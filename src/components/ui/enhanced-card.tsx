import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface EnhancedCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  variant?: "default" | "meshy" | "interactive" | "floating";
  children: React.ReactNode;
  delay?: number;
}

const cardVariants = {
  default: "glass-card",
  meshy: "meshy-card",
  interactive: "interactive-enhanced glass-card",
  floating: "glass-card float-animation"
};

export function EnhancedCard({ 
  variant = "default", 
  children, 
  className, 
  delay = 0,
  ...props 
}: EnhancedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: delay,
        ease: [0.4, 0, 0.2, 1]
      }}
      className={cn(
        cardVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}