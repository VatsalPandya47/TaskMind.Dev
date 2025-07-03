import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const asanaClientId = Deno.env.get('ASANA_CLIENT_ID');
const asanaClientSecret = Deno.env.get('ASANA_CLIENT_SECRET');

serve(async (req) => {
  console.log('OAuth callback request method:', req.method);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, state, redirect_uri } = await req.json();
    console.log('Received callback with code, state and redirect_uri:', { hasCode: !!code, state, redirect_uri });

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

    if (!asanaClientId || !asanaClientSecret) {
      console.error('Missing Asana credentials:', { hasClientId: !!asanaClientId, hasClientSecret: !!asanaClientSecret });
      return new Response(
        JSON.stringify({ error: 'Asana credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Exchanging authorization code for access token...');

    // Exchange code for access token
    const tokenResponse = await fetch('https://app.asana.com/-/oauth_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: asanaClientId,
        client_secret: asanaClientSecret,
        redirect_uri: redirect_uri,
        code: code,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Asana token exchange failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorData
      });
      return new Response(
        JSON.stringify({ 
          error: 'Failed to exchange authorization code',
          details: `Asana API returned ${tokenResponse.status}: ${errorData}`
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

    // Get user info from Asana to extract workspace information
    let workspaceId = null;
    let workspaceName = null;
    
    try {
      const userResponse = await fetch('https://app.asana.com/api/1.0/users/me', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        if (userData.data && userData.data.workspaces && userData.data.workspaces.length > 0) {
          workspaceId = userData.data.workspaces[0].gid;
          workspaceName = userData.data.workspaces[0].name;
        }
      }
    } catch (error) {
      console.warn('Failed to fetch user workspace info:', error);
    }

    // Calculate expiration time (Asana tokens typically don't expire, but we'll set a far future date)
    const expiresAt = tokenData.expires_in 
      ? new Date(Date.now() + (tokenData.expires_in * 1000))
      : new Date(Date.now() + (10 * 365 * 24 * 60 * 60 * 1000)); // 10 years from now

    // Delete existing token for this user
    const { error: deleteError } = await supabase
      .from('asana_tokens')
      .delete()
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Failed to delete existing token:', deleteError);
    }

    // Save new token
    const { error: insertError } = await supabase
      .from('asana_tokens')
      .insert({
        user_id: user.id,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token || null,
        expires_at: expiresAt.toISOString(),
        scope: tokenData.scope || 'default',
        workspace_id: workspaceId,
        workspace_name: workspaceName,
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
        message: 'Asana account connected successfully',
        expires_at: expiresAt.toISOString(),
        workspace_name: workspaceName
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('OAuth callback error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process OAuth callback',
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}); 