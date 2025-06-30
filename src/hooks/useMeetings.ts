import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { slackService } from "@/lib/slackService";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type Meeting = Tables<"meetings">;
type MeetingInsert = TablesInsert<"meetings">;
type MeetingUpdate = TablesUpdate<"meetings">;

export const useMeetings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: meetings = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["meetings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meetings")
        .select("*")
        .order("date", { ascending: false });
      
      if (error) throw error;
      return data as Meeting[];
    },
  });

  const createMeeting = useMutation({
    mutationFn: async (meeting: Omit<MeetingInsert, "user_id">) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("meetings")
        .insert({ ...meeting, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (newMeeting) => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      toast({
        title: "Success",
        description: "Meeting created successfully",
      });
      
      // Send Slack notification for new meeting
      try {
        slackService.notifyMeetingCreated(newMeeting);
      } catch (error) {
        console.error('Failed to send Slack notification for new meeting:', error);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMeeting = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & MeetingUpdate) => {
      const { data, error } = await supabase
        .from("meetings")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (updatedMeeting) => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      toast({
        title: "Success",
        description: "Meeting updated successfully",
      });
      
      // Send Slack notification for meeting updates
      try {
        slackService.notifyMeetingUpdated(updatedMeeting);
      } catch (error) {
        console.error('Failed to send Slack notification for meeting update:', error);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMeeting = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("meetings")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      toast({
        title: "Success",
        description: "Meeting deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    meetings,
    isLoading,
    error,
    createMeeting,
    updateMeeting,
    deleteMeeting,
  };
};
