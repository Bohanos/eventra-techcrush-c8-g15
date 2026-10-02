// Returns RAW (snake_case) shapes. QR codes are intentionally null —
// real QR generation happens on the backend during payment integration,
// not something we fake client-side.

import { MOCK_DELAY } from "../constants/config";
import { RawBooking } from "../types";

const delay = (ms: number = MOCK_DELAY) =>
  new Promise((resolve) => setTimeout(resolve, ms));

function pad(n: number) {
  return String(n).padStart(6, "0");
}

let ticketCounter = 2; // seed ticket below uses 000001
let bookings: RawBooking[] = [
  {
    id: "bkg_seed_001",
    event_id: "evt_tech_conf_2026",
    status: "confirmed",
    total_amount: 75,
    attendee_name: "John Doe",
    tier_name: "Regular",
    quantity: 1,
    Event: {
      title: "Tech Conference 2026",
      image_url: "https://picsum.photos/seed/techconf2026/700/500",
      start_date: "2026-10-15T09:00:00Z",
      venue: "Landmark Centre, Victoria Island, Lagos",
    },
    tickets: [
      {
        id: "tkt_seed_001",
        ticket_code: "EVT-000001",
        qr_code_url: null, // ← will come from backend once payment is wired
        status: "valid",
      },
    ],
  },
];

export const mockBookings = {
  async getMyBookings(): Promise<RawBooking[]> {
    await delay(300);
    return bookings;
  },

  async getBookingById(id: string): Promise<RawBooking | undefined> {
    await delay(200);
    return bookings.find((b) => b.id === id);
  },

  async createBooking(input: {
    event_id: string;
    items: { ticket_type_id: string; quantity: number }[];
    attendee_name: string;
    // extra display-only fields our mock needs since we don't have a real DB join:
    event_title: string;
    event_image: string;
    tier_name: string;
    unit_price: number;
    start_date: string;
    venue: string;
  }): Promise<RawBooking> {
    await delay(500);
    const quantity = input.items[0]?.quantity ?? 1;

    const tickets = Array.from({ length: quantity }).map(() => {
      ticketCounter += 1;
      return {
        id: `tkt_${Date.now()}_${ticketCounter}`,
        ticket_code: `EVT-${pad(ticketCounter)}`,
        qr_code_url: null, // left empty on purpose — see note above
        status: "valid" as const,
      };
    });

    const newBooking: RawBooking = {
      id: `bkg_${Date.now()}`,
      event_id: input.event_id,
      status: "confirmed",
      total_amount: input.unit_price * quantity,
      attendee_name: input.attendee_name,
      tier_name: input.tier_name,
      quantity,
      Event: {
        title: input.event_title,
        image_url: input.event_image,
        start_date: input.start_date,
        venue: input.venue,
      },
      tickets,
    };

    bookings = [newBooking, ...bookings];
    return newBooking;
  },
};
