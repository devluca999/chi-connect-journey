import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center px-6">
      <div className="glass-card text-center max-w-md animate-bounce-in">
        <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-bold text-white">404</span>
        </div>
        
        <h1 className="text-2xl font-bold font-heading mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Button 
          onClick={() => window.location.href = '/'}
          className="bg-gradient-primary hover:opacity-90"
        >
          Return to App
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
