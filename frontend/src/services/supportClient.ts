import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

export const supportClient = {
  async createTicket(data: {
    bookingId?: string;
    category: string;
    priority: string;
    subject: string;
    description: string;
    attachments?: string[];
  }) {
    const fn = httpsCallable(functions, 'createSupportTicket');
    const result = await fn(data);
    return result.data;
  },

  async addMessage(ticketId: string, message: string, attachments?: string[]) {
    const fn = httpsCallable(functions, 'addTicketMessage');
    const result = await fn({ ticketId, message, attachments });
    return result.data;
  },

  async updateStatus(ticketId: string, status: string) {
    const fn = httpsCallable(functions, 'updateTicketStatus');
    const result = await fn({ ticketId, status });
    return result.data;
  },

  async assignTicket(ticketId: string, assignedTo: string) {
    const fn = httpsCallable(functions, 'assignTicket');
    const result = await fn({ ticketId, assignedTo });
    return result.data;
  }
};
