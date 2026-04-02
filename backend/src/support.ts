import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

function generateTicketNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `TKT-${timestamp}-${random}`.toUpperCase();
}

export const createSupportTicket = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { bookingId, category, priority, subject, description, attachments } = data;
  const userId = context.auth.uid;

  try {
    const ticket = {
      ticketNumber: generateTicketNumber(),
      userId,
      bookingId,
      category,
      priority,
      subject,
      description,
      status: 'open',
      messages: [],
      attachments,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await admin.firestore().collection('supportTickets').add(ticket);
    return { id: docRef.id, ...ticket };
  } catch (error: any) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

export const addTicketMessage = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { ticketId, message, attachments } = data;
  const userId = context.auth.uid;
  const userRole = context.auth.token.role || 'customer';

  try {
    const ticketRef = admin.firestore().collection('supportTickets').doc(ticketId);
    const ticketSnap = await ticketRef.get();

    if (!ticketSnap.exists) {
      throw new Error('Ticket not found');
    }

    const newMessage = {
      id: `msg_${Date.now()}`,
      userId,
      userRole,
      message,
      attachments,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await ticketRef.update({
      messages: admin.firestore.FieldValue.arrayUnion(newMessage),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, message: newMessage };
  } catch (error: any) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

export const updateTicketStatus = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { ticketId, status } = data;

  try {
    const updateData: any = {
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (status === 'resolved' || status === 'closed') {
      updateData.resolvedAt = admin.firestore.FieldValue.serverTimestamp();
    }

    await admin.firestore().collection('supportTickets').doc(ticketId).update(updateData);
    return { success: true };
  } catch (error: any) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

export const assignTicket = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const token = context.auth.token;
  if (token.role !== 'admin' && token.role !== 'support') {
    throw new functions.https.HttpsError('permission-denied', 'Only admin/support can assign tickets');
  }

  const { ticketId, assignedTo } = data;

  try {
    await admin.firestore().collection('supportTickets').doc(ticketId).update({
      assignedTo,
      status: 'in_progress',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true };
  } catch (error: any) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
