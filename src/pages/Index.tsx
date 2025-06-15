
import { useState } from "react";
import Navigation from "@/components/Navigation";
import DashboardTab from "@/components/DashboardTab";
import MeetingsTab from "@/components/MeetingsTab";
import TasksTab from "@/components/TasksTab";
import SettingsTab from "@/components/SettingsTab";

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
    <div className="min-h-screen bg-gray-50 flex w-full">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 lg:pl-64">
        <main className="p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
