import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedBackgroundProps {
  variant?: "radial-primary" | "radial-secondary" | "gradient-hero";
  className?: string;
  children?: React.ReactNode;
}

export function AnimatedBackground({ 
  variant = "gradient-hero", 
  className,
  children 
}: AnimatedBackgroundProps) {
  return (
    <div className={cn(
      "relative overflow-hidden",
      variant === "gradient-hero" && "bg-gradient-hero",
      className
    )}>
      {/* Radial Gradient Overlays */}
      {variant === "radial-primary" && (
        <>
          <div className="absolute top-0 right-0 h-1/2 w-1/2 bg-radial-primary" />
          <div className="absolute top-0 left-0 h-1/2 w-1/2 bg-radial-primary -scale-x-100" />
        </>
      )}
      
      {variant === "radial-secondary" && (
        <>
          <div className="absolute bottom-0 left-0 h-1/2 w-1/2 bg-radial-secondary" />
          <div className="absolute bottom-0 right-0 h-1/2 w-1/2 bg-radial-secondary -scale-x-100" />
        </>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}