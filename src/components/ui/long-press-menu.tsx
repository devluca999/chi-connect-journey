import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, FileText, Share2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LongPressMenuProps {
  children: React.ReactNode;
  onViewConnections?: () => void;
  onAddNotes?: () => void;
  onShare?: () => void;
  onRemove?: () => void;
  className?: string;
}

export function LongPressMenu({
  children,
  onViewConnections,
  onAddNotes,
  onShare,
  onRemove,
  className
}: LongPressMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startLongPress = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setMenuPosition({ x: clientX, y: clientY });
    
    longPressTimer.current = setTimeout(() => {
      setIsMenuOpen(true);
      // Add haptic feedback on mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }, 500); // 500ms long press
  };

  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleMenuAction = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsMenuOpen(false);
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);

  const menuItems = [
    { icon: Users, label: "View Connections", action: onViewConnections, color: "text-primary" },
    { icon: FileText, label: "Add Notes", action: onAddNotes, color: "text-secondary" },
    { icon: Share2, label: "Share Event", action: onShare, color: "text-accent-foreground" },
    { icon: Trash2, label: "Remove", action: onRemove, color: "text-destructive" },
  ].filter(item => item.action); // Only show items with actions

  return (
    <>
      <div
        ref={containerRef}
        className={cn("relative select-none", className)}
        onMouseDown={startLongPress}
        onMouseUp={cancelLongPress}
        onMouseLeave={cancelLongPress}
        onTouchStart={startLongPress}
        onTouchEnd={cancelLongPress}
        onTouchCancel={cancelLongPress}
      >
        {children}
      </div>

      {/* Menu Portal */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" />
            
            {/* Menu */}
            <motion.div
              className="fixed z-50 glass-card rounded-xl shadow-2xl min-w-[200px]"
              style={{
                left: Math.min(menuPosition.x, window.innerWidth - 220),
                top: Math.min(menuPosition.y, window.innerHeight - (menuItems.length * 50 + 20)),
              }}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <div className="p-2">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.label}
                    onClick={() => handleMenuAction(item.action!)}
                    className={cn(
                      "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors hover:bg-muted/50 interactive-enhanced",
                      item.color
                    )}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}