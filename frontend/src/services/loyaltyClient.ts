import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

export const loyaltyClient = {
  async getLoyaltyAccount(userId?: string) {
    const fn = httpsCallable(functions, 'getLoyaltyAccount');
    const result = await fn({ userId });
    return result.data;
  },

  async addPoints(userId: string, points: number, reason: string, bookingId?: string) {
    const fn = httpsCallable(functions, 'addLoyaltyPoints');
    const result = await fn({ userId, points, reason, bookingId });
    return result.data;
  },

  async redeemPoints(userId: string, points: number, reason: string, bookingId?: string) {
    const fn = httpsCallable(functions, 'redeemLoyaltyPoints');
    const result = await fn({ userId, points, reason, bookingId });
    return result.data;
  }
};
