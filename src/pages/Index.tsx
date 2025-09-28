import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // This page should redirect to the main app
    navigate('/', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
      <div className="glass-card animate-bounce-in">
        <div className="w-12 h-12 bg-gradient-primary rounded-full animate-pulse" />
      </div>
    </div>
  );
};

export default Index;