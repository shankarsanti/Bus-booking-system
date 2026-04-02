import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

export const loginHistoryClient = {
  async saveLoginInfo(data: {
    userRole: string;
    loginMethod: 'email_password' | 'phone_otp';
    email?: string;
    phone?: string;
    userAgent?: string;
    deviceInfo?: string;
    status: 'success' | 'failed';
    failureReason?: string;
  }) {
    const fn = httpsCallable(functions, 'saveLoginHistory');
    const result = await fn(data);
    return result.data;
  },

  async getUserLoginHistory(userId?: string, limitCount?: number) {
    const fn = httpsCallable(functions, 'getUserLoginHistory');
    const result = await fn({ userId, limitCount });
    return result.data;
  },

  async getAllLoginHistory(limitCount?: number) {
    const fn = httpsCallable(functions, 'getAllLoginHistory');
    const result = await fn({ limitCount });
    return result.data;
  }
};
