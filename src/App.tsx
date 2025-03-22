import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import Features from "./pages/Features";
import FinalOnboarding from "./pages/FinalOnboarding";
import Settings from "./pages/Settings";
import FunZone from "./pages/FunZone";
import ImageToLearning from "./pages/ImageToLearning";
import RealLifePractice from "./pages/RealLifePractice";
import VideoLearning from "./pages/VideoLearning";
import Home from "./pages/Home";
import Learning from "./pages/Learning";
import Welcome from "./pages/Welcome";
import { UserPreferencesProvider } from "./contexts/UserPreferencesContext";
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18n}>
      <UserPreferencesProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Welcome Screen */}
              <Route path="/welcome" element={<Welcome />} />
              
              {/* Onboarding Routes */}
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/onboarding/theme" element={<Onboarding step={2} />} />
              <Route path="/onboarding/final" element={<FinalOnboarding />} />
              
              {/* Main App Routes */}
              <Route path="/home" element={<Home />} />
              <Route path="/features" element={<Features />} />
              <Route path="/settings" element={<Settings />} />
              
              {/* Personalized Learning Flow */}
              <Route path="/learning" element={<Learning />} />
              
              {/* Exercise Routes */}
              <Route path="/exercises/balloons" element={<Index />} />
              
              {/* Feature Routes */}
              <Route path="/funzone" element={<FunZone />} />
              <Route path="/image-to-learning" element={<ImageToLearning />} />
              <Route path="/real-life-practice" element={<RealLifePractice />} />
              <Route path="/video-learning" element={<VideoLearning />} />
              
              {/* Default Routes */}
              <Route path="/" element={<Navigate to="/welcome" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </UserPreferencesProvider>
    </I18nextProvider>
  </QueryClientProvider>
);

export default App;
