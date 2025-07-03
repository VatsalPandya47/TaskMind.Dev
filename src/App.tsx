import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { config, isLandingPageOnly } from "./config";
import OAuth2Callback from "./components/OAuth2Callback"; // Corrected import casing
import "./App.css";

// Import pages and components...
import Index from "./pages/Index";
import About from "./pages/About";
// ... (other landing page imports)
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
// ... (other main app imports)
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import ZoomCallback from "./components/ZoomCallback";

const queryClient = new QueryClient();

// This component will contain the routes for the full application
const MainAppRoutes = () => (
  <ThemeProvider>
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white transition-colors duration-300 relative">
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/auth" element={<Auth />} />
          {/* ... other non-dashboard routes */}
          <Route path="/oauth2callback" element={<OAuth2Callback />} />
          <Route path="/zoom-callback" element={<ProtectedRoute><ZoomCallback /></ProtectedRoute>} />
          
          {/* Routes that use the main AppLayout */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/meetings" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          {/* ... other dashboard routes */}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </AuthProvider>
  </ThemeProvider>
);

// This component will contain the routes for the landing page
const LandingPageRoutes = () => (
  <div className="no-select">
    <Toaster />
    <Sonner />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      {/* ... other landing page routes */}
      <Route path="/oauth2callback" element={<OAuth2Callback />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </div>
);

const App = () => {
  console.log("isLandingPageOnly returns:", isLandingPageOnly());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* ✅ The SINGLE BrowserRouter for the entire application */}
        <BrowserRouter>
          {isLandingPageOnly() ? <LandingPageRoutes /> : <MainAppRoutes />}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;