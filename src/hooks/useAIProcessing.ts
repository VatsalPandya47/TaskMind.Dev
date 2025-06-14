
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAIProcessing = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const processTranscript = useMutation({
    mutationFn: async ({ meetingId, transcript }: { meetingId: string; transcript: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke('process-transcript', {
        body: { meetingId, transcript },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      toast({
        title: "Success",
        description: `AI extracted ${data.tasksCount} tasks from the transcript`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to process transcript",
        variant: "destructive",
      });
    },
  });

  return {
    processTranscript,
    isProcessing: processTranscript.isPending,
  };
};
