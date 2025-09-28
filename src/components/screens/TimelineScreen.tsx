import { useState, useEffect } from "react";
import { Clock, Users, Plus, ChevronDown, ChevronUp, Calendar, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddConnectionForm } from "../forms/AddConnectionForm";
import { EnhancedCard } from "@/components/ui/enhanced-card";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { LongPressMenu } from "@/components/ui/long-press-menu";
import { motion } from "framer-motion";
import { Event, Connection, getEvents, getConnections, addConnection } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function TimelineScreen() {
  const [attendedEvents, setAttendedEvents] = useState<Event[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  useEffect(() => {
    const events = getEvents().filter(event => event.attended || event.rsvpStatus === 'rsvp');
    const allConnections = getConnections();
    
    setAttendedEvents(events);
    setConnections(allConnections);
  }, []);

  const getEventConnections = (eventId: string) => {
    return connections.filter(conn => conn.eventId === eventId);
  };

  const toggleEventExpansion = (eventId: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  const handleViewConnections = (eventId: string) => {
    const eventConnections = getEventConnections(eventId);
    if (eventConnections.length === 0) {
      toast({
        title: "No connections yet",
        description: "Add some connections from this event to view them here."
      });
    } else {
      // Toggle expansion to show connections
      toggleEventExpansion(eventId);
    }
  };

  const handleAddNotes = (event: Event) => {
    toast({
      title: "Coming soon",
      description: "Event notes and takeaways feature will be available soon!"
    });
  };

  const handleShareEvent = (event: Event) => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this event: ${event.title}`,
        url: window.location.href
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${event.title} - ${event.location} on ${event.date}`);
      toast({
        title: "Event details copied",
        description: "Event information has been copied to clipboard."
      });
    }
  };

  const handleRemoveEvent = (eventId: string) => {
    // Remove from RSVP list (this would update the events in storage)
    const events = getEvents();
    const updatedEvents = events.map(event => 
      event.id === eventId ? { ...event, rsvpStatus: undefined } : event
    );
    localStorage.setItem('chiconnect-events', JSON.stringify(updatedEvents));
    
    const updatedAttendedEvents = updatedEvents.filter(event => event.attended || event.rsvpStatus === 'rsvp');
    setAttendedEvents(updatedAttendedEvents);
    
    toast({
      title: "Event removed",
      description: "Event has been removed from your timeline."
    });
  };

  const handleAddConnection = async (eventId: string, eventTitle: string, connectionData: Omit<Connection, 'id' | 'eventId' | 'eventTitle' | 'addedDate'>) => {
    const newConnection = addConnection({
      ...connectionData,
      eventId,
      eventTitle,
    });
    setConnections([newConnection, ...connections]);
  };

  return (
    <AnimatedBackground variant="radial-secondary" className="min-h-screen">
      {/* Header */}
      <motion.header 
        className="safe-area-top px-6 py-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="flex items-center space-x-3 mb-2">
          <motion.div 
            className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Clock className="w-5 h-5 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold font-heading">Your Timeline</h1>
        </div>
        <p className="text-muted-foreground">Track your networking journey</p>
      </motion.header>

      {/* Timeline Content */}
      <div className="px-6 pb-6">
        {attendedEvents.length === 0 ? (
          <EnhancedCard variant="interactive">
            <div className="text-center py-12">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              </motion.div>
              <h3 className="text-lg font-semibold mb-2">No events yet</h3>
              <p className="text-muted-foreground mb-4">
                RSVP to events in the Feed to start building your timeline
              </p>
            </div>
          </EnhancedCard>
        ) : (
          <div className="space-y-4">
            {attendedEvents.map((event, index) => {
              const eventConnections = getEventConnections(event.id);
              const isExpanded = expandedEvents.has(event.id);
              
              return (
                <LongPressMenu
                  key={event.id}
                  onViewConnections={() => handleViewConnections(event.id)}
                  onAddNotes={() => handleAddNotes(event)}
                  onShare={() => handleShareEvent(event)}
                  onRemove={event.rsvpStatus === 'rsvp' && !event.attended ? () => handleRemoveEvent(event.id) : undefined}
                >
                  <TimelineEventCard
                    event={event}
                    connections={eventConnections}
                    isExpanded={isExpanded}
                    onToggleExpansion={() => toggleEventExpansion(event.id)}
                    onAddConnection={(connectionData) => handleAddConnection(event.id, event.title, connectionData)}
                    delay={index * 0.1}
                  />
                </LongPressMenu>
              );
            })}
          </div>
        )}
      </div>
    </AnimatedBackground>
  );
}

interface TimelineEventCardProps {
  event: Event;
  connections: Connection[];
  isExpanded: boolean;
  onToggleExpansion: () => void;
  onAddConnection: (connectionData: Omit<Connection, 'id' | 'eventId' | 'eventTitle' | 'addedDate'>) => void;
  delay?: number;
}

function TimelineEventCard({ 
  event, 
  connections, 
  isExpanded, 
  onToggleExpansion, 
  onAddConnection,
  delay = 0
}: TimelineEventCardProps) {
  return (
    <EnhancedCard variant="meshy" delay={delay}>
      {/* Event Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <motion.h3 
            className="font-semibold text-foreground mb-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.1, duration: 0.4 }}
          >
            {event.title}
          </motion.h3>
          <motion.div 
            className="flex items-center text-sm text-muted-foreground"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.2, duration: 0.4 }}
          >
            <Calendar className="w-4 h-4 mr-1" />
            {event.date}
          </motion.div>
        </div>
        <motion.div 
          className="text-right"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.3, duration: 0.4 }}
        >
          <span className="text-xs text-muted-foreground">
            {event.rsvpStatus === 'rsvp' ? 'RSVP\'d' : 'Attended'}
          </span>
        </motion.div>
      </div>

      {/* Connections Summary */}
      <motion.div 
        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/40 transition-colors interactive-enhanced"
        onClick={onToggleExpansion}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.4, duration: 0.4 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="w-4 h-4 mr-2" />
          {connections.length} connection{connections.length !== 1 ? 's' : ''} added
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </motion.div>

      {/* Expanded Connections */}
      {isExpanded && (
        <motion.div 
          className="mt-4 space-y-3"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          {connections.length > 0 && (
            <div className="space-y-2">
              {connections.map((connection, index) => (
                <motion.div 
                  key={connection.id} 
                  className="flex items-center justify-between p-3 bg-card rounded-lg border interactive-enhanced"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <div>
                    <p className="font-medium text-sm">{connection.name}</p>
                    <p className="text-xs text-muted-foreground">{connection.role}</p>
                    {connection.company && (
                      <p className="text-xs text-muted-foreground">at {connection.company}</p>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    @{connection.socialHandle}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          {/* Add Connection Button */}
          <Dialog>
            <DialogTrigger asChild>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <Button size="sm" variant="outline" className="w-full interactive-enhanced">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Connection
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Connection from {event.title}</DialogTitle>
              </DialogHeader>
              <AddConnectionForm onSubmit={onAddConnection} />
            </DialogContent>
          </Dialog>
        </motion.div>
      )}
    </EnhancedCard>
  );
}