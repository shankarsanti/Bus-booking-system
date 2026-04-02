import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const saveLoginHistory = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userRole, loginMethod, email, phone, userAgent, deviceInfo, status, failureReason } = data;

  try {
    const loginRecord = {
      userId: context.auth.uid,
      userRole,
      loginMethod,
      email,
      phone,
      userAgent,
      deviceInfo,
      loginTime: admin.firestore.FieldValue.serverTimestamp(),
      status,
      failureReason
    };

    const docRef = await admin.firestore().collection('loginHistory').add(loginRecord);
    return { id: docRef.id, success: true };
  } catch (error: any) {
    console.error('Failed to save login history:', error);
    return { success: false, error: error.message };
  }
});

export const getUserLoginHistory = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userId, limitCount = 10 } = data;
  const requestedUserId = userId || context.auth.uid;

  if (requestedUserId !== context.auth.uid && context.auth.token.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Cannot view other users login history');
  }

  try {
    const snapshot = await admin.firestore()
      .collection('loginHistory')
      .where('userId', '==', requestedUserId)
      .orderBy('loginTime', 'desc')
      .limit(limitCount)
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error: any) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

export const getAllLoginHistory = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  if (context.auth.token.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can view all login history');
  }

  const { limitCount = 50 } = data;

  try {
    const snapshot = await admin.firestore()
      .collection('loginHistory')
      .orderBy('loginTime', 'desc')
      .limit(limitCount)
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error: any) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
