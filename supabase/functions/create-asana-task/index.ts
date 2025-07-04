import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl!, supabaseKey!);

    // Get user ID from auth header
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { projectId, name, notes, due_on, assignee } = await req.json();

    if (!projectId || !name) {
      return new Response(
        JSON.stringify({ error: 'Project ID and task name are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user's Asana token
    const { data: asanaToken, error: tokenError } = await supabase
      .from('asana_tokens')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (tokenError || !asanaToken) {
      return new Response(
        JSON.stringify({ error: 'Asana account not connected' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if token is expired (though Asana tokens typically don't expire)
    if (asanaToken.expires_at && new Date(asanaToken.expires_at) <= new Date()) {
      return new Response(
        JSON.stringify({ error: 'Asana token expired. Please reconnect your account.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Creating task in Asana project:', projectId, 'for user:', user.id);

    // Prepare task data
    const taskData: any = {
      name: name,
      projects: [projectId],
    };

    if (notes) {
      taskData.notes = notes;
    }

    if (due_on) {
      taskData.due_on = due_on;
    }

    if (assignee) {
      taskData.assignee = assignee;
    }

    // Create task in Asana
    const createTaskResponse = await fetch('https://app.asana.com/api/1.0/tasks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${asanaToken.access_token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: taskData }),
    });

    if (!createTaskResponse.ok) {
      const errorData = await createTaskResponse.text();
      console.error('Asana API error:', errorData);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create task in Asana',
          details: `Asana API returned ${createTaskResponse.status}: ${errorData}`
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const taskResponse = await createTaskResponse.json();
    console.log('Successfully created task:', taskResponse.data?.gid);

    return new Response(
      JSON.stringify({
        success: true,
        task: taskResponse.data,
        message: 'Task created successfully in Asana'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error creating Asana task:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to create task',
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}); 