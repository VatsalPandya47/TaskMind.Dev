import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type AsanaToken = Tables<"asana_tokens">;

export const useAsanaAuth = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: asanaToken,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["asana-token"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("asana_tokens")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data as AsanaToken | null;
    },
  });

  const saveToken = useMutation({
    mutationFn: async (tokenData: { 
      access_token: string; 
      refresh_token?: string; 
      expires_at?: string; 
      scope?: string;
      workspace_id?: string;
      workspace_name?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Delete existing token first
      await supabase
        .from("asana_tokens")
        .delete()
        .eq("user_id", user.id);

      // Insert new token
      const { data, error } = await supabase
        .from("asana_tokens")
        .insert({
          user_id: user.id,
          ...tokenData,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asana-token"] });
      toast({
        title: "Success",
        description: "Asana account connected successfully",
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

  const disconnectAsana = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("asana_tokens")
        .delete()
        .eq("user_id", user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asana-token"] });
      queryClient.invalidateQueries({ queryKey: ["asana-projects"] });
      toast({
        title: "Success",
        description: "Asana account disconnected",
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

  const getAuthUrl = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-asana-auth-url', {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (error) throw error;
      if (!data?.authUrl) throw new Error('Failed to get authorization URL');

      return data;
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to get authorization URL: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleOAuthCallback = useMutation({
    mutationFn: async ({ code, state, redirect_uri }: { 
      code: string; 
      state: string; 
      redirect_uri: string; 
    }) => {
      const { data, error } = await supabase.functions.invoke('asana-oauth-callback', {
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
      queryClient.invalidateQueries({ queryKey: ["asana-token"] });
      toast({
        title: "Success! 🎉",
        description: "Asana account connected successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect Asana account. Please try again.",
        variant: "destructive",
      });
    },
  });

  const isConnected = !!asanaToken && (
    !asanaToken.expires_at || new Date(asanaToken.expires_at) > new Date()
  );

  return {
    asanaToken,
    isLoading,
    error,
    isConnected,
    saveToken,
    disconnectAsana,
    getAuthUrl,
    handleOAuthCallback,
  };
}; 