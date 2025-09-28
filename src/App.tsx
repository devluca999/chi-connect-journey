import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { SplashScreen } from "./components/splash/SplashScreen";
import { OnboardingFlow } from "./components/onboarding/OnboardingFlow";
import { MainApp } from "./components/MainApp";
import { ThemeProvider } from "./components/theme/ThemeProvider";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    // Always show splash screen on every load
    setShowSplash(true);
    const completed = localStorage.getItem('chiconnect-onboarding-completed');
    setHasCompletedOnboarding(completed === 'true');
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return (
      <ThemeProvider defaultTheme="light" storageKey="chiconnect-theme">
        <SplashScreen onComplete={handleSplashComplete} />
      </ThemeProvider>
    );
  }

  if (hasCompletedOnboarding === null) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="glass-card animate-bounce-in">
          <div className="w-12 h-12 bg-gradient-primary rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="chiconnect-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="mobile-app bg-background">
              {!hasCompletedOnboarding ? (
                <OnboardingFlow 
                  onComplete={() => {
                    localStorage.setItem('chiconnect-onboarding-completed', 'true');
                    setHasCompletedOnboarding(true);
                  }}
                />
              ) : (
                <Routes>
                  <Route path="/*" element={<MainApp />} />
                </Routes>
              )}
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;