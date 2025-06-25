import React, { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useMeetings } from "@/hooks/useMeetings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckSquare, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from '../context/ThemeContext';

const TasksTab = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();
  const [newTask, setNewTask] = useState({
    task: "",
    assignee: "",
    due_date: "",
    priority: "Medium",
    meeting_id: "none",
    status: "In Progress",
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
        assignee: newTask.assignee,
        due_date: newTask.due_date || null,
        priority: newTask.priority,
        meeting_id: newTask.meeting_id === "none" ? null : newTask.meeting_id,
        status: newTask.status,
      });

      setNewTask({
        task: "",
        assignee: "",
        due_date: "",
        priority: "Medium",
        meeting_id: "none",
        status: "In Progress",
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

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await updateTask.mutateAsync({ id: taskId, status: newStatus });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  if (tasksLoading || meetingsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Master 🎯</h1>
            <p className="text-gray-600">Your action items and follow-ups from meetings</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Master 🎯</h1>
          <p className="text-gray-600">Your action items and follow-ups from meetings</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add New Task
        </Button>
      </div>

      {/* Error Display */}
      {(tasksError || meetingsError) && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">
              {tasksError && `Oops! Tasks Error: ${tasksError.message}`}
              {meetingsError && `Oops! Meetings Error: ${meetingsError.message}`}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Create Task Form */}
      {showCreateForm && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-blue-900">Create New Mission 🚀</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowCreateForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              Add a new task or action item to track your progress.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="task">What needs to be done? *</Label>
                  <Input
                    id="task"
                    value={newTask.task}
                    onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                    placeholder="Enter your task description"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignee">Owner *</Label>
                  <Input
                    id="assignee"
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                    placeholder="Who is responsible for this?"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due_date">When's the deadline?</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">How urgent is this?</Label>
                  <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High - Drop everything! 🚨</SelectItem>
                      <SelectItem value="Medium">Medium - Important but not urgent ⏰</SelectItem>
                      <SelectItem value="Low">Low - When you have time 😌</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="meeting">Related Meeting (Optional)</Label>
                  <Select value={newTask.meeting_id} onValueChange={(value) => setNewTask({ ...newTask, meeting_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a meeting" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No specific meeting</SelectItem>
                      {meetings.map((meeting) => (
                        <SelectItem key={meeting.id} value={meeting.id}>
                          {meeting.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Create Mission! 🎯
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Simple Task List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Task List
          </CardTitle>
          <CardDescription>
            Track and manage your action items ({tasks?.length || 0} tasks)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!tasks || tasks.length === 0 ? (
            <div className="text-center py-12">
              <CheckSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
              <p className="text-gray-600 mb-4">Create your first task to get started.</p>
              <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className={`flex items-center justify-between p-4 border rounded ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                  <div>
                    <p className={`font-medium ${task.completed ? 'line-through opacity-60' : ''}`}>
                      {task.task}
                    </p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Owner: {task.assignee}</p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Due Date: {task.due_date || 'N/A'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={task.status} onValueChange={(value) => handleStatusChange(task.id, value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Complete">Complete</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Stuck">Stuck</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TasksTab;
