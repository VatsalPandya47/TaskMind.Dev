import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Configuration for retry logic
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
};

// Error types for better categorization
const ERROR_TYPES = {
  RATE_LIMITED: 'RATE_LIMITED',
  INVALID_API_KEY: 'INVALID_API_KEY',
  SERVICE_ERROR: 'SERVICE_ERROR',
  SUMMARY_ERROR: 'SUMMARY_ERROR',
  DB_ERROR: 'DB_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',
} as const;

type ErrorType = typeof ERROR_TYPES[keyof typeof ERROR_TYPES];

// Enhanced logging utility
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[Summarize Hook] ℹ️ ${message}`, data || '');
  },
  success: (message: string, data?: any) => {
    console.log(`[Summarize Hook] ✅ ${message}`, data || '');
  },
  warning: (message: string, data?: any) => {
    console.warn(`[Summarize Hook] ⚠️ ${message}`, data || '');
  },
  error: (message: string, error?: any) => {
    console.error(`[Summarize Hook] ❌ ${message}`, error || '');
  },
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Summarize Hook] 🔍 ${message}`, data || '');
    }
  },
};

// Utility function to calculate retry delay with exponential backoff
const calculateRetryDelay = (attempt: number): number => {
  const delay = RETRY_CONFIG.baseDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt - 1);
  return Math.min(delay, RETRY_CONFIG.maxDelay);
};

// Utility function to categorize errors
const categorizeError = (error: any): ErrorType => {
  const errorMessage = error?.message || error?.toString() || '';
  
  if (errorMessage.includes('RATE_LIMITED') || errorMessage.includes('429')) {
    return ERROR_TYPES.RATE_LIMITED;
  }
  if (errorMessage.includes('INVALID_API_KEY') || errorMessage.includes('401')) {
    return ERROR_TYPES.INVALID_API_KEY;
  }
  if (errorMessage.includes('SERVICE_ERROR') || errorMessage.includes('503')) {
    return ERROR_TYPES.SERVICE_ERROR;
  }
  if (errorMessage.includes('SUMMARY_ERROR') || errorMessage.includes('422')) {
    return ERROR_TYPES.SUMMARY_ERROR;
  }
  if (errorMessage.includes('DB_ERROR') || errorMessage.includes('500')) {
    return ERROR_TYPES.DB_ERROR;
  }
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return ERROR_TYPES.NETWORK_ERROR;
  }
  if (errorMessage.includes('auth') || errorMessage.includes('unauthorized')) {
    return ERROR_TYPES.AUTH_ERROR;
  }
  
  return ERROR_TYPES.UNEXPECTED_ERROR;
};

// Enhanced error message mapping
const getErrorMessage = (errorType: ErrorType): string => {
  const messages = {
    [ERROR_TYPES.RATE_LIMITED]: 'AI service is busy. Please try again in a few minutes.',
    [ERROR_TYPES.INVALID_API_KEY]: 'AI service configuration error. Please contact support.',
    [ERROR_TYPES.SERVICE_ERROR]: 'AI service is temporarily unavailable. Please try again later.',
    [ERROR_TYPES.SUMMARY_ERROR]: 'Failed to generate a valid summary. Please try again.',
    [ERROR_TYPES.DB_ERROR]: 'Database operation failed. Please try again.',
    [ERROR_TYPES.NETWORK_ERROR]: 'Network connection issue. Please check your internet and try again.',
    [ERROR_TYPES.AUTH_ERROR]: 'Authentication failed. Please log in again.',
    [ERROR_TYPES.UNEXPECTED_ERROR]: 'An unexpected error occurred. Please try again.',
  };
  
  return messages[errorType] || messages[ERROR_TYPES.UNEXPECTED_ERROR];
};

