import { useState, useEffect } from "react";
import { MapPin, Calendar, Badge, Heart, UserPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="safe-area-top px-6 py-6 text-center">
        <h1 className="text-3xl font-bold font-heading bg-gradient-primary bg-clip-text text-transparent">
          ChiConnect
        </h1>
        <p className="text-muted-foreground mt-1">Discover your next opportunity</p>
      </header>

      {/* Events Feed */}
      <div className="px-6 pb-6 space-y-6">
        {events.map((event, index) => (
          <EventCard
            key={event.id}
            event={event}
            onRSVP={(status) => handleRSVP(event.id, status)}
            className={cn(
              "animate-slide-up",
              `[animation-delay:${index * 100}ms]`
            )}
          />
        ))}
      </div>
    </div>
  );
}

interface EventCardProps {
  event: Event;
  onRSVP: (status: Event['rsvpStatus']) => void;
  className?: string;
}

function EventCard({ event, onRSVP, className }: EventCardProps) {
  const [imageError, setImageError] = useState(false);
  
  return (
    <div className={cn("glass-card interactive overflow-hidden", className)}>
      {/* Event Image */}
      <div className="w-full h-48 bg-gradient-secondary rounded-lg mb-4 overflow-hidden">
        {!imageError ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-secondary">
            <span className="text-white font-medium">Event Cover</span>
          </div>
        )}
      </div>

      {/* Event Details */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">{event.title}</h3>
        
        <p className="text-muted-foreground text-sm leading-relaxed">
          {event.description}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2" />
            {event.location}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            {event.date} at {event.time}
          </div>
        </div>
        
        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {event.badges.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
            >
              <Badge className="w-3 h-3 mr-1" />
              {badge}
            </span>
          ))}
        </div>
        
        {/* RSVP Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onRSVP('interested')}
            className={cn(
              "flex-1 transition-all duration-200",
              event.rsvpStatus === 'interested' && "bg-secondary/20 border-secondary text-secondary"
            )}
          >
            <Heart className={cn(
              "w-4 h-4 mr-1",
              event.rsvpStatus === 'interested' && "fill-current"
            )} />
            Interested
          </Button>
          
          <Button
            size="sm"
            onClick={() => onRSVP('rsvp')}
            className={cn(
              "flex-1 transition-all duration-200",
              event.rsvpStatus === 'rsvp' 
                ? "bg-primary text-primary-foreground" 
                : "bg-gradient-primary hover:opacity-90"
            )}
          >
            {event.rsvpStatus === 'rsvp' ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                RSVP'd
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-1" />
                RSVP
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}