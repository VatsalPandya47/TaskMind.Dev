
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

    // Fetch meetings from Zoom API
    const meetingsResponse = await fetch('https://api.zoom.us/v2/users/me/meetings?type=previous_meetings&page_size=50', {
      headers: {
        'Authorization': `Bearer ${zoomToken.access_token}`,
      },
    });

    if (!meetingsResponse.ok) {
      const errorData = await meetingsResponse.text();
      console.error('Zoom API error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch meetings from Zoom' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const meetingsData = await meetingsResponse.json();
    const meetings = meetingsData.meetings || [];

    let syncedCount = 0;

    for (const meeting of meetings) {
      try {
        // Check if meeting already exists
        const { data: existingMeeting } = await supabase
          .from('zoom_meetings')
          .select('id')
          .eq('zoom_meeting_id', meeting.id.toString())
          .eq('user_id', user.id)
          .single();

        if (existingMeeting) {
          continue; // Skip if already exists
        }

        // Fetch recording data for this meeting
        let recordingFiles = null;
        try {
          const recordingResponse = await fetch(`https://api.zoom.us/v2/meetings/${meeting.id}/recordings`, {
            headers: {
              'Authorization': `Bearer ${zoomToken.access_token}`,
            },
          });

          if (recordingResponse.ok) {
            const recordingData = await recordingResponse.json();
            recordingFiles = recordingData.recording_files || [];
          }
        } catch (recordingError) {
          console.log('No recordings found for meeting:', meeting.id);
        }

        // Insert meeting data
        await supabase
          .from('zoom_meetings')
          .insert({
            user_id: user.id,
            zoom_meeting_id: meeting.id.toString(),
            zoom_uuid: meeting.uuid,
            topic: meeting.topic,
            start_time: meeting.start_time,
            duration: meeting.duration,
            recording_files: recordingFiles,
          });

        syncedCount++;
      } catch (error) {
        console.error('Error syncing meeting:', meeting.id, error);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Synced ${syncedCount} meetings`,
        syncedCount
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Sync meetings error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
