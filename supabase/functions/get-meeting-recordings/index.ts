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

    const { zoomMeetingId } = await req.json();

    if (!zoomMeetingId) {
      return new Response(
        JSON.stringify({ error: 'Missing zoomMeetingId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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

    // Check if token is expired
    if (new Date(zoomToken.expires_at) <= new Date()) {
      return new Response(
        JSON.stringify({ error: 'Zoom token expired. Please reconnect your account.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch recording data from Zoom API
    const recordingResponse = await fetch(`https://api.zoom.us/v2/meetings/${zoomMeetingId}/recordings`, {
      headers: {
        'Authorization': `Bearer ${zoomToken.access_token}`,
      },
    });

    if (!recordingResponse.ok) {
      const errorData = await recordingResponse.text();
      console.error('Zoom recording API error:', errorData);
      
      if (recordingResponse.status === 404) {
        return new Response(
          JSON.stringify({ error: 'No recordings found for this meeting' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to fetch recording data from Zoom' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const recordingData = await recordingResponse.json();
    const recordingFiles = recordingData.recording_files || [];

    // Filter for video recordings
    const videoRecordings = recordingFiles.filter((file: any) => 
      file.file_type === 'MP4' && 
      (file.recording_type === 'shared_screen_with_speaker_view' || 
       file.recording_type === 'speaker_view' ||
       file.recording_type === 'gallery_view')
    );

    // Update the stored recording data
    await supabase
      .from('zoom_meetings')
      .update({ 
        recording_files: recordingFiles,
        updated_at: new Date().toISOString()
      })
      .eq('zoom_meeting_id', zoomMeetingId)
      .eq('user_id', user.id);

    return new Response(
      JSON.stringify({
        success: true,
        recordingFiles: videoRecordings,
        downloadUrls: videoRecordings.map((file: any) => ({
          id: file.id,
          recording_type: file.recording_type,
          download_url: file.download_url,
          play_url: file.play_url,
          file_type: file.file_type,
          file_size: file.file_size,
          recording_start: file.recording_start,
          recording_end: file.recording_end,
        }))
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Get recording data error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});