import { Clock, Calendar, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function TimelineStep() {
  return (
    <div className="text-center text-white animate-slide-up">
      <div className="mb-8">
        <motion.div 
          className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 mx-auto glow-secondary"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Clock className="w-10 h-10 text-white" />
        </motion.div>
      </div>

      <h2 className="text-3xl font-bold mb-4 font-heading">
        Opportunity Timeline
      </h2>

      <p className="text-lg text-white/90 mb-8 leading-relaxed">
        Every event you attend becomes part of your
        <br />
        <strong>Opportunity Timeline</strong>.
      </p>

      {/* Mini Timeline Preview */}
      <motion.div 
        className="glass-card mb-6 text-left"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h3 className="font-semibold text-foreground">Chi-Tech Collective Black CS Summit</h3>
              <span className="ml-3 px-2 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium">
                Upcoming
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-1" />
              Sep 27, 2025 at 10:00 AM CT
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="w-4 h-4 mr-2" />
            0 connections added
          </div>
          <div className="w-4 h-4" />
        </div>

        <div className="mt-4">
          <Button size="sm" variant="outline" className="w-full interactive-enhanced">
            <Plus className="w-4 h-4 mr-1" />
            Add Connection
          </Button>
        </div>
      </motion.div>

      <p className="text-sm text-white/70">
        Track events, connections, and your networking growth
      </p>
    </div>
  );
}