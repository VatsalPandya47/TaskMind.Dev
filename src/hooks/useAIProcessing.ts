
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
      
      if (data.success) {
        toast({
          title: "Success! 🎉",
          description: `AI extracted ${data.tasksCount} tasks from the transcript`,
        });
      } else {
        throw new Error(data.error || "Processing failed");
      }
    },
    onError: (error: any) => {
      console.error("AI Processing Error:", error);
      
      let errorMessage = "Failed to process transcript";
      
      if (error.message?.includes("rate limit")) {
        errorMessage = "OpenAI API rate limit reached. Please wait a few minutes and try again.";
      } else if (error.message?.includes("API key")) {
        errorMessage = "OpenAI API configuration issue. Please contact support.";
      } else if (error.message?.includes("Unauthorized")) {
        errorMessage = "Please log in again to continue.";
      } else if (error.message?.includes("parse")) {
        errorMessage = "Could not extract tasks. Please ensure your transcript contains clear action items.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Processing Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  return {
    processTranscript,
    isProcessing: processTranscript.isPending,
  };
};
