import { useState, useEffect } from "react";
import { MapPin, Calendar, Badge, Heart, UserPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedCard } from "@/components/ui/enhanced-card";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { motion } from "framer-motion";
import { Event, getEvents, updateEventRSVP } from "@/lib/storage";
import { cn } from "@/lib/utils";

export function FeedScreen() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    setEvents(getEvents());
  }, []);

  const handleRSVP = (eventId: string, status: Event['rsvpStatus']) => {
    const updatedEvents = updateEventRSVP(eventId, status);
    setEvents(updatedEvents);
  };

  return (
    <AnimatedBackground variant="radial-primary" className="min-h-screen">
      {/* Header */}
      <motion.header 
        className="safe-area-top px-6 py-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-3xl font-bold font-heading bg-gradient-primary bg-clip-text text-transparent">
          ChiConnect
        </h1>
        <p className="text-muted-foreground mt-1">Discover your next opportunity</p>
      </motion.header>

      {/* Events Feed */}
      <div className="px-6 pb-6 space-y-6">
        {events.map((event, index) => (
          <EventCard
            key={event.id}
            event={event}
            onRSVP={(status) => handleRSVP(event.id, status)}
            delay={index * 0.1}
          />
        ))}
      </div>
    </AnimatedBackground>
  );
}

interface EventCardProps {
  event: Event;
  onRSVP: (status: Event['rsvpStatus']) => void;
  delay?: number;
}

function EventCard({ event, onRSVP, delay = 0 }: EventCardProps) {
  const [imageError, setImageError] = useState(false);
  
  return (
    <EnhancedCard variant="meshy" delay={delay}>
      {/* Event Image */}
      <div className="w-full h-48 bg-gradient-secondary rounded-lg mb-4 overflow-hidden relative">
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
        </motion.div>
      </div>

      {/* Event Details */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.2, duration: 0.4 }}
      >
        <h3 className="text-xl font-semibold text-foreground">{event.title}</h3>
        
        <p className="text-muted-foreground text-sm leading-relaxed">
          {event.description}
        </p>
        
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