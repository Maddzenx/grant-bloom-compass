
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TopNavigation } from "@/components/TopNavigation";
import { SavedGrantsProvider } from "@/contexts/SavedGrantsContext";
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
      // 5 minutes
      gcTime: 10 * 60 * 1000,
      // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false
    }
  }
});

const App = () => <QueryClientProvider client={queryClient}>
    <SavedGrantsProvider>
      <TooltipProvider>
        <Router>
          <div className="min-h-screen w-full bg-[#f8f4ec]">
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
        </Router>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </SavedGrantsProvider>
  </QueryClientProvider>;

export default App;
