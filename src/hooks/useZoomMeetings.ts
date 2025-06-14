
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
      const { data, error } = await supabase.functions.invoke('sync-zoom-meetings');
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zoom-meetings"] });
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      toast({
        title: "Success",
        description: "Zoom meetings synced successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to sync Zoom meetings",
        variant: "destructive",
      });
    },
  });

  const extractTranscript = useMutation({
    mutationFn: async (zoomMeetingId: string) => {
      const { data, error } = await supabase.functions.invoke('extract-zoom-transcript', {
        body: { zoomMeetingId },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zoom-meetings"] });
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      toast({
        title: "Success",
        description: "Transcript extracted and processed successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to extract transcript",
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
