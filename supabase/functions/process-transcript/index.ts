
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
async function retryOpenAICall(prompt: string, maxRetries = 5) {
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
          model: 'gpt-4o-mini', // Switch to mini for lower rate limits
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
          max_tokens: 1500, // Reduced to lower cost
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }

      // Handle rate limiting specifically
      if (response.status === 429) {
        const retryAfter = response.headers.get('retry-after');
        // Use exponential backoff with longer delays
        const baseDelay = Math.pow(2, attempt) * 2000; // Start at 4s, then 8s, 16s, etc.
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : baseDelay;
        
        console.log(`Rate limited. Waiting ${waitTime}ms before retry ${attempt}/${maxRetries}`);
        
        if (attempt < maxRetries) {
          await delay(waitTime);
          continue;
        } else {
          throw new Error('OpenAI API rate limit exceeded after multiple retries. Please wait a few minutes and try again.');
        }
      }

      // Handle other errors
      const errorText = await response.text();
      console.error(`OpenAI API error (${response.status}):`, errorText);
      
      if (response.status === 401) {
        throw new Error('Invalid OpenAI API key. Please check your API key configuration.');
      } else if (response.status === 403) {
        throw new Error('OpenAI API access forbidden. Please check your API key permissions.');
      } else if (response.status >= 500) {
        // Server errors - retry with exponential backoff
        if (attempt < maxRetries) {
          const waitTime = Math.pow(2, attempt) * 1000;
          console.log(`Server error, retrying in ${waitTime}ms`);
          await delay(waitTime);
          continue;
        } else {
          throw new Error('OpenAI API server error. Please try again later.');
        }
      } else {
        throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
      }

    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying for non-rate-limit errors
      if (!error.message.includes('rate limit')) {
        await delay(1000 * attempt);
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
      throw new Error('Meeting ID and transcript are required');
    }

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log(`Processing transcript for meeting: ${meetingId}`);

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseKey!);

    // Get user ID from auth header
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Verify meeting belongs to user
    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', meetingId)
      .eq('user_id', user.id)
      .single();

    if (meetingError || !meeting) {
      throw new Error('Meeting not found or unauthorized');
    }

    // Prepare a more concise prompt for better performance
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

    // Call OpenAI GPT-4o-mini with enhanced retry logic
    console.log('Calling OpenAI API with enhanced retry logic...');
    const openAIData = await retryOpenAICall(prompt);
    
    const extractedContent = openAIData.choices[0].message.content;
    console.log('GPT-4o-mini response:', extractedContent);

    // Parse extracted tasks
    let extractedTasks;
    try {
      extractedTasks = JSON.parse(extractedContent);
    } catch (parseError) {
      console.error('Failed to parse GPT response:', extractedContent);
      throw new Error('AI response could not be parsed. Please try again with a clearer transcript.');
    }

    if (!Array.isArray(extractedTasks)) {
      throw new Error('AI response is not a valid task list. Please try again.');
    }

    // Update meeting with transcript
    const { error: updateError } = await supabase
      .from('meetings')
      .update({ transcript })
      .eq('id', meetingId);

    if (updateError) {
      throw new Error(`Failed to update meeting: ${updateError.message}`);
    }

    // Insert extracted tasks into database
    const tasksToInsert = extractedTasks.map((task: any) => ({
      task: task.task,
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
      throw new Error(`Failed to insert tasks: ${insertError.message}`);
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
    console.error('Error in process-transcript function:', error);
    
    // Return user-friendly error messages
    let errorMessage = 'An unexpected error occurred while processing the transcript.';
    
    if (error.message.includes('rate limit')) {
      errorMessage = 'OpenAI API is currently busy. Please wait a few minutes and try again.';
    } else if (error.message.includes('API key')) {
      errorMessage = 'OpenAI API configuration issue. Please check your API key.';
    } else if (error.message.includes('Unauthorized')) {
      errorMessage = 'Authentication failed. Please log in again.';
    } else if (error.message.includes('not found')) {
      errorMessage = 'Meeting not found or you do not have access to it.';
    } else if (error.message.includes('parse')) {
      errorMessage = 'Could not extract tasks from transcript. Please ensure the transcript contains clear action items.';
    } else if (error.message.includes('server error')) {
      errorMessage = 'OpenAI service is temporarily unavailable. Please try again in a few minutes.';
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
