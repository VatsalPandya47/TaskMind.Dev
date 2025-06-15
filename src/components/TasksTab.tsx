
import React, { useState, useEffect } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useMeetings } from "@/hooks/useMeetings";
import TaskForm from "./TaskForm";
import TaskStats from "./TaskStats";
import TaskList from "./TaskList";
import TaskFilter from "./TaskFilter";
import { TaskSkeleton, StatsSkeleton } from "./LoadingSkeleton";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

const TasksTab = () => {
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const { toast } = useToast();

  // Use hooks with error boundaries
  const { 
    tasks = [], 
    isLoading: tasksLoading = true, 
    createTask, 
    updateTask, 
    deleteTask,
    error: tasksError 
  } = useTasks() || {};

  const { 
    meetings = [], 
    isLoading: meetingsLoading = true,
    error: meetingsError 
  } = useMeetings() || {};

  // Update filtered tasks when tasks change
  useEffect(() => {
    if (tasks && Array.isArray(tasks)) {
      setFilteredTasks(tasks);
    }
  }, [tasks]);

  // Handle errors
  useEffect(() => {
    if (tasksError) {
      console.error('Tasks error:', tasksError);
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
    }
    if (meetingsError) {
      console.error('Meetings error:', meetingsError);
    }
  }, [tasksError, meetingsError, toast]);

  // Show loading state
  if (tasksLoading || meetingsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            <p className="text-gray-600">Manage action items and follow-ups from meetings</p>
          </div>
          <TaskForm meetings={[]} createTask={null} />
        </div>
        <StatsSkeleton />
        <TaskSkeleton />
      </div>
    );
  }

  // Handle errors gracefully
  if (tasksError) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            <p className="text-gray-600">Manage action items and follow-ups from meetings</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading tasks</h3>
              <p className="text-gray-600">Please try refreshing the page.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600">Manage action items and follow-ups from meetings</p>
        </div>
        <TaskForm meetings={meetings} createTask={createTask} />
      </div>

      <TaskStats tasks={tasks} filteredTasks={filteredTasks} />

      {tasks && meetings && (
        <TaskFilter
          tasks={tasks}
          meetings={meetings}
          onFilteredTasks={setFilteredTasks}
        />
      )}

      <TaskList
        filteredTasks={filteredTasks}
        tasks={tasks}
        updateTask={updateTask}
        deleteTask={deleteTask}
        onCreateTaskClick={() => setIsCreateTaskOpen(true)}
      />
    </div>
  );
};

export default TasksTab;
