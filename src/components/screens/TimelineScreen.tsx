import { useState, useEffect } from "react";
import { Clock, Users, Plus, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddConnectionForm } from "../forms/AddConnectionForm";
import { Event, Connection, getEvents, getConnections, addConnection } from "@/lib/storage";
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

  const handleAddConnection = async (eventId: string, eventTitle: string, connectionData: Omit<Connection, 'id' | 'eventId' | 'eventTitle' | 'addedDate'>) => {
    const newConnection = addConnection({
      ...connectionData,
      eventId,
      eventTitle,
    });
    setConnections([newConnection, ...connections]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="safe-area-top px-6 py-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold font-heading">Your Timeline</h1>
        </div>
        <p className="text-muted-foreground">Track your networking journey</p>
      </header>

      {/* Timeline Content */}
      <div className="px-6 pb-6">
        {attendedEvents.length === 0 ? (
          <div className="glass-card text-center py-12">
            <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No events yet</h3>
            <p className="text-muted-foreground mb-4">
              RSVP to events in the Feed to start building your timeline
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {attendedEvents.map((event, index) => {
              const eventConnections = getEventConnections(event.id);
              const isExpanded = expandedEvents.has(event.id);
              
              return (
                <TimelineEventCard
                  key={event.id}
                  event={event}
                  connections={eventConnections}
                  isExpanded={isExpanded}
                  onToggleExpansion={() => toggleEventExpansion(event.id)}
                  onAddConnection={(connectionData) => handleAddConnection(event.id, event.title, connectionData)}
                  className={cn(
                    "animate-slide-up",
                    `[animation-delay:${index * 100}ms]`
                  )}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

interface TimelineEventCardProps {
  event: Event;
  connections: Connection[];
  isExpanded: boolean;
  onToggleExpansion: () => void;
  onAddConnection: (connectionData: Omit<Connection, 'id' | 'eventId' | 'eventTitle' | 'addedDate'>) => void;
  className?: string;
}

function TimelineEventCard({ 
  event, 
  connections, 
  isExpanded, 
  onToggleExpansion, 
  onAddConnection,
  className 
}: TimelineEventCardProps) {
  return (
    <div className={cn("glass-card", className)}>
      {/* Event Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">{event.title}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-1" />
            {event.date}
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-muted-foreground">
            {event.rsvpStatus === 'rsvp' ? 'RSVP\'d' : 'Attended'}
          </span>
        </div>
      </div>

      {/* Connections Summary */}
      <div 
        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/40 transition-colors"
        onClick={onToggleExpansion}
      >
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="w-4 h-4 mr-2" />
          {connections.length} connection{connections.length !== 1 ? 's' : ''} added
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </div>

      {/* Expanded Connections */}
      {isExpanded && (
        <div className="mt-4 space-y-3 animate-slide-up">
          {connections.length > 0 && (
            <div className="space-y-2">
              {connections.map((connection) => (
                <div key={connection.id} className="flex items-center justify-between p-3 bg-card rounded-lg border">
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
                </div>
              ))}
            </div>
          )}
          
          {/* Add Connection Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-1" />
                Add Connection
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Connection from {event.title}</DialogTitle>
              </DialogHeader>
              <AddConnectionForm onSubmit={onAddConnection} />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}