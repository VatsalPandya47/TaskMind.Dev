import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { AuthProvider } from "@/contexts/AuthContext";
import Auth from "./pages/Auth";
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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-use" element={<TermsOfUse />} />
              <Route path="/support" element={<Support />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/use-cases" element={<UseCases />} />
              <Route path="/help" element={<Help />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/manifesto" element={<Manifesto />} />
              <Route path="/zoom-callback" element={
                <ProtectedRoute>
                  <ZoomCallback />
                </ProtectedRoute>
              } />
              <Route path="/my-meetings" element={
                <ProtectedRoute>
                  <MyMeetings />
                </ProtectedRoute>
              } />
              <Route path="/summary-history" element={
                <ProtectedRoute>
                  <SummaryHistory />
                </ProtectedRoute>
              } />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;