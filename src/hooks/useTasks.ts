import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { slackService } from "@/lib/slackService";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Task = {
  id: string;
  task: string;
  description?: string;
  assignee: string;
  due_date?: string;
  priority: string;
  meeting_id?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
};

export type TaskInsert = {
  task: string;
  description?: string;
  assignee: string;
  due_date?: string;
  priority: string;
  meeting_id?: string;
};

type TaskUpdate = TablesUpdate<"tasks">;

export const useTasks = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Task[];
    },
  });

  const createTask = useMutation({
    mutationFn: async (task: Omit<TaskInsert, "user_id">) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("tasks")
        .insert({ ...task, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Success",
        description: "Task created successfully",
      });
      
      // Send Slack notification for new task
      try {
        slackService.notifyTaskCreated(newTask);
      } catch (error) {
        console.error('Failed to send Slack notification for new task:', error);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & TaskUpdate) => {
      const { data, error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
      
      // Send Slack notification for task completion
      if (updatedTask.completed) {
        try {
          slackService.notifyTaskCompleted(updatedTask);
        } catch (error) {
          console.error('Failed to send Slack notification for completed task:', error);
        }
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
  };
};
