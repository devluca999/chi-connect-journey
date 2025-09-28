import { NavLink, useLocation } from "react-router-dom";
import { Home, Calendar, Clock, Users, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/home", icon: Home, label: "Home" },
  { path: "/feed", icon: Calendar, label: "Feed" },
  { path: "/timeline", icon: Clock, label: "Timeline" },
  { path: "/connections", icon: Users, label: "Connections" },
  { path: "/profile", icon: User, label: "Profile" },
];

export function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-nav home-indicator-safe">
      <div className="flex justify-around items-center px-4 py-3">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path || (path === "/home" && location.pathname === "/");
          
          return (
            <NavLink
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center justify-center px-4 py-3 rounded-2xl transition-all duration-300 min-w-[70px] native-button",
                isActive 
                  ? "text-primary bg-primary/15 shadow-lg scale-105 pulse-glow" 
                  : "text-muted-foreground hover:text-foreground hover:bg-hover/50"
              )}
            >
              <Icon 
                className={cn(
                  "w-6 h-6 mb-1 transition-transform duration-300",
                  isActive && "scale-110 drop-shadow-lg"
                )} 
              />
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