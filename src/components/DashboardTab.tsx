import { useMeetings } from "@/hooks/useMeetings";
import { useTasks } from "@/hooks/useTasks";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  CheckSquare, 
  Clock, 
  Users, 
  Brain,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Circle,
  BarChart3,
  Activity,
  Target,
  Zap,
  Star,
  Award,
  Lightbulb,
  ArrowUpRight,
  CalendarDays,
  MessageSquare,
  FileText,
  Play,
  Plus,
  Filter,
  Search,
  Bell,
  Settings,
  Download,
  Share2,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronRight,
  TrendingDown,
  Minus,
  Equal
} from "lucide-react";
import { format, isAfter, isBefore, startOfDay, addDays, differenceInDays } from "date-fns";
import { StatsSkeleton } from "./LoadingSkeleton";

interface DashboardTabProps {
  onTabChange?: (tab: string) => void;
}

const DashboardTab = ({ onTabChange }: DashboardTabProps) => {
  const { meetings, isLoading: meetingsLoading } = useMeetings();
  const { tasks, isLoading: tasksLoading } = useTasks();
  const { toast } = useToast();

  // Quick action handlers
  const handleAddNewTask = () => {
    if (onTabChange) {
      onTabChange("tasks");
      toast({
        title: "Task Master 🎯",
        description: "Ready to create your next mission!",
      });
    }
  };

  const handleScheduleMeeting = () => {
    if (onTabChange) {
      onTabChange("meetings");
      toast({
        title: "Meeting Hub 🎤",
        description: "Time to schedule your next meeting!",
      });
    }
  };

  const handleUploadAudio = () => {
    if (onTabChange) {
      onTabChange("meetings");
      toast({
        title: "Audio Upload 🎵",
        description: "Let's process your meeting audio!",
      });
    }
  };

  const handleShareReport = () => {
    // Generate a simple report and show toast
    const reportData = {
      totalMeetings: meetings.length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.completed).length,
      productivityScore: Math.round((tasks.filter(t => t.completed).length / Math.max(tasks.length, 1)) * 100)
    };
    
    toast({
      title: "Report Generated! 📊",
      description: `Your productivity report: ${reportData.totalMeetings} meetings, ${reportData.totalTasks} tasks, ${reportData.completedTasks} completed (${reportData.productivityScore}% success rate)`,
    });
  };

  const handleViewMeeting = (meetingId: string) => {
    if (onTabChange) {
      onTabChange("meetings");
      toast({
        title: "Meeting Details 📋",
        description: "Viewing meeting details in the Meeting Hub!",
      });
    }
  };

  const handleRefreshData = () => {
    // This would typically trigger a refetch of data
    toast({
      title: "Refreshing Data 🔄",
      description: "Updating your dashboard with the latest info!",
    });
  };

  const handleExportData = () => {
    const data = {
      meetings: meetings,
      tasks: tasks,
      summary: {
        totalMeetings: meetings.length,
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.completed).length,
        pendingTasks: tasks.filter(t => !t.completed).length
      }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taskmind-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported! 📁",
      description: "Your TaskMind data has been downloaded successfully!",
    });
  };

  if (meetingsLoading || tasksLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">Dashboard</h1>
          <p className="text-xl text-gray-600">
            Welcome back! Here's your meeting insights overview.
          </p>
        </div>
        <StatsSkeleton />
      </div>
    );
  }

  const completedTasks = tasks.filter((task) => task.completed);
  const pendingTasks = tasks.filter((task) => !task.completed);
  const overdueTasks = pendingTasks.filter(task => 
    task.due_date && isBefore(new Date(task.due_date), startOfDay(new Date()))
  );
  const recentMeetings = meetings.slice(0, 5);
  const totalParticipants = meetings.reduce(
    (acc, meeting) => acc + (meeting.participants?.length || 0),
    0
  );

  // Calculate average duration
  const meetingsWithDuration = meetings.filter(m => m.duration);
  const avgDuration = meetingsWithDuration.length > 0 ? "45m" : "0m";

  // Calculate completion rate
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  // Get priority distribution
  const highPriorityTasks = pendingTasks.filter(t => t.priority === "High").length;
  const mediumPriorityTasks = pendingTasks.filter(t => t.priority === "Medium").length;
  const lowPriorityTasks = pendingTasks.filter(t => t.priority === "Low").length;

  // Calculate upcoming deadlines (next 7 days)
  const upcomingDeadlines = pendingTasks.filter(task => {
    if (!task.due_date) return false;
    const dueDate = new Date(task.due_date);
    const today = new Date();
    const nextWeek = addDays(today, 7);
    return dueDate >= today && dueDate <= nextWeek;
  }).sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

  // Calculate productivity score
  const productivityScore = Math.min(100, Math.max(0, 
    (completionRate * 0.4) + 
    ((100 - (overdueTasks.length * 10)) * 0.3) + 
    ((meetings.length > 0 ? 100 : 0) * 0.3)
  ));

  // Get most active meeting participants
  const participantCounts: Record<string, number> = {};
  meetings.forEach(meeting => {
    meeting.participants?.forEach(participant => {
      participantCounts[participant] = (participantCounts[participant] || 0) + 1;
    });
  });
  const topParticipants = Object.entries(participantCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 5);

  // Calculate weekly trends
  const thisWeekMeetings = meetings.filter(m => {
    const meetingDate = new Date(m.date);
    const weekAgo = addDays(new Date(), -7);
    return meetingDate >= weekAgo;
  });
  const lastWeekMeetings = meetings.filter(m => {
    const meetingDate = new Date(m.date);
    const twoWeeksAgo = addDays(new Date(), -14);
    const weekAgo = addDays(new Date(), -7);
    return meetingDate >= twoWeeksAgo && meetingDate < weekAgo;
  });

  const meetingTrend = thisWeekMeetings.length > lastWeekMeetings.length ? 'up' : 
                      thisWeekMeetings.length < lastWeekMeetings.length ? 'down' : 'stable';

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'High': return <AlertCircle className="h-3 w-3" />;
      case 'Medium': return <Clock className="h-3 w-3" />;
      case 'Low': return <Circle className="h-3 w-3" />;
      default: return <Circle className="h-3 w-3" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProductivityLevel = (score) => {
    if (score >= 80) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 60) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (score >= 40) return { level: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { level: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const productivityLevel = getProductivityLevel(productivityScore);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-black leading-tight">
            Your AI Chief of Staff
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Welcome back, productivity champion! 🚀 Let's see what your AI assistant has been up to.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Button 
              variant="outline" 
              onClick={handleRefreshData}
              className="bg-white border-gray-200 hover:bg-gray-50 rounded-xl"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Button 
              variant="outline" 
              onClick={handleExportData}
              className="bg-white border-gray-200 hover:bg-gray-50 rounded-xl"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Download Data
            </Button>
          </div>
        </div>

        {/* Productivity Score */}
        <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-black">
              Your Productivity Power Level
            </CardTitle>
            <CardDescription className="text-gray-600">
              The AI has calculated your superhero score for this week
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-black mb-2">{Math.round(productivityScore)}</div>
                <div className={`text-lg font-semibold ${productivityLevel.color}`}>
                  {productivityLevel.level}
                </div>
                <Progress value={productivityScore} className="mt-4 h-2" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Tasks Crushed</span>
                  <span className="font-semibold text-black">{completionRate}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Oops, Overdue</span>
                  <span className="font-semibold text-black">{overdueTasks.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Meetings This Week</span>
                  <span className="font-semibold text-black">{thisWeekMeetings.length}</span>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className={`p-6 rounded-2xl ${productivityLevel.bg} hover:${productivityLevel.bg} transition-colors duration-200`}>
                  {productivityScore >= 80 ? (
                    <Award className="h-12 w-12 text-green-600" />
                  ) : productivityScore >= 60 ? (
                    <Star className="h-12 w-12 text-blue-600 hover:text-blue-600" />
                  ) : productivityScore >= 40 ? (
                    <TrendingUp className="h-12 w-12 text-yellow-600" />
                  ) : (
                    <TrendingDown className="h-12 w-12 text-red-600" />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { 
              icon: <Plus className="h-6 w-6" />, 
              label: "Add New Task", 
              color: "bg-blue-50 text-blue-600",
              onClick: handleAddNewTask
            },
            { 
              icon: <Calendar className="h-6 w-6" />, 
              label: "Schedule Meeting", 
              color: "bg-green-50 text-green-600",
              onClick: handleScheduleMeeting
            },
            { 
              icon: <FileText className="h-6 w-6" />, 
              label: "Upload Audio", 
              color: "bg-purple-50 text-purple-600",
              onClick: handleUploadAudio
            },
            { 
              icon: <Share2 className="h-6 w-6" />, 
              label: "Share Report", 
              color: "bg-orange-50 text-orange-600",
              onClick: handleShareReport
            }
          ].map((action, index) => (
            <Button 
              key={index} 
              variant="outline" 
              onClick={action.onClick}
              className="h-20 flex flex-col items-center gap-2 bg-white border-gray-200 hover:bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className={`p-2 rounded-xl ${action.color}`}>
                {action.icon}
              </div>
              <span className="text-sm font-medium text-black">{action.label}</span>
            </Button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              title: "Total Meetings", 
              value: meetings.length, 
              icon: <Calendar className="h-6 w-6" />, 
              color: "bg-blue-50 text-blue-600",
              trend: meetingTrend,
              subtitle: `${thisWeekMeetings.length} this week`,
              onClick: () => onTabChange && onTabChange("meetings")
            },
            { 
              title: "Active Tasks", 
              value: pendingTasks.length, 
              icon: <CheckSquare className="h-6 w-6" />, 
              color: "bg-green-50 text-green-600",
              subtitle: `${completedTasks.length} completed`,
              onClick: () => onTabChange && onTabChange("tasks")
            },
            { 
              title: "Team Members", 
              value: totalParticipants, 
              icon: <Users className="h-6 w-6" />, 
              color: "bg-purple-50 text-purple-600",
              subtitle: "Across all meetings",
              onClick: () => onTabChange && onTabChange("meetings")
            },
            { 
              title: "Avg Duration", 
              value: avgDuration, 
              icon: <Clock className="h-6 w-6" />, 
              color: "bg-orange-50 text-orange-600",
              subtitle: "Per meeting",
              onClick: () => onTabChange && onTabChange("meetings")
            }
          ].map((stat, index) => (
            <Card 
              key={index} 
              className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
              onClick={stat.onClick}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-xl ${stat.color}`}>
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">{stat.value}</div>
                <div className="flex items-center text-xs text-gray-500">
                  {stat.trend && (
                    <>
                      {stat.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                      ) : stat.trend === 'down' ? (
                        <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                      ) : (
                        <Equal className="h-3 w-3 mr-1 text-gray-500" />
                      )}
                    </>
                  )}
                  {stat.subtitle}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Priority Distribution */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Task Priority Breakdown
              </CardTitle>
              <CardDescription className="text-gray-600">
                Your to-do list organized by urgency level
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { priority: 'High', count: highPriorityTasks, color: 'bg-red-50 text-red-600', icon: <AlertCircle className="h-5 w-5" />, desc: 'Drop everything and do this!' },
                { priority: 'Medium', count: mediumPriorityTasks, color: 'bg-yellow-50 text-yellow-600', icon: <Clock className="h-5 w-5" />, desc: 'Important but not urgent' },
                { priority: 'Low', count: lowPriorityTasks, color: 'bg-green-50 text-green-600', icon: <Circle className="h-5 w-5" />, desc: 'When you have time' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${item.color}`}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-medium text-black">{item.priority} Priority</div>
                      <div className="text-sm text-gray-600">{item.desc}</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-black">{item.count}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <CalendarDays className="h-5 w-5 text-blue-600" />
                Deadline Watch
              </CardTitle>
              <CardDescription className="text-gray-600">
                Tasks that need your attention soon (no pressure! 😅)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingDeadlines.length > 0 ? (
                  upcomingDeadlines.slice(0, 5).map((task) => {
                    const daysUntilDue = differenceInDays(new Date(task.due_date), new Date());
                    return (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <CheckSquare className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-black">{task.task}</p>
                            <p className="text-sm text-gray-600">
                              Due {format(new Date(task.due_date), "MMM d")}
                            </p>
                          </div>
                        </div>
                        <Badge className={getPriorityColor(task.priority)}>
                          {daysUntilDue === 0 ? 'Today!' : 
                           daysUntilDue === 1 ? 'Tomorrow' : 
                           `${daysUntilDue} days left`}
                        </Badge>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarDays className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No deadlines looming! 🎉</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team Insights */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <Users className="h-5 w-5 text-blue-600" />
                Your Meeting Squad
              </CardTitle>
              <CardDescription className="text-gray-600">
                The most active participants in your meetings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topParticipants.length > 0 ? (
                  topParticipants.map(([participant, count], index) => (
                    <div key={participant} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">
                            {(participant as string).charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-black">{participant as string}</p>
                          <p className="text-sm text-gray-600">{count} meetings attended</p>
                        </div>
                      </div>
                      {index < 3 && (
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          <Star className="h-3 w-3 mr-1" />
                          Top {index + 1}
                        </Badge>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No meeting buddies yet! 🤝</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <Lightbulb className="h-5 w-5 text-blue-600" />
                AI Wisdom Corner
              </CardTitle>
              <CardDescription className="text-gray-600">
                Your AI assistant's friendly advice and suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overdueTasks.length > 0 && (
                  <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-red-900">Uh-oh, Overdue Alert! 🚨</p>
                        <p className="text-sm text-red-700 mb-3">
                          You have {overdueTasks.length} tasks that are past their due date. Maybe it's time to reschedule or delegate?
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-red-200 text-red-700 hover:bg-red-100"
                          onClick={() => onTabChange && onTabChange("tasks")}
                        >
                          View Overdue Tasks
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                {highPriorityTasks > 3 && (
                  <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Clock className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-yellow-900">High Priority Overload! ⚡</p>
                        <p className="text-sm text-yellow-700 mb-3">
                          You have {highPriorityTasks} high-priority tasks. Consider breaking them down into smaller, more manageable pieces.
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                          onClick={() => onTabChange && onTabChange("tasks")}
                        >
                          Organize Tasks
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                {completionRate < 50 && (
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Target className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-blue-900">Let's Boost That Completion Rate! 🎯</p>
                        <p className="text-sm text-blue-700 mb-3">
                          Your completion rate is {completionRate}%. Try setting smaller, achievable goals to build momentum!
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-blue-200 text-blue-700 hover:bg-blue-100"
                          onClick={() => onTabChange && onTabChange("tasks")}
                        >
                          Set Mini Goals
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                {meetings.length === 0 && (
                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-green-900">Ready to Start Your Journey! 🌟</p>
                        <p className="text-sm text-green-700 mb-3">
                          No meetings recorded yet. Schedule your first meeting and let the AI magic begin!
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-green-200 text-green-700 hover:bg-green-100"
                          onClick={() => onTabChange && onTabChange("meetings")}
                        >
                          Schedule Meeting
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black">
              <Activity className="h-5 w-5 text-blue-600" />
              Recent Adventures
            </CardTitle>
            <CardDescription className="text-gray-600">
              Your latest meetings and task updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMeetings.length > 0 ? (
                recentMeetings.map((meeting) => (
                  <div key={meeting.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-black">{meeting.title}</p>
                        <p className="text-sm text-gray-600">
                          {meeting.date ? format(new Date(meeting.date), "MMM d, yyyy") : "No date"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300">
                        {meeting.participants?.length || 0} attendees
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleViewMeeting(meeting.id)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No meetings yet! Time to schedule some? 📅</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardTab;
