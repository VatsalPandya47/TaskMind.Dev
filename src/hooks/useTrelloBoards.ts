import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TrelloBoard {
  id: string;
  name: string;
  desc: string;
  url: string;
  closed: boolean;
  pinned: boolean;
}

interface TrelloList {
  id: string;
  name: string;
  pos: number;
  closed: boolean;
}

interface TrelloCard {
  id: string;
  name: string;
  desc?: string;
  due?: string;
  url: string;
}

interface CreateCardParams {
  listId: string;
  name: string;
  desc?: string;
  due?: string;
  pos?: string;
}

export const useTrelloBoards = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: boardsData,
    isLoading: isLoadingBoards,
    error: boardsError,
    refetch: refetchBoards,
  } = useQuery({
    queryKey: ["trello-boards"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-trello-boards', {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to fetch boards');

      return data;
    },
    enabled: false, // Only fetch when explicitly called
  });

  const getBoardLists = useMutation({
    mutationFn: async (boardId: string) => {
      const { data, error } = await supabase.functions.invoke('get-trello-lists', {
        body: { boardId },
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to fetch lists');

      return data;
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch board lists",
        variant: "destructive",
      });
    },
  });

  const createCard = useMutation({
    mutationFn: async (params: CreateCardParams) => {
      const { data, error } = await supabase.functions.invoke('create-trello-card', {
        body: {
          listId: params.listId,
          name: params.name,
          desc: params.desc,
          due: params.due,
          pos: params.pos,
        },
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to create card');

      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Success! 🎯",
        description: `Card "${data.card?.name}" created successfully in Trello`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create card",
        variant: "destructive",
      });
    },
  });

  const boards = boardsData?.boards || [];
  const user = boardsData?.user;

  return {
    boards: boards as TrelloBoard[],
    user,
    isLoadingBoards,
    boardsError,
    refetchBoards,
    getBoardLists,
    createCard,
  };
}; 