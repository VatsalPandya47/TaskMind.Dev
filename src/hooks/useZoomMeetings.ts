import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type ZoomMeeting = Tables<"zoom_meetings">;

export const useZoomMeetings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: zoomMeetings = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["zoom-meetings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("zoom_meetings")
        .select("*")
        .order("start_time", { ascending: false });
      
      if (error) throw error;
      return data as ZoomMeeting[];
    },
  });

  /**
   * CLIENT-SIDE UTILITY: Extract recording URLs from stored data
   * 
   * USE WHEN:
   * - Displaying recording availability in lists/grids
   * - Quick checks for existing recordings
   * - Building UI that shows "has recording" status
   * - You need instant results without API calls
   * 
   * BENEFITS:
   * - ⚡ Instant/fast (no API calls)
   * - 💾 Uses cached data from database
   * - 🔄 Always available (works offline)
   * - 📊 Perfect for lists and overview displays
   * 
   * LIMITATIONS:
   * - URLs might be expired if data is old
   * - No fresh data from Zoom
   * - Depends on previously synced data
   * 
   * @param meeting - ZoomMeeting object from your meetings list
   * @returns Array of recording objects with download/play URLs
   */
  const getRecordingUrls = (meeting: ZoomMeeting) => {
    if (!meeting.recording_files) return [];
    
    const recordingFiles = Array.isArray(meeting.recording_files) 
      ? meeting.recording_files 
      : [];
    
    return recordingFiles
      .filter((file: any) => file.recording_type === 'shared_screen_with_speaker_view' || file.recording_type === 'speaker_view')
      .map((file: any) => ({
        id: file.id,
        recording_type: file.recording_type,
        download_url: file.download_url,
        play_url: file.play_url,
        file_type: file.file_type,
        file_size: file.file_size,
        recording_start: file.recording_start,
        recording_end: file.recording_end,
      }));
  };

  // Fetch fresh recording data from Zoom API
  const fetchRecordingData = useMutation({
    mutationFn: async (zoomMeetingId: string) => {
      console.log('Fetching recording data for meeting:', zoomMeetingId);
      const { data, error } = await supabase.functions.invoke('get-meeting-recordings', {
        body: { zoomMeetingId },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["zoom-meetings"] });
      toast({
        title: "Success",
        description: "Recording data fetched successfully",
      });
    },
    onError: (error: any) => {
      console.error('Fetch recording data error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch recording data",
        variant: "destructive",
      });
    },
  });

  const syncMeetings = useMutation({
    mutationFn: async () => {
      console.log('Syncing Zoom meetings...');
      const { data, error } = await supabase.functions.invoke('sync-zoom-meetings');
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["zoom-meetings"] });
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      toast({
        title: "Success",
        description: `Synced ${data?.syncedCount || 0} meetings successfully`,
      });
    },
    onError: (error: any) => {
      console.error('Sync meetings error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to sync Zoom meetings",
        variant: "destructive",
      });
    },
  });

  const extractTranscript = useMutation({
    mutationFn: async (zoomMeetingId: string) => {
      console.log('Extracting transcript for meeting:', zoomMeetingId);
      const { data, error } = await supabase.functions.invoke('extract-zoom-transcript', {
        body: { zoomMeetingId },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      console.log('Transcript extraction successful:', data);
      queryClient.invalidateQueries({ queryKey: ["zoom-meetings"] });
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      
      toast({
        title: "Success! 🎉",
        description: `Transcript extracted and ${data?.tasksExtracted || 0} tasks created`,
      });
    },
    onError: (error: any) => {
      console.error('Extract transcript error:', error);
      
      let errorMessage = "Failed to extract transcript";
      if (error.message?.includes("No transcript file")) {
        errorMessage = "No transcript available for this meeting recording";
      } else if (error.message?.includes("rate limit")) {
        errorMessage = "AI service is busy. Please try again in a few minutes.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  return {
    zoomMeetings,
    isLoading,
    error,
    syncMeetings,
    extractTranscript,
    getRecordingUrls,
    fetchRecordingData,
  };
};
