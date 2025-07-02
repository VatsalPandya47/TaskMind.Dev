import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Calendar, CheckSquare, FileText, MessageSquare, Settings } from "lucide-react";
import TasksTab from "./TasksTab";
import MeetingsTab from "./MeetingsTab";
import SummariesTab from "./SummariesTab";
import SettingsTab from "./SettingsTab";
import MemoryTab from "./MemoryTab";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MemorySidebar from "./MemorySidebar";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("tasks");
  const [isMemorySidebarOpen, setIsMemorySidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-blue-400 to-gray-200 dark:from-gray-900 dark:via-blue-900 dark:to-gray-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-800/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-800/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 dark:bg-purple-800/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent">TaskMind Dashboard</h1>
          <p className="text-gray-300">
            Manage your meetings, tasks, and access your long-term memory
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800/60 backdrop-blur-sm border-gray-700/50 rounded-2xl p-1">
            <TabsTrigger value="tasks" className="flex items-center gap-2 text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-2xl transition-all duration-200">
              <CheckSquare className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="meetings" className="flex items-center gap-2 text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-2xl transition-all duration-200">
              <MessageSquare className="h-4 w-4" />
              Meetings
            </TabsTrigger>
            <TabsTrigger value="summaries" className="flex items-center gap-2 text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-2xl transition-all duration-200">
              <FileText className="h-4 w-4" />
              Summaries
            </TabsTrigger>
            <TabsTrigger value="memory" className="flex items-center gap-2 text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-2xl transition-all duration-200">
              <Brain className="h-4 w-4" />
              Memory
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-2xl transition-all duration-200">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
            <TasksTab />
          </TabsContent>

          <TabsContent value="meetings">
            <MeetingsTab />
          </TabsContent>

          <TabsContent value="summaries">
            <SummariesTab />
          </TabsContent>

          <TabsContent value="memory">
            <MemoryTab />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Memory Access Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setIsMemorySidebarOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-2xl hover:shadow-xl hover:scale-110 transition-all duration-200 group border-0"
          size="icon"
        >
          <Brain className="h-6 w-6 group-hover:scale-110 transition-transform duration-200 text-white" />
        </Button>
        <div className="absolute -top-2 -right-2">
          <Badge className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse border-0">
            AI
          </Badge>
        </div>
      </div>

      {/* Memory Sidebar */}
      <MemorySidebar 
        isOpen={isMemorySidebarOpen} 
        onClose={() => setIsMemorySidebarOpen(false)} 
      />
    </div>
  );
};

export default Dashboard; 