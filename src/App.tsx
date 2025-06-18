import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import MyMeetings from "./pages/My Meetings";
import ProtectedRoute from "./components/ProtectedRoute";
import ZoomCallback from "./components/ZoomCallback";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import Support from "./pages/Support";
import Documentation from "./pages/Documentation";
// New pages
import HowItWorks from "./pages/HowItWorks";
import UseCases from "./pages/UseCases";
import Help from "./pages/Help";
import Careers from "./pages/Careers";
import Manifesto from "./pages/Manifesto";
import "./App.css";

const queryClient = new QueryClient();

const App = () => (
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

export default App;