import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const bookSeatsTransaction = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { tripId, bookingData, seatsToBook } = data;

  try {
    const db = admin.firestore();
    const result = await db.runTransaction(async (transaction) => {
      const tripRef = db.collection('trips').doc(tripId);
      const tripDoc = await transaction.get(tripRef);

      if (!tripDoc.exists) {
        throw new Error('Trip not found');
      }

      const tripData = tripDoc.data()!;
      const currentAvailableSeats = tripData.availableSeats || 0;

      if (currentAvailableSeats < seatsToBook) {
        throw new Error(`Only ${currentAvailableSeats} seats available`);
      }

      const bookingRef = db.collection('bookings').doc();
      transaction.set(bookingRef, {
        ...bookingData,
        userId: context.auth!.uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      transaction.update(tripRef, {
        availableSeats: currentAvailableSeats - seatsToBook,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return { bookingId: bookingRef.id };
    });

    return result;
  } catch (error: any) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

export const cancelBookingTransaction = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { bookingId, tripId, seatsToRestore } = data;

  try {
    const db = admin.firestore();
    await db.runTransaction(async (transaction) => {
      const bookingRef = db.collection('bookings').doc(bookingId);
      const tripRef = db.collection('trips').doc(tripId);

      const bookingDoc = await transaction.get(bookingRef);
      const tripDoc = await transaction.get(tripRef);

      if (!bookingDoc.exists) {
        throw new Error('Booking not found');
      }

      if (!tripDoc.exists) {
        throw new Error('Trip not found');
      }

      const booking = bookingDoc.data()!;
      if (booking.userId !== context.auth!.uid && context.auth!.token.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      const tripData = tripDoc.data()!;
      const currentAvailableSeats = tripData.availableSeats || 0;

      transaction.update(bookingRef, {
        status: 'cancelled',
        cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      transaction.update(tripRef, {
        availableSeats: currentAvailableSeats + seatsToRestore,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    return { success: true };
  } catch (error: any) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

export const updateWalletTransaction = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { agentId, amountChange, transactionType, description, bookingId } = data;

  if (agentId !== context.auth.uid && context.auth.token.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Cannot modify other users wallets');
  }

  try {
    const db = admin.firestore();
    await db.runTransaction(async (transaction) => {
      const walletRef = db.collection('wallets').doc(agentId);
      const walletDoc = await transaction.get(walletRef);

      let currentBalance = 0;

      if (walletDoc.exists) {
        currentBalance = walletDoc.data()!.balance || 0;
      }

      const newBalance = currentBalance + amountChange;

      if (newBalance < 0 && transactionType === 'debit') {
        throw new Error('Insufficient wallet balance');
      }

      if (walletDoc.exists) {
        transaction.update(walletRef, {
          balance: newBalance,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      } else {
        transaction.set(walletRef, {
          agentId,
          balance: newBalance,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }

      const transactionRef = db.collection('walletTransactions').doc();
      transaction.set(transactionRef, {
        agentId,
        type: transactionType,
        amount: Math.abs(amountChange),
        description,
        bookingId,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    return { success: true };
  } catch (error: any) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
