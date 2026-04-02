import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

export const notificationClient = {
  async createNotification(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    actionUrl?: string;
    metadata?: Record<string, any>;
  }) {
    const fn = httpsCallable(functions, 'createNotification');
    const result = await fn(data);
    return result.data;
  },

  async getUserNotifications(userId: string, unreadOnly?: boolean, limitCount?: number) {
    const fn = httpsCallable(functions, 'getUserNotifications');
    const result = await fn({ userId, unreadOnly, limitCount });
    return result.data;
  },

  async markNotificationRead(notificationId: string) {
    const fn = httpsCallable(functions, 'markNotificationRead');
    const result = await fn({ notificationId });
    return result.data;
  },

  async markAllNotificationsRead(userId: string) {
    const fn = httpsCallable(functions, 'markAllNotificationsRead');
    const result = await fn({ userId });
    return result.data;
  }
};
