import { useState } from "react";
import { Calendar, MapPin, Badge, Heart, UserPlus, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { updateEventRSVP, getEvents } from "@/lib/storage";
import chiTechSummitImage from '@/assets/chi-tech-summit.jpg';
import { cn } from "@/lib/utils";

export function SummitStep() {
  const [rsvpStatus, setRsvpStatus] = useState<'interested' | 'rsvp' | null>(null);
  const [imageError, setImageError] = useState(false);

  const handleRSVP = (status: 'interested' | 'rsvp') => {
    setRsvpStatus(status);
    // Update the event in storage
    updateEventRSVP('chi-tech-summit', status);
  };

  const summitEvent = {
    id: 'chi-tech-summit',
    title: 'Chi-Tech Collective Black CS Summit',
    description: 'Join Chicago\'s premier Black computer science summit featuring keynote speakers, technical workshops, career panels, and networking opportunities.',
    location: 'UIC Forum, Chicago',
    date: 'Sep 27, 2025',
    time: '10:00 AM CT',
    duration: '5 hours',
    image: chiTechSummitImage,
    badges: ['Community Verified', 'Black-centered'],
    host: 'Chi-Tech Collective'
  };

  return (
    <div className="text-center text-white animate-slide-up">
      <div className="mb-6">
        <motion.div 
          className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 mx-auto glow-secondary"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Calendar className="w-8 h-8 text-white" />
        </motion.div>
      </div>

      <h2 className="text-3xl font-bold mb-4 font-heading">
        The Demo Event
      </h2>

      <p className="text-lg text-white/90 mb-8 leading-relaxed">
        Here's a real event happening in Chicago.
        <br />
        Try RSVP'ing to see how it works!
      </p>

      {/* Summit Event Card */}
      <motion.div 
        className="glass-card mb-6 text-left native-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {/* Event Image */}
        <div className="w-full h-48 bg-gradient-secondary rounded-2xl mb-6 overflow-hidden relative">
          {!imageError ? (
            <motion.img
              src={summitEvent.image}
              alt={summitEvent.title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-secondary">
              <span className="text-white font-medium">Summit Cover</span>
            </div>
          )}
          
          {/* Status Badge */}
          {rsvpStatus && (
            <motion.div 
              className="absolute top-4 right-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <span className={cn(
                "px-4 py-2 rounded-full text-sm font-semibold shadow-lg",
                rsvpStatus === 'rsvp' 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-secondary-foreground"
              )}>
                {rsvpStatus === 'rsvp' ? 'RSVP\'d' : 'Interested'}
              </span>
            </motion.div>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-foreground mb-3">{summitEvent.title}</h3>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-muted-foreground">
            <MapPin className="w-5 h-5 mr-3" />
            <span className="text-base">{summitEvent.location}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground">
            <Calendar className="w-5 h-5 mr-3" />
            <span className="text-base">{summitEvent.date} at {summitEvent.time}</span>
          </div>

          <div className="flex items-center text-muted-foreground">
            <Clock className="w-5 h-5 mr-3" />
            <span className="text-base">{summitEvent.duration}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 mb-6">
          {summitEvent.badges.map((badge, index) => (
            <motion.span
              key={badge}
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + (index * 0.1), type: "spring" }}
            >
              <Badge className="w-4 h-4 mr-2" />
              {badge}
            </motion.span>
          ))}
        </div>
        
        <div className="flex gap-3">
          <Button
            size="lg"
            variant="outline"
            onClick={() => handleRSVP('interested')}
            className={cn(
              "flex-1 transition-all duration-300 transform-gpu hover:scale-[1.02] h-12 native-button",
              rsvpStatus === 'interested' && "bg-secondary/20 border-secondary text-secondary shadow-lg"
            )}
          >
            <Heart className={cn(
              "w-5 h-5 mr-2 transition-all duration-200",
              rsvpStatus === 'interested' && "fill-current scale-110"
            )} />
            Interested
          </Button>
          
          <Button
            size="lg"
            onClick={() => handleRSVP('rsvp')}
            className={cn(
              "flex-1 transition-all duration-300 transform-gpu hover:scale-[1.02] h-12 native-button",
              rsvpStatus === 'rsvp' 
                ? "bg-primary text-primary-foreground shadow-lg pulse-glow" 
                : "bg-gradient-primary hover:opacity-90"
            )}
          >
            {rsvpStatus === 'rsvp' ? (
              <motion.div
                className="flex items-center"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Check className="w-5 h-5 mr-2" />
                RSVP'd
              </motion.div>
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                RSVP
              </>
            )}
          </Button>
        </div>
      </motion.div>

      <p className="text-sm text-white/70">
        {rsvpStatus === 'rsvp' ? (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-primary font-medium"
          >
            ✨ Great! This will appear in your Timeline and Home dashboard
          </motion.span>
        ) : rsvpStatus === 'interested' ? (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-secondary font-medium"
          >
            💡 You can always RSVP later from the Feed
          </motion.span>
        ) : (
          "Tap RSVP to add this to your opportunity timeline"
        )}
      </p>
    </div>
  );
}