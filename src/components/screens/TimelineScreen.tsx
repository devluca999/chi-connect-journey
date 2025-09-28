import { useState, useEffect } from "react";
import { Clock, Users, Plus, ChevronDown, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddConnectionForm } from "../forms/AddConnectionForm";
import { EnhancedCard } from "@/components/ui/enhanced-card";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { LongPressMenu } from "@/components/ui/long-press-menu";
import { motion } from "framer-motion";
import { Event, Connection, getEvents, getConnections, addConnection, toggleHostFilter } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function TimelineScreen() {
  const [attendedEvents, setAttendedEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  useEffect(() => {
    const allEvents = getEvents();
    const rsvpEvents = allEvents.filter(event => event.rsvpStatus === 'rsvp' || event.attended);
    const today = new Date().toISOString().split('T')[0];
    
    const upcoming = rsvpEvents.filter(event => event.date >= today && !event.attended);
    const past = rsvpEvents.filter(event => event.date < today || event.attended);
    
    const allConnections = getConnections();
    
    setUpcomingEvents(upcoming);
    setPastEvents(past);
    setAttendedEvents(rsvpEvents);
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
    
    // Update local state
    const rsvpEvents = updatedEvents.filter(event => event.rsvpStatus === 'rsvp' || event.attended);
    const today = new Date().toISOString().split('T')[0];
    const upcoming = rsvpEvents.filter(event => event.date >= today && !event.attended);
    const past = rsvpEvents.filter(event => event.date < today || event.attended);
    
    setUpcomingEvents(upcoming);
    setPastEvents(past);
    setAttendedEvents(rsvpEvents);
    
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
    
    // Refresh state to reflect changes
    const allEvents = getEvents();
    const rsvpEvents = allEvents.filter(event => event.rsvpStatus === 'rsvp' || event.attended);
    const today = new Date().toISOString().split('T')[0];
    const upcoming = rsvpEvents.filter(event => event.date >= today && !event.attended);
    const past = rsvpEvents.filter(event => event.date < today || event.attended);
    
    setUpcomingEvents(upcoming);
    setPastEvents(past);
    setAttendedEvents(rsvpEvents);
  };

  return (
    <AnimatedBackground variant="radial-secondary" className="mobile-app">
      {/* Header */}
      <motion.header 
        className="px-6 py-6 pt-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="flex items-center space-x-3 mb-2">
          <motion.div 
            className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Clock className="w-6 h-6 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold font-heading">Your Timeline</h1>
        </div>
        <p className="text-muted-foreground text-lg">Track your networking journey</p>
      </motion.header>

      {/* Timeline Content */}
      <div className="px-6 pb-6 space-y-8">
        {attendedEvents.length === 0 ? (
          <EnhancedCard variant="interactive" className="native-card">
            <div className="text-center py-12">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">No events yet</h3>
              <p className="text-muted-foreground mb-4">
                RSVP to events in the Feed to start building your timeline
              </p>
            </div>
          </EnhancedCard>
        ) : (
          <>
            {/* Upcoming Events Section */}
            {upcomingEvents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Calendar className="w-6 h-6 mr-3 text-primary" />
                  Upcoming Events
                  <span className="ml-3 px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                    {upcomingEvents.length}
                  </span>
                </h2>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => {
                    const eventConnections = getEventConnections(event.id);
                    const isExpanded = expandedEvents.has(event.id);
                    
                    return (
                      <LongPressMenu
                        key={event.id}
                        onViewConnections={() => handleViewConnections(event.id)}
                        onAddNotes={() => handleAddNotes(event)}
                        onShare={() => handleShareEvent(event)}
                        onRemove={() => handleRemoveEvent(event.id)}
                      >
                        <TimelineEventCard
                          event={event}
                          connections={eventConnections}
                          isExpanded={isExpanded}
                          onToggleExpansion={() => toggleEventExpansion(event.id)}
                          onAddConnection={(connectionData) => handleAddConnection(event.id, event.title, connectionData)}
                          delay={index * 0.1}
                          isUpcoming={true}
                        />
                      </LongPressMenu>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Past Events Section */}
            {pastEvents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: upcomingEvents.length > 0 ? 0.3 : 0.1 }}
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Clock className="w-6 h-6 mr-3 text-secondary" />
                  Past Events
                  <span className="ml-3 px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm font-medium">
                    {pastEvents.length}
                  </span>
                </h2>
                <div className="space-y-4">
                  {pastEvents.map((event, index) => {
                    const eventConnections = getEventConnections(event.id);
                    const isExpanded = expandedEvents.has(event.id);
                    
                    return (
                      <LongPressMenu
                        key={event.id}
                        onViewConnections={() => handleViewConnections(event.id)}
                        onAddNotes={() => handleAddNotes(event)}
                        onShare={() => handleShareEvent(event)}
                      >
                        <TimelineEventCard
                          event={event}
                          connections={eventConnections}
                          isExpanded={isExpanded}
                          onToggleExpansion={() => toggleEventExpansion(event.id)}
                          onAddConnection={(connectionData) => handleAddConnection(event.id, event.title, connectionData)}
                          delay={index * 0.1}
                          isUpcoming={false}
                        />
                      </LongPressMenu>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </>
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
  isUpcoming?: boolean;
}

function TimelineEventCard({ 
  event, 
  connections, 
  isExpanded, 
  onToggleExpansion, 
  onAddConnection,
  delay = 0,
  isUpcoming = false
}: TimelineEventCardProps) {
  return (
    <EnhancedCard variant="meshy" delay={delay} className="native-card">
      {/* Event Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <motion.h3 
              className="font-semibold text-foreground"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.1, duration: 0.4 }}
            >
              {event.title}
            </motion.h3>
            <motion.span 
              className={cn(
                "ml-3 px-2 py-1 rounded-full text-xs font-medium",
                isUpcoming 
                  ? "bg-primary/20 text-primary" 
                  : "bg-secondary/20 text-secondary"
              )}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.2, type: "spring" }}
            >
              {isUpcoming ? 'Upcoming' : 'Past'}
            </motion.span>
          </div>
          <motion.div 
            className="flex items-center text-sm text-muted-foreground"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.3, duration: 0.4 }}
          >
            <Calendar className="w-4 h-4 mr-1" />
            {event.date} at {event.time}
          </motion.div>
        </div>
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
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {connection.avatar || connection.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{connection.name}</p>
                          <p className="text-xs text-muted-foreground">{connection.role}</p>
                          {connection.company && (
                            <p className="text-xs text-muted-foreground">at {connection.company}</p>
                          )}
                        </div>
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