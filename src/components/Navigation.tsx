import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Brain, Calendar, CheckSquare, Settings, BarChart3, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "./ui/sidebar";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const { signOut, user } = useAuth();
  const { isMobile, setOpenMobile } = useSidebar();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "meetings", label: "Meetings", icon: Calendar },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-2 p-2">
          <Brain className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">TaskMind.ai</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  onClick={() => {
                    onTabChange(item.id);
                    handleLinkClick();
                  }}
                  isActive={activeTab === item.id}
                >
                  <Icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <div className="mb-4">
          <p className="text-sm text-gray-600">Signed in as</p>
          <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
        </div>
        <div className="mb-4 text-sm space-y-1">
          <Link to="/support" className="block text-gray-600 hover:text-gray-900 hover:underline" onClick={handleLinkClick}>Support</Link>
          <Link to="/documentation" className="block text-gray-600 hover:text-gray-900 hover:underline" onClick={handleLinkClick}>Documentation</Link>
          <Link to="/privacy-policy" className="block text-gray-600 hover:text-gray-900 hover:underline" onClick={handleLinkClick}>Privacy Policy</Link>
          <Link to="/terms-of-use" className="block text-gray-600 hover:text-gray-900 hover:underline" onClick={handleLinkClick}>Terms of Use</Link>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="w-full"
        >
          <LogOut />
          <span>Sign Out</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default Navigation;
