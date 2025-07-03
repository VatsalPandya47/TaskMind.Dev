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
    const { boardId } = await req.json();

    if (!boardId) {
      return new Response(
        JSON.stringify({ error: 'Board ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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

    console.log('Fetching lists from Trello board:', boardId, 'for user:', user.id);

    // Fetch lists from Trello API
    const listsUrl = `https://api.trello.com/1/boards/${boardId}/lists?key=${trelloToken.api_key}&token=${trelloToken.token}&fields=name,pos,closed&filter=open`;

    const listsResponse = await fetch(listsUrl);

    if (!listsResponse.ok) {
      const errorData = await listsResponse.text();
      console.error('Trello API error:', errorData);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch lists from Trello',
          details: `Trello API returned ${listsResponse.status}: ${errorData}`
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const listsData = await listsResponse.json();
    console.log(`Successfully fetched ${listsData.length} lists from board ${boardId}`);

    // Sort lists by position
    const sortedLists = listsData.sort((a: any, b: any) => a.pos - b.pos);

    return new Response(
      JSON.stringify({
        success: true,
        lists: sortedLists,
        boardId: boardId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error fetching Trello lists:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch lists',
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}); 