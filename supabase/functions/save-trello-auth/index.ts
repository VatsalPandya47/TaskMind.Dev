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
      console.log('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User authenticated:', user.id);

    // Parse request body
    const { apiKey, trelloToken } = await req.json();

    if (!apiKey || !trelloToken) {
      return new Response(
        JSON.stringify({ error: 'API key and token are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Validating Trello credentials for user:', user.id);

    // Validate credentials by testing the Trello API
    const testResponse = await fetch(`https://api.trello.com/1/members/me?key=${apiKey}&token=${trelloToken}`);
    
    if (!testResponse.ok) {
      console.error('Trello API validation failed:', testResponse.status);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid Trello credentials',
          details: 'Unable to authenticate with Trello API'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const trelloUser = await testResponse.json();
    console.log('Trello credentials validated for user:', trelloUser.username);

    // Delete existing token for this user
    const { error: deleteError } = await supabase
      .from('trello_tokens')
      .delete()
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Failed to delete existing token:', deleteError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to delete existing credentials',
          details: deleteError.message
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Save new credentials
    const { error: insertError } = await supabase
      .from('trello_tokens')
      .insert({
        user_id: user.id,
        api_key: apiKey,
        token: trelloToken,
        username: trelloUser.username || null,
        full_name: trelloUser.fullName || null,
      });

    if (insertError) {
      console.error('Failed to save credentials:', insertError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to save credentials',
          details: insertError.message
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Trello credentials saved successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Trello account connected successfully',
        username: trelloUser.username,
        fullName: trelloUser.fullName
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Save Trello auth error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to save Trello credentials',
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}); 