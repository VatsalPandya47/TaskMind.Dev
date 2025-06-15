
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"

const SLACK_CLIENT_ID = Deno.env.get("SLACK_CLIENT_ID")
const SLACK_CLIENT_SECRET = Deno.env.get("SLACK_CLIENT_SECRET")
const CALLBACK_REDIRECT_URI = `${Deno.env.get("SUPABASE_URL")}/functions/v1/slack-oauth-callback`

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const code = url.searchParams.get("code")
    const stateEncoded = url.searchParams.get("state")

    if (!code || !stateEncoded) {
      return new Response("Missing code or state.", { status: 400 })
    }

    const { return_url, jwt } = JSON.parse(atob(stateEncoded))

    const formData = new FormData()
    formData.append("code", code)
    formData.append("client_id", SLACK_CLIENT_ID!)
    formData.append("client_secret", SLACK_CLIENT_SECRET!)
    formData.append("redirect_uri", CALLBACK_REDIRECT_URI)

    const tokenRes = await fetch("https://slack.com/api/oauth.v2.access", {
      method: "POST",
      body: formData,
    })

    const tokenData = await tokenRes.json()
    if (!tokenData.ok) {
      console.error("Slack OAuth error:", tokenData.error)
      const errorUrl = new URL(return_url)
      errorUrl.searchParams.set("error", "slack_auth_failed")
      errorUrl.searchParams.set("error_description", tokenData.error)
      return Response.redirect(errorUrl.toString())
    }

    const { access_token, team, scope } = tokenData
    const { id: team_id, name: team_name } = team

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: `Bearer ${jwt}` } } }
    )
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
        console.error("Error getting user from JWT:", userError)
        const errorUrl = new URL(return_url)
        errorUrl.searchParams.set("error", "invalid_user")
        return Response.redirect(errorUrl.toString())
    }

    const { error: dbError } = await supabase.from("slack_tokens").insert({
      user_id: user.id,
      access_token,
      team_id,
      team_name,
      scope,
    })

    if (dbError) {
      console.error("Database error:", dbError)
      const errorUrl = new URL(return_url)
      errorUrl.searchParams.set("error", "db_error")
      errorUrl.searchParams.set("error_description", dbError.message)
      return Response.redirect(errorUrl.toString())
    }

    const successUrl = new URL(return_url)
    successUrl.searchParams.set("slack_auth", "success")
    return Response.redirect(successUrl.toString())

  } catch (error) {
    console.error(error)
    // Redirect to a generic error page on the client
    const fallbackUrl = new URL(req.headers.get("origin") || Deno.env.get("SITE_URL") || "http://localhost:8080");
    fallbackUrl.searchParams.set("error", "internal_error");
    fallbackUrl.searchParams.set("error_description", "An unexpected error occurred.");
    return Response.redirect(fallbackUrl.toString());
  }
})
