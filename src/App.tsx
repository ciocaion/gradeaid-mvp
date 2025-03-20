
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import Features from "./pages/Features";
import FinalOnboarding from "./pages/FinalOnboarding";
import Settings from "./pages/Settings";
import FunZone from "./pages/FunZone";
import { UserPreferencesProvider } from "./contexts/UserPreferencesContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserPreferencesProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/onboarding/theme" element={<Onboarding step={2} />} />
            <Route path="/features" element={<Features />} />
            <Route path="/onboarding/final" element={<FinalOnboarding />} />
            <Route path="/app" element={<Index />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/funzone" element={<FunZone />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserPreferencesProvider>
  </QueryClientProvider>
);

export default App;
