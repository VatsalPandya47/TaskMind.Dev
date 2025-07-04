import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type TrelloToken = Tables<"trello_tokens">;

export const useTrelloAuth = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: trelloToken,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["trello-token"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trello_tokens")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data as TrelloToken | null;
    },
  });

  const saveCredentials = useMutation({
    mutationFn: async (credentials: { 
      apiKey: string; 
      token: string; 
    }) => {
      const { data, error } = await supabase.functions.invoke('save-trello-auth', {
        body: { 
          apiKey: credentials.apiKey,
          trelloToken: credentials.token
        },
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to save credentials');

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trello-token"] });
      queryClient.invalidateQueries({ queryKey: ["trello-boards"] });
      toast({
        title: "Success! 🎉",
        description: "Trello account connected successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect Trello account. Please check your credentials.",
        variant: "destructive",
      });
    },
  });

  const disconnectTrello = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("trello_tokens")
        .delete()
        .eq("user_id", user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trello-token"] });
      queryClient.invalidateQueries({ queryKey: ["trello-boards"] });
      toast({
        title: "Success",
        description: "Trello account disconnected",
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

  const isConnected = !!trelloToken;

  return {
    trelloToken,
    isLoading,
    error,
    isConnected,
    saveCredentials,
    disconnectTrello,
  };
}; 