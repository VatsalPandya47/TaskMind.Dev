
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { meetingId, transcript } = await req.json();

    if (!meetingId || !transcript) {
      throw new Error('Meeting ID and transcript are required');
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

    // Prepare the prompt for GPT-4o
    const prompt = `
You are an AI assistant that extracts actionable tasks from meeting transcripts. 

Analyze the following meeting transcript and extract all action items, tasks, and follow-ups. For each task, identify:

1. TASK: Clear, actionable description of what needs to be done
2. ASSIGNEE: Person responsible (if mentioned, otherwise use "Unassigned")
3. DUE_DATE: Deadline or timeframe (if mentioned, format as YYYY-MM-DD, otherwise leave empty)
4. PRIORITY: High/Medium/Low based on urgency and importance mentioned
5. CONTEXT: Brief context from the meeting

Return ONLY a valid JSON array with this exact structure:
[
  {
    "task": "Task description",
    "assignee": "Person name or Unassigned",
    "due_date": "YYYY-MM-DD or null",
    "priority": "High|Medium|Low",
    "context": "Brief context"
  }
]

Meeting Transcript:
${transcript}

Important: Return ONLY the JSON array, no other text or formatting.
`;

    // Call OpenAI GPT-4o
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
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
        max_tokens: 2000,
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${openAIResponse.statusText}`);
    }

    const openAIData = await openAIResponse.json();
    const extractedContent = openAIData.choices[0].message.content;

    console.log('GPT-4o response:', extractedContent);

    // Parse extracted tasks
    let extractedTasks;
    try {
      extractedTasks = JSON.parse(extractedContent);
    } catch (parseError) {
      console.error('Failed to parse GPT response:', extractedContent);
      throw new Error('Failed to parse AI response as JSON');
    }

    if (!Array.isArray(extractedTasks)) {
      throw new Error('AI response is not a valid array');
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
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
