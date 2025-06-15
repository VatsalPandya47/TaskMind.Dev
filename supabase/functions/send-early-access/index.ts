
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const RECIPIENT = "vatsalpandya@taskmind.dev";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "Missing email" }), { status: 400, headers: corsHeaders });
    }

    // Send email via resend
    const response = await resend.emails.send({
      from: "TaskMind Early Access <onboarding@resend.dev>",
      to: RECIPIENT,
      subject: "New Early Access Signup",
      html: `
        <h2>Early Access Request Received</h2>
        <p><b>Email:</b> ${email}</p>
      `,
    });

    if (response.error) {
      console.error("Resend error:", response.error);
      return new Response(JSON.stringify({ error: "Failed to send email" }), { status: 500, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Handler error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
