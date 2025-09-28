import techNetworkingImage from '@/assets/tech-networking.jpg';
import startupPitchImage from '@/assets/startup-pitch.jpg';
import womenBrunchImage from '@/assets/women-brunch.jpg';
import designWorkshopImage from '@/assets/design-workshop.jpg';
import youngProfessionalsImage from '@/assets/young-professionals-mixer.jpg';
import creativeWorkshopImage from '@/assets/creative-workshop.jpg';
import activismMeetupImage from '@/assets/activism-meetup.jpg';
import culturalFestivalImage from '@/assets/cultural-festival.jpg';
import careerWorkshopImage from '@/assets/career-workshop.jpg';
import entrepreneurMeetupImage from '@/assets/entrepreneur-meetup.jpg';
import bookClubImage from '@/assets/book-club.jpg';
import communityGardenImage from '@/assets/community-garden.jpg';

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
  host?: string;
  category?: string;
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
  avatar?: string;
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

// Connection Storage with Mock Data
export const getConnections = (): Connection[] => {
  try {
    const connections = localStorage.getItem('chiconnect-connections');
    return connections ? JSON.parse(connections) : getDefaultConnections();
  } catch {
    return getDefaultConnections();
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
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextMonth = new Date(today);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  return [
    {
      id: '1',
      title: 'Tech Networking Mixer',
      description: 'Connect with Chicago\'s tech community over drinks and appetizers. Meet startup founders, developers, and industry leaders.',
      location: 'WeWork River North',
      date: today.toISOString().split('T')[0],
      time: '6:00 PM',
      image: techNetworkingImage,
      badges: ['Community Verified', 'Black-Owned Venue'],
      host: 'Chicago Tech Collective',
      category: 'Technology'
    },
    {
      id: '2',
      title: 'Young Professionals Mixer',
      description: 'Network with ambitious young professionals across industries. Share experiences and build lasting connections.',
      location: 'The Hoxton Chicago',
      date: tomorrow.toISOString().split('T')[0],
      time: '7:00 PM',
      image: youngProfessionalsImage,
      badges: ['Community Verified', 'Trending'],
      host: 'Chicago Young Professionals',
      category: 'Networking'
    },
    {
      id: '3',
      title: 'Creative Arts Workshop',
      description: 'Hands-on workshop for artists, designers, and creative minds. Collaborate on projects and showcase your work.',
      location: 'Chicago Cultural Center',
      date: new Date(today.getTime() + 2*24*60*60*1000).toISOString().split('T')[0],
      time: '2:00 PM',
      image: creativeWorkshopImage,
      badges: ['Workshop', 'Black-Owned Venue'],
      host: 'Creative Chicago Collective',
      category: 'Arts & Culture'
    },
    {
      id: '4',
      title: 'Startup Pitch Night',
      description: 'Watch local entrepreneurs pitch their innovative ideas to investors and mentors. Network with the startup ecosystem.',
      location: '1871 Innovation Hub',
      date: new Date(today.getTime() + 3*24*60*60*1000).toISOString().split('T')[0],
      time: '7:30 PM',
      image: startupPitchImage,
      badges: ['Community Verified', 'Investor Event'],
      host: 'Chicago Startup Scene',
      category: 'Entrepreneurship'
    },
    {
      id: '5',
      title: 'Community Activism Meetup',
      description: 'Join fellow activists and community organizers to discuss social change initiatives and plan collective action.',
      location: 'Bronzeville Community Center',
      date: new Date(today.getTime() + 4*24*60*60*1000).toISOString().split('T')[0],
      time: '6:30 PM',
      image: activismMeetupImage,
      badges: ['Community Verified', 'Black-Led', 'Social Impact'],
      host: 'Change Makers Chicago',
      category: 'Activism'
    },
    {
      id: '6',
      title: 'Women in Business Brunch',
      description: 'Empowering conversations and networking for professional women. Share experiences and support each other\'s growth.',
      location: 'Alinea Restaurant',
      date: new Date(today.getTime() + 5*24*60*60*1000).toISOString().split('T')[0],
      time: '11:00 AM',
      image: womenBrunchImage,
      badges: ['Community Verified', 'Women-Led', 'Brunch'],
      host: 'Women Entrepreneurs Chicago',
      category: 'Professional'
    },
    {
      id: '7',
      title: 'Cultural Heritage Festival',
      description: 'Celebrate Chicago\'s diverse cultural heritage with food, music, art, and community connections.',
      location: 'Grant Park',
      date: nextWeek.toISOString().split('T')[0],
      time: '12:00 PM',
      image: culturalFestivalImage,
      badges: ['Community Verified', 'Cultural', 'Free Event'],
      host: 'Chicago Cultural Alliance',
      category: 'Culture'
    },
    {
      id: '8',
      title: 'Career Development Workshop',
      description: 'Level up your career with expert-led sessions on leadership, negotiation, and professional growth strategies.',
      location: 'Northwestern Kellogg',
      date: new Date(today.getTime() + 8*24*60*60*1000).toISOString().split('T')[0],
      time: '9:00 AM',
      image: careerWorkshopImage,
      badges: ['Workshop', 'Community Verified', 'Professional Development'],
      host: 'Career Catalyst Network',
      category: 'Professional'
    },
    {
      id: '9',
      title: 'Design Thinking Workshop',
      description: 'Learn design thinking methodologies through hands-on exercises. Perfect for innovators and problem-solvers.',
      location: 'Design Museum of Chicago',
      date: new Date(today.getTime() + 10*24*60*60*1000).toISOString().split('T')[0],
      time: '2:00 PM',
      image: designWorkshopImage,
      badges: ['Workshop', 'Community Verified', 'Innovation'],
      host: 'Design Thinking Chicago',
      category: 'Design'
    },
    {
      id: '10',
      title: 'Entrepreneur Coffee Meetup',
      description: 'Casual morning meetup for entrepreneurs to share experiences, challenges, and celebrate wins over great coffee.',
      location: 'Intelligentsia Coffee',
      date: new Date(today.getTime() + 12*24*60*60*1000).toISOString().split('T')[0],
      time: '8:00 AM',
      image: entrepreneurMeetupImage,
      badges: ['Community Verified', 'Coffee', 'Casual'],
      host: 'Entrepreneur Network Chicago',
      category: 'Entrepreneurship'
    },
    {
      id: '11',
      title: 'Book Club & Discussion',
      description: 'Monthly book club focusing on leadership, business, and personal development literature. Great conversations guaranteed.',
      location: 'Chicago Public Library',
      date: new Date(today.getTime() + 15*24*60*60*1000).toISOString().split('T')[0],
      time: '6:00 PM',
      image: bookClubImage,
      badges: ['Community Verified', 'Educational', 'Monthly'],
      host: 'Chicago Readers Collective',
      category: 'Education'
    },
    {
      id: '12',
      title: 'Community Garden Volunteer Day',
      description: 'Give back to the community while meeting like-minded individuals. Help maintain our neighborhood garden.',
      location: 'South Side Community Garden',
      date: nextMonth.toISOString().split('T')[0],
      time: '10:00 AM',
      image: communityGardenImage,
      badges: ['Community Verified', 'Volunteer', 'Outdoor', 'Black-Owned Venue'],
      host: 'Green Chicago Initiative',
      category: 'Community Service'
    },
  ];
}

function getDefaultConnections(): Connection[] {
  return [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Product Manager',
      company: 'TechFlow Inc',
      socialHandle: 'sarah_j_pm',
      eventId: '1',
      eventTitle: 'Tech Networking Mixer',
      addedDate: new Date(Date.now() - 86400000).toISOString(),
      avatar: 'SJ'
    },
    {
      id: '2',
      name: 'Marcus Williams',
      role: 'Software Engineer',
      company: 'Startup Labs',
      socialHandle: 'marcus_codes',
      eventId: '1',
      eventTitle: 'Tech Networking Mixer',
      addedDate: new Date(Date.now() - 86400000).toISOString(),
      avatar: 'MW'
    },
    {
      id: '3',
      name: 'Aisha Patel',
      role: 'UX Designer',
      company: 'Design Studio',
      socialHandle: 'aisha_designs',
      eventId: '3',
      eventTitle: 'Creative Arts Workshop',
      addedDate: new Date(Date.now() - 172800000).toISOString(),
      avatar: 'AP'
    },
    {
      id: '4',
      name: 'David Chen',
      role: 'Entrepreneur',
      company: 'GreenTech Solutions',
      socialHandle: 'david_greentech',
      eventId: '4',
      eventTitle: 'Startup Pitch Night',
      addedDate: new Date(Date.now() - 259200000).toISOString(),
      avatar: 'DC'
    },
    {
      id: '5',
      name: 'Maya Rodriguez',
      role: 'Community Organizer',
      company: 'Change Makers Collective',
      socialHandle: 'maya_changemaker',
      eventId: '5',
      eventTitle: 'Community Activism Meetup',
      addedDate: new Date(Date.now() - 345600000).toISOString(),
      avatar: 'MR'
    }
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