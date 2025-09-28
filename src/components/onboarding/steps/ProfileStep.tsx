import { User, Settings, Moon, Shield } from "lucide-react";

export function ProfileStep() {
  return (
    <div className="text-center text-white animate-slide-up">
      <div className="mb-8">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 glow-secondary">
          <User className="w-10 h-10 text-white" />
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-4 font-heading">
        Customize Your Profile
      </h2>

      <p className="text-lg text-white/90 mb-8 leading-relaxed">
        Set your skills, goals, and preferences
        <br />
        to get the most relevant opportunities
      </p>

      {/* Features Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="glass-card text-center p-4">
          <User className="w-8 h-8 text-white mx-auto mb-2 opacity-80" />
          <p className="text-sm text-white/90">Profile & Skills</p>
        </div>
        
        <div className="glass-card text-center p-4">
          <Settings className="w-8 h-8 text-white mx-auto mb-2 opacity-80" />
          <p className="text-sm text-white/90">Preferences</p>
        </div>
        
        <div className="glass-card text-center p-4">
          <Moon className="w-8 h-8 text-white mx-auto mb-2 opacity-80" />
          <p className="text-sm text-white/90">Dark Mode</p>
        </div>
        
        <div className="glass-card text-center p-4">
          <Shield className="w-8 h-8 text-white mx-auto mb-2 opacity-80" />
          <p className="text-sm text-white/90">Privacy</p>
        </div>
      </div>

      <div className="text-left space-y-3 mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-white rounded-full" />
          <span className="text-white/90 text-sm">Set your professional interests</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-white rounded-full" />
          <span className="text-white/90 text-sm">Choose your networking goals</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-white rounded-full" />
          <span className="text-white/90 text-sm">Control your privacy settings</span>
        </div>
      </div>

      <p className="text-sm text-white/70">
        Ready to start connecting? Let's go!
      </p>
    </div>
  );
}