import { useState } from "react";
import { User } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ProfileStep() {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [showProfile, setShowProfile] = useState(true);

  const goals = [
    'networking',
    'career advancement', 
    'entrepreneurship',
    'philanthropy',
    'fun',
    'make friends'
  ];

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  return (
    <div className="text-center text-white animate-slide-up">
      <div className="mb-8">
        <motion.div 
          className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 mx-auto glow-primary"
          animate={{ 
            boxShadow: [
              "0 0 30px rgba(255,255,255,0.3)",
              "0 0 50px rgba(255,255,255,0.5)",
              "0 0 30px rgba(255,255,255,0.3)"
            ]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <User className="w-10 h-10 text-white" />
        </motion.div>
      </div>

      <h2 className="text-3xl font-bold mb-4 font-heading">
        Your Profile & Privacy
      </h2>

      <p className="text-lg text-white/90 mb-8 leading-relaxed">
        Quick setup to personalize your experience
      </p>

      <div className="space-y-6 mb-8">
        {/* Privacy Toggle */}
        <motion.div 
          className="glass-card text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground mb-1">Show my profile to fellow attendees</h4>
              <p className="text-sm text-muted-foreground">Let others see your profile at events you both attend</p>
            </div>
            <Switch 
              checked={showProfile}
              onCheckedChange={setShowProfile}
              className="ml-4"
            />
          </div>
        </motion.div>

        {/* Goals Selection */}
        <motion.div 
          className="glass-card text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h4 className="font-medium text-foreground mb-4">What are your goals? (Select 2-3)</h4>
          <div className="flex flex-wrap gap-3">
            {goals.map((goal, index) => (
              <motion.button
                key={goal}
                onClick={() => toggleGoal(goal)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize",
                  selectedGoals.includes(goal)
                    ? "bg-primary text-primary-foreground shadow-lg" 
                    : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                )}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + (index * 0.1), duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {goal}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.p 
        className="text-sm text-white/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.4 }}
      >
        You can always change these settings later
      </motion.p>
    </div>
  );
}