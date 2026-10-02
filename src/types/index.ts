// APP TYPES (camelCase) — what screens actually use.
// RAW TYPES (snake_case) — the shape the real backend sends.
// api/mappers.ts converts Raw -> App at the service boundary,
// so screens never touch snake_case.

// ---------- APP TYPES ----------

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  profilePictureUrl?: string;
  avatarInitials?: string;
  isVerified?: boolean;
}

export interface AuthSession {
  user: User;
  token: string;
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
  perks: string[]; // UI-only — not confirmed in backend docs, kept for Figma parity
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string; // ⚠ unconfirmed field name — verify with backend
  venue: string; // ⚠ unconfirmed
  city: string; // ⚠ unconfirmed
  image: string; // ⚠ unconfirmed — may not exist until image upload is built
  startDate: string; // ISO string from backend (start_date)
  capacity: number;
  organizerName?: string; // ⚠ unconfirmed
  ticketTypes: TicketType[];
  dateLabel: string; // derived from startDate for display
  time: string; // derived from startDate for display
  priceFrom: number; // derived: lowest ticketTypes price
}

export type TicketStatus = "valid" | "used" | "expired" | "cancelled";
export type BookingStatus = "confirmed" | "pending" | "cancelled";
export type BookingDisplayStatus = "upcoming" | "past"; // app-only, for the Tickets tab tabs

export interface Ticket {
  id: string;
  ticketCode: string;
  qrCodeUrl: string | null; // null until payment/QR integration is wired
  status: TicketStatus;
}

export interface Booking {
  id: string;
  eventId: string;
  eventTitle: string;
  eventImage: string;
  tierName: string;
  quantity: number;
  status: BookingStatus;
  displayStatus: BookingDisplayStatus;
  dateLabel: string;
  time: string;
  venue: string;
  gate?: string; // UI-only, not from backend
  seatArea?: string; // UI-only, not from backend
  attendeeName: string;
  totalAmount: number;
  tickets: Ticket[];
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

// ---------- RAW API TYPES (snake_case, as backend sends them) ----------

export interface RawUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role?: string;
  bio?: string;
  profile_picture_url?: string;
  phone?: string;
  is_verified?: boolean;
  created_at?: string;
}

export interface RawTicketType {
  id: string;
  name: string;
  price: number;
}

export interface RawEvent {
  id: string;
  title: string;
  description: string;
  start_date: string;
  capacity: number;
  category?: string;
  venue?: string;
  city?: string;
  image_url?: string;
  organizer_name?: string;
  ticket_types: RawTicketType[];
}

export interface RawTicket {
  id: string;
  ticket_code: string;
  qr_code_url: string | null;
  status: TicketStatus;
}

export interface RawBooking {
  id: string;
  event_id: string;
  status: BookingStatus;
  total_amount: number;
  attendee_name: string;
  Event?: {
    title: string;
    image_url?: string;
    start_date: string;
    venue?: string;
  };
  tier_name?: string; // ⚠ reconstructed — not shown verbatim in docs
  quantity?: number;
  tickets: RawTicket[];
}
