
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
      <div className="min-h-screen bg-background flex w-full">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        <SidebarInset>
            <header className="flex h-14 items-center gap-4 border-b bg-white px-4 lg:hidden">
                <SidebarTrigger />
            </header>
            <main className="p-6 lg:p-8">
              {renderContent()}
            </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
