import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ThemeToggle } from "./components/ThemeToggle";
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
import Documentation from "./pages/Documentation";
import HowItWorks from "./pages/HowItWorks";
import UseCases from "./pages/UseCases";
import Help from "./pages/Help";
import Careers from "./pages/Careers";
import Manifesto from "./pages/Manifesto";
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
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900 transition-colors duration-300 relative">
              <div className="fixed bottom-4 right-4 z-50">
                <ThemeToggle />
              </div>
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
                  <Route path="/documentation" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Documentation />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/how-it-works" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <HowItWorks />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/use-cases" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <UseCases />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/help" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Help />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/careers" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Careers />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/manifesto" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Manifesto />
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
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
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