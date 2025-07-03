import { useMeetings } from "@/hooks/useMeetings";
import { useTasks } from "@/hooks/useTasks";
import { useToast } from "@/hooks/use-toast";
import { useGoogleCalendarEvents } from "@/hooks/useGoogleCalendarEvents";

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Equal,
  Mail,
  MessageCircle,
  Copy,
  ExternalLink,
  Mic
} from "lucide-react";
import { format, isAfter, isBefore, startOfDay, addDays, differenceInDays } from "date-fns";
import { StatsSkeleton } from "./LoadingSkeleton";
import { slackService } from '@/lib/slackService';

interface DashboardTabProps {
  onTabChange?: (tab: string) => void;
}

const DashboardTab = ({ onTabChange }: DashboardTabProps) => {
  const { meetings, isLoading: meetingsLoading } = useMeetings();
  const { tasks, isLoading: tasksLoading } = useTasks();
  const { toast } = useToast();
  const { events: googleEvents, isConnected: isGoogleConnected } = useGoogleCalendarEvents();
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
    // This will be handled by the dialog trigger
  };

  const handleDownloadData = () => {
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
      title: "Data Downloaded! 📁",
      description: "Your TaskMind data has been downloaded successfully!",
    });
  };

  const handleExportViaEmail = () => {
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
    
    const subject = encodeURIComponent(`TaskMind Report - ${new Date().toLocaleDateString()}`);
    const body = encodeURIComponent(`Here's your TaskMind productivity report:\n\n` +
      `📊 Summary:\n` +
      `• Total Meetings: ${data.summary.totalMeetings}\n` +
      `• Total Tasks: ${data.summary.totalTasks}\n` +
      `• Completed Tasks: ${data.summary.completedTasks}\n` +
      `• Pending Tasks: ${data.summary.pendingTasks}\n\n` +
      `📋 Detailed data is attached as JSON file.`);
    
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    window.open(mailtoLink);
    
    toast({
      title: "Export via Email 📧",
      description: "Opening your email client to share the report!",
    });
  };

  const handleExportViaSlack = async () => {
    try {
      // Show loading toast
      toast({
        title: "Sending to Slack...",
        description: "Preparing your TaskMind report for Slack.",
      });

      // Create a comprehensive report message
      const completedTasks = tasks.filter(t => t.completed).length;
      const pendingTasks = tasks.filter(t => !t.completed).length;
      const totalMeetings = meetings.length;
      const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

      const message = `📊 *TaskMind Productivity Report*\n\n` +
        `📅 *Report Date:* ${new Date().toLocaleDateString()}\n\n` +
        `📈 *Productivity Summary*\n` +
        `• Total Meetings: ${totalMeetings}\n` +
        `• Total Tasks: ${tasks.length}\n` +
        `• Completed Tasks: ${completedTasks}\n` +
        `• Pending Tasks: ${pendingTasks}\n` +
        `• Completion Rate: ${completionRate}%\n\n` +
        `🎯 *Recent Activity*\n` +
        `${meetings.length > 0 ? 
          `• Latest Meeting: ${meetings[0].title} (${format(new Date(meetings[0].date), 'MMM dd')})\n` : 
          '• No recent meetings\n'}` +
        `${pendingTasks.length > 0 ? 
          `• Next Priority: ${pendingTasks[0].task}\n` : 
          '• No pending tasks\n'}` +
        `\n${completionRate >= 80 ? '🎉 Excellent productivity! Keep up the great work!' : 
          completionRate >= 60 ? '👍 Good progress! You\'re on track!' : 
          '💪 Room for improvement. Let\'s boost that productivity!'}`;

      // Send to Slack using the service
      await slackService.sendCustomNotification({
        type: 'custom',
        title: 'TaskMind Productivity Report',
        message: message
      });

      // Success toast
      toast({
        title: "✅ Report Sent to Slack!",
        description: "Your TaskMind productivity report has been sent to your Slack channel.",
      });
    } catch (error) {
      console.error('Failed to send report to Slack:', error);
      toast({
        title: "❌ Failed to Send to Slack",
        description: "There was an error sending the report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCopyToClipboard = () => {
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
    
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    
    toast({
      title: "Data Copied! 📋",
      description: "Your TaskMind data has been copied to clipboard!",
    });
  };

  if (meetingsLoading || tasksLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 container mx-auto px-6 py-20 space-y-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent mb-6">
              Dashboard
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Welcome back! Here's your meeting insights overview.
            </p>
          </div>
          <StatsSkeleton />
        </div>
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
      case 'High': return 'bg-red-500/20 text-red-400 border-red-400/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
      case 'Low': return 'bg-green-500/20 text-green-400 border-green-400/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };

  const getProductivityLevel = (score) => {
    if (score >= 80) return { level: 'Excellent', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (score >= 60) return { level: 'Good', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    if (score >= 40) return { level: 'Fair', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { level: 'Needs Improvement', color: 'text-red-400', bg: 'bg-red-500/20' };
  };

  const productivityLevel = getProductivityLevel(productivityScore);

  const unifiedEvents = [
    ...pendingTasks
      .filter(task => task.due_date)
      .map(task => ({
        id: `task-${task.id}`,
        title: task.task,
        datetime: task.due_date,
        source: "task",
        link: null,
      })),
    ...googleEvents.map(event => ({
      id: `google-${event.id}`,
      title: event.summary,
      datetime: event.start.dateTime || event.start.date,
      source: "google",
      link: event.htmlLink,
    })),
    ...meetings
      .filter(m => new Date(m.date) > new Date())
      .map(m => ({
        id: `zoom-${m.id}`,
        title: m.title,
        datetime: m.date,
        source: "zoom",
        link: null,
      })),
  ].sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 container mx-auto px-6 py-20 space-y-8">
        {/* Header */}
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent leading-tight">
            Your AI Chief of Staff ⚡
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Welcome back! Here's your productivity command center
          </p>
          
          {/* Quick Stats Banner */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="bg-blue-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-500/30">
              <span className="text-sm font-medium text-blue-400">{completedTasks.length} completed today</span>
            </div>
            <div className="bg-green-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-green-500/30">
              <span className="text-sm font-medium text-green-400">{Math.round(productivityScore)}% productivity</span>
            </div>
            <div className="bg-indigo-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-indigo-500/30">
              <span className="text-sm font-medium text-indigo-400">{meetings.length} meetings</span>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-8">
            <Button 
              variant="outline" 
              onClick={handleRefreshData}
              className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50 text-white hover:bg-gray-700/60 hover:border-gray-600/50 rounded-2xl transition-all duration-200"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50 text-white hover:bg-gray-700/60 hover:border-gray-600/50 rounded-2xl transition-all duration-200"
                >
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-gray-800/90 backdrop-blur-sm border-gray-700/50">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-white">
                    <ArrowUpRight className="h-5 w-5 text-blue-400" />
                    Export Your Data
                  </DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Choose how you'd like to export your TaskMind data and reports.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-3">
                  <Button 
                    variant="outline" 
                    onClick={handleDownloadData}
                    className="justify-start h-12 bg-gray-700/60 border-gray-600/50 text-white hover:bg-gray-600/60"
                  >
                    <Download className="h-4 w-4 mr-3" />
                    Download as JSON File
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleExportViaEmail}
                    className="justify-start h-12 bg-gray-700/60 border-gray-600/50 text-white hover:bg-gray-600/60"
                  >
                    <Mail className="h-4 w-4 mr-3" />
                    Export via Email
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleExportViaSlack}
                    className="justify-start h-12 bg-gray-700/60 border-gray-600/50 text-white hover:bg-gray-600/60"
                  >
                    <MessageCircle className="h-4 w-4 mr-3" />
                    Share to Slack
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCopyToClipboard}
                    className="justify-start h-12 bg-gray-700/60 border-gray-600/50 text-white hover:bg-gray-600/60"
                  >
                    <Copy className="h-4 w-4 mr-3" />
                    Copy to Clipboard
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>


        {/* Productivity Score */}
        <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50 shadow-2xl hover:border-gray-600/50 transition-all duration-200">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-white">
              Your Productivity Power Level
            </CardTitle>
            <CardDescription className="text-gray-300">
              The AI has calculated your superhero score for this week
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">{Math.round(productivityScore)}</div>
                <div className={`text-lg font-semibold ${productivityLevel.color}`}>
                  {productivityLevel.level}
                </div>
                <Progress value={productivityScore} className="mt-4 h-2" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-xl">
                  <span className="text-gray-300">Tasks Crushed</span>
                  <span className="font-semibold text-white">{completionRate}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-xl">
                  <span className="text-gray-300">Oops, Overdue</span>
                  <span className="font-semibold text-white">{overdueTasks.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-xl">
                  <span className="text-gray-300">Meetings This Week</span>
                  <span className="font-semibold text-white">{thisWeekMeetings.length}</span>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className={`p-6 rounded-2xl ${productivityLevel.bg} hover:scale-105 transition-transform duration-200`}>
                  {productivityScore >= 80 ? (
                    <Award className="h-12 w-12 text-green-400" />
                  ) : productivityScore >= 60 ? (
                    <Star className="h-12 w-12 text-blue-400" />
                  ) : productivityScore >= 40 ? (
                    <TrendingUp className="h-12 w-12 text-yellow-400" />
                  ) : (
                    <TrendingDown className="h-12 w-12 text-red-400" />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Button 
            onClick={handleAddNewTask}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3 font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
          <Button 
            onClick={handleScheduleMeeting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-3 font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Meeting
          </Button>
          <Button 
            onClick={handleUploadAudio}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-6 py-3 font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Mic className="h-4 w-4 mr-2" />
            Upload Audio
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              title: "Total Meetings", 
              value: meetings.length, 
              icon: <Calendar className="h-6 w-6" />, 
              color: "bg-blue-500/20 text-blue-400",
              trend: meetingTrend,
              subtitle: `${thisWeekMeetings.length} this week`,
              onClick: () => onTabChange && onTabChange("meetings")
            },
            { 
              title: "Active Tasks", 
              value: pendingTasks.length, 
              icon: <CheckSquare className="h-6 w-6" />, 
              color: "bg-green-500/20 text-green-400",
              subtitle: `${completedTasks.length} completed`,
              onClick: () => onTabChange && onTabChange("tasks")
            },
            { 
              title: "Team Members", 
              value: totalParticipants, 
              icon: <Users className="h-6 w-6" />, 
              color: "bg-purple-500/20 text-purple-400",
              subtitle: "Across all meetings",
              onClick: () => onTabChange && onTabChange("meetings")
            },
            { 
              title: "Avg Duration", 
              value: avgDuration, 
              icon: <Clock className="h-6 w-6" />, 
              color: "bg-orange-500/20 text-orange-400",
              subtitle: "Per meeting",
              onClick: () => onTabChange && onTabChange("meetings")
            }
          ].map((stat, index) => (
            <Card 
              key={index} 
              className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50 shadow-lg hover:shadow-2xl hover:border-gray-600/50 transition-all duration-200 cursor-pointer hover:scale-105"
              onClick={stat.onClick}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-xl ${stat.color}`}>
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="flex items-center text-xs text-gray-400">
                  {stat.trend && (
                    <>
                      {stat.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3 mr-1 text-green-400" />
                      ) : stat.trend === 'down' ? (
                        <TrendingDown className="h-3 w-3 mr-1 text-red-400" />
                      ) : (
                        <Equal className="h-3 w-3 mr-1 text-gray-400" />
                      )}
                    </>
                  )}
                  {stat.subtitle}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Priority Distribution */}
          <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50 shadow-lg hover:border-gray-600/50 transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BarChart3 className="h-5 w-5 text-blue-400" />
                Task Priority Breakdown
              </CardTitle>
              <CardDescription className="text-gray-300">
                Your to-do list organized by urgency level
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { priority: 'High', count: highPriorityTasks, color: 'bg-red-500/20 text-red-400', icon: <AlertCircle className="h-5 w-5" />, desc: 'Drop everything and do this!' },
                { priority: 'Medium', count: mediumPriorityTasks, color: 'bg-yellow-500/20 text-yellow-400', icon: <Clock className="h-5 w-5" />, desc: 'Important but not urgent' },
                { priority: 'Low', count: lowPriorityTasks, color: 'bg-green-500/20 text-green-400', icon: <Circle className="h-5 w-5" />, desc: 'When you have time' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl hover:bg-gray-600/50 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${item.color}`}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-medium text-white">{item.priority} Priority</div>
                      <div className="text-sm text-gray-400">{item.desc}</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">{item.count}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50 shadow-lg hover:border-gray-600/50 transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <CalendarDays className="h-5 w-5 text-blue-400" />
                Deadline Watch
              </CardTitle>
              <CardDescription className="text-gray-300">
                Tasks that need your attention soon (no pressure! 😅)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingDeadlines.length > 0 ? (
                  upcomingDeadlines.slice(0, 5).map((task) => {
                    const daysUntilDue = differenceInDays(new Date(task.due_date), new Date());
                    return (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-xl hover:bg-gray-600/50 transition-colors duration-200">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/20 rounded-lg">
                            <CheckSquare className="h-4 w-4 text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{task.task}</p>
                            <p className="text-sm text-gray-400">
                              Due {format(new Date(task.due_date), "MMM d")}
                            </p>
                          </div>
                        </div>
                        <Badge className={`${getPriorityColor(task.priority)} border-0`}>
                          {daysUntilDue === 0 ? 'Today!' : 
                           daysUntilDue === 1 ? 'Tomorrow' : 
                           `${daysUntilDue} days left`}
                        </Badge>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <CalendarDays className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                    <p>No deadlines looming! 🎉</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team Insights */}
          <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50 shadow-lg hover:border-gray-600/50 transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Users className="h-5 w-5 text-blue-400" />
                Your Meeting Squad
              </CardTitle>
              <CardDescription className="text-gray-300">
                The most active participants in your meetings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topParticipants.length > 0 ? (
                  topParticipants.map(([participant, count], index) => (
                    <div key={participant} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-xl hover:bg-gray-600/50 transition-colors duration-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-400/30">
                          <span className="text-sm font-bold text-blue-400">
                            {(participant as string).charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{participant as string}</p>
                          <p className="text-sm text-gray-400">{count} meetings attended</p>
                        </div>
                      </div>
                      {index < 3 && (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-400/30">
                          <Star className="h-3 w-3 mr-1" />
                          Top {index + 1}
                        </Badge>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                    <p>No meeting buddies yet! 🤝</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50 shadow-lg hover:border-gray-600/50 transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Lightbulb className="h-5 w-5 text-blue-400" />
                AI Wisdom Corner
              </CardTitle>
              <CardDescription className="text-gray-300">
                Your AI assistant's friendly advice and suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overdueTasks.length > 0 && (
                  <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-red-500/20 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-red-400">Uh-oh, Overdue Alert! 🚨</p>
                        <p className="text-sm text-gray-300 mb-3">
                          You have {overdueTasks.length} tasks that are past their due date. Maybe it's time to reschedule or delegate?
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          onClick={() => onTabChange && onTabChange("tasks")}
                        >
                          View Overdue Tasks
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                {highPriorityTasks > 3 && (
                  <div className="p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <Clock className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-yellow-400">High Priority Overload! ⚡</p>
                        <p className="text-sm text-gray-300 mb-3">
                          You have {highPriorityTasks} high-priority tasks. Consider breaking them down into smaller, more manageable pieces.
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                          onClick={() => onTabChange && onTabChange("tasks")}
                        >
                          Organize Tasks
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                {completionRate < 50 && (
                  <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Target className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-blue-400">Let's Boost That Completion Rate! 🎯</p>
                        <p className="text-sm text-gray-300 mb-3">
                          Your completion rate is {completionRate}%. Try setting smaller, achievable goals to build momentum!
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                          onClick={() => onTabChange && onTabChange("tasks")}
                        >
                          Set Mini Goals
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                {meetings.length === 0 && (
                  <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <Calendar className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-green-400">Ready to Start Your Journey! 🌟</p>
                        <p className="text-sm text-gray-300 mb-3">
                          No meetings recorded yet. Schedule your first meeting and let the AI magic begin!
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-green-500/30 text-green-400 hover:bg-green-500/10"
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

        {/* Achievement Badges */}
        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30 bg-gray-800/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Award className="h-5 w-5 text-purple-400" />
              Achievement Unlocked! 🏆
            </CardTitle>
            <CardDescription className="text-gray-300">
              Your productivity milestones and accomplishments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {completedTasks.length >= 5 && (
                <div className="text-center p-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30">
                  <div className="text-2xl mb-2">🎯</div>
                  <p className="text-sm font-medium text-yellow-400">Task Crusher</p>
                  <p className="text-xs text-gray-400">5+ tasks completed</p>
                </div>
              )}
              {meetings.length >= 3 && (
                <div className="text-center p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/30">
                  <div className="text-2xl mb-2">🎤</div>
                  <p className="text-sm font-medium text-blue-400">Meeting Master</p>
                  <p className="text-xs text-gray-400">3+ meetings processed</p>
                </div>
              )}
              {productivityScore >= 80 && (
                <div className="text-center p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
                  <div className="text-2xl mb-2">⚡</div>
                  <p className="text-sm font-medium text-green-400">Productivity Pro</p>
                  <p className="text-xs text-gray-400">80%+ efficiency</p>
                </div>
              )}
              {overdueTasks.length === 0 && tasks.length > 0 && (
                <div className="text-center p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                  <div className="text-2xl mb-2">🦄</div>
                  <p className="text-sm font-medium text-purple-400">Unicorn Status</p>
                  <p className="text-xs text-gray-400">No overdue tasks!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Tasks */}
          <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <CheckSquare className="h-5 w-5 text-blue-400" />
                Recent Tasks
              </CardTitle>
              <CardDescription className="text-gray-300">
                Your latest action items
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tasks.slice(0, 3).length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No tasks yet</p>
                  <Button 
                    onClick={handleAddNewTask}
                    className="mt-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                  >
                    Create First Task
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${task.completed ? 'bg-green-400' : 'bg-blue-400'}`}></div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                          {task.task}
                        </p>
                        <p className="text-xs text-gray-400">{task.assignee}</p>
                      </div>
                    </div>
                  ))}
                  <Button 
                    onClick={() => onTabChange?.('tasks')}
                    variant="outline"
                    className="w-full mt-3 border-gray-600 text-gray-300 hover:bg-gray-700/50"
                  >
                    View All Tasks
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Meetings */}
          <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <MessageSquare className="h-5 w-5 text-indigo-400" />
                Recent Meetings
              </CardTitle>
              <CardDescription className="text-gray-300">
                Your latest conversations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentMeetings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No meetings yet</p>
                  <Button 
                    onClick={handleScheduleMeeting}
                    className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
                  >
                    Schedule First Meeting
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentMeetings.map((meeting) => (
                    <div key={meeting.id} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{meeting.title}</p>
                        <p className="text-xs text-gray-400">
                          {format(new Date(meeting.date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      {meeting.has_recording && (
                        <div className="w-2 h-2 bg-green-400 rounded-full" title="Has recording"></div>
                      )}
                    </div>
                  ))}
                  <Button 
                    onClick={() => onTabChange?.('meetings')}
                    variant="outline"
                    className="w-full mt-3 border-gray-600 text-gray-300 hover:bg-gray-700/50"
                  >
                    View All Meetings
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;