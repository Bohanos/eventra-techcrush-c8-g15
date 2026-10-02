export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarInitials?: string;
}

export interface AuthSession {
  user: User;
  token: string;
}

export interface Event {
  id: string;
  title: string;
  category: string;
  image: string;
  dateLabel: string;
  time: string;
  venue: string;
  city: string;
  priceFrom: number;
  seatsLeft?: number;
  description?: string;
  organizerName?: string;
}

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  perks: string[];
  badge?: string;
}

export type TicketStatus = 'upcoming' | 'past';

export interface Ticket {
  id: string;
  eventId: string;
  eventTitle: string;
  eventImage: string;
  tierName: string;
  quantity: number;
  status: TicketStatus;
  dateLabel: string;
  time: string;
  venue: string;
  gate?: string;
  seatArea?: string;
  attendeeName: string;
  qrValue: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
}