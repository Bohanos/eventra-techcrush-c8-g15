import { Event, TicketTier } from '../types';

export const mockEvents: Event[] = [
  {
    id: 'evt_tech_conf_2026',
    title: 'Tech Conference 2026',
    category: 'Tech & Innovation',
    image: 'https://picsum.photos/seed/techconf2026/700/500',
    dateLabel: 'Sat, Oct 12, 2026',
    time: '10:00 AM – 6:00 PM WAT',
    venue: 'Landmark Centre, Victoria Island, Lagos',
    city: 'Lagos',
    priceFrom: 15000,
    seatsLeft: 4,
    description:
      'Tech Conference 2026 convenes over 1,500 software architects, fintech visionaries, and startup founders. Immerse yourself in high-impact tracks spanning sovereign AI infrastructure, real-time cross-border payment protocols, and enterprise cloud resilience.',
    organizerName: 'Apex Live Events NG',
  },
  {
    id: 'evt_lagos_food_fest',
    title: 'Lagos Food & Culture Festival',
    category: 'Food & Drink',
    image: 'https://picsum.photos/seed/lagosfoodfest/700/500',
    dateLabel: 'Thu, Nov 5, 2026',
    time: '12:00 PM',
    venue: 'Muri Okunola Park, Victoria Island',
    city: 'Lagos',
    priceFrom: 5000,
    description: 'A day of Nigerian street food, live cooking stations, and culture showcases from across the country.',
    organizerName: 'Culture Collective',
  },
  {
    id: 'evt_comedy_night',
    title: 'Lagos Comedy & Vibes Night',
    category: 'Performing Arts',
    image: 'https://picsum.photos/seed/comedynight/700/500',
    dateLabel: 'Fri, Oct 30, 2026',
    time: '7:00 PM',
    venue: 'Terra Kulture, Victoria Island',
    city: 'Lagos',
    priceFrom: 8000,
    description: "An evening of stand-up comedy from Lagos's top rising comedians.",
    organizerName: 'Vibes Entertainment',
  },
  {
    id: 'evt_art_expo',
    title: 'Nike Art Gallery Horizon Expo',
    category: 'Arts & Culture',
    image: 'https://picsum.photos/seed/artexpo/700/500',
    dateLabel: 'Sun, Nov 15, 2026',
    time: '10:00 AM',
    venue: 'Nike Art Gallery, Lekki Phase 1',
    city: 'Lagos',
    priceFrom: 3000,
    description: 'A curated exhibition of contemporary Nigerian visual art and sculpture.',
    organizerName: 'Nike Art Gallery',
  },
];

export const ticketTiersByEvent: Record<string, TicketTier[]> = {
  evt_tech_conf_2026: [
    {
      id: 'tier_regular',
      name: 'Regular Pass',
      price: 15000,
      badge: 'Popular',
      perks: ['Keynote Hall Access', 'Buffet Lunch & Coffee', 'Digital Badge'],
    },
    {
      id: 'tier_vip',
      name: 'VIP All-Access',
      price: 40000,
      badge: 'Priority',
      perks: ['All Regular Perks', 'VIP Lounge Bar', 'Fast-Track Entry'],
    },
    {
      id: 'tier_vvip',
      name: 'Executive VVIP',
      price: 75000,
      perks: ['Private Speaker Dinner', '1-on-1 VC Roundtable'],
    },
  ],
};

export function getMockEventById(id: string): Event | undefined {
  return mockEvents.find((e) => e.id === id);
}

export function getMockTiersForEvent(event: Event): TicketTier[] {
  return (
    ticketTiersByEvent[event.id] ?? [
      {
        id: 'tier_general',
        name: 'General Admission',
        price: event.priceFrom,
        perks: ['Entry to event'],
      },
    ]
  );
}