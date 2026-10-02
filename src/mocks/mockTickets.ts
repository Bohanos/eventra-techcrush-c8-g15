import { MOCK_DELAY } from '../constants/config';
import { Ticket } from '../types';

const delay = (ms: number = MOCK_DELAY) =>
  new Promise((resolve) => setTimeout(resolve, ms));

function randomRef(eventSuffix: string) {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `EVT-${num}-${eventSuffix}`;
}

// In-memory store so booking a ticket during the demo shows up
// instantly in the Tickets tab. Resets on app restart — fine for now,
// will be swapped for a real API call later.
let tickets: Ticket[] = [
  {
    id: 'tkt_seed_001',
    eventId: 'evt_tech_conf_2026',
    eventTitle: 'Tech Conference 2026',
    eventImage: 'https://picsum.photos/seed/techconf2026/700/500',
    tierName: 'Regular Pass',
    quantity: 1,
    status: 'upcoming',
    dateLabel: 'Sat, Oct 12, 2026',
    time: '10:00 AM – 6:00 PM',
    venue: 'Landmark Centre, Victoria Island, Lagos',
    gate: 'Gate 2 (Hall A)',
    seatArea: 'General Keynote',
    attendeeName: 'John Doe',
    qrValue: 'EVT-928374-TC26',
  },
];

export const mockTickets = {
  async getMyTickets(): Promise<Ticket[]> {
    await delay(300);
    return tickets;
  },

  async getTicketById(id: string): Promise<Ticket | undefined> {
    await delay(200);
    return tickets.find((t) => t.id === id);
  },

  async addTicket(data: {
    eventId: string;
    eventTitle: string;
    eventImage: string;
    tierName: string;
    quantity: number;
    dateLabel: string;
    time: string;
    venue: string;
    attendeeName: string;
  }): Promise<Ticket> {
    await delay(400);
    const newTicket: Ticket = {
      id: `tkt_${Date.now()}`,
      status: 'upcoming',
      gate: 'Gate 1 (Main Entrance)',
      seatArea: 'General Admission',
      qrValue: randomRef(data.eventId.slice(-4).toUpperCase()),
      ...data,
    };
    tickets = [newTicket, ...tickets];
    return newTicket;
  },
};