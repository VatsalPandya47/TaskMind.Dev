// supabase/functions/google-calendar-events/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GOOGLE_CLIENT_ID = Deno.env.get("VITE_GOOGLE_CLIENT_ID")!;
const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET")!;

serve(async (req) => {
  // Parse user_id from the request body (you can also get it from JWT if you want)
  const { user_id } = await req.json();

  if (!user_id) {
    return new Response(JSON.stringify({ error: "Missing user_id" }), { status: 400 });
  }

  // Get refresh token from Supabase
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  const { data, error } = await supabase
    .from("google_tokens")
    .select("refresh_token")
    .eq("user_id", user_id)
    .single();

  if (error || !data) {
    return new Response(JSON.stringify({ error: "No refresh token found" }), { status: 400 });
  }

  // Exchange refresh token for access token
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: data.refresh_token,
      grant_type: "refresh_token",
    }),
  });
  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  if (!accessToken) {
    return new Response(JSON.stringify({ error: "Failed to get access token" }), { status: 400 });
  }

  // Fetch events from Google Calendar
  const now = new Date().toISOString();
  const eventsRes = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10&orderBy=startTime&singleEvents=true&timeMin=${now}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  const events = await eventsRes.json();

  return new Response(JSON.stringify(events), { headers: { "Content-Type": "application/json" } });
});