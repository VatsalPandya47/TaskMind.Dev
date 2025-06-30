import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { config, isLandingPageOnly } from "./config";
import "./App.css";

// Import landing page components
import Index from "./pages/Index";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

// Import main app components
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import MyMeetings from "./pages/My Meetings";
import SummaryHistory from "./pages/SummaryHistory";
import ProtectedRoute from "./components/ProtectedRoute";
import ZoomCallback from "./components/ZoomCallback";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import Support from "./pages/Support";
import AppLayout from "./components/AppLayout";

const queryClient = new QueryClient();

const App = () => {
  // Show landing page only mode
  if (isLandingPageOnly()) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="no-select">
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Full application mode
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white transition-colors duration-300 relative">
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-use" element={<TermsOfUse />} />
                  <Route path="/support" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Support />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/zoom-callback" element={
                    <ProtectedRoute>
                      <ZoomCallback />
                    </ProtectedRoute>
                  } />
                  <Route path="/my-meetings" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <MyMeetings />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/summary-history" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <SummaryHistory />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/tasks" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/meetings" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/memory" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/summaries" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </div>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;