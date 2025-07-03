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

    // Get user's Trello credentials
    const { data: trelloToken, error: tokenError } = await supabase
      .from('trello_tokens')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (tokenError || !trelloToken) {
      return new Response(
        JSON.stringify({ error: 'Trello account not connected' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching boards from Trello API for user:', user.id);

    // Fetch boards from Trello API
    const boardsUrl = `https://api.trello.com/1/members/me/boards?key=${trelloToken.api_key}&token=${trelloToken.token}&fields=name,desc,url,closed,pinned&filter=open`;

    const boardsResponse = await fetch(boardsUrl);

    if (!boardsResponse.ok) {
      const errorData = await boardsResponse.text();
      console.error('Trello API error:', errorData);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch boards from Trello',
          details: `Trello API returned ${boardsResponse.status}: ${errorData}`
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const boardsData = await boardsResponse.json();
    console.log(`Successfully fetched ${boardsData.length} boards`);

    // Sort boards by pinned status and name
    const sortedBoards = boardsData.sort((a: any, b: any) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return a.name.localeCompare(b.name);
    });

    return new Response(
      JSON.stringify({
        success: true,
        boards: sortedBoards,
        user: {
          username: trelloToken.username,
          fullName: trelloToken.full_name
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error fetching Trello boards:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch boards',
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}); 