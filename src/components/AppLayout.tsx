import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const AppLayout = ({ children, activeTab = "dashboard", onTabChange }: AppLayoutProps) => {
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState(activeTab);

  // Update current tab when activeTab prop changes
  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

  // Handle navigation state from Resources pages
  useEffect(() => {
    if (location.state?.activeTab) {
      setCurrentTab(location.state.activeTab);
      // Clear the state to prevent it from persisting
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation activeTab={currentTab} onTabChange={handleTabChange} />
      
      <div className="flex-1 overflow-auto lg:ml-64">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout; 