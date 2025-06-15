
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const zoomClientId = Deno.env.get('ZOOM_CLIENT_ID');
const zoomClientSecret = Deno.env.get('ZOOM_CLIENT_SECRET');

serve(async (req) => {
  console.log('OAuth callback request method:', req.method);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, redirect_uri } = await req.json();
    console.log('Received callback with code and redirect_uri:', { hasCode: !!code, redirect_uri });

    if (!code) {
      console.error('Missing authorization code');
      return new Response(
        JSON.stringify({ error: 'Authorization code is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!redirect_uri) {
      console.error('Missing redirect URI');
      return new Response(
        JSON.stringify({ error: 'Redirect URI is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!zoomClientId || !zoomClientSecret) {
      console.error('Missing Zoom credentials:', { hasClientId: !!zoomClientId, hasClientSecret: !!zoomClientSecret });
      return new Response(
        JSON.stringify({ error: 'Zoom credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Exchanging authorization code for access token...');

    // Exchange code for access token
    const tokenResponse = await fetch('https://zoom.us/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${zoomClientId}:${zoomClientSecret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirect_uri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Zoom token exchange failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorData
      });
      return new Response(
        JSON.stringify({ 
          error: 'Failed to exchange authorization code',
          details: `Zoom API returned ${tokenResponse.status}: ${errorData}`
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const tokenData = await tokenResponse.json();
    console.log('Token exchange successful, received data keys:', Object.keys(tokenData));

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

    // Calculate expiration time
    const expiresAt = new Date(Date.now() + (tokenData.expires_in * 1000));

    // Delete existing token for this user
    const { error: deleteError } = await supabase
      .from('zoom_tokens')
      .delete()
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Failed to delete existing token:', deleteError);
    }

    // Save new token
    const { error: insertError } = await supabase
      .from('zoom_tokens')
      .insert({
        user_id: user.id,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: expiresAt.toISOString(),
        scope: tokenData.scope,
      });

    if (insertError) {
      console.error('Failed to save token:', insertError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to save token',
          details: insertError.message
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Token saved successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Zoom account connected successfully',
        expires_at: expiresAt.toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('OAuth callback error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
