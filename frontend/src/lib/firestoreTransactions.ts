import { doc, runTransaction, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { Booking } from '../types/firestore';

/**
 * Atomically book seats using Firestore transactions
 * This prevents race conditions where multiple users book the same seat
 */
export async function bookSeatsWithTransaction(
  tripId: string,
  bookingData: Omit<Booking, 'id' | 'createdAt'>,
  seatsToBook: number
): Promise<string> {
  const tripRef = doc(db, 'trips', tripId);
  
  return await runTransaction(db, async (transaction) => {
    const tripDoc = await transaction.get(tripRef);
    
    if (!tripDoc.exists()) {
      throw new Error('Trip not found');
    }
    
    const tripData = tripDoc.data();
    const currentAvailableSeats = tripData.availableSeats || 0;
    
    // Check if enough seats are available
    if (currentAvailableSeats < seatsToBook) {
      throw new Error(`Only ${currentAvailableSeats} seats available`);
    }
    
    // Create booking document
    const bookingRef = doc(db, 'bookings', `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    transaction.set(bookingRef, {
      ...bookingData,
      createdAt: Timestamp.now()
    });
    
    // Update available seats atomically
    transaction.update(tripRef, {
      availableSeats: currentAvailableSeats - seatsToBook,
      updatedAt: Timestamp.now()
    });
    
    return bookingRef.id;
  });
}

/**
 * Atomically cancel booking and restore seats
 */
export async function cancelBookingWithTransaction(
  bookingId: string,
  tripId: string,
  seatsToRestore: number
): Promise<void> {
  const bookingRef = doc(db, 'bookings', bookingId);
  const tripRef = doc(db, 'trips', tripId);
  
  await runTransaction(db, async (transaction) => {
    const bookingDoc = await transaction.get(bookingRef);
    const tripDoc = await transaction.get(tripRef);
    
    if (!bookingDoc.exists()) {
      throw new Error('Booking not found');
    }
    
    if (!tripDoc.exists()) {
      throw new Error('Trip not found');
    }
    
    const tripData = tripDoc.data();
    const currentAvailableSeats = tripData.availableSeats || 0;
    
    // Update booking status
    transaction.update(bookingRef, {
      status: 'cancelled',
      cancelledAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    // Restore seats
    transaction.update(tripRef, {
      availableSeats: currentAvailableSeats + seatsToRestore,
      updatedAt: Timestamp.now()
    });
  });
}

/**
 * Atomically update loyalty points
 */
export async function updateLoyaltyPointsWithTransaction(
  userId: string,
  pointsChange: number,
  transactionType: 'earned' | 'redeemed',
  description: string
): Promise<void> {
  const loyaltyRef = doc(db, 'loyaltyPoints', userId);
  
  await runTransaction(db, async (transaction) => {
    const loyaltyDoc = await transaction.get(loyaltyRef);
    
    let currentPoints = 0;
    
    if (loyaltyDoc.exists()) {
      currentPoints = loyaltyDoc.data().points || 0;
    }
    
    const newPoints = currentPoints + pointsChange;
    
    // Prevent negative points
    if (newPoints < 0) {
      throw new Error('Insufficient loyalty points');
    }
    
    // Update or create loyalty points document
    if (loyaltyDoc.exists()) {
      transaction.update(loyaltyRef, {
        points: newPoints,
        updatedAt: Timestamp.now()
      });
    } else {
      transaction.set(loyaltyRef, {
        userId,
        points: newPoints,
        tier: 'bronze',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    }
    
    // Create transaction record
    const transactionRef = doc(db, 'pointsTransactions', `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    transaction.set(transactionRef, {
      userId,
      type: transactionType,
      points: Math.abs(pointsChange),
      description,
      createdAt: Timestamp.now()
    });
  });
}

/**
 * Atomically update agent wallet balance
 */
export async function updateWalletWithTransaction(
  agentId: string,
  amountChange: number,
  transactionType: 'credit' | 'debit',
  description: string,
  bookingId?: string
): Promise<void> {
  const walletRef = doc(db, 'wallets', agentId);
  
  await runTransaction(db, async (transaction) => {
    const walletDoc = await transaction.get(walletRef);
    
    let currentBalance = 0;
    
    if (walletDoc.exists()) {
      currentBalance = walletDoc.data().balance || 0;
    }
    
    const newBalance = currentBalance + amountChange;
    
    // Prevent negative balance for debits
    if (newBalance < 0 && transactionType === 'debit') {
      throw new Error('Insufficient wallet balance');
    }
    
    // Update or create wallet document
    if (walletDoc.exists()) {
      transaction.update(walletRef, {
        balance: newBalance,
        updatedAt: Timestamp.now()
      });
    } else {
      transaction.set(walletRef, {
        agentId,
        balance: newBalance,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    }
    
    // Create transaction record
    const transactionRef = doc(db, 'walletTransactions', `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    transaction.set(transactionRef, {
      agentId,
      type: transactionType,
      amount: Math.abs(amountChange),
      description,
      bookingId,
      createdAt: Timestamp.now()
    });
  });
}
