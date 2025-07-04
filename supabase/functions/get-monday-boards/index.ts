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
  console.log('Get Monday.com boards request method:', req.method);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user ID from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      console.error('Missing authorization header');
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    
    const supabase = createClient(supabaseUrl!, supabaseKey!);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('User authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User authenticated successfully:', user.id);

    // Get Monday.com token from database
    const { data: mondayToken, error: tokenError } = await supabase
      .from('monday_tokens')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (tokenError || !mondayToken) {
      console.error('No Monday.com token found for user:', user.id);
      return new Response(
        JSON.stringify({ error: 'Monday.com not connected' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if token is expired
    if (mondayToken.expires_at && new Date(mondayToken.expires_at) <= new Date()) {
      console.error('Monday.com token expired for user:', user.id);
      return new Response(
        JSON.stringify({ error: 'Monday.com token expired' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching boards from Monday.com...');

    // Fetch boards using GraphQL API
    const boardsResponse = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mondayToken.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            boards {
              id
              name
              description
              state
              board_folder_id
              board_kind
              permissions
              columns {
                id
                title
                type
              }
              groups {
                id
                title
                color
              }
            }
          }
        `
      })
    });

    if (!boardsResponse.ok) {
      const errorData = await boardsResponse.text();
      console.error('Monday.com boards fetch failed:', {
        status: boardsResponse.status,
        statusText: boardsResponse.statusText,
        error: errorData
      });
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch boards',
          details: `Monday.com API returned ${boardsResponse.status}: ${errorData}`
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const boardsData = await boardsResponse.json();
    console.log('Boards fetched successfully:', boardsData.data?.boards?.length || 0);

    if (boardsData.errors) {
      console.error('GraphQL errors:', boardsData.errors);
      return new Response(
        JSON.stringify({ 
          error: 'GraphQL errors',
          details: boardsData.errors
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        boards: boardsData.data?.boards || [],
        account_name: mondayToken.account_name
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error fetching Monday.com boards:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch boards',
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}); 