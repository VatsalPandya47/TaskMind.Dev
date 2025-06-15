
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface TaskFormProps {
  meetings: any[];
  createTask: any;
}

const TaskForm = ({ meetings, createTask }: TaskFormProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const [newTask, setNewTask] = useState({
    task: "",
    assignee: "",
    due_date: "",
    priority: "Medium",
    meeting_id: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
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
  );
};

export default TaskForm;
