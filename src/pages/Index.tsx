
import { useState } from "react";
import Navigation from "@/components/Navigation";
import DashboardTab from "@/components/DashboardTab";
import MeetingsTab from "@/components/MeetingsTab";
import TasksTab from "@/components/TasksTab";
import SettingsTab from "@/components/SettingsTab";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab />;
      case "meetings":
        return <MeetingsTab />;
      case "tasks":
        return <TasksTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-slate-50 flex w-full">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        <SidebarInset className="flex-1">
          <header className="flex h-16 items-center gap-4 border-b bg-white/80 backdrop-blur-sm px-6 lg:hidden sticky top-0 z-10">
            <SidebarTrigger className="text-purple-600" />
            <div className="flex-1" />
          </header>
          <main className="flex-1 p-6 lg:p-8 space-y-6">
            <div className="bg-white rounded-xl card-shadow-lg p-6 border border-slate-200/60">
              {renderContent()}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
