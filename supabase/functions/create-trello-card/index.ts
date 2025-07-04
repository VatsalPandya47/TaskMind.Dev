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
    const { listId, name, desc, due, pos } = await req.json();

    if (!listId || !name) {
      return new Response(
        JSON.stringify({ error: 'List ID and card name are required' }),
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

    console.log('Creating card in Trello list:', listId, 'for user:', user.id);

    // Prepare card data for Trello API
    const cardData = new URLSearchParams({
      idList: listId,
      name: name,
      key: trelloToken.api_key,
      token: trelloToken.token
    });

    if (desc) {
      cardData.append('desc', desc);
    }

    if (due) {
      cardData.append('due', due);
    }

    if (pos) {
      cardData.append('pos', pos);
    }

    // Create card in Trello
    const createCardResponse = await fetch('https://api.trello.com/1/cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: cardData,
    });

    if (!createCardResponse.ok) {
      const errorData = await createCardResponse.text();
      console.error('Trello API error:', errorData);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create card in Trello',
          details: `Trello API returned ${createCardResponse.status}: ${errorData}`
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const cardResponse = await createCardResponse.json();
    console.log('Successfully created card:', cardResponse.id);

    return new Response(
      JSON.stringify({
        success: true,
        card: cardResponse,
        message: 'Card created successfully in Trello'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error creating Trello card:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to create card',
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}); 