export const useSummarize = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const summarizeTranscript = useMutation({
    mutationFn: async ({ 
      meetingId, 
      transcript, 
      dry_run = false 
    }: { 
      meetingId: string; 
      transcript: string; 
      dry_run?: boolean;
    }) => {
      logger.info('Starting summarization request', { 
        meetingId, 
        transcriptLength: transcript.length, 
        dry_run 
      });

      // Get session and validate authentication
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError || !session) {
        logger.error('Authentication failed', authError);
        throw new Error('Not authenticated');
      }

      logger.debug('Authentication successful', { userId: session.user.id });

      // Retry logic with exponential backoff
      let lastError: any;
      
      for (let attempt = 1; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
        try {
          logger.info(`Attempt ${attempt}/${RETRY_CONFIG.maxRetries}`, { 
            meetingId, 
            dry_run 
          });

          const startTime = Date.now();
          
          const { data, error } = await supabase.functions.invoke('summarize', {
            body: { meetingId, transcript, dry_run },
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });

          const duration = Date.now() - startTime;
          
          if (error) {
            logger.error(`API call failed on attempt ${attempt}`, { 
              error, 
              duration,
              attempt 
            });
            throw error;
          }

          logger.success('Summarization completed successfully', { 
            duration, 
            attempt,
            dry_run,
            success: data?.success 
          });

          return data;

        } catch (error: any) {
          lastError = error;
          const errorType = categorizeError(error);
          
          logger.warning(`Attempt ${attempt} failed`, { 
            errorType, 
            error: error.message,
            attempt 
          });

          // Don't retry on certain error types
          if (errorType === ERROR_TYPES.INVALID_API_KEY || 
              errorType === ERROR_TYPES.AUTH_ERROR ||
              errorType === ERROR_TYPES.SUMMARY_ERROR) {
            logger.info('Not retrying due to error type', { errorType });
            break;
          }

          // If this is the last attempt, don't wait
          if (attempt === RETRY_CONFIG.maxRetries) {
            logger.error('All retry attempts exhausted', { 
              totalAttempts: RETRY_CONFIG.maxRetries,
              finalError: error 
            });
            break;
          }

          // Calculate delay for next retry
          const delay = calculateRetryDelay(attempt);
          logger.info(`Retrying in ${delay}ms`, { 
            attempt, 
            nextAttempt: attempt + 1,
            delay 
          });

          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      // If we get here, all retries failed
      logger.error('All retry attempts failed', { 
        totalAttempts: RETRY_CONFIG.maxRetries,
        finalError: lastError 
      });
      
      throw lastError;
    },
    
    onSuccess: (data, variables) => {
      logger.success('Summarization mutation succeeded', { 
        meetingId: variables.meetingId,
        dry_run: variables.dry_run,
        success: data.success 
      });

      // Only invalidate queries if it's not a dry run
      if (!data.dry_run) {
        logger.debug('Invalidating meetings query cache');
        queryClient.invalidateQueries({ queryKey: ["meetings"] });
      } else {
        logger.debug('Skipping cache invalidation for dry run');
      }
      
      if (data.success) {
        const message = data.dry_run 
          ? "Test summary generated successfully (not saved to database)"
          : "Meeting summary has been created successfully";
        
        const title = data.dry_run ? "Test Summary Generated! 🧪" : "Summary Generated! 📝";
        
        logger.success('Showing success toast', { title, message });
        
        toast({
          title,
          description: message,
        });
      } else {
        logger.error('API returned success: false', { data });
        throw new Error(data.error || "Summarization failed");
      }
    },
    
    onError: (error: any, variables) => {
      const errorType = categorizeError(error);
      const errorMessage = getErrorMessage(errorType);
      
      logger.error('Summarization mutation failed', {
        errorType,
        errorMessage,
        meetingId: variables.meetingId,
        dry_run: variables.dry_run,
        error: error.message,
        stack: error.stack
      });
      
      toast({
        title: "Summarization Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
    
    onMutate: (variables) => {
      logger.info('Starting summarization mutation', { 
        meetingId: variables.meetingId,
        dry_run: variables.dry_run,
        transcriptLength: variables.transcript.length 
      });
    },
    
    onSettled: (data, error, variables) => {
      logger.info('Summarization mutation settled', {
        success: !!data,
        error: error?.message,
        meetingId: variables.meetingId,
        dry_run: variables.dry_run
      });
    },
  });

  return {
    summarizeTranscript,
    isSummarizing: summarizeTranscript.isPending,
    // Expose retry configuration for debugging
    retryConfig: RETRY_CONFIG,
    // Expose error types for external use
    errorTypes: ERROR_TYPES,
  };
}; 