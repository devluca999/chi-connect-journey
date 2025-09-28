import techNetworkingImage from '@/assets/tech-networking.jpg';
import startupPitchImage from '@/assets/startup-pitch.jpg';
import womenBrunchImage from '@/assets/women-brunch.jpg';
import designWorkshopImage from '@/assets/design-workshop.jpg';

// Local storage utilities for ChiConnect

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  image: string;
  badges: string[];
  rsvpStatus?: 'interested' | 'not_interested' | 'rsvp';
  attended?: boolean;
}

export interface Connection {
  id: string;
  name: string;
  role: string;
  company?: string;
  socialHandle: string;
  eventId: string;
  eventTitle: string;
  addedDate: string;
}

export interface UserProfile {
  name: string;
  bio: string;
  skills: string[];
  goals: string[];
  profileImage?: string;
}

// Event Storage
export const getEvents = (): Event[] => {
  try {
    const events = localStorage.getItem('chiconnect-events');
    return events ? JSON.parse(events) : getDefaultEvents();
  } catch {
    return getDefaultEvents();
  }
};

export const saveEvents = (events: Event[]) => {
  localStorage.setItem('chiconnect-events', JSON.stringify(events));
};

export const updateEventRSVP = (eventId: string, status: Event['rsvpStatus']) => {
  const events = getEvents();
  const updatedEvents = events.map(event => 
    event.id === eventId ? { ...event, rsvpStatus: status } : event
  );
  saveEvents(updatedEvents);
  return updatedEvents;
};

export const markEventAttended = (eventId: string) => {
  const events = getEvents();
  const updatedEvents = events.map(event => 
    event.id === eventId ? { ...event, attended: true } : event
  );
  saveEvents(updatedEvents);
  return updatedEvents;
};

// Connection Storage
export const getConnections = (): Connection[] => {
  try {
    const connections = localStorage.getItem('chiconnect-connections');
    return connections ? JSON.parse(connections) : [];
  } catch {
    return [];
  }
};

export const saveConnections = (connections: Connection[]) => {
  localStorage.setItem('chiconnect-connections', JSON.stringify(connections));
};

export const addConnection = (connection: Omit<Connection, 'id' | 'addedDate'>) => {
  const connections = getConnections();
  const newConnection: Connection = {
    ...connection,
    id: Date.now().toString(),
    addedDate: new Date().toISOString(),
  };
  connections.unshift(newConnection);
  saveConnections(connections);
  return newConnection;
};

export const deleteConnection = (connectionId: string) => {
  const connections = getConnections();
  const updatedConnections = connections.filter(conn => conn.id !== connectionId);
  saveConnections(updatedConnections);
  return updatedConnections;
};

// Profile Storage
export const getUserProfile = (): UserProfile => {
  try {
    const profile = localStorage.getItem('chiconnect-profile');
    return profile ? JSON.parse(profile) : getDefaultProfile();
  } catch {
    return getDefaultProfile();
  }
};

export const saveUserProfile = (profile: UserProfile) => {
  localStorage.setItem('chiconnect-profile', JSON.stringify(profile));
};

// Default Data
function getDefaultEvents(): Event[] {
  return [
    {
      id: '1',
      title: 'Tech Networking Mixer',
      description: 'Connect with Chicago\'s tech community over drinks and appetizers.',
      location: 'Downtown Chicago',
      date: new Date().toISOString().split('T')[0],
      time: '6:00 PM',
      image: techNetworkingImage,
      badges: ['Community Verified', 'Black-Owned Venue'],
    },
    {
      id: '2',
      title: 'Startup Pitch Night',
      description: 'Watch local entrepreneurs pitch their ideas to investors.',
      location: 'Innovation Hub',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: '7:30 PM',
      image: startupPitchImage,
      badges: ['Community Verified'],
    },
    {
      id: '3',
      title: 'Women in Business Brunch',
      description: 'Empowering conversations and networking for professional women.',
      location: 'River North',
      date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
      time: '11:00 AM',
      image: womenBrunchImage,
      badges: ['Community Verified', 'Women-Led'],
    },
    {
      id: '4',
      title: 'Design Thinking Workshop',
      description: 'Learn design thinking methodologies through hands-on exercises.',
      location: 'Creative Space',
      date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
      time: '2:00 PM',
      image: designWorkshopImage,
      badges: ['Workshop', 'Community Verified'],
    },
  ];
}

function getDefaultProfile(): UserProfile {
  return {
    name: '',
    bio: '',
    skills: [],
    goals: [],
  };
}