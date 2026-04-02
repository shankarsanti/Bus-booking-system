import { collection, addDoc, query, where, getDocs, updateDoc, doc, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Notification } from '@/types/features';

export interface CreateNotificationRequest {
  userId: string;
  type: Notification['type'];
  title: string;
  message: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface GetNotificationsRequest {
  userId: string;
  unreadOnly?: boolean;
  limit?: number;
}

// Create notification
export async function createNotification(data: CreateNotificationRequest) {
  try {
    const notification: Omit<Notification, 'id'> = {
      ...data,
      read: false,
      createdAt: new Date() as any
    };

    const docRef = await addDoc(collection(db, 'notifications'), notification);
    return { id: docRef.id, ...notification };
  } catch (error) {
    console.error('Error creating notification:', error);
    throw new Error('Failed to create notification');
  }
}

// Get user notifications
export async function getUserNotifications(params: GetNotificationsRequest) {
  try {
    let q = query(
      collection(db, 'notifications'),
      where('userId', '==', params.userId),
      orderBy('createdAt', 'desc')
    );

    if (params.unreadOnly) {
      q = query(q, where('read', '==', false));
    }

    if (params.limit) {
      q = query(q, limit(params.limit));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw new Error('Failed to fetch notifications');
  }
}

// Mark notification as read
export async function markNotificationRead(notificationId: string) {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, { read: true });
    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw new Error('Failed to update notification');
  }
}

// Mark all notifications as read
export async function markAllNotificationsRead(userId: string) {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );

    const snapshot = await getDocs(q);
    const updates = snapshot.docs.map(doc =>
      updateDoc(doc.ref, { read: true })
    );

    await Promise.all(updates);
    return { success: true, count: updates.length };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw new Error('Failed to update notifications');
  }
}
