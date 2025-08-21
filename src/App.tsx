
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { TopNavigation } from "@/components/TopNavigation";
import { SavedGrantsProvider } from "@/contexts/SavedGrantsContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { GoogleAnalyticsProvider } from "@/contexts/GoogleAnalyticsContext";
import AuthPage from "@/components/AuthPage";
import Index from "./pages/Index";
import DiscoverGrants from "./pages/DiscoverGrants";
import SavedGrants from "./pages/SavedGrants";
import ProgressChecklist from "./pages/ProgressChecklist";
import DraftViewer from "./pages/DraftViewer";
import ChatInterface from "./pages/ChatInterface";
import BusinessPlanEditor from "./pages/BusinessPlanEditor";

// Create query client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false
    }
  }
});

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <SavedGrantsProvider>
          <TooltipProvider>
            <Router>
              <GoogleAnalyticsProvider>
                <TopNavigation />
                <main className="w-full">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/discover" element={<DiscoverGrants />} />
                    <Route path="/login" element={<AuthPage />} />
                    <Route path="/signup" element={<AuthPage />} />
                    {/* Protected routes */}
                    <Route path="/saved" element={
                      <ProtectedRoute>
                        <SavedGrants />
                      </ProtectedRoute>
                    } />
                    <Route path="/ongoing" element={
                      <ProtectedRoute>
                        <ProgressChecklist />
                      </ProtectedRoute>
                    } />
                    <Route path="/progress" element={
                      <ProtectedRoute>
                        <ProgressChecklist />
                      </ProtectedRoute>
                    } />
                    <Route path="/draft/:draftId" element={
                      <ProtectedRoute>
                        <DraftViewer />
                      </ProtectedRoute>
                    } />
                    <Route path="/chat" element={
                      <ProtectedRoute>
                        <ChatInterface />
                      </ProtectedRoute>
                    } />
                    <Route path="/business-plan-editor" element={
                      <ProtectedRoute>
                        <BusinessPlanEditor />
                      </ProtectedRoute>
                    } />
                  </Routes>
                </main>
                <Toaster />
                <Sonner />
              </GoogleAnalyticsProvider>
            </Router>
          </TooltipProvider>
        </SavedGrantsProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
