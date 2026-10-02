import { mapEvent } from "../api/mappers";
import { mockEvents } from "../mocks/mockEvents";
import { Event } from "../types";

export const eventsService = {
  async getEvents(): Promise<Event[]> {
    const raw = await mockEvents.getEvents();
    return raw.map(mapEvent);
  },
  async getEventById(id: string): Promise<Event | undefined> {
    const raw = await mockEvents.getEventById(id);
    return raw ? mapEvent(raw) : undefined;
  },
};
