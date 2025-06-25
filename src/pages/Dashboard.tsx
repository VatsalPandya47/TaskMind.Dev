import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import DashboardTab from "@/components/DashboardTab";
import MeetingsTab from "@/components/MeetingsTab";
import TasksTab from "@/components/TasksTab";
import SettingsTab from "@/components/SettingsTab";

const Dashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Handle navigation state from Resources pages
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      // Clear the state to prevent it from persisting
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab onTabChange={handleTabChange} />;
      case "meetings":
        return <MeetingsTab />;
      case "tasks":
        return <TasksTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <DashboardTab onTabChange={handleTabChange} />;
    }
  };

  return (
    <AppLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {renderTabContent()}
    </AppLayout>
  );
};

export default Dashboard; 