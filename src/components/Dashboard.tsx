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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">TaskMind Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your meetings, tasks, and access your long-term memory
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="meetings" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Meetings
            </TabsTrigger>
            <TabsTrigger value="summaries" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Summaries
            </TabsTrigger>
            <TabsTrigger value="memory" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Memory
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
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
          className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 group"
          size="icon"
        >
          <Brain className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
        </Button>
        <div className="absolute -top-2 -right-2">
          <Badge className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">
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