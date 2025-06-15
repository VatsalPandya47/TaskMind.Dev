
import React, { useState } from "react";
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

const TasksTab = () => {
  const { tasks, isLoading, createTask, updateTask, deleteTask } = useTasks();
  const { meetings, isLoading: meetingsLoading } = useMeetings();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [newTask, setNewTask] = useState({
    task: "",
    assignee: "",
    due_date: "",
    priority: "Medium",
    meeting_id: "",
  });

  // Update filtered tasks when tasks change
  React.useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createTask.mutateAsync({
        task: newTask.task,
        assignee: newTask.assignee,
        due_date: newTask.due_date || null,
        priority: newTask.priority as "High" | "Medium" | "Low",
        meeting_id: newTask.meeting_id || null,
      });

      // Reset form and close dialog
      setNewTask({
        task: "",
        assignee: "",
        due_date: "",
        priority: "Medium",
        meeting_id: "",
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    try {
      await updateTask.mutateAsync({
        id: taskId,
        completed: !completed,
      });
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask.mutateAsync(taskId);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  if (isLoading || meetingsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Tasks</h1>
            <p className="text-slate-600">Manage action items and follow-ups from meetings</p>
          </div>
          <Button disabled className="gradient-bg text-white rounded-xl shadow-lg shadow-purple-500/25">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
        <StatsSkeleton />
        <TaskSkeleton />
      </div>
    );
  }

  const completedTasks = filteredTasks.filter(task => task.completed);
  const pendingTasks = filteredTasks.filter(task => !task.completed);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tasks</h1>
          <p className="text-slate-600">Manage action items and follow-ups from meetings</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-bg text-white rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white border border-slate-200">
            <DialogHeader>
              <DialogTitle className="text-slate-900">Create New Task</DialogTitle>
              <DialogDescription className="text-slate-600">
                Add a new task or action item to track progress.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="task" className="text-slate-700">Task Description</Label>
                  <Input
                    id="task"
                    value={newTask.task}
                    onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                    placeholder="Enter task description"
                    required
                    className="border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignee" className="text-slate-700">Assignee</Label>
                  <Input
                    id="assignee"
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                    placeholder="Who is responsible?"
                    required
                    className="border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due_date" className="text-slate-700">Due Date</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                    className="border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-slate-700">Priority</Label>
                  <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
                    <SelectTrigger className="border-slate-200 focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-slate-200">
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meeting" className="text-slate-700">Related Meeting (Optional)</Label>
                  <Select value={newTask.meeting_id} onValueChange={(value) => setNewTask({ ...newTask, meeting_id: value })}>
                    <SelectTrigger className="border-slate-200 focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue placeholder="Select meeting" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-slate-200">
                      <SelectItem value="">No meeting</SelectItem>
                      {meetings.map((meeting) => (
                        <SelectItem key={meeting.id} value={meeting.id}>
                          {meeting.title} - {format(new Date(meeting.date), "MMM d, yyyy")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={createTask.isPending}
                  className="gradient-bg text-white rounded-xl shadow-lg shadow-purple-500/25"
                >
                  {createTask.isPending ? "Creating..." : "Create Task"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border border-slate-200/60 card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-slate-900">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{tasks.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-slate-200/60 card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-slate-900">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{pendingTasks.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-slate-200/60 card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-slate-900">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{completedTasks.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <TaskFilter
        tasks={tasks}
        meetings={meetings}
        onFilteredTasks={setFilteredTasks}
      />

      <Card className="bg-white border border-slate-200/60 card-shadow">
        <CardHeader>
          <CardTitle className="text-slate-900">Task List</CardTitle>
          <CardDescription className="text-slate-600">
            Track and manage your action items ({filteredTasks.length} of {tasks.length} tasks)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8">
              <div className="p-4 bg-slate-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckSquare className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                {tasks.length === 0 ? "No tasks yet" : "No matching tasks"}
              </h3>
              <p className="text-slate-600 mb-4">
                {tasks.length === 0 
                  ? "Create your first task to get started." 
                  : "Try adjusting your filters to see more tasks."
                }
              </p>
              {tasks.length === 0 && (
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="gradient-bg text-white rounded-xl shadow-lg shadow-purple-500/25"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              )}
            </div>
          ) : (
            <div className="bg-slate-50/50 rounded-xl p-1">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200/60">
                    <TableHead className="w-12 text-slate-600 font-medium">Done</TableHead>
                    <TableHead className="text-slate-600 font-medium">Task</TableHead>
                    <TableHead className="text-slate-600 font-medium">Assignee</TableHead>
                    <TableHead className="text-slate-600 font-medium">Priority</TableHead>
                    <TableHead className="text-slate-600 font-medium">Due Date</TableHead>
                    <TableHead className="text-slate-600 font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id} className={`border-slate-200/60 hover:bg-white/50 ${task.completed ? "opacity-60" : ""}`}>
                      <TableCell>
                        <Checkbox
                          checked={task.completed || false}
                          onCheckedChange={() => toggleTaskCompletion(task.id, task.completed || false)}
                        />
                      </TableCell>
                      <TableCell className={`text-slate-900 ${task.completed ? "line-through" : ""}`}>{task.task}</TableCell>
                      <TableCell className="text-slate-600">{task.assignee}</TableCell>
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
                      <TableCell className="text-slate-600">
                        {task.due_date ? format(new Date(task.due_date), "MMM d, yyyy") : "No due date"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTask(task.id)}
                          disabled={deleteTask.isPending}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TasksTab;
