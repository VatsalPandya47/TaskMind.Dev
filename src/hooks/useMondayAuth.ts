import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type MondayToken = Tables<"monday_tokens">;

export const useMondayAuth = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query to get Monday.com token
  const { data: mondayToken, isLoading, error } = useQuery({
    queryKey: ["monday-token"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("monday_tokens")
        .select("*")
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No token found, which is expected for new users
          return null;
        }
        throw error;
      }

      return data as MondayToken;
    },
    retry: (failureCount, error: any) => {
      // Don't retry if it's a "not found" error
      if (error?.code === "PGRST116") {
        return false;
      }
      return failureCount < 3;
    },
  });

  // Mutation to save token
  const saveToken = useMutation({
    mutationFn: async (tokenData: Omit<MondayToken, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("monday_tokens")
        .upsert(tokenData, { onConflict: "user_id" })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monday-token"] });
      toast({
        title: "Success! 🎉",
        description: "Monday.com account connected successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to save Monday.com token.",
        variant: "destructive",
      });
    },
  });

  // Mutation to disconnect Monday.com
  const disconnectMonday = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("monday_tokens")
        .delete()
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monday-token"] });
      toast({
        title: "Disconnected",
        description: "Monday.com account disconnected successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Disconnection Failed",
        description: error.message || "Failed to disconnect Monday.com account.",
        variant: "destructive",
      });
    },
  });

  // Mutation to get auth URL
  const getAuthUrl = useMutation({
    mutationFn: async () => {
      const redirectUri = `${window.location.origin}/monday-callback`;
      
      const { data, error } = await supabase.functions.invoke('get-monday-auth-url', {
        body: { 
          redirect_uri: redirectUri
        },
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (error) throw error;
      if (!data?.authUrl) throw new Error('No auth URL received');

      return data;
    },
    onError: (error: any) => {
      toast({
        title: "Authorization Failed",
        description: error.message || "Failed to get Monday.com authorization URL.",
        variant: "destructive",
      });
    },
  });

  // Mutation to handle OAuth callback
  const handleOAuthCallback = useMutation({
    mutationFn: async ({ code, state, redirect_uri }: { 
      code: string; 
      state: string; 
      redirect_uri: string; 
    }) => {
      const { data, error } = await supabase.functions.invoke('monday-oauth-callback', {
        body: { 
          code,
          state,
          redirect_uri
        },
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'OAuth callback failed');

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monday-token"] });
      toast({
        title: "Success! 🎉",
        description: "Monday.com account connected successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect Monday.com account. Please try again.",
        variant: "destructive",
      });
    },
  });

  const isConnected = !!mondayToken && (
    !mondayToken.expires_at || new Date(mondayToken.expires_at) > new Date()
  );

  return {
    mondayToken,
    isLoading,
    error,
    isConnected,
    saveToken,
    disconnectMonday,
    getAuthUrl,
    handleOAuthCallback,
  };
}; 