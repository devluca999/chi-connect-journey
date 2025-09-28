import { NavLink, useLocation } from "react-router-dom";
import { Home, Calendar, Clock, Users, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/home", icon: Home, label: "Home" },
  { path: "/feed", icon: Calendar, label: "Feed" },
  { path: "/timeline", icon: Clock, label: "Timeline" },
  { path: "/connections", icon: Users, label: "Connections" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[9999] glass-nav home-indicator-safe border-t border-border/30 bg-background/95 backdrop-blur-xl">
      <div className="flex justify-around items-center px-4 py-3">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path || (path === "/home" && location.pathname === "/");
          
          return (
            <NavLink
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center justify-center px-4 py-3 rounded-2xl transition-all duration-200 min-w-[70px] native-button relative",
                isActive 
                  ? "text-primary bg-primary/15 shadow-lg scale-105" 
                  : "text-muted-foreground hover:text-foreground hover:bg-hover/50"
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  className="absolute -top-1 left-1/2 w-1 h-1 bg-primary rounded-full"
                  initial={{ scale: 0, x: "-50%" }}
                  animate={{ scale: 1, x: "-50%" }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              )}
              
              <motion.div
                animate={{ 
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -2 : 0
                }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Icon 
                  className={cn(
                    "w-6 h-6 mb-1 transition-all duration-300",
                    isActive && "drop-shadow-lg"
                  )} 
                />
              </motion.div>
              
              <span 
                className={cn(
                  "text-xs font-semibold transition-all duration-300",
                  isActive ? "opacity-100 text-primary" : "opacity-70"
                )}
              >
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}