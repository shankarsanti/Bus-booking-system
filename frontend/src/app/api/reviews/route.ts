import { collection, addDoc, query, where, getDocs, updateDoc, doc, getDoc, orderBy, limit as firestoreLimit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Review } from '@/types/features';

export interface CreateReviewRequest {
  bookingId: string;
  userId: string;
  busId: string;
  tripId: string;
  rating: number;
  comment?: string;
  aspects?: Review['aspects'];
}

export interface GetReviewsRequest {
  busId?: string;
  tripId?: string;
  userId?: string;
  status?: Review['status'];
  limit?: number;
}

// Create review
export async function createReview(data: CreateReviewRequest) {
  try {
    // Verify booking exists and belongs to user
    const bookingRef = doc(db, 'bookings', data.bookingId);
    const bookingSnap = await getDoc(bookingRef);

    if (!bookingSnap.exists()) {
      throw new Error('Booking not found');
    }

    const booking = bookingSnap.data();
    if (booking.userId !== data.userId) {
      throw new Error('Unauthorized');
    }

    // Check if review already exists
    const existingReview = query(
      collection(db, 'reviews'),
      where('bookingId', '==', data.bookingId)
    );
    const existingSnap = await getDocs(existingReview);

    if (!existingSnap.empty) {
      throw new Error('Review already exists for this booking');
    }

    const review: Omit<Review, 'id'> = {
      ...data,
      helpful: 0,
      verified: true,
      status: 'pending',
      createdAt: new Date() as any
    };

    const docRef = await addDoc(collection(db, 'reviews'), review);
    return { id: docRef.id, ...review };
  } catch (error: any) {
    console.error('Error creating review:', error);
    throw new Error(error.message || 'Failed to create review');
  }
}

// Get reviews
export async function getReviews(params: GetReviewsRequest) {
  try {
    let q = query(collection(db, 'reviews'));

    if (params.busId) {
      q = query(q, where('busId', '==', params.busId));
    }

    if (params.tripId) {
      q = query(q, where('tripId', '==', params.tripId));
    }

    if (params.userId) {
      q = query(q, where('userId', '==', params.userId));
    }

    if (params.status) {
      q = query(q, where('status', '==', params.status));
    }

    q = query(q, orderBy('createdAt', 'desc'));

    if (params.limit) {
      q = query(q, firestoreLimit(params.limit));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw new Error('Failed to fetch reviews');
  }
}

// Update review status (admin only)
export async function updateReviewStatus(reviewId: string, status: Review['status']) {
  try {
    const reviewRef = doc(db, 'reviews', reviewId);
    await updateDoc(reviewRef, {
      status,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating review status:', error);
    throw new Error('Failed to update review');
  }
}

// Mark review as helpful
export async function markReviewHelpful(reviewId: string) {
  try {
    const reviewRef = doc(db, 'reviews', reviewId);
    const reviewSnap = await getDoc(reviewRef);

    if (!reviewSnap.exists()) {
      throw new Error('Review not found');
    }

    const currentHelpful = reviewSnap.data().helpful || 0;
    await updateDoc(reviewRef, {
      helpful: currentHelpful + 1
    });

    return { success: true, helpful: currentHelpful + 1 };
  } catch (error) {
    console.error('Error marking review as helpful:', error);
    throw new Error('Failed to update review');
  }
}

// Get bus average rating
export async function getBusRating(busId: string) {
  try {
    const q = query(
      collection(db, 'reviews'),
      where('busId', '==', busId),
      where('status', '==', 'approved')
    );

    const snapshot = await getDocs(q);
    const reviews = snapshot.docs.map(doc => doc.data() as Review);

    if (reviews.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
      ratingDistribution: {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length,
        2: reviews.filter(r => r.rating === 2).length,
        1: reviews.filter(r => r.rating === 1).length
      }
    };
  } catch (error) {
    console.error('Error calculating bus rating:', error);
    throw new Error('Failed to calculate rating');
  }
}
