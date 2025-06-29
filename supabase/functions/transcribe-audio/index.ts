import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const assemblyApiKey = Deno.env.get('ASSEMBLYAI_API_KEY');

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Serve POST request
serve(async (req) => {
  console.log('Transcribe audio request received');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: corsHeaders
      });
    }

    if (!assemblyApiKey) {
      return new Response(
        JSON.stringify({ error: "AssemblyAI API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const contentType = req.headers.get("content-type") || "";

    if (!contentType.includes("multipart/form-data")) {
      return new Response(
        JSON.stringify({ error: "Content-Type must be multipart/form-data" }),
        { status: 415, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response(
        JSON.stringify({ error: "Missing audio file" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 1: Upload audio file to AssemblyAI
    const uploadRes = await fetch("https://api.assemblyai.com/v2/upload", {
      method: "POST",
      headers: {
        "authorization": assemblyApiKey,
      },
      body: file,
    });
    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      return new Response(
        JSON.stringify({ error: `Failed to upload audio: ${errorText}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const uploadData = await uploadRes.json();
    const audio_url = uploadData.upload_url;

    // Step 2: Request transcription with desired parameters
    const transcriptRes = await fetch("https://api.assemblyai.com/v2/transcript", {
      method: "POST",
      headers: {
        "authorization": assemblyApiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        audio_url,
        speaker_labels: true,
        format_text: true,
        punctuate: true,
        speech_model: "slam-1",
        language_code: "en_us",
      }),
    });
    if (!transcriptRes.ok) {
      const errorText = await transcriptRes.text();
      return new Response(
        JSON.stringify({ error: `Failed to start transcription: ${errorText}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const transcriptData = await transcriptRes.json();
    const transcriptId = transcriptData.id;

    // Step 3: Poll for completion
    let transcriptText = null;
    for (let i = 0; i < 60; i++) { // Poll up to 60 times (about 60 seconds)
      const pollRes = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
        headers: {
          "authorization": assemblyApiKey,
        },
      });
      if (!pollRes.ok) {
        const errorText = await pollRes.text();
        return new Response(
          JSON.stringify({ error: `Failed to poll transcription: ${errorText}` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const pollData = await pollRes.json();
      if (pollData.status === "completed") {
        transcriptText = pollData.utterances
          ? pollData.utterances.map(u => `SPEAKER ${u.speaker}:\n${u.text}\n`).join("\n\n")
          : pollData.text;
        break;
      } else if (pollData.status === "failed") {
        return new Response(
          JSON.stringify({ error: `Transcription failed: ${pollData.error}` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      // Wait 1 second before polling again
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    if (!transcriptText) {
      return new Response(
        JSON.stringify({ error: "Transcription timed out" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ transcript: transcriptText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ error: `Failed to transcribe audio: ${err.message}` }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
