// Converts raw snake_case backend responses into camelCase app types.
// This is the ONLY place that should know the backend's exact field names —
// screens and components never see Raw* types.

import {
    Booking,
    BookingDisplayStatus,
    Event,
    RawBooking,
    RawEvent,
    RawUser,
    TicketType,
    User,
} from "../types";

export function mapUser(raw: RawUser): User {
  return {
    id: raw.id,
    firstName: raw.first_name,
    lastName: raw.last_name,
    email: raw.email,
    phone: raw.phone,
    bio: raw.bio,
    profilePictureUrl: raw.profile_picture_url,
    isVerified: raw.is_verified,
    avatarInitials:
      `${raw.first_name?.[0] ?? ""}${raw.last_name?.[0] ?? ""}`.toUpperCase(),
  };
}

function formatDateLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTimeLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function mapEvent(raw: RawEvent): Event {
  const ticketTypes: TicketType[] = (raw.ticket_types ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    price: t.price,
    perks: [], // not provided by backend — UI-only, fill manually if needed
  }));

  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    category: raw.category ?? "General",
    venue: raw.venue ?? "Venue TBD",
    city: raw.city ?? "Lagos",
    image: raw.image_url ?? `https://picsum.photos/seed/${raw.id}/700/500`,
    startDate: raw.start_date,
    capacity: raw.capacity,
    organizerName: raw.organizer_name,
    ticketTypes,
    dateLabel: formatDateLabel(raw.start_date),
    time: formatTimeLabel(raw.start_date),
    priceFrom: ticketTypes.length
      ? Math.min(...ticketTypes.map((t) => t.price))
      : 0,
  };
}

function deriveDisplayStatus(
  startDateIso: string | undefined,
): BookingDisplayStatus {
  if (!startDateIso) return "upcoming";
  return new Date(startDateIso).getTime() >= Date.now() ? "upcoming" : "past";
}

export function mapBooking(raw: RawBooking): Booking {
  return {
    id: raw.id,
    eventId: raw.event_id,
    eventTitle: raw.Event?.title ?? "Event",
    eventImage:
      raw.Event?.image_url ??
      `https://picsum.photos/seed/${raw.event_id}/700/500`,
    tierName: raw.tier_name ?? "Ticket",
    quantity: raw.quantity ?? raw.tickets?.length ?? 1,
    status: raw.status,
    displayStatus: deriveDisplayStatus(raw.Event?.start_date),
    dateLabel: raw.Event?.start_date
      ? formatDateLabel(raw.Event.start_date)
      : "",
    time: raw.Event?.start_date ? formatTimeLabel(raw.Event.start_date) : "",
    venue: raw.Event?.venue ?? "Venue TBD",
    attendeeName: raw.attendee_name,
    totalAmount: raw.total_amount,
    tickets: (raw.tickets ?? []).map((t) => ({
      id: t.id,
      ticketCode: t.ticket_code,
      qrCodeUrl: t.qr_code_url,
      status: t.status,
    })),
  };
}
