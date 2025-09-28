import { Users } from "lucide-react";
import { motion } from "framer-motion";

export function WelcomeStep() {
  return (
    <div className="text-center text-white animate-slide-up">
      <div className="mb-8">
        <motion.div 
          className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 mx-auto glow-primary"
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
          <Users className="w-12 h-12 text-white" />
        </motion.div>
      </div>

      <motion.h2 
        className="text-4xl font-bold mb-6 font-heading"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Find real, trusted opportunities in Chicago.
      </motion.h2>

      <motion.p 
        className="text-xl text-white/90 mb-12 leading-relaxed font-medium"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Made for us, by us.
      </motion.p>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <div className="flex items-center justify-center space-x-3 text-white/80">
          <div className="w-2 h-2 bg-primary rounded-full" />
          <span className="text-lg">Community-verified events</span>
        </div>
        
        <div className="flex items-center justify-center space-x-3 text-white/80">
          <div className="w-2 h-2 bg-secondary rounded-full" />
          <span className="text-lg">Black-owned venues prioritized</span>
        </div>
        
        <div className="flex items-center justify-center space-x-3 text-white/80">
          <div className="w-2 h-2 bg-accent-foreground rounded-full" />
          <span className="text-lg">Your networking timeline</span>
        </div>
      </motion.div>
    </div>
  );
}