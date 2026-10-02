import { mapBooking } from "../api/mappers";
import { mockBookings } from "../mocks/mockBookings";
import { Booking } from "../types";

export const bookingsService = {
  async getMyBookings(): Promise<Booking[]> {
    const raw = await mockBookings.getMyBookings();
    return raw.map(mapBooking);
  },
  async getBookingById(id: string): Promise<Booking | undefined> {
    const raw = await mockBookings.getBookingById(id);
    return raw ? mapBooking(raw) : undefined;
  },
  async createBooking(input: {
    eventId: string;
    ticketTypeId: string;
    quantity: number;
    attendeeName: string;
    eventTitle: string;
    eventImage: string;
    tierName: string;
    unitPrice: number;
    startDate: string;
    venue: string;
  }): Promise<Booking> {
    const raw = await mockBookings.createBooking({
      event_id: input.eventId,
      items: [{ ticket_type_id: input.ticketTypeId, quantity: input.quantity }],
      attendee_name: input.attendeeName,
      event_title: input.eventTitle,
      event_image: input.eventImage,
      tier_name: input.tierName,
      unit_price: input.unitPrice,
      start_date: input.startDate,
      venue: input.venue,
    });
    return mapBooking(raw);
  },
};
