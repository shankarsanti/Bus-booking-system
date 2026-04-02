import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

export const transactionClient = {
  async bookSeats(tripId: string, bookingData: any, seatsToBook: number) {
    const fn = httpsCallable(functions, 'bookSeatsTransaction');
    const result = await fn({ tripId, bookingData, seatsToBook });
    return result.data;
  },

  async cancelBooking(bookingId: string, tripId: string, seatsToRestore: number) {
    const fn = httpsCallable(functions, 'cancelBookingTransaction');
    const result = await fn({ bookingId, tripId, seatsToRestore });
    return result.data;
  },

  async updateWallet(
    agentId: string,
    amountChange: number,
    transactionType: 'credit' | 'debit',
    description: string,
    bookingId?: string
  ) {
    const fn = httpsCallable(functions, 'updateWalletTransaction');
    const result = await fn({ agentId, amountChange, transactionType, description, bookingId });
    return result.data;
  }
};
