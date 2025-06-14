
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { zoomMeetingId } = await req.json();

    if (!zoomMeetingId) {
      return new Response(
        JSON.stringify({ error: 'Zoom meeting ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl!, supabaseKey!);

    // Get user ID from auth header
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Zoom meeting data
    const { data: zoomMeeting, error: meetingError } = await supabase
      .from('zoom_meetings')
      .select('*')
      .eq('id', zoomMeetingId)
      .eq('user_id', user.id)
      .single();

    if (meetingError || !zoomMeeting) {
      return new Response(
        JSON.stringify({ error: 'Zoom meeting not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user's Zoom token
    const { data: zoomToken, error: tokenError } = await supabase
      .from('zoom_tokens')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (tokenError || !zoomToken) {
      return new Response(
        JSON.stringify({ error: 'Zoom account not connected' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find transcript file in recording files
    const recordingFiles = zoomMeeting.recording_files as any[];
    if (!recordingFiles || recordingFiles.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No recording files found for this meeting' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Look for transcript file
    const transcriptFile = recordingFiles.find(file => 
      file.file_type === 'TRANSCRIPT' || file.file_type === 'CC'
    );

    if (!transcriptFile) {
      return new Response(
        JSON.stringify({ error: 'No transcript file found in this recording' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Download transcript content
    const transcriptResponse = await fetch(transcriptFile.download_url, {
      headers: {
        'Authorization': `Bearer ${zoomToken.access_token}`,
      },
    });

    if (!transcriptResponse.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to download transcript file' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const transcriptContent = await transcriptResponse.text();

    // Update zoom meeting with transcript URL
    await supabase
      .from('zoom_meetings')
      .update({ transcript_file_url: transcriptFile.download_url })
      .eq('id', zoomMeetingId);

    // Create or update meeting record
    let meetingId = zoomMeeting.meeting_id;
    
    if (!meetingId) {
      // Create new meeting record
      const { data: newMeeting, error: createError } = await supabase
        .from('meetings')
        .insert({
          user_id: user.id,
          title: zoomMeeting.topic || 'Zoom Meeting',
          date: new Date(zoomMeeting.start_time).toISOString().split('T')[0],
          duration: zoomMeeting.duration ? `${zoomMeeting.duration} minutes` : null,
          zoom_meeting_id: zoomMeeting.zoom_meeting_id,
          zoom_uuid: zoomMeeting.zoom_uuid,
          transcript: transcriptContent,
        })
        .select()
        .single();

      if (createError) {
        console.error('Failed to create meeting:', createError);
        return new Response(
          JSON.stringify({ error: 'Failed to create meeting record' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      meetingId = newMeeting.id;

      // Update zoom meeting with meeting ID
      await supabase
        .from('zoom_meetings')
        .update({ meeting_id: meetingId })
        .eq('id', zoomMeetingId);
    } else {
      // Update existing meeting with transcript
      await supabase
        .from('meetings')
        .update({ transcript: transcriptContent })
        .eq('id', meetingId);
    }

    // Now process the transcript to extract tasks
    const { data: processResult, error: processError } = await supabase.functions.invoke('process-transcript', {
      body: { meetingId, transcript: transcriptContent },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (processError) {
      console.error('Failed to process transcript:', processError);
      // Don't fail the entire operation if task extraction fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Transcript extracted and processed successfully',
        meetingId,
        tasksExtracted: processResult?.success ? processResult.tasksCount : 0,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Extract transcript error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
