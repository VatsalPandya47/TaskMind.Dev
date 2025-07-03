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

    console.log('Fetching projects from Asana API for user:', user.id);

    // Fetch projects from Asana API
    const projectsUrl = asanaToken.workspace_id 
      ? `https://app.asana.com/api/1.0/projects?workspace=${asanaToken.workspace_id}&limit=100`
      : `https://app.asana.com/api/1.0/projects?limit=100`;

    const projectsResponse = await fetch(projectsUrl, {
      headers: {
        'Authorization': `Bearer ${asanaToken.access_token}`,
        'Accept': 'application/json',
      },
    });

    if (!projectsResponse.ok) {
      const errorData = await projectsResponse.text();
      console.error('Asana API error:', errorData);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch projects from Asana',
          details: `Asana API returned ${projectsResponse.status}: ${errorData}`
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const projectsData = await projectsResponse.json();
    console.log(`Successfully fetched ${projectsData.data?.length || 0} projects`);

    return new Response(
      JSON.stringify({
        success: true,
        projects: projectsData.data || [],
        workspace: {
          id: asanaToken.workspace_id,
          name: asanaToken.workspace_name
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error fetching Asana projects:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch projects',
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}); 