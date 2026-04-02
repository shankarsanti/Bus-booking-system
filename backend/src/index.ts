import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Export all function modules
export * from './loyalty';
export * from './notifications';
export * from './support';
export * from './refunds';
export * from './transactions';
export * from './loginHistory';

/**
 * Set custom user role claims
 * Only admins can call this function
 */
export const setUserRole = functions.https.onCall(async (data: any, context: functions.https.CallableContext) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const callerToken = context.auth.token;
  if (callerToken.role !== 'admin' && callerToken.role !== 'super_admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can set user roles');
  }

  const { uid, role } = data;

  if (!uid || typeof uid !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'User ID is required');
  }

  const validRoles = ['customer', 'agent', 'admin', 'super_admin', 'operator', 'support'];
  if (!role || !validRoles.includes(role)) {
    throw new functions.https.HttpsError('invalid-argument', `Role must be one of: ${validRoles.join(', ')}`);
  }

  try {
    await admin.auth().setCustomUserClaims(uid, { role });
    await admin.firestore().collection('users').doc(uid).update({
      role,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, message: `Role '${role}' set for user ${uid}` };
  } catch (error: any) {
    console.error('Error setting user role:', error);
    throw new functions.https.HttpsError('internal', 'Failed to set user role', error.message);
  }
});

export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  try {
    await admin.auth().setCustomUserClaims(user.uid, { role: 'customer' });
    await admin.firestore().collection('users').doc(user.uid).set({
      uid: user.uid,
      email: user.email || null,
      phone: user.phoneNumber || null,
      role: 'customer',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`User ${user.uid} created with role 'customer'`);
  } catch (error) {
    console.error('Error in onUserCreate:', error);
  }
});

export const refreshToken = functions.https.onCall(async (data: any, context: functions.https.CallableContext) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const user = await admin.auth().getUser(context.auth.uid);
    return { success: true, claims: user.customClaims || {} };
  } catch (error: any) {
    throw new functions.https.HttpsError('internal', 'Failed to refresh token', error.message);
  }
});

export const processBooking = functions.https.onCall(async (data: any, context: functions.https.CallableContext) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { tripId, seats, passengers, totalAmount } = data;

  if (!tripId || !seats || !Array.isArray(seats) || seats.length === 0) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid booking data');
  }

  try {
    const result = await admin.firestore().runTransaction(async (transaction: admin.firestore.Transaction) => {
      const tripRef = admin.firestore().collection('trips').doc(tripId);
      const tripDoc = await transaction.get(tripRef);

      if (!tripDoc.exists) {
        throw new Error('Trip not found');
      }

      const tripData = tripDoc.data();
      const availableSeats = tripData?.availableSeats || 0;

      if (availableSeats < seats.length) {
        throw new Error(`Only ${availableSeats} seats available`);
      }

      const bookingRef = admin.firestore().collection('bookings').doc();
      const bookingData = {
        userId: context.auth!.uid,
        tripId,
        seats,
        passengers,
        totalAmount,
        paymentStatus: 'pending',
        status: 'confirmed',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };

      transaction.set(bookingRef, bookingData);
      transaction.update(tripRef, {
        availableSeats: availableSeats - seats.length,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return { bookingId: bookingRef.id };
    });

    return result;
  } catch (error: any) {
    console.error('Error processing booking:', error);
    throw new functions.https.HttpsError('internal', error.message || 'Failed to process booking');
  }
});
