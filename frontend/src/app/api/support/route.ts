import { collection, addDoc, query, where, getDocs, updateDoc, doc, getDoc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SupportTicket, TicketMessage } from '@/types/features';

export interface CreateTicketRequest {
  userId: string;
  bookingId?: string;
  category: SupportTicket['category'];
  priority: SupportTicket['priority'];
  subject: string;
  description: string;
  attachments?: string[];
}

export interface AddMessageRequest {
  ticketId: string;
  userId: string;
  userRole: string;
  message: string;
  attachments?: string[];
}

// Generate ticket number
function generateTicketNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `TKT-${timestamp}-${random}`.toUpperCase();
}

// Create support ticket
export async function createSupportTicket(data: CreateTicketRequest) {
  try {
    const ticketNumber = generateTicketNumber();

    const ticket: Omit<SupportTicket, 'id'> = {
      ticketNumber,
      userId: data.userId,
      bookingId: data.bookingId,
      category: data.category,
      priority: data.priority,
      subject: data.subject,
      description: data.description,
      status: 'open',
      messages: [],
      attachments: data.attachments,
      createdAt: new Date() as any,
      updatedAt: new Date() as any
    };

    const docRef = await addDoc(collection(db, 'supportTickets'), ticket);
    return { id: docRef.id, ...ticket };
  } catch (error) {
    console.error('Error creating support ticket:', error);
    throw new Error('Failed to create support ticket');
  }
}

// Get ticket by ID
export async function getSupportTicket(ticketId: string) {
  try {
    const ticketRef = doc(db, 'supportTickets', ticketId);
    const ticketSnap = await getDoc(ticketRef);

    if (!ticketSnap.exists()) {
      throw new Error('Ticket not found');
    }

    return { id: ticketSnap.id, ...ticketSnap.data() } as SupportTicket;
  } catch (error: any) {
    console.error('Error fetching ticket:', error);
    throw new Error(error.message || 'Failed to fetch ticket');
  }
}

// Get user tickets
export async function getUserTickets(userId: string) {
  try {
    const q = query(
      collection(db, 'supportTickets'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SupportTicket));
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    throw new Error('Failed to fetch tickets');
  }
}

// Get all tickets (for support staff/admin)
export async function getAllTickets(filters?: {
  status?: SupportTicket['status'];
  category?: SupportTicket['category'];
  priority?: SupportTicket['priority'];
  assignedTo?: string;
}) {
  try {
    let q = query(collection(db, 'supportTickets'), orderBy('createdAt', 'desc'));

    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }

    if (filters?.category) {
      q = query(q, where('category', '==', filters.category));
    }

    if (filters?.priority) {
      q = query(q, where('priority', '==', filters.priority));
    }

    if (filters?.assignedTo) {
      q = query(q, where('assignedTo', '==', filters.assignedTo));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SupportTicket));
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw new Error('Failed to fetch tickets');
  }
}

// Add message to ticket
export async function addTicketMessage(data: AddMessageRequest) {
  try {
    const ticket = await getSupportTicket(data.ticketId);

    const newMessage: TicketMessage = {
      id: `msg_${Date.now()}`,
      userId: data.userId,
      userRole: data.userRole,
      message: data.message,
      attachments: data.attachments,
      createdAt: new Date() as any
    };

    const updatedMessages = [...ticket.messages, newMessage];

    const ticketRef = doc(db, 'supportTickets', data.ticketId);
    await updateDoc(ticketRef, {
      messages: updatedMessages,
      updatedAt: new Date()
    });

    return { success: true, message: newMessage };
  } catch (error: any) {
    console.error('Error adding message:', error);
    throw new Error(error.message || 'Failed to add message');
  }
}

// Update ticket status
export async function updateTicketStatus(
  ticketId: string,
  status: SupportTicket['status']
) {
  try {
    const ticketRef = doc(db, 'supportTickets', ticketId);
    const updateData: any = {
      status,
      updatedAt: new Date()
    };

    if (status === 'resolved' || status === 'closed') {
      updateData.resolvedAt = new Date();
    }

    await updateDoc(ticketRef, updateData);
    return { success: true };
  } catch (error) {
    console.error('Error updating ticket status:', error);
    throw new Error('Failed to update ticket status');
  }
}

// Assign ticket to support staff
export async function assignTicket(ticketId: string, assignedTo: string) {
  try {
    const ticketRef = doc(db, 'supportTickets', ticketId);
    await updateDoc(ticketRef, {
      assignedTo,
      status: 'in_progress',
      updatedAt: new Date()
    });

    return { success: true };
  } catch (error) {
    console.error('Error assigning ticket:', error);
    throw new Error('Failed to assign ticket');
  }
}

// Update ticket priority
export async function updateTicketPriority(
  ticketId: string,
  priority: SupportTicket['priority']
) {
  try {
    const ticketRef = doc(db, 'supportTickets', ticketId);
    await updateDoc(ticketRef, {
      priority,
      updatedAt: new Date()
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating ticket priority:', error);
    throw new Error('Failed to update ticket priority');
  }
}

// Get ticket statistics
export async function getTicketStats() {
  try {
    const snapshot = await getDocs(collection(db, 'supportTickets'));
    const tickets = snapshot.docs.map(doc => doc.data() as SupportTicket);

    return {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      inProgress: tickets.filter(t => t.status === 'in_progress').length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
      closed: tickets.filter(t => t.status === 'closed').length,
      byPriority: {
        urgent: tickets.filter(t => t.priority === 'urgent').length,
        high: tickets.filter(t => t.priority === 'high').length,
        medium: tickets.filter(t => t.priority === 'medium').length,
        low: tickets.filter(t => t.priority === 'low').length
      },
      byCategory: {
        booking: tickets.filter(t => t.category === 'booking').length,
        payment: tickets.filter(t => t.category === 'payment').length,
        refund: tickets.filter(t => t.category === 'refund').length,
        technical: tickets.filter(t => t.category === 'technical').length,
        feedback: tickets.filter(t => t.category === 'feedback').length,
        other: tickets.filter(t => t.category === 'other').length
      }
    };
  } catch (error) {
    console.error('Error fetching ticket stats:', error);
    throw new Error('Failed to fetch ticket statistics');
  }
}
