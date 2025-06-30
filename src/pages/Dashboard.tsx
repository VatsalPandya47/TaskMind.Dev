import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import DashboardTab from "@/components/DashboardTab";
import MeetingsTab from "@/components/MeetingsTab";
import TasksTab from "@/components/TasksTab";
import SettingsTab from "@/components/SettingsTab";
import MemoryTab from "@/components/MemoryTab";
import SummariesTab from "@/components/SummariesTab";

const Dashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Set active tab based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === "/" || path === "/dashboard") {
      setActiveTab("dashboard");
    } else if (path === "/tasks") {
      setActiveTab("tasks");
    } else if (path === "/meetings") {
      setActiveTab("meetings");
    } else if (path === "/memory") {
      setActiveTab("memory");
    } else if (path === "/summaries") {
      setActiveTab("summaries");
    } else if (path === "/settings") {
      setActiveTab("settings");
    }
  }, [location.pathname]);

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
      case "memory":
        return <MemoryTab />;
      case "summaries":
        return <SummariesTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <DashboardTab onTabChange={handleTabChange} />;
    }
  };

  return (
    <AppLayout>
      {renderTabContent()}
    </AppLayout>
  );
};

export default Dashboard; 