import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useTheme } from '../context/ThemeContext';
import { 
  Brain, 
  Search, 
  BarChart3, 
  Settings, 
  Sparkles,
  TrendingUp,
  Clock,
  FileText,
  CheckSquare,
  MessageSquare,
  Zap,
  Activity,
  Target,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react";
import MemorySearch from "./MemorySearch";
import { useMemory } from "@/hooks/useMemory";
import ThemeGradientWrapper from "./ThemeGradientWrapper";

const MemoryTab = () => {
  const { getMemoryStats } = useMemory();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("search");

  const stats = getMemoryStats.data;

  const getContentTypeStats = () => {
    // This would be enhanced with actual data from the database
    return [
      { type: 'meeting', count: 12, icon: MessageSquare, color: 'text-blue-400', bgColor: 'bg-blue-500/20', trend: '+15%' },
      { type: 'summary', count: 8, icon: FileText, color: 'text-green-400', bgColor: 'bg-green-500/20', trend: '+8%' },
      { type: 'task', count: 25, icon: CheckSquare, color: 'text-orange-400', bgColor: 'bg-orange-500/20', trend: '+22%' },
      { type: 'decision', count: 5, icon: Brain, color: 'text-purple-400', bgColor: 'bg-purple-500/20', trend: '+5%' },
    ];
  };

  const getPerformanceMetrics = () => {
    return [
      { label: 'Avg Response Time', value: '~150ms', trend: '-12%', icon: Clock, color: 'text-green-400', bgColor: 'bg-green-500/20' },
      { label: 'Success Rate', value: '98.5%', trend: '+2.1%', icon: Target, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
      { label: 'Avg Results', value: '4.2', trend: '+0.3', icon: BarChart3, color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
      { label: 'Active Users', value: '12', trend: '+3', icon: Users, color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
    ];
  };

  const getRecentActivity = () => {
    return [
      { action: 'Search performed', query: 'design meeting', time: '2 minutes ago', icon: Search },
      { action: 'Items indexed', count: 3, time: '1 hour ago', icon: Zap },
      { action: 'Memory updated', details: 'Embeddings refreshed', time: '3 hours ago', icon: Brain },
      { action: 'New meeting added', title: 'Sprint Planning', time: '1 day ago', icon: MessageSquare },
    ];
  };

  const getUsageInsights = () => {
    return [
      {
        title: 'Most Common Searches',
        data: ['"design meeting"', '"project updates"', '"action items"'],
        icon: Search,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/20'
      },
      {
        title: 'Peak Usage Times',
        data: ['Monday mornings', 'Friday afternoons'],
        icon: Activity,
        color: 'text-green-400',
        bgColor: 'bg-green-500/20'
      },
      {
        title: 'Memory Growth',
        data: ['+15% more content', '+22% searches', '+8% accuracy'],
        icon: TrendingUp,
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/20'
      },
    ];
  };

  const getTrendIcon = (trend: string) => {
    if (trend.startsWith('+')) return <ArrowUpRight className="h-3 w-3 text-green-400" />;
    if (trend.startsWith('-')) return <ArrowDownRight className="h-3 w-3 text-red-400" />;
    return <Minus className="h-3 w-3 text-gray-400" />;
  };

  return (
    <ThemeGradientWrapper>      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl backdrop-blur-sm">
            <Brain className="h-8 w-8 text-blue-800 dark:text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground via-primary to-primary bg-clip-text text-transparent">
              Memory
            </h1>
            <p className="text-default">
              Search across all your meetings, tasks, and decisions
            </p>
          </div>
        </div>
        {stats && (
          <div className="hidden lg:flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 bg-purple-800/50 px-3 py-2 rounded-lg border border-purple-500/30">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="font-medium text-white">{stats.embeddingsCount} items indexed</span>
            </div>
            <div className="flex items-center gap-2 bg-green-800/50 px-3 py-2 rounded-lg border border-green-500/30">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="font-medium text-white">{stats.searchLogsCount} searches</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-12 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
          <TabsTrigger value="search" className="flex items-center gap-2 data-[state=active]:bg-purple-500/40 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200">
            <Search className="h-4 w-4" />
            Search Memory
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-purple-500/40 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-purple-500/40 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Search Tab */}
        <TabsContent value="search" className="space-y-6">
          <MemorySearch />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Overview Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {getPerformanceMetrics().map((metric, index) => (
              <Card key={index} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    {metric.label}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${metric.bgColor} border border-gray-600/30`}>
                    <metric.icon className={`h-4 w-4 ${metric.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{metric.value}</div>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                    {getTrendIcon(metric.trend)}
                    <span>{metric.trend} from last week</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Content Distribution */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <FileText className="h-5 w-5 text-purple-400" />
                  Content Types
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Distribution of indexed content by type
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {getContentTypeStats().map((item, index) => (
                  <div key={item.type} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${item.bgColor} border border-gray-600/30`}>
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                      </div>
                      <div>
                        <div className="font-medium capitalize text-white">{item.type}</div>
                        <div className="text-sm text-gray-300">{item.count} items</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                        {item.trend}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Activity className="h-5 w-5 text-green-400" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Latest memory system activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {getRecentActivity().map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-1.5 bg-gray-700/50 rounded-full border border-gray-600/30">
                      <activity.icon className="h-3 w-3 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white">{activity.action}</div>
                      <div className="text-xs text-gray-300">
                        {activity.query || activity.count || activity.details || activity.title}
                      </div>
                      <div className="text-xs text-gray-400">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Usage Insights */}
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="h-5 w-5 text-purple-400" />
                Usage Insights
              </CardTitle>
              <CardDescription className="text-gray-300">
                How you're using TaskMind Memory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {getUsageInsights().map((insight, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${insight.bgColor} border border-gray-600/30`}>
                        <insight.icon className={`h-4 w-4 ${insight.color}`} />
                      </div>
                      <h4 className="font-medium text-white">{insight.title}</h4>
                    </div>
                    <div className="space-y-2">
                      {insight.data.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center gap-2 text-sm text-gray-300">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Memory Health */}
          <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/30 bg-gray-800/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Brain className="h-5 w-5 text-green-400" />
                Memory Health
              </CardTitle>
              <CardDescription className="text-gray-300">
                System status and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-200">Embeddings</span>
                    <Badge className="bg-green-500/20 text-green-400 border border-green-400/30">✓ Up to date</Badge>
                  </div>
                  <Progress value={95} className="h-2 bg-gray-200" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-200">Index Status</span>
                    <Badge className="bg-green-500/20 text-green-400 border border-green-400/30">✓ Optimized</Badge>
                  </div>
                  <Progress value={88} className="h-2 bg-gray-200" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-200">Storage</span>
                    <span className="text-sm font-medium text-white">2.3 MB</span>
                  </div>
                  <Progress value={67} className="h-2 bg-gray-200" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Search Settings */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Search className="h-5 w-5 text-purple-400" />
                  Search Settings
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Configure how memory search works
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">Default Similarity Threshold</label>
                  <p className="text-sm text-gray-300">
                    Minimum similarity score for search results (0.7 recommended)
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-sm font-medium text-white">0.7 (70% match)</span>
                  </div>
                </div>
                
                <Separator className="bg-gray-600" />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">Default Result Limit</label>
                  <p className="text-sm text-gray-300">
                    Maximum number of results returned (10 recommended)
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm font-medium text-white">10 results</span>
                  </div>
                </div>
                
                <Separator className="bg-gray-600" />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">Auto-indexing</label>
                  <p className="text-sm text-gray-300">
                    Automatically create embeddings for new content
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm font-medium text-white">Enabled</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Users className="h-5 w-5 text-blue-400" />
                  Privacy & Data
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Control your memory data and privacy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">Search Logging</label>
                  <p className="text-sm text-gray-300">
                    Store search queries for improving results
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm font-medium text-white">Enabled</span>
                  </div>
                </div>
                
                <Separator className="bg-gray-600" />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">Data Retention</label>
                  <p className="text-sm text-gray-300">
                    How long to keep search logs (90 days)
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span className="text-sm font-medium text-white">90 days</span>
                  </div>
                </div>
                
                <Separator className="bg-gray-600" />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">Export Data</label>
                  <p className="text-sm text-gray-300">
                    Download your memory data
                  </p>
                  <Button variant="outline" size="sm" className="mt-2 button-solid-primary">
                    Export Memory Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Advanced Settings */}
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Settings className="h-5 w-5 text-gray-400" />
                Advanced Settings
              </CardTitle>
              <CardDescription className="text-gray-300">
                Advanced configuration options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                <div>
                  <h4 className="font-medium text-white">Rebuild Memory Index</h4>
                  <p className="text-sm text-gray-300">
                    Regenerate all embeddings (may take several minutes)
                  </p>
                </div>
                <Button variant="outline" size="sm" className="button-solid-primary">
                  Rebuild Index
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                <div>
                  <h4 className="font-medium text-white">Clear Search History</h4>
                  <p className="text-sm text-gray-300">
                    Remove all search logs and analytics data
                  </p>
                </div>
                <Button variant="outline" size="sm" className="button-danger">
                  Clear History
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                <div>
                  <h4 className="font-medium text-white">Memory Diagnostics</h4>
                  <p className="text-sm text-gray-300">
                    Run system diagnostics and health checks
                  </p>
                </div>
                <Button variant="outline" size="sm" className="button-solid-primary">
                  Run Diagnostics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ThemeGradientWrapper>
  );
};

export default MemoryTab; 