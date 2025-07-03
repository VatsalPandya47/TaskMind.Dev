import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AsanaProject {
  gid: string;
  name: string;
  color?: string;
  notes?: string;
  team?: {
    gid: string;
    name: string;
  };
  created_at?: string;
  modified_at?: string;
}

export interface AsanaTask {
  gid: string;
  name: string;
  notes?: string;
  completed: boolean;
  due_on?: string;
  assignee?: {
    gid: string;
    name: string;
  };
  projects?: AsanaProject[];
  created_at?: string;
  modified_at?: string;
}

export const useAsanaProjects = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: projectsData,
    isLoading: isLoadingProjects,
    error: projectsError,
    refetch: refetchProjects,
  } = useQuery({
    queryKey: ["asana-projects"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-asana-projects', {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to fetch projects');

      return {
        projects: data.projects as AsanaProject[],
        workspace: data.workspace
      };
    },
    enabled: false, // Will be enabled when user is connected
  });

  const createTask = useMutation({
    mutationFn: async ({
      projectId,
      name,
      notes,
      due_on,
      assignee
    }: {
      projectId: string;
      name: string;
      notes?: string;
      due_on?: string;
      assignee?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke('create-asana-task', {
        body: {
          projectId,
          name,
          notes,
          due_on,
          assignee
        },
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to create task');

      return data.task as AsanaTask;
    },
    onSuccess: () => {
      toast({
        title: "Success! 🎉",
        description: "Task created successfully in Asana",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Task",
        description: error.message || "Could not create task in Asana. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    projects: projectsData?.projects || [],
    workspace: projectsData?.workspace,
    isLoadingProjects,
    projectsError,
    refetchProjects,
    createTask,
  };
};

export const useAsanaTasks = () => {
  const { toast } = useToast();

  const createTask = useMutation({
    mutationFn: async ({
      projectId,
      name,
      notes,
      due_on,
      assignee
    }: {
      projectId: string;
      name: string;
      notes?: string;
      due_on?: string;
      assignee?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke('create-asana-task', {
        body: {
          projectId,
          name,
          notes,
          due_on,
          assignee
        },
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to create task');

      return data.task as AsanaTask;
    },
    onSuccess: (task) => {
      toast({
        title: "Success! 🎉",
        description: `Task "${task.name}" created successfully in Asana`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Task",
        description: error.message || "Could not create task in Asana. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    createTask,
  };
}; 