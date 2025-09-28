import { NavLink, useLocation } from "react-router-dom";
import { Home, Clock, Users, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/feed", icon: Home, label: "Feed" },
  { path: "/timeline", icon: Clock, label: "Timeline" },
  { path: "/connections", icon: Users, label: "Connections" },
  { path: "/profile", icon: User, label: "Profile" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-nav safe-area-bottom">
      <div className="flex justify-around items-center px-2 py-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path || (path === "/feed" && location.pathname === "/");
          
          return (
            <NavLink
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-300 min-w-[60px]",
                isActive 
                  ? "text-primary bg-primary/10 shadow-lg" 
                  : "text-muted-foreground hover:text-foreground hover:bg-hover"
              )}
            >
              <Icon 
                className={cn(
                  "w-5 h-5 mb-1 transition-transform duration-200",
                  isActive && "scale-110"
                )} 
              />
              <span 
                className={cn(
                  "text-xs font-medium transition-all duration-200",
                  isActive ? "opacity-100" : "opacity-70"
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