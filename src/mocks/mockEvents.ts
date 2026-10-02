// Returns RAW (snake_case) shapes, simulating the real API response —
// so the services layer's mapping logic gets exercised even on mocks.

import { MOCK_DELAY } from "../constants/config";
import { RawEvent } from "../types";

const delay = (ms: number = MOCK_DELAY) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// These 5 match backend's actual seeded test data (see handoff doc) —
// titles, capacity, start_date, and ticket prices are real; venue/city/image
// are placeholders since backend hasn't documented those fields yet.
const rawEvents: RawEvent[] = [
  {
    id: "evt_tech_conf_2026",
    title: "Tech Conference 2026",
    description:
      "Tech Conference 2026 convenes software architects, fintech visionaries, and startup founders for a day of high-impact talks.",
    start_date: "2026-10-15T09:00:00Z",
    capacity: 500,
    category: "Technology",
    venue: "Landmark Centre, Victoria Island, Lagos", // ⚠ placeholder
    city: "Lagos", // ⚠ placeholder
    image_url: "https://picsum.photos/seed/techconf2026/700/500", // ⚠ placeholder
    organizer_name: "Apex Live Events NG", // ⚠ placeholder
    ticket_types: [
      { id: "tt_early_bird", name: "Early Bird", price: 50 },
      { id: "tt_regular", name: "Regular", price: 75 },
      { id: "tt_vip", name: "VIP", price: 150 },
    ],
  },
  {
    id: "evt_music_fest_2026",
    title: "Music Festival 2026",
    description:
      "A weekend-long celebration of live music across multiple stages.",
    start_date: "2026-11-20T18:00:00Z",
    capacity: 5000,
    category: "Music",
    venue: "Eko Convention Centre, Lagos",
    city: "Lagos",
    image_url: "https://picsum.photos/seed/musicfest2026/700/500",
    organizer_name: "Vibes Entertainment",
    ticket_types: [
      { id: "tt_general", name: "General", price: 60 },
      { id: "tt_vip_music", name: "VIP", price: 200 },
    ],
  },
  {
    id: "evt_biz_networking",
    title: "Business Networking",
    description:
      "An evening of structured networking for founders and operators.",
    start_date: "2026-10-10T19:00:00Z",
    capacity: 100,
    category: "Business & Professional",
    venue: "Terra Kulture, Victoria Island",
    city: "Lagos",
    image_url: "https://picsum.photos/seed/biznetworking/700/500",
    organizer_name: "Founders Circle",
    ticket_types: [{ id: "tt_attendee", name: "Attendee", price: 0 }],
  },
  {
    id: "evt_sports_marathon",
    title: "Sports Marathon",
    description:
      "An annual road race through the city with 10K and 5K categories.",
    start_date: "2026-10-25T06:00:00Z",
    capacity: 2000,
    category: "Sports & Fitness",
    venue: "National Stadium, Lagos",
    city: "Lagos",
    image_url: "https://picsum.photos/seed/sportsmarathon/700/500",
    organizer_name: "Lagos Runners Club",
    ticket_types: [
      { id: "tt_10k", name: "10K Run", price: 30 },
      { id: "tt_5k", name: "5K Run", price: 20 },
    ],
  },
  {
    id: "evt_art_expo",
    title: "Art Exhibition",
    description: "A curated exhibition of contemporary Nigerian visual art.",
    start_date: "2026-10-05T18:00:00Z",
    capacity: 300,
    category: "Arts & Culture",
    venue: "Nike Art Gallery, Lekki Phase 1",
    city: "Lagos",
    image_url: "https://picsum.photos/seed/artexpo/700/500",
    organizer_name: "Nike Art Gallery",
    ticket_types: [{ id: "tt_standard", name: "Standard", price: 25 }],
  },
];

export const mockEvents = {
  async getEvents(): Promise<RawEvent[]> {
    await delay(300);
    return rawEvents;
  },
  async getEventById(id: string): Promise<RawEvent | undefined> {
    await delay(200);
    return rawEvents.find((e) => e.id === id);
  },
};
