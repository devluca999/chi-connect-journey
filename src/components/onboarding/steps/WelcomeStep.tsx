import { Users, Sparkles } from "lucide-react";

export function WelcomeStep() {
  return (
    <div className="text-center text-white animate-slide-up">
      <div className="mb-8">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 glow-primary">
            <Users className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      <h1 className="text-4xl font-bold mb-4 font-heading">
        Welcome to
        <br />
        <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          ChiConnect
        </span>
      </h1>

      <p className="text-xl text-white/90 mb-8 leading-relaxed">
        Grow your opportunities through
        <br />
        meaningful community connections
      </p>

      <div className="space-y-4 text-left">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-white rounded-full" />
          <span className="text-white/90">Discover local events</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-white rounded-full" />
          <span className="text-white/90">Build your network</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-white rounded-full" />
          <span className="text-white/90">Track your opportunities</span>
        </div>
      </div>
    </div>
  );
}