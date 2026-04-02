import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const createNotification = functions.https.onCall(async (data: any, context: functions.https.CallableContext) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userId, type, title, message, actionUrl, metadata } = data;

  try {
    const notification = {
      userId,
      type,
      title,
      message,
      actionUrl,
      metadata,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await admin.firestore().collection('notifications').add(notification);
    return { id: docRef.id, ...notification };
  } catch (error: any) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

export const getUserNotifications = functions.https.onCall(async (data: any, context: functions.https.CallableContext) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userId, unreadOnly, limitCount = 50 } = data;

  try {
    let query = admin.firestore()
      .collection('notifications')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limitCount);

    if (unreadOnly) {
      query = query.where('read', '==', false) as any;
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error: any) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

export const markNotificationRead = functions.https.onCall(async (data: any, context: functions.https.CallableContext) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { notificationId } = data;

  try {
    await admin.firestore().collection('notifications').doc(notificationId).update({ read: true });
    return { success: true };
  } catch (error: any) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

export const markAllNotificationsRead = functions.https.onCall(async (data: any, context: functions.https.CallableContext) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userId } = data;

  try {
    const snapshot = await admin.firestore()
      .collection('notifications')
      .where('userId', '==', userId)
      .where('read', '==', false)
      .get();

    const batch = admin.firestore().batch();
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { read: true });
    });

    await batch.commit();
    return { success: true, count: snapshot.size };
  } catch (error: any) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
