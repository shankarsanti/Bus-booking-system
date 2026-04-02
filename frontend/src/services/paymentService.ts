import { firestoreService } from '../lib/firestore';

export interface Payment {
  id?: string;
  bookingId: string;
  userId: string;
  amount: number;
  method: 'card' | 'upi' | 'netbanking' | 'wallet' | 'cash';
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  timestamp: Date;
}

export const paymentService = {
  async initiatePayment(payment: Omit<Payment, 'timestamp'>) {
    return await firestoreService.create('payments', {
      ...payment,
      timestamp: new Date()
    });
  },

  async getPayment(paymentId: string) {
    return await firestoreService.read('payments', paymentId);
  },

  async updatePaymentStatus(
    paymentId: string, 
    status: Payment['status'], 
    transactionId?: string
  ) {
    return await firestoreService.update('payments', paymentId, {
      status,
      transactionId
    });
  },

  async processPayment(paymentId: string): Promise<boolean> {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const success = Math.random() > 0.1; // 90% success rate
    await paymentService.updatePaymentStatus(
      paymentId,
      success ? 'completed' : 'failed',
      success ? `TXN${Date.now()}` : undefined
    );
    
    return success;
  }
};
