import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useMondayAuth } from "./useMondayAuth";

interface MondayBoard {
  id: string;
  name: string;
  description?: string;
  state: string;
  board_folder_id?: string;
  board_kind: string;
  permissions: string;
  columns: {
    id: string;
    title: string;
    type: string;
  }[];
  groups: {
    id: string;
    title: string;
    color: string;
  }[];
}

interface CreateItemData {
  board_id: string;
  group_id?: string;
  item_name: string;
  column_values?: Record<string, any>;
}

export const useMondayBoards = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isConnected } = useMondayAuth();

  // Query to get Monday.com boards
  const { 
    data: boardsData, 
    isLoading: isLoadingBoards, 
    error: boardsError,
    refetch: refetchBoards 
  } = useQuery({
    queryKey: ["monday-boards"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-monday-boards', {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to fetch boards');

      return data;
    },
    enabled: isConnected,
    retry: (failureCount, error: any) => {
      // Don't retry if Monday.com is not connected
      if (error?.message?.includes('not connected')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // Mutation to create an item
  const createItem = useMutation({
    mutationFn: async (itemData: CreateItemData) => {
      const { data, error } = await supabase.functions.invoke('create-monday-item', {
        body: itemData,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to create item');

      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Success! 🎉",
        description: `Item "${data.item?.name}" created successfully!`,
      });
      // Optionally refetch boards to update counts
      queryClient.invalidateQueries({ queryKey: ["monday-boards"] });
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create item in Monday.com.",
        variant: "destructive",
      });
    },
  });

  // Mutation to refresh boards
  const refreshBoards = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-monday-boards', {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to refresh boards');

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monday-boards"] });
      toast({
        title: "Refreshed",
        description: "Monday.com boards refreshed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Refresh Failed",
        description: error.message || "Failed to refresh Monday.com boards.",
        variant: "destructive",
      });
    },
  });

  const boards = boardsData?.boards || [];
  const accountName = boardsData?.account_name;

  return {
    boards: boards as MondayBoard[],
    accountName,
    isLoadingBoards,
    boardsError,
    refetchBoards,
    createItem,
    refreshBoards,
  };
}; 