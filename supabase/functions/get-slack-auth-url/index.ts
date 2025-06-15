
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

const SLACK_CLIENT_ID = Deno.env.get("SLACK_CLIENT_ID")
const CALLBACK_REDIRECT_URI = `${Deno.env.get("SUPABASE_URL")}/functions/v1/slack-oauth-callback`

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  if (!SLACK_CLIENT_ID) {
    return new Response("SLACK_CLIENT_ID is not set in environment variables.", { status: 500 })
  }

  const { return_url, jwt } = await req.json()
  if (!return_url || !jwt) {
    return new Response("return_url and jwt are required.", { status: 400 })
  }

  const scope = "channels:read,chat:write,team:read"
  const state = btoa(JSON.stringify({ return_url, jwt }))
  const authUrl = `https://slack.com/oauth/v2/authorize?client_id=${SLACK_CLIENT_ID}&scope=${scope}&user_scope=&redirect_uri=${encodeURIComponent(CALLBACK_REDIRECT_URI)}&state=${encodeURIComponent(state)}`

  return new Response(JSON.stringify({ authUrl }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })
})
