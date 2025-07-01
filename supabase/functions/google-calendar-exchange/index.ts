// supabase/functions/google-calendar-exchange/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GOOGLE_CLIENT_ID = Deno.env.get('VITE_GOOGLE_CLIENT_ID');
const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET');
// IMPORTANT: This must be the EXACT same URI as in your Google Cloud Console
const REDIRECT_URI = Deno.env.get('GOOGLE_REDIRECT_URI'); // e.g., 'http://localhost:8080/oauth2callback'

serve(async (req) => {
  // 1. Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } });
  }

  try {
    // 2. Extract code from the incoming request body
    const { code } = await req.json();
    if (!code) {
      console.error('No authorization code provided in the request body.');
      return new Response(JSON.stringify({ error: 'Authorization code is missing.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
    console.log('Received authorization code:', code);

    // 3. Exchange the code for a token with Google
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI, // <-- Must match exactly
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
        console.error('Google API Error:', tokenData);
        throw new Error(tokenData.error_description || 'Failed to fetch token from Google.');
    }
    
    console.log('Received tokens from Google:', tokenData);
    const { access_token, refresh_token, expiry_date } = tokenData;

    // 4. Securely save the tokens to the database
    const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Get the user from the incoming request's Authorization header
    const authHeader = req.headers.get('Authorization')!;
    const { data: { user } } = await supabaseAdmin.auth.getUser(authHeader.replace('Bearer ', ''));

    if (!user) {
        throw new Error('User not found.');
    }

    const { error: updateError } = await supabaseAdmin
      .from('user_profiles') // Or your table name
      .update({
        google_calendar_access_token: access_token,
        google_calendar_refresh_token: refresh_token,
        google_calendar_token_expiry: new Date(expiry_date),
      })
      .eq('id', user.id);

    if (updateError) {
        console.error('DB Update Error:', updateError);
        throw new Error('Failed to save tokens to the database.');
    }

    return new Response(JSON.stringify({ success: true, message: 'Tokens stored successfully.' }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });

  } catch (error) {
    console.error('Internal Server Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
});