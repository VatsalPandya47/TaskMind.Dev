import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const asanaClientId = Deno.env.get('ASANA_CLIENT_ID');

serve(async (req) => {
  console.log('Request method:', req.method);
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Asana Client ID from env:', asanaClientId ? 'Present' : 'Missing');
    
    if (!asanaClientId) {
      console.error('ASANA_CLIENT_ID environment variable is not set');
      return new Response(
        JSON.stringify({ 
          error: 'Asana Client ID not configured. Please set ASANA_CLIENT_ID in Supabase secrets.',
          details: 'The ASANA_CLIENT_ID environment variable is missing from the edge function configuration.'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the origin from the request headers or use a fallback
    const origin = req.headers.get('origin') || req.headers.get('referer')?.split('/').slice(0, 3).join('/') || 'http://localhost:5173';
    const redirectUri = `${origin}/asana-callback`;
    
    console.log('Generated redirect URI:', redirectUri);
    console.log('Using Client ID:', asanaClientId.substring(0, 8) + '...');
    
    // Generate a random state parameter for security
    const state = crypto.randomUUID();
    
    // Create the Asana OAuth URL with proper scopes
    const authUrl = `https://app.asana.com/-/oauth_authorize?response_type=code&client_id=${encodeURIComponent(asanaClientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent('default')}&state=${encodeURIComponent(state)}`;

    console.log('Generated auth URL (without client ID):', authUrl.replace(asanaClientId, '[CLIENT_ID]'));

    return new Response(
      JSON.stringify({ 
        authUrl,
        state,
        redirectUri
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error generating Asana auth URL:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate authorization URL',
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}); 