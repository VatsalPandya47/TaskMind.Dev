// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

console.log("Hello from Functions!")

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 60000, // 60 seconds
  backoffMultiplier: 2,
  jitter: 0.1, // 10% jitter to prevent thundering herd
};

// Error types for better categorization
const ERROR_TYPES = {
  RATE_LIMITED: 'RATE_LIMITED',
  INVALID_API_KEY: 'INVALID_API_KEY',
  FORBIDDEN: 'FORBIDDEN',
  SERVER_ERROR: 'SERVER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',
} as const;

type ErrorType = typeof ERROR_TYPES[keyof typeof ERROR_TYPES];

// Helper function to wait/delay with jitter
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to calculate exponential backoff delay with jitter
const calculateBackoffDelay = (attempt: number, baseDelay: number, maxDelay: number, multiplier: number, jitter: number): number => {
  const exponentialDelay = Math.min(baseDelay * Math.pow(multiplier, attempt - 1), maxDelay);
  const jitterAmount = exponentialDelay * jitter * Math.random();
  return exponentialDelay + jitterAmount;
};

// Helper function to parse retry-after header
const parseRetryAfter = (retryAfter: string | null): number => {
  if (!retryAfter) return RATE_LIMIT_CONFIG.baseDelay;
  
  const value = parseInt(retryAfter);
  if (isNaN(value)) return RATE_LIMIT_CONFIG.baseDelay;
  
  // If retry-after is in seconds, convert to milliseconds
  return value <= 60 ? value * 1000 : value;
};

// Helper: Save log for dry-run or failure
async function saveEvalLog(obj: Record<string, unknown>) {
  console.error("AI_SUMMARY_EVAL_LOG", JSON.stringify(obj));
}

// Enhanced retry function for OpenAI API calls with improved rate limit handling
async function retryOpenAICall(prompt: string, maxRetries = RATE_LIMIT_CONFIG.maxRetries) {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`OpenAI API attempt ${attempt}/${maxRetries}`);
      
      const startTime = Date.now();
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert at summarizing meeting transcripts. Provide clear, concise summaries that capture the key points, decisions, and action items discussed.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1500,
        }),
      });

      const duration = Date.now() - startTime;
      console.log(`OpenAI API response received in ${duration}ms (status: ${response.status})`);

      if (response.ok) {
        const data = await response.json();
        console.log(`OpenAI API call successful on attempt ${attempt}`);
        return data;
      }

      // Handle rate limiting (429) with proper retry-after parsing
      if (response.status === 429) {
        const retryAfter = response.headers.get('retry-after');
        const waitTime = parseRetryAfter(retryAfter);
        
        console.log(`Rate limited (429). Retry-After: ${retryAfter}, Calculated wait: ${waitTime}ms`);
        
        if (attempt < maxRetries) {
          console.log(`Waiting ${waitTime}ms before retry ${attempt + 1}/${maxRetries}`);
          await delay(waitTime);
          continue;
        } else {
          lastError = new Error('RATE_LIMITED');
          console.error(`Rate limit exceeded after ${maxRetries} attempts`);
          break;
        }
      }

      // Handle other HTTP errors
      const errorText = await response.text();
      console.error(`OpenAI API error (${response.status}):`, errorText);
      
      let errorType: ErrorType;
      
      switch (response.status) {
        case 401:
          errorType = ERROR_TYPES.INVALID_API_KEY;
          break;
        case 403:
          errorType = ERROR_TYPES.FORBIDDEN;
          break;
        case 408:
        case 499:
          errorType = ERROR_TYPES.TIMEOUT_ERROR;
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          errorType = ERROR_TYPES.SERVER_ERROR;
          break;
        default:
          errorType = ERROR_TYPES.UNEXPECTED_ERROR;
      }
      
      // For server errors and timeouts, retry with exponential backoff
      if (errorType === ERROR_TYPES.SERVER_ERROR || errorType === ERROR_TYPES.TIMEOUT_ERROR) {
        if (attempt < maxRetries) {
          const waitTime = calculateBackoffDelay(
            attempt, 
            RATE_LIMIT_CONFIG.baseDelay, 
            RATE_LIMIT_CONFIG.maxDelay, 
            RATE_LIMIT_CONFIG.backoffMultiplier, 
            RATE_LIMIT_CONFIG.jitter
          );
          
          console.log(`${errorType} error, retrying in ${Math.round(waitTime)}ms (attempt ${attempt + 1}/${maxRetries})`);
          await delay(waitTime);
          continue;
        }
      }
      
      // For other errors, don't retry
      lastError = new Error(errorType);
      break;

    } catch (error: any) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      lastError = error;
      
      // Handle network errors with retry
      if (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('timeout')) {
        if (attempt < maxRetries) {
          const waitTime = calculateBackoffDelay(
            attempt, 
            RATE_LIMIT_CONFIG.baseDelay, 
            RATE_LIMIT_CONFIG.maxDelay, 
            RATE_LIMIT_CONFIG.backoffMultiplier, 
            RATE_LIMIT_CONFIG.jitter
          );
          
          console.log(`Network error, retrying in ${Math.round(waitTime)}ms (attempt ${attempt + 1}/${maxRetries})`);
          await delay(waitTime);
          continue;
        }
      }
      
      // For other errors, don't retry
      break;
    }
  }
  
  // If we get here, all retries failed
  console.error(`All ${maxRetries} attempts failed. Last error:`, lastError?.message);
  throw lastError || new Error('UNEXPECTED_ERROR');
}

