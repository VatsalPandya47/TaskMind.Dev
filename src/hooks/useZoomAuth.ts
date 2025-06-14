
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type ZoomToken = Tables<"zoom_tokens">;

export const useZoomAuth = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: zoomToken,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["zoom-token"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("zoom_tokens")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data as ZoomToken | null;
    },
  });

  const saveToken = useMutation({
    mutationFn: async (tokenData: { access_token: string; refresh_token?: string; expires_at: string; scope?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Delete existing token first
      await supabase
        .from("zoom_tokens")
        .delete()
        .eq("user_id", user.id);

      // Insert new token
      const { data, error } = await supabase
        .from("zoom_tokens")
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
      queryClient.invalidateQueries({ queryKey: ["zoom-token"] });
      toast({
        title: "Success",
        description: "Zoom account connected successfully",
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

  const disconnectZoom = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("zoom_tokens")
        .delete()
        .eq("user_id", user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zoom-token"] });
      toast({
        title: "Success",
        description: "Zoom account disconnected",
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

  const isConnected = !!zoomToken && new Date(zoomToken.expires_at) > new Date();

  return {
    zoomToken,
    isLoading,
    error,
    isConnected,
    saveToken,
    disconnectZoom,
  };
};
