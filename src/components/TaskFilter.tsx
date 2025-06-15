
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Task = Tables<"tasks">;
type Meeting = Tables<"meetings">;

interface TaskFilterProps {
  tasks: Task[];
  meetings: Meeting[];
  onFilteredTasks: (filteredTasks: Task[]) => void;
}

const TaskFilter = ({ tasks, meetings, onFilteredTasks }: TaskFilterProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState<string>("");
  const [selectedMeeting, setSelectedMeeting] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // Get unique assignees from tasks
  const uniqueAssignees = Array.from(new Set(tasks.map(task => task.assignee))).filter(Boolean);

  const applyFilters = () => {
    let filtered = tasks;

    // Search term filter (task text)
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.task.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Assignee filter
    if (selectedAssignee) {
      filtered = filtered.filter(task => task.assignee === selectedAssignee);
    }

    // Meeting filter
    if (selectedMeeting) {
      filtered = filtered.filter(task => task.meeting_id === selectedMeeting);
    }

    // Status filter
    if (selectedStatus) {
      if (selectedStatus === "completed") {
        filtered = filtered.filter(task => task.completed);
      } else if (selectedStatus === "pending") {
        filtered = filtered.filter(task => !task.completed);
      }
    }

    onFilteredTasks(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedAssignee("");
    setSelectedMeeting("");
    setSelectedStatus("");
    onFilteredTasks(tasks);
  };

  // Apply filters whenever any filter changes
  React.useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedAssignee, selectedMeeting, selectedStatus, tasks]);

  const hasActiveFilters = searchTerm || selectedAssignee || selectedMeeting || selectedStatus;

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Assignee Filter */}
          <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All assignees</SelectItem>
              {uniqueAssignees.map((assignee) => (
                <SelectItem key={assignee} value={assignee}>
                  {assignee}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Meeting Filter */}
          <Select value={selectedMeeting} onValueChange={setSelectedMeeting}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by meeting" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All meetings</SelectItem>
              {meetings.map((meeting) => (
                <SelectItem key={meeting.id} value={meeting.id}>
                  {meeting.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters} className="w-full">
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskFilter;
