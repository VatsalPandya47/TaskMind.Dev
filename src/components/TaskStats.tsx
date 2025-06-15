
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TaskStatsProps {
  tasks: any[];
  filteredTasks: any[];
}

const TaskStats = ({ tasks, filteredTasks }: TaskStatsProps) => {
  const completedTasks = filteredTasks.filter(task => task.completed);
  const pendingTasks = filteredTasks.filter(task => !task.completed);

  return (
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
  );
};

export default TaskStats;
