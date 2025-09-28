import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Sparkles } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show content after initial mount
    const timer1 = setTimeout(() => setShowContent(true), 100);
    
    // Auto redirect after 6 seconds
    const timer2 = setTimeout(() => {
      onComplete();
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 h-1/2 w-1/2 bg-radial-primary opacity-60" />
      <div className="absolute bottom-0 left-0 h-1/2 w-1/2 bg-radial-secondary opacity-40" />
      
      {/* Floating Icons */}
      <motion.div
        className="absolute top-20 left-10"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
          <Users className="w-6 h-6 text-white/70" />
        </div>
      </motion.div>

      <motion.div
        className="absolute top-32 right-16"
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, -10, 10, 0]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1
        }}
      >
        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-white/70" />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {showContent && (
          <>
            {/* Logo Icon */}
            <motion.div
              className="mb-8"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.68, -0.55, 0.265, 1.55] 
              }}
            >
              <div className="relative inline-block">
                <motion.div 
                  className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30"
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
                
                {/* Orbiting Elements */}
                <motion.div
                  className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full"
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                />
                
                <motion.div
                  className="absolute -bottom-1 -left-3 w-4 h-4 bg-secondary rounded-full"
                  animate={{ 
                    rotate: -360,
                    scale: [1, 1.3, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 6, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                  }}
                />
              </div>
            </motion.div>

            {/* Brand Name */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.4, 
                duration: 0.8, 
                ease: "easeOut" 
              }}
            >
              <h1 className="text-6xl font-bold text-white mb-2 font-heading">
                <motion.span
                  animate={{ 
                    textShadow: [
                      "0 0 20px rgba(255,255,255,0.5)",
                      "0 0 40px rgba(255,255,255,0.8)",
                      "0 0 20px rgba(255,255,255,0.5)"
                    ]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  ChiConnect
                </motion.span>
              </h1>
              
              <motion.p 
                className="text-lg text-white/90 font-medium italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                for the people, from the block.
              </motion.p>
            </motion.div>

            {/* Loading Dots */}
            <motion.div 
              className="flex justify-center space-x-2 mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.4 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-white/60 rounded-full"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}