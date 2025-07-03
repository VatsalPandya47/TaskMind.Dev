import React, { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useMeetings } from "@/hooks/useMeetings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckSquare, Plus, X, AlertCircle, Clock, Circle, CheckCircle2, Edit3, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from '../context/ThemeContext';
import { format } from 'date-fns';
import ThemeGradientWrapper from "./ThemeGradientWrapper";

const TasksTab = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editingDescription, setEditingDescription] = useState("");
  const { toast } = useToast();
  const [newTask, setNewTask] = useState({
    task: "",
    description: "",
    assignee: "",
    due_date: "",
    priority: "Medium",
    meeting_id: "none",
  });
  
  // Use hooks with error boundaries
  const { 
    tasks = [], 
    isLoading: tasksLoading, 
    createTask,
    error: tasksError,
    updateTask
  } = useTasks() || {};

  const { 
    meetings = [], 
    isLoading: meetingsLoading,
    error: meetingsError 
  } = useMeetings() || {};

  const { theme } = useTheme();

  // Helper functions for priority styling
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High': return <AlertCircle className="h-3 w-3" />;
      case 'Medium': return <Clock className="h-3 w-3" />;
      case 'Low': return <Circle className="h-3 w-3" />;
      default: return <Circle className="h-3 w-3" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-500/20 text-red-400 border-red-400/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
      case 'Low': return 'bg-green-500/20 text-green-400 border-green-400/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!newTask.task.trim() || !newTask.assignee.trim()) {
      toast({
        title: "Error",
        description: "Task description and assignee are required",
        variant: "destructive",
      });
      return;
    }

    if (!createTask) {
      toast({
        title: "Error",
        description: "Create task function not available",
        variant: "destructive",
      });
      return;
    }

    try {
      await createTask.mutateAsync({
        task: newTask.task,
        description: newTask.description,
        assignee: newTask.assignee,
        due_date: newTask.due_date || null,
        priority: newTask.priority,
        meeting_id: newTask.meeting_id === "none" ? null : newTask.meeting_id,
      });

      setNewTask({
        task: "",
        description: "",
        assignee: "",
        due_date: "",
        priority: "Medium",
        meeting_id: "none",
      });
      setShowCreateForm(false);
      
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    }
  };

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    try {
      await updateTask.mutateAsync({ id: taskId, completed });
    } catch (error) {
      console.error('Error updating task completion:', error);
    }
  };

  const handleEditDescription = (taskId: string, currentDescription: string) => {
    setEditingTask(taskId);
    setEditingDescription(currentDescription || "");
  };

  const handleSaveDescription = async (taskId: string) => {
    try {
      await updateTask.mutateAsync({ 
        id: taskId, 
        description: editingDescription.trim() || null 
      });
      setEditingTask(null);
      setEditingDescription("");
      toast({
        title: "Success",
        description: "Task description updated",
      });
    } catch (error) {
      console.error('Error updating task description:', error);
      toast({
        title: "Error", 
        description: "Failed to update description",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditingDescription("");
  };

  if (tasksLoading || meetingsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 container mx-auto px-6 py-20 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="heading-gradient">Tasks</h1>
              <p className="text-default">Focus on what matters most</p>
            </div>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThemeGradientWrapper>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="heading-gradient">Tasks</h1>
          <p className="text-default">Focus on what matters most</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="button-solid-primary">
          New Task
        </Button>
      </div>

      {/* Error Display */}
      {(tasksError || meetingsError) && (
        <Card className="bg-red-500/10 backdrop-blur-sm border-red-500/20 shadow-lg">
          <CardContent className="pt-6">
            <p className="text-red-400">
              {tasksError && `Oops! Tasks Error: ${tasksError.message}`}
              {meetingsError && `Oops! Meetings Error: ${meetingsError.message}`}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {(tasksLoading || meetingsLoading) && (
        <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50 shadow-lg">
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-muted-foreground">Loading your tasks...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Task Form */}
      {showCreateForm && (
        <Card className="card-surface-blue">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-blue-300">Create New Mission 🚀</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowCreateForm(false)}
                className="text-gray-300 hover:text-white hover:bg-gray-700/50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription className="text-gray-300">
              Add a new task or action item to track your progress.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="task" className="text-gray-300">What needs to be done? *</Label>
                  <Input
                    id="task"
                    value={newTask.task}
                    onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                    placeholder="Enter your task description"
                    className="bg-gray-800/60 border-gray-700/50 text-white placeholder-white focus:border-blue-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-300">Description</Label>
                  <Textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Enter a description for the task"
                    className="bg-gray-800/60 border-gray-700/50 text-white placeholder-white focus:border-blue-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignee" className="text-gray-300">Owner *</Label>
                  <Input
                    id="assignee"
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                    placeholder="Who is responsible for this?"
                    className="bg-gray-800/60 border-gray-700/50 text-white placeholder-white focus:border-blue-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due_date" className="text-gray-300">When's the deadline?</Label>
                  <div className="relative">
                    <Input
                      id="due_date"
                      type="date"
                      value={newTask.due_date}
                      onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                      className="bg-gray-800/60 border-gray-700/50 text-white focus:border-blue-400 pr-10"
                      style={{
                        colorScheme: "dark"
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-gray-300">How urgent is this?</Label>
                  <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
                    <SelectTrigger className="bg-gray-800/60 border-gray-700/50 text-white">
                      <SelectValue placeholder="Select priority level" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="High" className="text-white hover:bg-gray-700">High - Drop everything! 🚨</SelectItem>
                      <SelectItem value="Medium" className="text-white hover:bg-gray-700">Medium - Important but not urgent ⏰</SelectItem>
                      <SelectItem value="Low" className="text-white hover:bg-gray-700">Low - When you have time 😌</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="meeting" className="text-gray-300">Related Meeting (Optional)</Label>
                  <Select value={newTask.meeting_id} onValueChange={(value) => setNewTask({ ...newTask, meeting_id: value })}>
                    <SelectTrigger className="bg-gray-800/60 border-gray-700/50 text-white">
                      <SelectValue placeholder="Choose a meeting" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="none" className="text-white hover:bg-gray-700">No specific meeting</SelectItem>
                      {meetings.map((meeting) => (
                        <SelectItem key={meeting.id} value={meeting.id} className="text-white hover:bg-gray-700">
                          {meeting.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl">
                  Create Mission! 🎯
                </Button>
                <Button 
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="button-danger rounded-2xl"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tasks List */}
      {!tasksLoading && !meetingsLoading && (
        <Card className="card-surface">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <CheckSquare className="h-5 w-5 text-blue-400" />
              Your Task Arsenal
            </CardTitle>
            <CardDescription className="text-gray-300">
              {tasks.length === 0 ? "Ready to add your first mission? 🚀" : `${tasks.length} tasks in your command center`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center">
                  <CheckSquare className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No tasks yet</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  Create your first task or connect a meeting to get started
                </p>
                <Button onClick={() => setShowCreateForm(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 py-2.5 font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl">
                  Create Task
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-xl hover:bg-gray-600/50 transition-colors duration-200"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateTask.mutate({ id: task.id, completed: !task.completed })}
                      className="p-1 h-auto text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </Button>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-medium ${task.completed ? 'text-gray-300 line-through' : 'text-white'}`}>
                          {task.task}
                        </span>
                        {task.priority && (
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                            {getPriorityIcon(task.priority)}
                            <span>{task.priority}</span>
                          </span>
                        )}
                      </div>
                      
                      {/* Description Section */}
                      <div className="mb-2">
                        {editingTask === task.id ? (
                          <div className="flex items-center gap-2">
                            <Textarea
                              value={editingDescription}
                              onChange={(e) => setEditingDescription(e.target.value)}
                              placeholder="Add a description..."
                              className="bg-gray-800/60 border-gray-700/50 text-white placeholder-gray-400 focus:border-blue-400 text-sm min-h-[80px]"
                            />
                            <div className="flex flex-col gap-1">
                              <Button
                                size="sm"
                                onClick={() => handleSaveDescription(task.id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 h-auto"
                              >
                                <Save className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancelEdit}
                                className="button-danger px-2 py-1 h-auto"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2">
                            <p className="text-sm text-gray-300 flex-1">
                              {task.description || (
                                <span className="text-gray-500 italic">No description</span>
                              )}
                            </p>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditDescription(task.id, task.description || "")}
                              className="text-gray-300 hover:text-blue-400 px-2 py-1 h-auto"
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      {task.assignee && (
                        <p className="text-sm text-gray-300">
                          Assigned to: {task.assignee}
                        </p>
                      )}
                      {task.due_date && (
                        <p className="text-sm text-gray-300">
                          Due: {format(new Date(task.due_date), 'MMM dd, yyyy')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </ThemeGradientWrapper>
  );
};

export default TasksTab;
