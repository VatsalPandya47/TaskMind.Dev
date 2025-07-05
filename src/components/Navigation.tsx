import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { 
  Menu, 
  X, 
  Home, 
  CheckSquare, 
  MessageSquare, 
  Brain, 
  Settings, 
  LogOut, 
  User, 
  Bell,
  Zap,
  TrendingUp,
  FileText,
  Users,
  HelpCircle,
  ExternalLink,
  CalendarDays,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Directly show dashboard on small screens
  useEffect(() => {
    if (window.innerWidth < 1024 && location.pathname === '/dashboard') {
      navigate('/dashboard');
    }
  }, [navigate, location.pathname]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      description: "Overview and insights"
    },
    {
      name: "Calendar",
      href: "/calendar",
      icon: CalendarDays,
      description: "View synchronized meetings"
    },
    {
      name: "Tasks",
      href: "/tasks",
      icon: CheckSquare,
      description: "Action items and to-dos"
    },
    {
      name: "Meetings",
      href: "/meetings",
      icon: MessageSquare,
      description: "Calendar and recordings"
    },
    {
      name: "Memory",
      href: "/memory",
      icon: Brain,
      description: "Search and recall"
    },
    {
      name: "Summaries",
      href: "/summaries",
      icon: FileText,
      description: "AI-generated insights"
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      description: "Preferences and account"
    }
  ];

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + "/");
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <>
      {/* Mobile Header */}
      {/* <div className="lg:hidden flex items-center justify-between p-4 bg-gradient-to-r from-card/90 to-muted/90 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">TaskMind</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            {theme === 'dark' ? <Zap className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-purple-400 border border-purple-500/30">
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-white">{user?.email}</p>
                  <p className="text-xs leading-none text-gray-400">Signed in</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-400 hover:text-red-300 hover:bg-red-500/20">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div> */}

      {/* Toggle button for small screens */}
      {!isSidebarVisible && (
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 no-overlap border-2 border-primary rounded-full"
            style={{ zIndex: 100 }}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 contain-content min-w-[200px] bg-card/95 backdrop-blur-sm border-r border-border`}>
        <div className={`flex flex-col h-full overflow-y-auto scrollbar-hide`}>
          {/* Logo */}
          <div className={`flex items-center gap-3 p-6 border-b border-border ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl backdrop-blur-sm hover:scale-110 transition-transform duration-200">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            {!isCollapsed && (
              <>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">TaskMind</span>
                <div className="ml-auto">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </>
            )}
            {/* Desktop Collapse Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`hidden lg:flex p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 ${isCollapsed ? 'ml-0' : 'ml-auto'}`}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <TooltipProvider>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                const linkContent = (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center ${isCollapsed ? 'justify-center px-3 py-3' : 'gap-3 px-3 py-2'} rounded-xl text-sm font-medium transition-all duration-200 ${
                      active 
                        ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400 border border-purple-500/30 shadow-lg' 
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white hover:shadow-sm'
                    }`}
                    onClick={() => setIsSidebarVisible(false)}
                  >
                    <Icon className={`h-4 w-4 transition-colors ${active ? 'text-purple-400' : 'text-gray-400 group-hover:text-white'}`} />
                    {!isCollapsed && (
                      <>
                        <span>{item.name}</span>
                        {active && (
                          <Badge variant="outline" className="ml-auto text-xs border-purple-500/30 text-purple-400">
                            Active
                          </Badge>
                        )}
                      </>
                    )}
                  </Link>
                );

                if (isCollapsed) {
                  return (
                    <Tooltip key={item.name} delayDuration={0}>
                      <TooltipTrigger asChild>
                        {linkContent}
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-gray-800 border-gray-700 text-white">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return linkContent;
              })}
            </TooltipProvider>
          </nav>

          {/* Quick Actions */}
          <div className="px-4 py-4 border-t border-gray-700/50">
            <div className="space-y-2">
              <TooltipProvider>
                {isCollapsed ? (
                  <>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Link
                          to="/support"
                          className="flex items-center justify-center px-3 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-200"
                        >
                          <HelpCircle className="h-4 w-4 text-gray-400" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-gray-800 border-gray-700 text-white">
                        <p>Help & Support</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <a
                          href="https://taskmind.dev/documentation"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center px-3 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-200"
                        >
                          <ExternalLink className="h-4 w-4 text-gray-400" />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-gray-800 border-gray-700 text-white">
                        <p>Documentation</p>
                      </TooltipContent>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <Link
                      to="/support"
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-200"
                    >
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                      <span>Help & Support</span>
                    </Link>
                    
                    <a
                      href="https://taskmind.dev/documentation"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-200"
                    >
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                      <span>Documentation</span>
                    </a>
                  </>
                )}
              </TooltipProvider>
            </div>
          </div>

          {/* User Profile */}
          <div className="border-t border-gray-700/50 bg-gradient-to-r from-gray-800/30 to-gray-700/20 backdrop-blur-sm flex-shrink-0">
            {isCollapsed ? (
              <div className="p-4 flex flex-col items-center space-y-3">
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
                              <AvatarFallback className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-purple-400 border border-purple-500/30">
                                {user?.email?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700" align="end" forceMount>
                          <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                              <p className="text-sm font-medium leading-none text-white">{user?.email}</p>
                              <p className="text-xs leading-none text-gray-400">Signed in</p>
                            </div>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-gray-700" />
                          <DropdownMenuItem onClick={toggleTheme} className="text-gray-300 hover:text-white hover:bg-gray-700">
                            {theme === 'dark' ? <Zap className="mr-2 h-4 w-4" /> : <TrendingUp className="mr-2 h-4 w-4" />}
                            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={handleSignOut} className="text-red-400 hover:text-red-300 hover:bg-red-500/20">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-gray-800 border-gray-700 text-white">
                      <p className="font-medium">{user?.email}</p>
                      <p className="text-xs text-gray-400">Click for options</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ) : (
              <>
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-purple-400 border border-purple-500/30">
                        {user?.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                      <p className="text-xs text-gray-400">Active</p>
                    </div>
                  </div>
                </div>
                
                <div className="px-4 pb-4 space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleTheme}
                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 border-gray-600"
                  >
                    {theme === 'dark' ? (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Dark Mode
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/20 border-red-500/30"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Add an overlay to close the sidebar when clicking outside */}
      {isSidebarVisible && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Navigation;