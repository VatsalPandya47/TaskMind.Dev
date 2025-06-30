import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Types for memory system
export interface MemoryResult {
  id: string;
  content_type: 'meeting' | 'summary' | 'task' | 'decision' | 'note';
  content_id: string;
  content_text: string;
  metadata: Record<string, any>;
  similarity: number;
}

export interface MemorySearchResponse {
  success: boolean;
  results: MemoryResult[];
  search_duration_ms: number;
  query_embedding_length: number;
}

export interface MemoryUpdateResponse {
  success: boolean;
  processed: number;
  message: string;
}

// Configuration for retry logic
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
};

// Enhanced logging utility
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[Memory Hook] ℹ️ ${message}`, data || '');
  },
  success: (message: string, data?: any) => {
    console.log(`[Memory Hook] ✅ ${message}`, data || '');
  },
  warning: (message: string, data?: any) => {
    console.warn(`[Memory Hook] ⚠️ ${message}`, data || '');
  },
  error: (message: string, error?: any) => {
    console.error(`[Memory Hook] ❌ ${message}`, error || '');
  },
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Memory Hook] 🔍 ${message}`, data || '');
    }
  },
};

// Utility function to calculate retry delay with exponential backoff
const calculateRetryDelay = (attempt: number): number => {
  const delay = RETRY_CONFIG.baseDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt - 1);
  return Math.min(delay, RETRY_CONFIG.maxDelay);
};

export const useMemory = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Search memory by natural language query
  const searchMemory = useMutation({
    mutationFn: async ({ 
      query, 
      threshold = 0.7,
      limit = 10
    }: { 
      query: string; 
      threshold?: number;
      limit?: number;
    }) => {
      logger.info('Starting memory search', { query, threshold, limit });

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
          logger.info(`Search attempt ${attempt}/${RETRY_CONFIG.maxRetries}`, { query });

          const startTime = Date.now();
          
          const { data, error } = await supabase.functions.invoke('memory', {
            body: { 
              action: 'search',
              query, 
              threshold, 
              limit 
            },
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });

          const duration = Date.now() - startTime;
          
          if (error) {
            logger.error(`API call failed on attempt ${attempt}`, { error, duration, attempt });
            throw error;
          }

          logger.success('Memory search completed successfully', { 
            duration, 
            attempt,
            resultsCount: data?.results?.length || 0
          });

          return data as MemorySearchResponse;

        } catch (error: any) {
          lastError = error;
          
          logger.warning(`Search attempt ${attempt} failed`, { 
            error: error.message,
            attempt 
          });

          // Don't retry on certain error types
          if (error.message?.includes('Unauthorized') || 
              error.message?.includes('Invalid action')) {
            logger.info('Not retrying due to error type', { error: error.message });
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
      logger.error('All search attempts failed', { 
        totalAttempts: RETRY_CONFIG.maxRetries,
        finalError: lastError 
      });
      
      throw lastError;
    },
    
    onSuccess: (data, variables) => {
      logger.success('Memory search succeeded', { 
        query: variables.query,
        resultsCount: data.results?.length || 0,
        duration: data.search_duration_ms
      });
      
      if (data.results && data.results.length > 0) {
        toast({
          title: "Memory Search Complete! 🧠",
          description: `Found ${data.results.length} relevant items in ${data.search_duration_ms}ms`,
        });
      } else {
        toast({
          title: "No Results Found",
          description: "Try adjusting your search terms or similarity threshold",
        });
      }
    },
    
    onError: (error: any, variables) => {
      logger.error('Memory search failed', {
        query: variables.query,
        error: error.message,
        stack: error.stack
      });
      
      let errorMessage = "Failed to search memory";
      
      if (error.message?.includes('rate limit')) {
        errorMessage = "Search service is busy. Please try again in a few minutes.";
      } else if (error.message?.includes('API key')) {
        errorMessage = "Search service configuration error. Please contact support.";
      } else if (error.message?.includes('Unauthorized')) {
        errorMessage = "Please log in again to continue.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Search Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  // Update embeddings for existing content
  const updateEmbeddings = useMutation({
    mutationFn: async () => {
      logger.info('Starting embedding update');

      // Get session and validate authentication
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError || !session) {
        logger.error('Authentication failed', authError);
        throw new Error('Not authenticated');
      }

      logger.debug('Authentication successful', { userId: session.user.id });

      const { data, error } = await supabase.functions.invoke('memory', {
        body: { 
          action: 'update_embeddings',
          updateEmbeddings: true
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        logger.error('Embedding update failed', error);
        throw error;
      }

      logger.success('Embedding update completed', data);
      return data as MemoryUpdateResponse;
    },
    
    onSuccess: (data) => {
      logger.success('Embedding update succeeded', { 
        processed: data.processed,
        message: data.message
      });
      
      toast({
        title: "Memory Updated! 🧠",
        description: data.message,
      });
    },
    
    onError: (error: any) => {
      logger.error('Embedding update failed', {
        error: error.message,
        stack: error.stack
      });
      
      let errorMessage = "Failed to update memory embeddings";
      
      if (error.message?.includes('rate limit')) {
        errorMessage = "Update service is busy. Please try again in a few minutes.";
      } else if (error.message?.includes('API key')) {
        errorMessage = "Update service configuration error. Please contact support.";
      } else if (error.message?.includes('Unauthorized')) {
        errorMessage = "Please log in again to continue.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  // Get memory statistics
  const getMemoryStats = useQuery({
    queryKey: ["memory-stats"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      // Get count of memory embeddings
      const { count: embeddingsCount, error: embeddingsError } = await supabase
        .from('memory_embeddings')
        .select('*', { count: 'exact', head: true });

      if (embeddingsError) throw embeddingsError;

      // Get count of search logs
      const { count: searchLogsCount, error: searchLogsError } = await supabase
        .from('memory_search_logs')
        .select('*', { count: 'exact', head: true });

      if (searchLogsError) throw searchLogsError;

      return {
        embeddingsCount: embeddingsCount || 0,
        searchLogsCount: searchLogsCount || 0,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    searchMemory,
    updateEmbeddings,
    getMemoryStats,
    isSearching: searchMemory.isPending,
    isUpdating: updateEmbeddings.isPending,
    // Expose retry configuration for debugging
    retryConfig: RETRY_CONFIG,
  };
}; 