import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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

const MemoryTab = () => {
  const { getMemoryStats } = useMemory();
  const [activeTab, setActiveTab] = useState("search");

  const stats = getMemoryStats.data;

  const getContentTypeStats = () => {
    // This would be enhanced with actual data from the database
    return [
      { type: 'meeting', count: 12, icon: MessageSquare, color: 'text-blue-600', bgColor: 'bg-blue-50', trend: '+15%' },
      { type: 'summary', count: 8, icon: FileText, color: 'text-green-600', bgColor: 'bg-green-50', trend: '+8%' },
      { type: 'task', count: 25, icon: CheckSquare, color: 'text-orange-600', bgColor: 'bg-orange-50', trend: '+22%' },
      { type: 'decision', count: 5, icon: Brain, color: 'text-purple-600', bgColor: 'bg-purple-50', trend: '+5%' },
    ];
  };

  const getPerformanceMetrics = () => {
    return [
      { label: 'Avg Response Time', value: '~150ms', trend: '-12%', icon: Clock, color: 'text-green-600', bgColor: 'bg-green-50' },
      { label: 'Success Rate', value: '98.5%', trend: '+2.1%', icon: Target, color: 'text-blue-600', bgColor: 'bg-blue-50' },
      { label: 'Avg Results', value: '4.2', trend: '+0.3', icon: BarChart3, color: 'text-purple-600', bgColor: 'bg-purple-50' },
      { label: 'Active Users', value: '12', trend: '+3', icon: Users, color: 'text-orange-600', bgColor: 'bg-orange-50' },
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
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      {
        title: 'Peak Usage Times',
        data: ['Monday mornings', 'Friday afternoons'],
        icon: Activity,
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      },
      {
        title: 'Memory Growth',
        data: ['+15% more content', '+22% searches', '+8% accuracy'],
        icon: TrendingUp,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50'
      },
    ];
  };

  const getTrendIcon = (trend: string) => {
    if (trend.startsWith('+')) return <ArrowUpRight className="h-3 w-3 text-green-600" />;
    if (trend.startsWith('-')) return <ArrowDownRight className="h-3 w-3 text-red-600" />;
    return <Minus className="h-3 w-3 text-gray-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl">
            <Brain className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              TaskMind Memory
            </h1>
            <p className="text-muted-foreground">
              Your AI-powered long-term memory for meetings, tasks, and decisions
            </p>
          </div>
        </div>
        {stats && (
          <div className="hidden lg:flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="font-medium">{stats.embeddingsCount} items indexed</span>
            </div>
            <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="font-medium">{stats.searchLogsCount} searches</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger value="search" className="flex items-center gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
            <Search className="h-4 w-4" />
            Search Memory
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
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
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.label}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <metric.icon className={`h-4 w-4 ${metric.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    {getTrendIcon(metric.trend)}
                    <span>{metric.trend} from last week</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Content Distribution */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Content Types
                </CardTitle>
                <CardDescription>
                  Distribution of indexed content by type
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {getContentTypeStats().map((item, index) => (
                  <div key={item.type} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${item.bgColor}`}>
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                      </div>
                      <div>
                        <div className="font-medium capitalize">{item.type}</div>
                        <div className="text-sm text-muted-foreground">{item.count} items</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {item.trend}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest memory system activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {getRecentActivity().map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-1.5 bg-gray-100 rounded-full">
                      <activity.icon className="h-3 w-3 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{activity.action}</div>
                      <div className="text-xs text-muted-foreground">
                        {activity.query || activity.count || activity.details || activity.title}
                      </div>
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Usage Insights */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Usage Insights
              </CardTitle>
              <CardDescription>
                How you're using TaskMind Memory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {getUsageInsights().map((insight, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${insight.bgColor}`}>
                        <insight.icon className={`h-4 w-4 ${insight.color}`} />
                      </div>
                      <h4 className="font-medium">{insight.title}</h4>
                    </div>
                    <div className="space-y-2">
                      {insight.data.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
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
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-green-600" />
                Memory Health
              </CardTitle>
              <CardDescription>
                System status and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Embeddings</span>
                    <Badge className="bg-green-100 text-green-800">✓ Up to date</Badge>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Index Status</span>
                    <Badge className="bg-green-100 text-green-800">✓ Optimized</Badge>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Storage</span>
                    <span className="text-sm font-medium">2.3 MB</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Search Settings */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-purple-600" />
                  Search Settings
                </CardTitle>
                <CardDescription>
                  Configure how memory search works
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default Similarity Threshold</label>
                  <p className="text-sm text-muted-foreground">
                    Minimum similarity score for search results (0.7 recommended)
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="text-sm font-medium">0.7 (70% match)</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default Result Limit</label>
                  <p className="text-sm text-muted-foreground">
                    Maximum number of results returned (10 recommended)
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm font-medium">10 results</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Auto-indexing</label>
                  <p className="text-sm text-muted-foreground">
                    Automatically create embeddings for new content
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-sm font-medium">Enabled</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Privacy & Data
                </CardTitle>
                <CardDescription>
                  Control your memory data and privacy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search Logging</label>
                  <p className="text-sm text-muted-foreground">
                    Store search queries for improving results
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-sm font-medium">Enabled</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Retention</label>
                  <p className="text-sm text-muted-foreground">
                    How long to keep search logs (90 days)
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    <span className="text-sm font-medium">90 days</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Export Data</label>
                  <p className="text-sm text-muted-foreground">
                    Download your memory data
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Export Memory Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Advanced Settings */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-600" />
                Advanced Settings
              </CardTitle>
              <CardDescription>
                Advanced configuration options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Rebuild Memory Index</h4>
                  <p className="text-sm text-muted-foreground">
                    Regenerate all embeddings (may take several minutes)
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Rebuild Index
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Clear Search History</h4>
                  <p className="text-sm text-muted-foreground">
                    Remove all search logs and analytics data
                  </p>
                </div>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  Clear History
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Memory Diagnostics</h4>
                  <p className="text-sm text-muted-foreground">
                    Run system diagnostics and health checks
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Run Diagnostics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MemoryTab; 