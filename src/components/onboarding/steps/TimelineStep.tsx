import { Clock, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TimelineStep() {
  return (
    <div className="text-center text-white animate-slide-up">
      <div className="mb-8">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 glow-primary">
          <Clock className="w-10 h-10 text-white" />
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-4 font-heading">
        Build Your Timeline
      </h2>

      <p className="text-lg text-white/90 mb-8 leading-relaxed">
        Track attended events and the meaningful
        <br />
        connections you make along the way
      </p>

      {/* Mock Timeline Preview */}
      <div className="space-y-4 mb-6">
        {/* Timeline Event 1 */}
        <div className="glass-card text-left">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Startup Pitch Night</h3>
            <span className="text-xs text-muted-foreground">2 days ago</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <Users className="w-4 h-4 mr-1" />
            3 connections added
          </div>
          
          <Button size="sm" variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-1" />
            Add Connection
          </Button>
        </div>

        {/* Timeline Event 2 */}
        <div className="glass-card text-left opacity-70">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Design Workshop</h3>
            <span className="text-xs text-muted-foreground">1 week ago</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="w-4 h-4 mr-1" />
            1 connection added
          </div>
        </div>
      </div>

      <p className="text-sm text-white/70">
        Every event becomes an opportunity to grow your network
      </p>
    </div>
  );
}