import { mockTickets } from '../mocks/mockTickets';
import { Ticket } from '../types';

export const ticketsService = {
  async getMyTickets(): Promise<Ticket[]> {
    return mockTickets.getMyTickets();
  },
  async getTicketById(id: string): Promise<Ticket | undefined> {
    return mockTickets.getTicketById(id);
  },
  async bookTicket(data: Parameters<typeof mockTickets.addTicket>[0]): Promise<Ticket> {
    return mockTickets.addTicket(data);
  },
};