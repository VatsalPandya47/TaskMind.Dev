import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Basic interface for summaries - will be updated once types are regenerated
interface Summary {
  id: string;
  user_id: string;
  transcript: string;
  summary: string;
  created_at: string;
  audio_name?: string | null;
}

export const useUserSummaries = () => {
  const {
    data: summaries = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["summaries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("summaries")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to match our expected interface
      // This will be simplified once the types are regenerated
      return (data || []).map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        transcript: item.transcript || item.transcript_sample || "",
        summary: item.summary,
        created_at: item.created_at,
        audio_name: item.audio_name || null,
      })) as Summary[];
    },
  });

  return {
    summaries,
    isLoading,
    error,
  };
}; 