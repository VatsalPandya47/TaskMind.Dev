import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const mondayClientId = Deno.env.get('MONDAY_CLIENT_ID');
const mondayClientSecret = Deno.env.get('MONDAY_CLIENT_SECRET');

serve(async (req) => {
  console.log('Monday.com OAuth callback request method:', req.method);

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

    if (!mondayClientId || !mondayClientSecret) {
      console.error('Missing Monday.com credentials:', { hasClientId: !!mondayClientId, hasClientSecret: !!mondayClientSecret });
      return new Response(
        JSON.stringify({ error: 'Monday.com credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Exchanging authorization code for access token...');

    // Exchange code for access token
    const tokenResponse = await fetch('https://auth.monday.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: mondayClientId,
        client_secret: mondayClientSecret,
        redirect_uri: redirect_uri,
        code: code,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Monday.com token exchange failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorData
      });
      return new Response(
        JSON.stringify({ 
          error: 'Failed to exchange authorization code',
          details: `Monday.com API returned ${tokenResponse.status}: ${errorData}`
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

    // Calculate expiration time (Monday.com tokens are usually valid for 1 hour)
    const expiresAt = new Date(Date.now() + (tokenData.expires_in * 1000));

    // Get account information using the access token
    let accountId = null;
    let accountName = null;
    
    try {
      const accountResponse = await fetch('https://api.monday.com/v2', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query {
              me {
                id
                name
                account {
                  id
                  name
                }
              }
            }
          `
        })
      });

      if (accountResponse.ok) {
        const accountData = await accountResponse.json();
        if (accountData.data && accountData.data.me) {
          accountId = accountData.data.me.account?.id;
          accountName = accountData.data.me.account?.name;
        }
      }
    } catch (error) {
      console.error('Failed to fetch account info:', error);
    }

    // Delete existing token for this user
    const { error: deleteError } = await supabase
      .from('monday_tokens')
      .delete()
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Failed to delete existing token:', deleteError);
    }

    // Save new token
    const { error: insertError } = await supabase
      .from('monday_tokens')
      .insert({
        user_id: user.id,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token || null,
        expires_at: expiresAt.toISOString(),
        scope: tokenData.scope || 'boards:read boards:write',
        account_id: accountId,
        account_name: accountName,
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
        message: 'Monday.com account connected successfully',
        expires_at: expiresAt.toISOString(),
        account_name: accountName
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