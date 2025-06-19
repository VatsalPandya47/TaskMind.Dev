import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useMeetings } from "@/hooks/useMeetings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, CheckSquare, X } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const TasksTab = () => {
  
  try {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const { toast } = useToast();
    const [newTask, setNewTask] = useState({
      task: "",
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
      error: tasksError 
    } = useTasks() || {};

    const { 
      meetings = [], 
      isLoading: meetingsLoading,
      error: meetingsError 
    } = useMeetings() || {};

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
          meeting_id: newTask.meeting_id === "none" ? null : newTask.meeting_id,
        });

        setNewTask({
          task: "",
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

    const completedTasks = tasks.filter(task => task.completed);
    const pendingTasks = tasks.filter(task => !task.completed);

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            <p className="text-gray-600">Manage action items and follow-ups from meetings</p>
          </div>
        </div>

        {/* Error Display */}
        {(tasksError || meetingsError) && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">
                {tasksError && `Tasks Error: ${tasksError.message}`}
                {meetingsError && `Meetings Error: ${meetingsError.message}`}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Create Task Form */}
        {showCreateForm && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Create New Task</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowCreateForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                Add a new task or action item to track progress.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="meeting">Related Meeting (Optional)</Label>
                    <Select value={newTask.meeting_id} onValueChange={(value) => setNewTask({ ...newTask, meeting_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select meeting" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No meeting</SelectItem>
                        {meetings && meetings.map && meetings.map((meeting) => (
                          <SelectItem key={meeting.id} value={meeting.id}>
                            {meeting.title} - {meeting.date ? format(new Date(meeting.date), "MMM d, yyyy") : 'No date'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createTask?.isPending}>
                    {createTask?.isPending ? "Creating..." : "Create Task"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

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

        <Card>
          <CardHeader>
            <CardTitle>Task List</CardTitle>
            <CardDescription>
              Track and manage your action items ({tasks?.length || 0} tasks)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!tasks || tasks.length === 0 ? (
              <div className="text-center py-8">
                <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                <p className="text-gray-600 mb-4">Create your first task to get started.</p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <p className={`font-medium ${task.completed ? 'line-through opacity-60' : ''}`}>
                        {task.task}
                      </p>
                      <p className="text-sm text-gray-600">Assignee: {task.assignee}</p>
                      {task.due_date && (
                        <p className="text-sm text-gray-500">
                          Due: {format(new Date(task.due_date), "MMM d, yyyy")}
                        </p>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {task.completed ? "Completed" : "Pending"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error('TasksTab error:', error);
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            <p className="text-gray-600">Manage action items and follow-ups from meetings</p>
          </div>
        </div>
        
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Tasks</h2>
            <p className="text-red-600">There was an error loading the tasks component.</p>
            <p className="text-red-600 mt-2">Error: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }
};

export default TasksTab;