// Enhanced retry logic for OpenAI with validation
async function retryOpenAICallWithValidation(prompt: string, maxRetries = 2) {
  let lastInvalidOutput = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    let openAIData;
    try {
      console.log(`Validation attempt ${attempt}/${maxRetries}`);
      openAIData = await retryOpenAICall(prompt, 1); // single call per attempt
      
      if (!openAIData?.choices?.[0]?.message?.content) {
        throw new Error("NoOpenAIContent");
      }

      const output = openAIData.choices[0].message.content;
      console.log(`Generated output length: ${output.length} characters`);
      
      if (!output || output.trim().length < 50) {
        lastInvalidOutput = output;
        console.warn(`Output too short (${output?.length || 0} chars), retrying...`);
        if (attempt < maxRetries) continue; // retry
        throw new Error("SummaryTooShort");
      }
      
      console.log(`Valid output generated on attempt ${attempt}`);
      return output; // valid
      
    } catch (err: any) {
      console.error(`Validation attempt ${attempt} failed:`, err.message);
      
      if (attempt === maxRetries) {
        if (lastInvalidOutput) {
          const error = new Error("InvalidSummaryFinal");
          (error as any).lastInvalidOutput = lastInvalidOutput;
          throw error;
        }
        throw err;
      }
      
      // Wait before retrying validation
      const waitTime = calculateBackoffDelay(
        attempt, 
        RATE_LIMIT_CONFIG.baseDelay, 
        RATE_LIMIT_CONFIG.maxDelay, 
        RATE_LIMIT_CONFIG.backoffMultiplier, 
        RATE_LIMIT_CONFIG.jitter
      );
      
      console.log(`Waiting ${Math.round(waitTime)}ms before validation retry ${attempt + 1}/${maxRetries}`);
      await delay(waitTime);
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { meetingId, transcript, dry_run } = await req.json();

    if (!meetingId || !transcript) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Meeting ID and transcript are required',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'OpenAI API key not configured',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Summarizing transcript for meeting: ${meetingId} (length: ${transcript.length} chars)`);

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseKey!);

    // Get user ID from auth header
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Unauthorized',
        }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Verify meeting belongs to user
    console.log(`Verifying meeting ownership: meetingId=${meetingId}, userId=${user.id}`);
    
    // First, check if the meeting exists
    const { data: meetingExists, error: meetingExistsError } = await supabase
      .from('meetings')
      .select('id, user_id')
      .eq('id', meetingId)
      .single();

    if (meetingExistsError) {
      if (meetingExistsError.code === 'PGRST116') {
        // Meeting not found
        console.log(`Meeting not found: ${meetingId}`);
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Meeting not found',
            code: 'MEETING_NOT_FOUND'
          }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      } else {
        // Database error
        console.error('Database error checking meeting:', meetingExistsError);
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Database error occurred while checking meeting',
            code: 'DB_ERROR'
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Meeting exists, now check ownership
    if (meetingExists.user_id !== user.id) {
      console.log(`Access denied: user ${user.id} does not own meeting ${meetingId} (owned by ${meetingExists.user_id})`);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Access denied. You do not have permission to access this meeting.',
          code: 'ACCESS_DENIED'
        }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // User owns the meeting, get full meeting data
    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', meetingId)
      .eq('user_id', user.id)
      .single();

    if (meetingError || !meeting) {
      console.error('Error fetching meeting data after ownership verification:', meetingError);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Error retrieving meeting data',
          code: 'DB_ERROR'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Meeting ownership verified successfully: ${meetingId} belongs to user ${user.id}`);

    // Prepare a comprehensive prompt for summarization
    const prompt = `
Please provide a comprehensive summary of this meeting transcript. The summary should include:

1. **Key Topics Discussed**: Main subjects and themes covered
2. **Important Decisions**: Any decisions made during the meeting
3. **Action Items**: Tasks assigned and responsibilities
4. **Key Insights**: Important points or revelations
5. **Next Steps**: What happens after this meeting

Format the summary in a clear, structured manner with appropriate sections.

Meeting Title: ${meeting.title || 'Untitled Meeting'}
Meeting Date: ${meeting.date || 'Unknown Date'}

Transcript:
${transcript}

Please provide a well-structured summary that captures the essence of this meeting.
`;

    // Call OpenAI with validation and retry
    let summary;
    let ai_raw_output = "";
    let processingStartTime = Date.now();
    let retryAttempts = 0;
    
    try {
      console.log('Starting OpenAI API call with retry logic...');
      summary = await retryOpenAICallWithValidation(prompt, 2);
      ai_raw_output = summary;
      console.log('Successfully generated summary');
    } catch (error: any) {
      console.error('OpenAI API call failed:', error.message);
      
      // Always save failed AI outputs for audit if possible
      await saveEvalLog({
        type: "gpt_summary_fail",
        meetingId,
        transcript_sample: transcript?.slice?.(0, 200),
        error: error?.message,
        ai_content: error?.lastInvalidOutput || "",
        prompt_version: "summarizer-v1",
        retry_config: RATE_LIMIT_CONFIG
      });
      
      if (error.message === "InvalidSummaryFinal") {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'AI response could not generate a valid summary after retry.',
            code: 'SUMMARY_ERROR',
            raw_output: error.lastInvalidOutput,
          }),
          {
            status: 422,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      // Handle specific error types with proper HTTP status codes
      if (error.message === 'RATE_LIMITED') {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'OpenAI API is currently busy with too many requests. Please wait a few minutes and try again.',
            code: 'RATE_LIMITED',
            retry_after: '300' // Suggest 5 minutes
          }),
          {
            status: 429,
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json',
              'Retry-After': '300'
            },
          }
        );
      } else if (error.message === 'INVALID_API_KEY') {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Invalid OpenAI API key configuration.',
            code: 'INVALID_API_KEY'
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      } else if (error.message === 'FORBIDDEN') {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'OpenAI API access forbidden. Please check your API key permissions.',
            code: 'FORBIDDEN'
          }),
          {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      } else if (error.message === 'SERVER_ERROR') {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'OpenAI service is temporarily unavailable. Please try again in a few minutes.',
            code: 'SERVICE_ERROR'
          }),
          {
            status: 503,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      } else if (error.message === 'TIMEOUT_ERROR') {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Request timed out. Please try again.',
            code: 'TIMEOUT_ERROR'
          }),
          {
            status: 408,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      } else {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'AI service is temporarily unavailable. Please try again in a few minutes.',
            code: 'SERVICE_ERROR',
            details: error.message
          }),
          {
            status: 503,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    const processingTime = Date.now() - processingStartTime;
    console.log(`Summary generation completed in ${processingTime}ms`);

    // DRY RUN: for testing, don't save to DB, just return result and log
    if (dry_run) {
      await saveEvalLog({
        type: "dry_run_summary",
        meetingId,
        transcript_sample: transcript?.slice?.(0, 200),
        ai_output: summary,
        prompt_version: "summarizer-v1",
        processing_time_ms: processingTime
      });
      return new Response(
        JSON.stringify({
          success: true,
          message: "Dry run: generated summary, not saved to DB.",
          summary,
          dry_run: true,
          processing_time_ms: processingTime
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Save summary to summaries table
    console.log(`Saving summary to summaries table for meeting: ${meetingId}`);
    
    const { data: savedSummary, error: saveError } = await supabase
      .from('summaries')
      .upsert({
        user_id: user.id,
        meeting_id: meetingId,
        summary: summary,
        transcript_sample: transcript?.slice?.(0, 500), // Store first 500 chars as sample
        ai_model: 'gpt-4o-mini',
        prompt_version: 'summarizer-v1',
        processing_time_ms: processingTime,
        retry_attempts: retryAttempts
      }, {
        onConflict: 'meeting_id' // Update if summary already exists for this meeting
      })
      .select()
      .single();

    if (saveError) {
      console.error('Failed to save summary to summaries table:', saveError);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to save summary to database.',
          code: 'DB_ERROR',
          details: saveError.message
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Successfully saved summary to database. Summary ID: ${savedSummary.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Successfully generated and saved meeting summary',
        summary,
        meetingId,
        summaryId: savedSummary.id,
        processing_time_ms: processingTime,
        dry_run: false
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Unexpected error in summarize function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'An unexpected error occurred while summarizing the transcript.',
        code: 'UNEXPECTED_ERROR',
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/summarize' \
    --header 'Authorization: Bearer YOUR_JWT_TOKEN' \
    --header 'Content-Type: application/json' \
    --data '{"meetingId":"uuid","transcript":"meeting transcript text"}'

*/
