
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, CheckSquare, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface TaskListProps {
  filteredTasks: any[];
  tasks: any[];
  updateTask: any;
  deleteTask: any;
  onCreateTaskClick: () => void;
}

const TaskList = ({ filteredTasks, tasks, updateTask, deleteTask, onCreateTaskClick }: TaskListProps) => {
  const { toast } = useToast();

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
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

  const handleDeleteTask = async (taskId: string) => {
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

  return (
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
              <Button onClick={onCreateTaskClick}>
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
  );
};

export default TaskList;
