import { useState, useEffect } from "react";
import { Calendar, Users, Clock, TrendingUp, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedCard } from "@/components/ui/enhanced-card";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { motion } from "framer-motion";
import { Event, Connection, getEvents, getConnections } from "@/lib/storage";
import { useNavigate } from "react-router-dom";

interface DashboardStats {
  eventsAttended: number;
  connectionsMade: number;
  upcomingRSVPs: Event[];
}

export function HomeScreen() {
  const [stats, setStats] = useState<DashboardStats>({
    eventsAttended: 0,
    connectionsMade: 0,
    upcomingRSVPs: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    const events = getEvents();
    const connections = getConnections();
    
    const attendedEvents = events.filter(event => 
      event.attended || event.rsvpStatus === 'rsvp'
    ).length;
    
    const upcomingEvents = events.filter(event => 
      event.rsvpStatus === 'rsvp' && !event.attended
    );

    setStats({
      eventsAttended: attendedEvents,
      connectionsMade: connections.length,
      upcomingRSVPs: upcomingEvents.slice(0, 3) // Show max 3
    });
  }, []);

  const getCurrentMonth = () => {
    return new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <AnimatedBackground variant="radial-primary" className="min-h-screen">
      {/* Header */}
      <motion.header 
        className="safe-area-top px-6 py-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold font-heading bg-gradient-primary bg-clip-text text-transparent">
              Welcome back
            </h1>
            <p className="text-muted-foreground">Ready to connect?</p>
          </div>
          
          <motion.div 
            className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
        </div>
      </motion.header>

      {/* This Month Section */}
      <div className="px-6 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary" />
            This Month - {getCurrentMonth()}
          </h2>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <EnhancedCard variant="meshy" delay={0.3}>
            <div className="text-center">
              <motion.div
                className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Calendar className="w-6 h-6 text-white" />
              </motion.div>
              <motion.p 
                className="text-3xl font-bold text-foreground"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
              >
                {stats.eventsAttended}
              </motion.p>
              <p className="text-sm text-muted-foreground">Events Attended</p>
            </div>
          </EnhancedCard>

          <EnhancedCard variant="meshy" delay={0.4}>
            <div className="text-center">
              <motion.div
                className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-3"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <Users className="w-6 h-6 text-white" />
              </motion.div>
              <motion.p 
                className="text-3xl font-bold text-foreground"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.6, type: "spring" }}
              >
                {stats.connectionsMade}
              </motion.p>
              <p className="text-sm text-muted-foreground">Connections Made</p>
            </div>
          </EnhancedCard>
        </div>

        {/* Upcoming RSVPs */}
        <EnhancedCard variant="interactive" delay={0.5}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Clock className="w-5 h-5 mr-2 text-primary" />
              Upcoming RSVPs
            </h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/timeline')}
              className="text-primary hover:text-primary hover:bg-primary/10"
            >
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {stats.upcomingRSVPs.length === 0 ? (
            <motion.div 
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">No upcoming events</p>
              <Button 
                size="sm"
                onClick={() => navigate('/feed')}
                className="bg-gradient-primary"
              >
                Discover Events
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {stats.upcomingRSVPs.map((event, index) => (
                <motion.div
                  key={event.id}
                  className="flex items-center justify-between p-3 bg-muted/20 rounded-lg interactive-enhanced cursor-pointer"
                  onClick={() => navigate('/feed')}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + (index * 0.1), duration: 0.4 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.date} at {event.time}
                    </p>
                  </div>
                  <div className="text-xs text-primary font-medium">
                    RSVP'd
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </EnhancedCard>

        {/* Quick Actions */}
        <motion.div 
          className="grid grid-cols-2 gap-4 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Button
            variant="outline"
            className="h-16 flex flex-col items-center justify-center space-y-1 interactive-enhanced border-primary/20 hover:border-primary/40"
            onClick={() => navigate('/feed')}
          >
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-xs">Discover Events</span>
          </Button>

          <Button
            variant="outline"
            className="h-16 flex flex-col items-center justify-center space-y-1 interactive-enhanced border-secondary/20 hover:border-secondary/40"
            onClick={() => navigate('/connections')}
          >
            <Users className="w-5 h-5 text-secondary" />
            <span className="text-xs">My Network</span>
          </Button>
        </motion.div>
      </div>
    </AnimatedBackground>
  );
}