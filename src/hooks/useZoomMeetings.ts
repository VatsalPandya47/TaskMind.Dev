
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
  };
};
