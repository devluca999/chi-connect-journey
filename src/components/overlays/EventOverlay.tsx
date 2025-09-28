import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Calendar, Users, Clock, Badge, Heart, UserPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Event } from "@/lib/storage";
import { cn } from "@/lib/utils";

interface EventOverlayProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onRSVP: (eventId: string, status: Event['rsvpStatus']) => void;
}

// Mock RSVP data for demonstration - Diverse Chicago community
const mockRSVPs = [
  { id: 1, name: "Sarah Johnson", avatar: "SJ", comment: "Can't wait for this networking opportunity! 🎉" },
  { id: 2, name: "Marcus Williams", avatar: "MW", comment: "See you all there - excited to connect!" },
  { id: 3, name: "Aisha Patel", avatar: "AP", comment: "This looks amazing, perfect for my startup goals" },
  { id: 4, name: "David Chen", avatar: "DC", comment: "First time attending - looking forward to it!" },
  { id: 5, name: "Maya Rodriguez", avatar: "MR", comment: "Love the venue choice, great for conversations" },
  { id: 6, name: "Jordan Thompson", avatar: "JT", comment: "Ready to learn and network! 💪" },
  { id: 7, name: "Keisha Washington", avatar: "KW", comment: "Chicago's tech scene is growing so fast! 🚀" },
  { id: 8, name: "Alex Kim", avatar: "AK", comment: "Bringing my business cards and big energy!" },
  { id: 9, name: "Tamara Jackson", avatar: "TJ", comment: "Always excited for community events like this" },
  { id: 10, name: "Carlos Mendez", avatar: "CM", comment: "Perfect timing for my career transition!" }
];

export function EventOverlay({ event, isOpen, onClose, onRSVP }: EventOverlayProps) {
  const [imageError, setImageError] = useState(false);

  if (!event) return null;

  const handleRSVP = (status: Event['rsvpStatus']) => {
    onRSVP(event.id, status);
    if (status === 'rsvp') {
      // Small delay to show the animation before closing
      setTimeout(() => onClose(), 500);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="native-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Overlay Content */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <div className="glass-card native-modal w-full max-w-lg max-h-[85vh] overflow-hidden">
              {/* Header with close button */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="absolute top-6 right-6 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full w-10 h-10 p-0 native-button backdrop-blur-sm"
                >
                  <X className="w-5 h-5" />
                </Button>

                {/* Event Image */}
                <div className="w-full h-48 bg-gradient-secondary rounded-t-lg overflow-hidden relative">
                  {!imageError ? (
                    <motion.img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.6 }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-secondary">
                      <span className="text-white font-medium">Event Cover</span>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  {event.rsvpStatus && (
                    <motion.div 
                      className="absolute top-4 left-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                    >
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold shadow-lg",
                        event.rsvpStatus === 'rsvp' && "bg-primary text-primary-foreground",
                        event.rsvpStatus === 'interested' && "bg-secondary text-secondary-foreground"
                      )}>
                        {event.rsvpStatus === 'rsvp' ? 'RSVP\'d' : 'Interested'}
                      </span>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="max-h-[50vh] overflow-y-auto mobile-scroll p-6 space-y-6">
                {/* Event Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-xl font-bold text-foreground mb-2">{event.title}</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {event.description}
                  </p>

                  {/* Event Info */}
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-3 text-primary" />
                      {event.location}
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-3 text-primary" />
                      {event.date} at {event.time}
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-3 text-primary" />
                      2 hours duration
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-3 text-primary" />
                      {mockRSVPs.length + Math.floor(Math.random() * 25) + 15} people attending
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {event.badges.map((badge, index) => (
                      <motion.span
                        key={badge}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 + (index * 0.1), type: "spring" }}
                      >
                        <Badge className="w-3 h-3 mr-1" />
                        {badge}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                {/* RSVP'd Users */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-sm font-semibold mb-3 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Who's Going
                  </h3>
                  
                  <div className="space-y-3 max-h-40 overflow-y-auto mobile-scroll">
                    {mockRSVPs.slice(0, 8).map((rsvp, index) => (
                      <motion.div
                        key={rsvp.id}
                        className="flex items-start space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + (index * 0.1) }}
                      >
                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg">
                          {rsvp.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{rsvp.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{rsvp.comment}</p>
                        </div>
                      </motion.div>
                    ))}
                    
                    {mockRSVPs.length > 8 && (
                      <motion.div
                        className="text-center pt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                      >
                        <p className="text-xs text-muted-foreground">
                          +{mockRSVPs.length - 8} more people attending
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <motion.div 
                className="p-6 pt-0 flex gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRSVP('interested')}
                  className={cn(
                    "flex-1 interactive-enhanced native-button",
                    event.rsvpStatus === 'interested' && "bg-secondary/20 border-secondary text-secondary"
                  )}
                >
                  <Heart className={cn(
                    "w-4 h-4 mr-2",
                    event.rsvpStatus === 'interested' && "fill-current"
                  )} />
                  {event.rsvpStatus === 'interested' ? 'Interested' : 'Interested'}
                </Button>
                
                <Button
                  size="sm"
                  onClick={() => handleRSVP('rsvp')}
                  className={cn(
                    "flex-1 interactive-enhanced native-button",
                    event.rsvpStatus === 'rsvp' 
                      ? "bg-primary text-primary-foreground pulse-glow" 
                      : "bg-gradient-primary"
                  )}
                >
                  {event.rsvpStatus === 'rsvp' ? (
                    <motion.div
                      className="flex items-center"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      RSVP'd
                    </motion.div>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      RSVP
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}