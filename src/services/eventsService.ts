import { getMockEventById, mockEvents } from '../mocks/mockEvents';
import { Event } from '../types';

// USE_MOCK is true everywhere right now — once backend exists, branch
// here to call the real API client instead. Screens never need to change.
export const eventsService = {
  async getEvents(): Promise<Event[]> {
    return mockEvents;
  },
  async getEventById(id: string): Promise<Event | undefined> {
    return getMockEventById(id);
  },
};