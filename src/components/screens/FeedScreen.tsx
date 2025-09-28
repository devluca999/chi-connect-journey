import { useState, useEffect } from "react";
import { MapPin, Calendar, Badge, Heart, UserPlus, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedCard } from "@/components/ui/enhanced-card";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { EventOverlay } from "@/components/overlays/EventOverlay";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Event, getEvents, updateEventRSVP } from "@/lib/storage";
import { cn } from "@/lib/utils";

const notInterestedReasons = [
  "Not interested in the topic",
  "Can't make the time",
  "Location is too far",
  "Already attending similar event",
  "Prefer smaller gatherings",
  "Just not my vibe"
];

export function FeedScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [notInterestedEvent, setNotInterestedEvent] = useState<Event | null>(null);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);

  useEffect(() => {
    const allEvents = getEvents();
    // Filter out events marked as not interested
    const interestedEvents = allEvents.filter(event => event.rsvpStatus !== 'not_interested');
    setEvents(interestedEvents);
  }, []);

  const handleRSVP = (eventId: string, status: Event['rsvpStatus']) => {
    const updatedEvents = updateEventRSVP(eventId, status);
    
    if (status === 'not_interested') {
      // Remove from feed and show feedback dialog
      const event = events.find(e => e.id === eventId);
      if (event) {
        setNotInterestedEvent(event);
        setShowFeedbackDialog(true);
        setEvents(prev => prev.filter(e => e.id !== eventId));
      }
    } else {
      // Update the events list for other statuses
      const filteredEvents = updatedEvents.filter(event => event.rsvpStatus !== 'not_interested');
      setEvents(filteredEvents);
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setOverlayOpen(true);
  };

  const handleFeedbackSubmit = (reason: string) => {
    // Could save feedback to analytics/local storage
    console.log(`User not interested in "${notInterestedEvent?.title}" because: ${reason}`);
    setShowFeedbackDialog(false);
    setNotInterestedEvent(null);
  };

  return (
    <>
      <AnimatedBackground variant="radial-primary" className="min-h-screen">
        {/* Header */}
        <motion.header 
          className="safe-area-top px-6 py-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-3xl font-bold font-heading bg-gradient-primary bg-clip-text text-transparent">
            Discover Events
          </h1>
          <p className="text-muted-foreground mt-1">Connect with your community</p>
        </motion.header>

        {/* Events Feed */}
        <div className="px-6 pb-6 space-y-6">
          {events.length === 0 ? (
            <EnhancedCard variant="interactive">
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No more events</h3>
                <p className="text-muted-foreground">
                  You've seen all available events. Check back later for new opportunities!
                </p>
              </div>
            </EnhancedCard>
          ) : (
            events.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                onRSVP={(status) => handleRSVP(event.id, status)}
                onEventClick={() => handleEventClick(event)}
                delay={index * 0.1}
              />
            ))
          )}
        </div>
      </AnimatedBackground>

      {/* Event Detail Overlay */}
      <EventOverlay
        event={selectedEvent}
        isOpen={overlayOpen}
        onClose={() => setOverlayOpen(false)}
        onRSVP={handleRSVP}
      />

      {/* Not Interested Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>Help us improve your feed</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Why weren't you interested in "{notInterestedEvent?.title}"?
            </p>
            <div className="space-y-2">
              {notInterestedReasons.map((reason, index) => (
                <motion.button
                  key={reason}
                  onClick={() => handleFeedbackSubmit(reason)}
                  className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors interactive-enhanced"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {reason}
                </motion.button>
              ))}
            </div>
            <Button
              variant="ghost"
              onClick={() => setShowFeedbackDialog(false)}
              className="w-full mt-4"
            >
              Skip feedback
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface EventCardProps {
  event: Event;
  onRSVP: (status: Event['rsvpStatus']) => void;
  onEventClick: () => void;
  delay?: number;
}

function EventCard({ event, onRSVP, onEventClick, delay = 0 }: EventCardProps) {
  const [imageError, setImageError] = useState(false);
  
  return (
    <EnhancedCard variant="meshy" delay={delay}>
      {/* Event Image - Clickable */}
      <motion.div 
        className="w-full h-48 bg-gradient-secondary rounded-lg mb-4 overflow-hidden relative cursor-pointer"
        onClick={onEventClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
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
            <motion.span 
              className="text-white font-medium"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Event Cover
            </motion.span>
          </div>
        )}
        
        {/* Click hint */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-200">
          <span className="text-white font-medium text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
            Tap for details
          </span>
        </div>
        
        {/* Floating badge */}
        <motion.div 
          className="absolute top-4 right-4"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {event.rsvpStatus === 'rsvp' && (
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              RSVP'd
            </span>
          )}
          {event.rsvpStatus === 'interested' && (
            <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              Interested
            </span>
          )}
        </motion.div>
      </motion.div>

      {/* Event Details */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.2, duration: 0.4 }}
      >
        <h3 className="text-xl font-semibold text-foreground cursor-pointer hover:text-primary transition-colors" onClick={onEventClick}>
          {event.title}
        </h3>
        
        <div className="space-y-2">
          <motion.div 
            className="flex items-center text-sm text-muted-foreground"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: delay + 0.3, duration: 0.4 }}
          >
            <MapPin className="w-4 h-4 mr-2" />
            {event.location}
          </motion.div>
          
          <motion.div 
            className="flex items-center text-sm text-muted-foreground"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: delay + 0.4, duration: 0.4 }}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {event.date} at {event.time}
          </motion.div>
        </div>
        
        {/* Badges */}
        <motion.div 
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.5, duration: 0.4 }}
        >
          {event.badges.map((badge, index) => (
            <motion.span
              key={badge}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                delay: delay + 0.6 + (index * 0.1), 
                duration: 0.3,
                type: "spring",
                stiffness: 200
              }}
            >
              <Badge className="w-3 h-3 mr-1" />
              {badge}
            </motion.span>
          ))}
        </motion.div>
        
        {/* RSVP Buttons */}
        <motion.div 
          className="flex gap-2 pt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.7, duration: 0.4 }}
        >
          <Button
            size="sm"
            variant="outline"
            onClick={() => onRSVP('interested')}
            className={cn(
              "flex-1 transition-all duration-300 transform-gpu hover:scale-[1.02]",
              event.rsvpStatus === 'interested' && "bg-secondary/20 border-secondary text-secondary shadow-lg"
            )}
          >
            <Heart className={cn(
              "w-4 h-4 mr-1 transition-all duration-200",
              event.rsvpStatus === 'interested' && "fill-current scale-110"
            )} />
            Interested
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onRSVP('not_interested')}
            className="transition-all duration-300 transform-gpu hover:scale-[1.02] hover:bg-destructive/10 hover:border-destructive/40 hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </Button>
          
          <Button
            size="sm"
            onClick={() => onRSVP('rsvp')}
            className={cn(
              "flex-1 transition-all duration-300 transform-gpu hover:scale-[1.02]",
              event.rsvpStatus === 'rsvp' 
                ? "bg-primary text-primary-foreground shadow-lg pulse-glow" 
                : "bg-gradient-primary hover:opacity-90"
            )}
          >
            {event.rsvpStatus === 'rsvp' ? (
              <motion.div
                className="flex items-center"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Check className="w-4 h-4 mr-1" />
                RSVP'd
              </motion.div>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-1" />
                RSVP
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </EnhancedCard>
  );
}