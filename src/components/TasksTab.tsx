
import React, { useState, useEffect } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useMeetings } from "@/hooks/useMeetings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, CheckSquare, Trash2 } from "lucide-react";
import { format } from "date-fns";
import TaskFilter from "./TaskFilter";
import { TaskSkeleton, StatsSkeleton } from "./LoadingSkeleton";
import { useToast } from "@/hooks/use-toast";

const TasksTab = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const { toast } = useToast();
  const [newTask, setNewTask] = useState({
    task: "",
    assignee: "",
    due_date: "",
    priority: "Medium",
    meeting_id: "",
  });

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

  const handleSubmit = async (e) => {
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
        meeting_id: newTask.meeting_id || null,
      });

      setNewTask({
        task: "",
        assignee: "",
        due_date: "",
        priority: "Medium",
        meeting_id: "",
      });
      setIsDialogOpen(false);
      
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

  const toggleTaskCompletion = async (taskId, completed) => {
    if (!updateTask) return;

    try {
      await updateTask.mutateAsync({
        id: taskId,
        completed: !completed,
      });
      
      toast({
        title: "Success",
        description: completed ? "Task marked as incomplete" : "Task completed",
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!deleteTask) return;

    try {
      await deleteTask.mutateAsync(taskId);
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  // Show loading state
  if (tasksLoading || meetingsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            <p className="text-gray-600">Manage action items and follow-ups from meetings</p>
          </div>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
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

  const completedTasks = filteredTasks.filter(task => task.completed);
  const pendingTasks = filteredTasks.filter(task => !task.completed);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600">Manage action items and follow-ups from meetings</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Add a new task or action item to track progress.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="task">Task Description *</Label>
                  <Input
                    id="task"
                    value={newTask.task}
                    onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                    placeholder="Enter task description"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignee">Assignee *</Label>
                  <Input
                    id="assignee"
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                    placeholder="Who is responsible?"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meeting">Related Meeting (Optional)</Label>
                  <Select value={newTask.meeting_id} onValueChange={(value) => setNewTask({ ...newTask, meeting_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select meeting" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No meeting</SelectItem>
                      {meetings && meetings.map && meetings.map((meeting) => (
                        <SelectItem key={meeting.id} value={meeting.id}>
                          {meeting.title} - {meeting.date ? format(new Date(meeting.date), "MMM d, yyyy") : 'No date'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createTask?.isPending}>
                  {createTask?.isPending ? "Creating..." : "Create Task"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{tasks?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{pendingTasks?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{completedTasks?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      {tasks && meetings && (
        <TaskFilter
          tasks={tasks}
          meetings={meetings}
          onFilteredTasks={setFilteredTasks}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Task List</CardTitle>
          <CardDescription>
            Track and manage your action items ({filteredTasks?.length || 0} of {tasks?.length || 0} tasks)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!filteredTasks || filteredTasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {!tasks || tasks.length === 0 ? "No tasks yet" : "No matching tasks"}
              </h3>
              <p className="text-gray-600 mb-4">
                {!tasks || tasks.length === 0 
                  ? "Create your first task to get started." 
                  : "Try adjusting your filters to see more tasks."
                }
              </p>
              {(!tasks || tasks.length === 0) && (
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Done</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id} className={task.completed ? "opacity-60" : ""}>
                    <TableCell>
                      <Checkbox
                        checked={task.completed || false}
                        onCheckedChange={() => toggleTaskCompletion(task.id, task.completed || false)}
                      />
                    </TableCell>
                    <TableCell className={task.completed ? "line-through" : ""}>{task.task}</TableCell>
                    <TableCell>{task.assignee}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          task.priority === "High" ? "destructive" :
                          task.priority === "Medium" ? "default" : "secondary"
                        }
                      >
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {task.due_date ? format(new Date(task.due_date), "MMM d, yyyy") : "No due date"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                        disabled={deleteTask?.isPending}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TasksTab;
