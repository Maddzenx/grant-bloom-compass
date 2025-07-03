
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TopNavigation } from "@/components/TopNavigation";
import { SavedGrantsProvider } from "@/contexts/SavedGrantsContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
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

const AuthenticatedApp = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas-cloud flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-newsreader font-normal mb-4">
            <span style={{ color: '#000000' }}>gr</span>
            <span style={{ color: '#8162F4' }}>ai</span>
            <span style={{ color: '#000000' }}>gent</span>
          </h1>
          <p className="text-gray-600">Laddar...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen w-full bg-canvas-cloud">
      <TopNavigation />
      <main className="w-full">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/discover" element={<DiscoverGrants />} />
          <Route path="/saved" element={<SavedGrants />} />
          <Route path="/ongoing" element={<ProgressChecklist />} />
          <Route path="/progress" element={<ProgressChecklist />} />
          <Route path="/draft/:draftId" element={<DraftViewer />} />
          <Route path="/chat" element={<ChatInterface />} />
          <Route path="/business-plan-editor" element={<BusinessPlanEditor />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <SavedGrantsProvider>
          <TooltipProvider>
            <Router>
              <AuthenticatedApp />
            </Router>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </SavedGrantsProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
