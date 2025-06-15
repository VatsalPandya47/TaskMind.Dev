
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Brain, Calendar, CheckSquare, Settings, BarChart3, LogOut, User } from "lucide-react";
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
    <Sidebar className="border-r border-purple-200/50 bg-white/95 backdrop-blur-sm">
      <SidebarHeader className="p-6 border-b border-purple-100">
        <div className="flex items-center space-x-3">
          <div className="p-2 gradient-bg rounded-xl">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-slate-900">TaskMind</span>
            <span className="text-xl font-light text-purple-600">.ai</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        <SidebarMenu className="space-y-2">
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
                  className={`w-full h-12 px-4 rounded-xl transition-all duration-200 ${
                    activeTab === item.id
                      ? 'gradient-bg text-white shadow-lg shadow-purple-500/25'
                      : 'text-slate-600 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-purple-100">
        <div className="mb-4 p-3 bg-slate-50 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <User className="h-4 w-4 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900">Signed in as</p>
              <p className="text-xs text-slate-600 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-4 text-xs space-y-2">
          <Link to="/support" className="block text-slate-500 hover:text-purple-600 hover:underline transition-colors" onClick={handleLinkClick}>Support</Link>
          <Link to="/documentation" className="block text-slate-500 hover:text-purple-600 hover:underline transition-colors" onClick={handleLinkClick}>Documentation</Link>
          <Link to="/privacy-policy" className="block text-slate-500 hover:text-purple-600 hover:underline transition-colors" onClick={handleLinkClick}>Privacy Policy</Link>
          <Link to="/terms-of-use" className="block text-slate-500 hover:text-purple-600 hover:underline transition-colors" onClick={handleLinkClick}>Terms of Use</Link>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="w-full h-10 border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default Navigation;
