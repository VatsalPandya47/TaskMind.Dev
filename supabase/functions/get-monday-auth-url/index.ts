import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const mondayClientId = Deno.env.get('MONDAY_CLIENT_ID');
const mondayClientSecret = Deno.env.get('MONDAY_CLIENT_SECRET');

serve(async (req) => {
  console.log('Get Monday.com auth URL request method:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!mondayClientId || !mondayClientSecret) {
      console.error('Missing Monday.com credentials:', { hasClientId: !!mondayClientId, hasClientSecret: !!mondayClientSecret });
      return new Response(
        JSON.stringify({ error: 'Monday.com credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
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

    // Generate a random state value for security
    const state = crypto.randomUUID();
    
    // Get redirect URI from request body
    const { redirect_uri } = await req.json();
    
    if (!redirect_uri) {
      console.error('Missing redirect URI');
      return new Response(
        JSON.stringify({ error: 'Redirect URI is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build Monday.com OAuth URL
    const authUrl = new URL('https://auth.monday.com/oauth2/authorize');
    authUrl.searchParams.append('client_id', mondayClientId);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('redirect_uri', redirect_uri);
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('scope', 'boards:read boards:write');
    
    console.log('Generated Monday.com OAuth URL:', authUrl.toString());

    return new Response(
      JSON.stringify({ 
        authUrl: authUrl.toString(),
        state: state
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error generating Monday.com auth URL:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate authentication URL',
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}); 