
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileText, CheckSquare, Calendar, TrendingUp, Upload } from "lucide-react";
import { useState } from "react";

const DashboardTab = () => {
  const [transcript, setTranscript] = useState("");

  const stats = [
    {
      title: "Total Meetings",
      value: "12",
      change: "+2 this week",
      icon: Calendar,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Action Items",
      value: "34",
      change: "+8 pending",
      icon: CheckSquare,
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Completed Tasks",
      value: "26",
      change: "76% completion rate",
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-600"
    }
  ];

  const recentMeetings = [
    { title: "Q3 Product Planning", date: "2025-06-10", tasks: 3 },
    { title: "Marketing Strategy Review", date: "2025-06-08", tasks: 2 },
    { title: "Team Standup", date: "2025-06-07", tasks: 0 }
  ];

  const urgentTasks = [
    { task: "Finalize marketing brief", assignee: "Alice", dueDate: "2025-06-21", priority: "High" },
    { task: "Update project timeline", assignee: "Bob", dueDate: "2025-06-18", priority: "Medium" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your meeting intelligence overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.change}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Quick Process Meeting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your meeting transcript here for instant AI processing..."
            className="min-h-[120px]"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />
          <Button className="w-full sm:w-auto">
            <FileText className="w-4 h-4 mr-2" />
            Process Meeting
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Meetings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentMeetings.map((meeting, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{meeting.title}</p>
                    <p className="text-sm text-gray-600">{meeting.date}</p>
                  </div>
                  <div className="text-sm">
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      {meeting.tasks} tasks
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Urgent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Urgent Action Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {urgentTasks.map((task, index) => (
                <div key={index} className="p-3 border border-orange-200 bg-orange-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{task.task}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Assigned to {task.assignee} • Due {task.dueDate}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      task.priority === "High" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardTab;
