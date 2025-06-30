// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://deno.land/x/openai@v4.20.1/mod.ts";

console.log("Hello from Functions!")

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  if (!openAIApiKey) {
    return new Response(
      JSON.stringify({ error: "OpenAI API key not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { transcript } = await req.json();
    if (!transcript) {
      return new Response(
        JSON.stringify({ error: "Missing transcript" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const prompt = `Analyze this meeting transcript and extract structured information in the following format:

**Key Topics**: Main subjects, themes, and topics discussed during the meeting
**Important Decisions**: Specific decisions made, agreements reached, or conclusions drawn
**Action Items**: Tasks assigned, responsibilities given, and who is responsible for what
**Key Insights**: Important points, revelations, discoveries, or significant information shared
**Next Steps**: What happens after the meeting, follow-up actions, and timeline

Return your answer as a JSON object with these exact keys: key_topics, important_decisions, action_items, key_insights, next_steps.

For each section, provide specific, actionable items. If a section has no relevant content, return an empty array.

Meeting Transcript:
${transcript}`;

    const openai = new OpenAI({ apiKey: openAIApiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        { role: "system", content: "You are a meeting assistant. Extract structured information from meeting transcripts." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      max_tokens: 1024,
      temperature: 0.2,
    });

    const summary = completion.choices[0]?.message?.content || "";
    let summaryJson;
    try {
      summaryJson = JSON.parse(summary);
    } catch (e) {
      return new Response(
        JSON.stringify({ error: "Failed to parse summary JSON", raw: summary }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(summaryJson),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `Failed to summarize: ${err.message}` }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
