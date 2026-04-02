import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

function calculateCancellationCharges(bookingAmount: number, hoursBeforeDeparture: number): number {
  if (hoursBeforeDeparture >= 48) return bookingAmount * 0.1;
  if (hoursBeforeDeparture >= 24) return bookingAmount * 0.25;
  if (hoursBeforeDeparture >= 12) return bookingAmount * 0.5;
  if (hoursBeforeDeparture >= 6) return bookingAmount * 0.75;
  return bookingAmount;
}

function generateRefundId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `REF-${timestamp}-${random}`.toUpperCase();
}

export const createRefund = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { bookingId, reason } = data;
  const userId = context.auth.uid;

  try {
    const db = admin.firestore();
    const bookingRef = db.collection('bookings').doc(bookingId);
    const bookingSnap = await bookingRef.get();

    if (!bookingSnap.exists) {
      throw new Error('Booking not found');
    }

    const booking = bookingSnap.data()!;

    if (booking.userId !== userId) {
      throw new Error('Unauthorized');
    }

    if (booking.status === 'cancelled') {
      throw new Error('Booking is already cancelled');
    }

    const existingRefund = await db.collection('refunds').where('bookingId', '==', bookingId).get();
    if (!existingRefund.empty) {
      throw new Error('Refund request already exists');
    }

    const tripSnap = await db.collection('trips').doc(booking.tripId).get();
    if (!tripSnap.exists) {
      throw new Error('Trip not found');
    }

    const trip = tripSnap.data()!;
    const departureDateTime = new Date(`${trip.date} ${trip.departureTime}`);
    const hoursBeforeDeparture = (departureDateTime.getTime() - Date.now()) / (1000 * 60 * 60);

    const cancellationCharges = calculateCancellationCharges(booking.totalAmount, hoursBeforeDeparture);
    const refundAmount = booking.totalAmount - cancellationCharges;

    const refund = {
      refundId: generateRefundId(),
      bookingId,
      userId,
      amount: booking.totalAmount,
      reason,
      cancellationCharges,
      refundAmount,
      status: 'pending',
      paymentMethod: 'original',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const refundRef = await db.collection('refunds').add(refund);
    await bookingRef.update({ status: 'cancelled', paymentStatus: 'refunded' });

    return { id: refundRef.id, ...refund };
  } catch (error: any) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

export const processRefund = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const token = context.auth.token;
  if (token.role !== 'admin' && token.role !== 'support') {
    throw new functions.https.HttpsError('permission-denied', 'Only admin/support can process refunds');
  }

  const { refundId, status, remarks } = data;

  try {
    const db = admin.firestore();
    const refundRef = db.collection('refunds').doc(refundId);
    const refundSnap = await refundRef.get();

    if (!refundSnap.exists) {
      throw new Error('Refund not found');
    }

    const refund = refundSnap.data()!;

    if (refund.status !== 'pending' && refund.status !== 'processing') {
      throw new Error('Refund already processed');
    }

    await refundRef.update({
      status,
      processedBy: context.auth.uid,
      remarks,
      processedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    if (status === 'rejected') {
      await db.collection('bookings').doc(refund.bookingId).update({
        status: 'confirmed',
        paymentStatus: 'completed'
      });
    }

    return { success: true };
  } catch (error: any) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
