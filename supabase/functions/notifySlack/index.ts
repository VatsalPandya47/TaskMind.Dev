import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SlackMessageRequest {
  message: string;
  channel?: string; // Optional, will use SLACK_CHANNEL_ID if not provided
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const slackBotToken = Deno.env.get("SLACK_BOT_TOKEN");
    const defaultChannelId = Deno.env.get("SLACK_CHANNEL_ID");

    if (!slackBotToken) {
      throw new Error("SLACK_BOT_TOKEN environment variable is not set");
    }

    if (!defaultChannelId) {
      throw new Error("SLACK_CHANNEL_ID environment variable is not set");
    }

    // Parse request body
    const { message, channel }: SlackMessageRequest = await req.json();

    if (!message) {
      throw new Error("Message is required");
    }

    // Use provided channel or default to environment variable
    const targetChannel = channel || defaultChannelId;

    // Prepare the Slack API request
    const slackPayload = {
      channel: targetChannel,
      text: message,
    };

    // Send message to Slack
    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${slackBotToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(slackPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Slack API error: ${response.status} - ${errorText}`);
    }

    const slackResponse = await response.json();

    if (!slackResponse.ok) {
      throw new Error(`Slack API returned error: ${slackResponse.error}`);
    }

    console.log("Slack message sent successfully:", {
      channel: targetChannel,
      message: message.substring(0, 100) + (message.length > 100 ? "..." : ""),
      timestamp: slackResponse.ts,
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        timestamp: slackResponse.ts,
        channel: targetChannel 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("Error sending Slack notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler); 