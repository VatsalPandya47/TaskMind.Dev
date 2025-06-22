import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Calendar, 
  CheckSquare, 
  Settings, 
  BarChart3, 
  LogOut, 
  Menu, 
  X, 
  CalendarDays, 
  History,
  Home,
  FileText,
  HelpCircle,
  Briefcase,
  BookOpen,
  Shield,
  FileCheck,
  ChevronUp,
  ChevronDown,
  User
} from "lucide-react";
import { Link } from "react-router-dom";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const { signOut, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDetailsExpanded, setIsUserDetailsExpanded] = useState(true);

  const mainNavItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, description: "Your productivity overview" },
    { id: "meetings", label: "Meeting Hub", icon: Calendar, description: "Manage your meetings" },
    { id: "tasks", label: "Task Master", icon: CheckSquare, description: "Action items & follow-ups" },
    { id: "settings", label: "Command Center", icon: Settings, description: "Account & preferences" },
  ];

  // New pages (section navigation)
  const sectionNavItems = [
    { id: "my-meetings", label: "My Meetings", to: "/my-meetings", icon: CalendarDays },
    { id: "summary-history", label: "AI Summaries", to: "/summary-history", icon: History },
    { id: "how-it-works", label: "How it works", to: "/how-it-works", icon: HelpCircle },
    { id: "use-cases", label: "Use Cases", to: "/use-cases", icon: FileText },
    { id: "help", label: "Help", to: "/help", icon: HelpCircle },
    { id: "careers", label: "Careers", to: "/careers", icon: Briefcase },
    { id: "manifesto", label: "Manifesto", to: "/manifesto", icon: BookOpen },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-sm">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">TaskMind</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="hover:bg-gray-100"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-white/95 backdrop-blur-sm border-r border-gray-200 shadow-xl transform transition-transform duration-200 ease-in-out z-50 ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto p-6 pb-0">
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-sm">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">TaskMind</span>
                <p className="text-xs text-gray-500">AI-powered productivity</p>
              </div>
            </div>

            {/* Main Navigation */}
            <nav className="space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
                Main
              </p>
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                    }`}
                  >
                    <Icon 
                      className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}
                    />
                    <div className="flex-1">
                      <span className={`font-medium ${isActive ? 'text-blue-700' : ''}`}>
                        {item.label}
                      </span>
                      <p className={`text-xs mt-0.5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}

              {/* Section navigation */}
              <div className="pt-6 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
                  Resources
                </p>
                <div className="space-y-1">
                  {sectionNavItems.map((item) => (
                    <Link
                      key={item.id}
                      to={item.to}
                      className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.icon && <item.icon className="h-4 w-4 text-gray-500" />}
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
          </div>

          {/* Bottom section - collapsible */}
          <div className="border-t border-gray-200 bg-gray-50/80 backdrop-blur-sm">
            {/* Toggle button */}
            <button
              onClick={() => setIsUserDetailsExpanded(!isUserDetailsExpanded)}
              className="w-full p-3 flex items-center justify-between text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">User Details</span>
              </div>
              {isUserDetailsExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </button>
            
            {/* Collapsible content */}
            {isUserDetailsExpanded && (
              <div className="p-6 pt-0">
                {/* User info */}
                <div className="mb-4 p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">Signed in as</p>
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                </div>
                
                {/* Quick links */}
                <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
                  <button 
                    onClick={() => {
                      onTabChange("dashboard");
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-1 text-gray-600 hover:text-gray-900 hover:underline p-2 rounded-lg hover:bg-white transition-colors" 
                  >
                    <Home className="h-3 w-3" />
                    Dashboard
                  </button>
                  <Link 
                    to="/support" 
                    className="flex items-center gap-1 text-gray-600 hover:text-gray-900 hover:underline p-2 rounded-lg hover:bg-white transition-colors" 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <HelpCircle className="h-3 w-3" />
                    Support
                  </Link>
                  <Link 
                    to="/documentation" 
                    className="flex items-center gap-1 text-gray-600 hover:text-gray-900 hover:underline p-2 rounded-lg hover:bg-white transition-colors" 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FileCheck className="h-3 w-3" />
                    Docs
                  </Link>
                  <Link 
                    to="/privacy-policy" 
                    className="flex items-center gap-1 text-gray-600 hover:text-gray-900 hover:underline p-2 rounded-lg hover:bg-white transition-colors" 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Shield className="h-3 w-3" />
                    Privacy
                  </Link>
                  <Link 
                    to="/terms-of-use" 
                    className="flex items-center gap-1 text-gray-600 hover:text-gray-900 hover:underline p-2 rounded-lg hover:bg-white transition-colors" 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FileText className="h-3 w-3" />
                    Terms
                  </Link>
                </div>
                
                {/* Sign out */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="w-full text-gray-600 hover:text-gray-900 border-gray-300 hover:border-gray-400"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;