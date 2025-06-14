
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Helper function to wait/delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Enhanced retry function for OpenAI API calls with exponential backoff
async function retryOpenAICall(prompt: string, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`OpenAI API attempt ${attempt}/${maxRetries}`);
      
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
              content: 'You are an expert at extracting actionable tasks from meeting transcripts. Always return valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1000,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }

      // Handle rate limiting specifically
      if (response.status === 429) {
        const retryAfter = response.headers.get('retry-after');
        const baseDelay = Math.min(Math.pow(2, attempt) * 5000, 30000); // Cap at 30s
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : baseDelay;
        
        console.log(`Rate limited. Waiting ${waitTime}ms before retry ${attempt}/${maxRetries}`);
        
        if (attempt < maxRetries) {
          await delay(waitTime);
          continue;
        } else {
          // Return a specific error for rate limiting
          throw new Error('RATE_LIMITED');
        }
      }

      // Handle other errors
      const errorText = await response.text();
      console.error(`OpenAI API error (${response.status}):`, errorText);
      
      if (response.status === 401) {
        throw new Error('INVALID_API_KEY');
      } else if (response.status === 403) {
        throw new Error('FORBIDDEN');
      } else if (response.status >= 500) {
        // Server errors - retry with exponential backoff
        if (attempt < maxRetries) {
          const waitTime = Math.pow(2, attempt) * 2000;
          console.log(`Server error, retrying in ${waitTime}ms`);
          await delay(waitTime);
          continue;
        } else {
          throw new Error('SERVER_ERROR');
        }
      } else {
        throw new Error(`API_ERROR_${response.status}`);
      }

    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying for non-rate-limit errors
      if (!error.message.includes('RATE_LIMITED')) {
        await delay(2000 * attempt);
      }
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { meetingId, transcript } = await req.json();

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

    console.log(`Processing transcript for meeting: ${meetingId}`);

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
    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', meetingId)
      .eq('user_id', user.id)
      .single();

    if (meetingError || !meeting) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Meeting not found or unauthorized',
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Prepare a concise prompt for better performance
    const prompt = `
Extract actionable tasks from this meeting transcript. Return ONLY a JSON array with this structure:
[
  {
    "task": "Clear task description",
    "assignee": "Person name or Unassigned",
    "due_date": "YYYY-MM-DD or null",
    "priority": "High|Medium|Low",
    "context": "Brief context"
  }
]

Transcript:
${transcript}

Return ONLY the JSON array, no other text.
`;

    // Call OpenAI with retry logic
    console.log('Calling OpenAI API...');
    let openAIData;
    try {
      openAIData = await retryOpenAICall(prompt);
    } catch (error) {
      console.error('OpenAI API failed after retries:', error.message);
      
      // Handle specific error types
      if (error.message === 'RATE_LIMITED') {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'OpenAI API is currently busy with too many requests. Please wait a few minutes and try again.',
            code: 'RATE_LIMITED'
          }),
          {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
      } else {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'AI service is temporarily unavailable. Please try again in a few minutes.',
            code: 'SERVICE_ERROR'
          }),
          {
            status: 503,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }
    
    const extractedContent = openAIData.choices[0].message.content;
    console.log('GPT response received successfully');

    // Parse extracted tasks
    let extractedTasks;
    try {
      extractedTasks = JSON.parse(extractedContent);
    } catch (parseError) {
      console.error('Failed to parse GPT response:', extractedContent);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'AI response could not be parsed. Please try again with a clearer transcript.',
          code: 'PARSE_ERROR'
        }),
        {
          status: 422,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!Array.isArray(extractedTasks)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'AI response is not a valid task list. Please try again.',
          code: 'INVALID_FORMAT'
        }),
        {
          status: 422,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Update meeting with transcript
    const { error: updateError } = await supabase
      .from('meetings')
      .update({ transcript })
      .eq('id', meetingId);

    if (updateError) {
      console.error('Failed to update meeting:', updateError);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to save transcript to meeting.',
          code: 'DB_ERROR'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Insert extracted tasks into database
    const tasksToInsert = extractedTasks.map((task: any) => ({
      task: task.task || 'Untitled Task',
      assignee: task.assignee || 'Unassigned',
      due_date: task.due_date || null,
      priority: task.priority || 'Medium',
      meeting_id: meetingId,
      user_id: user.id,
      completed: false,
    }));

    const { data: insertedTasks, error: insertError } = await supabase
      .from('tasks')
      .insert(tasksToInsert)
      .select();

    if (insertError) {
      console.error('Failed to insert tasks:', insertError);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to save extracted tasks.',
          code: 'DB_ERROR'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Successfully extracted and stored ${insertedTasks.length} tasks`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully extracted ${insertedTasks.length} tasks from transcript`,
        extractedTasks: insertedTasks,
        tasksCount: insertedTasks.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Unexpected error in process-transcript function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'An unexpected error occurred while processing the transcript.',
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
