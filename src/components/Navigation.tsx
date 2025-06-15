
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Brain, Calendar, CheckSquare, Settings, BarChart3, LogOut, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const { signOut, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mainNavItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "meetings", label: "Meetings", icon: Calendar },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // New pages (section navigation)
  const sectionNavItems = [
    { id: "how-it-works", label: "How it works", to: "/how-it-works" },
    { id: "use-cases", label: "Use Cases", to: "/use-cases" },
    { id: "help", label: "Help", to: "/help" },
    { id: "careers", label: "Careers", to: "/careers" },
    { id: "manifesto", label: "Manifesto", to: "/manifesto" },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">TaskMind.ai</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-white border-r transform transition-transform duration-200 ease-in-out z-50 ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}>
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">TaskMind.ai</span>
          </div>

          <nav className="space-y-2">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}

            {/* Section navigation as buttons styled as links */}
            <div className="pt-6 border-t space-y-1">
              {sectionNavItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.to}
                  className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t">
          <div className="mb-4">
            <p className="text-sm text-gray-600">Signed in as</p>
            <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
          </div>
          <div className="mb-4 text-sm space-y-1">
            <Link to="/support" className="block text-gray-600 hover:text-gray-900 hover:underline" onClick={() => setIsMobileMenuOpen(false)}>Support</Link>
            <Link to="/documentation" className="block text-gray-600 hover:text-gray-900 hover:underline" onClick={() => setIsMobileMenuOpen(false)}>Documentation</Link>
            <Link to="/privacy-policy" className="block text-gray-600 hover:text-gray-900 hover:underline" onClick={() => setIsMobileMenuOpen(false)}>Privacy Policy</Link>
            <Link to="/terms-of-use" className="block text-gray-600 hover:text-gray-900 hover:underline" onClick={() => setIsMobileMenuOpen(false)}>Terms of Use</Link>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="w-full flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Navigation;

