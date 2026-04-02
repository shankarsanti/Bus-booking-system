import { collection, addDoc, query, where, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Refund } from '@/types/features';
import { Booking } from '@/types/firestore';

export interface CreateRefundRequest {
  bookingId: string;
  userId: string;
  reason: string;
}

// Cancellation charge calculation (based on time before departure)
function calculateCancellationCharges(
  bookingAmount: number,
  hoursBeforeDeparture: number
): number {
  if (hoursBeforeDeparture >= 48) {
    return bookingAmount * 0.1; // 10% charge
  } else if (hoursBeforeDeparture >= 24) {
    return bookingAmount * 0.25; // 25% charge
  } else if (hoursBeforeDeparture >= 12) {
    return bookingAmount * 0.5; // 50% charge
  } else if (hoursBeforeDeparture >= 6) {
    return bookingAmount * 0.75; // 75% charge
  } else {
    return bookingAmount; // No refund
  }
}

// Generate refund ID
function generateRefundId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `REF-${timestamp}-${random}`.toUpperCase();
}

// Create refund request
export async function createRefund(data: CreateRefundRequest) {
  try {
    // Get booking details
    const bookingRef = doc(db, 'bookings', data.bookingId);
    const bookingSnap = await getDoc(bookingRef);

    if (!bookingSnap.exists()) {
      throw new Error('Booking not found');
    }

    const booking = bookingSnap.data() as Booking;

    // Verify booking belongs to user
    if (booking.userId !== data.userId) {
      throw new Error('Unauthorized');
    }

    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      throw new Error('Booking is already cancelled');
    }

    // Check if refund already exists
    const existingRefundQuery = query(
      collection(db, 'refunds'),
      where('bookingId', '==', data.bookingId)
    );
    const existingRefundSnap = await getDocs(existingRefundQuery);

    if (!existingRefundSnap.empty) {
      throw new Error('Refund request already exists for this booking');
    }

    // Get trip details to calculate hours before departure
    const tripRef = doc(db, 'trips', booking.tripId);
    const tripSnap = await getDoc(tripRef);

    if (!tripSnap.exists()) {
      throw new Error('Trip not found');
    }

    const trip = tripSnap.data();
    const departureDateTime = new Date(`${trip.date} ${trip.departureTime}`);
    const now = new Date();
    const hoursBeforeDeparture = (departureDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Calculate cancellation charges
    const cancellationCharges = calculateCancellationCharges(
      booking.totalAmount,
      hoursBeforeDeparture
    );
    const refundAmount = booking.totalAmount - cancellationCharges;

    const refundId = generateRefundId();

    const refund: Omit<Refund, 'id'> = {
      refundId,
      bookingId: data.bookingId,
      userId: data.userId,
      amount: booking.totalAmount,
      reason: data.reason,
      cancellationCharges,
      refundAmount,
      status: 'pending',
      paymentMethod: 'original',
      createdAt: new Date() as any
    };

    const docRef = await addDoc(collection(db, 'refunds'), refund);

    // Update booking status
    await updateDoc(bookingRef, {
      status: 'cancelled',
      paymentStatus: 'refunded'
    });

    return { id: docRef.id, ...refund };
  } catch (error: any) {
    console.error('Error creating refund:', error);
    throw new Error(error.message || 'Failed to create refund');
  }
}

// Get refund by ID
export async function getRefund(refundId: string) {
  try {
    const refundRef = doc(db, 'refunds', refundId);
    const refundSnap = await getDoc(refundRef);

    if (!refundSnap.exists()) {
      throw new Error('Refund not found');
    }

    return { id: refundSnap.id, ...refundSnap.data() } as Refund;
  } catch (error: any) {
    console.error('Error fetching refund:', error);
    throw new Error(error.message || 'Failed to fetch refund');
  }
}

// Get user refunds
export async function getUserRefunds(userId: string) {
  try {
    const q = query(
      collection(db, 'refunds'),
      where('userId', '==', userId)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Refund));
  } catch (error) {
    console.error('Error fetching user refunds:', error);
    throw new Error('Failed to fetch refunds');
  }
}

// Get all refunds (admin/support)
export async function getAllRefunds(status?: Refund['status']) {
  try {
    let q = query(collection(db, 'refunds'));

    if (status) {
      q = query(q, where('status', '==', status));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Refund));
  } catch (error) {
    console.error('Error fetching refunds:', error);
    throw new Error('Failed to fetch refunds');
  }
}

// Process refund (admin/support)
export async function processRefund(
  refundId: string,
  status: 'completed' | 'rejected',
  processedBy: string,
  remarks?: string
) {
  try {
    const refundRef = doc(db, 'refunds', refundId);
    const refundSnap = await getDoc(refundRef);

    if (!refundSnap.exists()) {
      throw new Error('Refund not found');
    }

    const refund = refundSnap.data() as Refund;

    if (refund.status !== 'pending' && refund.status !== 'processing') {
      throw new Error('Refund has already been processed');
    }

    await updateDoc(refundRef, {
      status,
      processedBy,
      remarks,
      processedAt: new Date()
    });

    // If rejected, revert booking status
    if (status === 'rejected') {
      const bookingRef = doc(db, 'refunds', refund.bookingId);
      await updateDoc(bookingRef, {
        status: 'confirmed',
        paymentStatus: 'completed'
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error processing refund:', error);
    throw new Error(error.message || 'Failed to process refund');
  }
}

// Update refund status
export async function updateRefundStatus(refundId: string, status: Refund['status']) {
  try {
    const refundRef = doc(db, 'refunds', refundId);
    await updateDoc(refundRef, { status });
    return { success: true };
  } catch (error) {
    console.error('Error updating refund status:', error);
    throw new Error('Failed to update refund status');
  }
}

// Get refund statistics
export async function getRefundStats() {
  try {
    const snapshot = await getDocs(collection(db, 'refunds'));
    const refunds = snapshot.docs.map(doc => doc.data() as Refund);

    const totalRefundAmount = refunds
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => sum + r.refundAmount, 0);

    return {
      total: refunds.length,
      pending: refunds.filter(r => r.status === 'pending').length,
      processing: refunds.filter(r => r.status === 'processing').length,
      completed: refunds.filter(r => r.status === 'completed').length,
      rejected: refunds.filter(r => r.status === 'rejected').length,
      totalRefundAmount
    };
  } catch (error) {
    console.error('Error fetching refund stats:', error);
    throw new Error('Failed to fetch refund statistics');
  }
}
