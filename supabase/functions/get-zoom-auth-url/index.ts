
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const zoomClientId = Deno.env.get('ZOOM_CLIENT_ID');

serve(async (req) => {
  console.log('Request method:', req.method);
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Zoom Client ID from env:', zoomClientId ? 'Present' : 'Missing');
    
    if (!zoomClientId) {
      console.error('ZOOM_CLIENT_ID environment variable is not set');
      return new Response(
        JSON.stringify({ 
          error: 'Zoom Client ID not configured. Please set ZOOM_CLIENT_ID in Supabase secrets.',
          details: 'The ZOOM_CLIENT_ID environment variable is missing from the edge function configuration.'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the origin from the request headers or use a fallback
    const origin = req.headers.get('origin') || req.headers.get('referer')?.split('/').slice(0, 3).join('/') || 'http://localhost:5173';
    const redirectUri = `${origin}/zoom-callback`;
    
    console.log('Generated redirect URI:', redirectUri);
    console.log('Using Client ID:', zoomClientId.substring(0, 8) + '...');
    
    // Create the Zoom OAuth URL with proper scopes
    const authUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${encodeURIComponent(zoomClientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent('meeting:read recording:read')}`;

    console.log('Generated auth URL (without client ID):', authUrl.replace(zoomClientId, '[CLIENT_ID]'));

    return new Response(
      JSON.stringify({ 
        authUrl,
        redirectUri,
        success: true 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating auth URL:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
