import { Calendar, MapPin, Badge } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeedStep() {
  return (
    <div className="text-center text-white animate-slide-up">
      <div className="mb-8">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 glow-secondary">
          <Calendar className="w-10 h-10 text-white" />
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-4 font-heading">
        Discover Events
      </h2>

      <p className="text-lg text-white/90 mb-8 leading-relaxed">
        Browse community events and RSVP to
        <br />
        opportunities that match your interests
      </p>

      {/* Mock Event Card Preview */}
      <div className="glass-card mb-6 text-left">
        <div className="w-full h-32 bg-gradient-secondary rounded-lg mb-4 flex items-center justify-center">
          <span className="text-white font-medium">Event Cover</span>
        </div>
        
        <h3 className="font-semibold text-foreground mb-2">Tech Networking Mixer</h3>
        
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          Downtown Chicago
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <Calendar className="w-4 h-4 mr-1" />
          Tonight, 6:00 PM
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
            <Badge className="w-3 h-3 mr-1" />
            Community Verified
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary/10 text-secondary border border-secondary/20">
            Black-Owned Venue
          </span>
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1">
            Interested
          </Button>
          <Button size="sm" className="flex-1 bg-gradient-primary">
            RSVP
          </Button>
        </div>
      </div>

      <p className="text-sm text-white/70">
        Swipe through events and build your calendar
      </p>
    </div>
  );
}