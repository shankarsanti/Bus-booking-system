import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

export const refundClient = {
  async createRefund(bookingId: string, reason: string) {
    const fn = httpsCallable(functions, 'createRefund');
    const result = await fn({ bookingId, reason });
    return result.data;
  },

  async processRefund(refundId: string, status: 'completed' | 'rejected', remarks?: string) {
    const fn = httpsCallable(functions, 'processRefund');
    const result = await fn({ refundId, status, remarks });
    return result.data;
  }
};
