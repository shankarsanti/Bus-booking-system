import { collection, addDoc, query, where, getDocs, updateDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { LoyaltyPoints, PointsTransaction } from '@/types/features';

// Tier thresholds
const TIER_THRESHOLDS = {
  bronze: 0,
  silver: 1000,
  gold: 5000,
  platinum: 10000
};

// Points earning rules
const POINTS_RULES = {
  bookingPercentage: 5, // 5% of booking amount
  referralBonus: 500,
  reviewBonus: 50,
  birthdayBonus: 200
};

// Calculate tier based on points
function calculateTier(points: number): LoyaltyPoints['tier'] {
  if (points >= TIER_THRESHOLDS.platinum) return 'platinum';
  if (points >= TIER_THRESHOLDS.gold) return 'gold';
  if (points >= TIER_THRESHOLDS.silver) return 'silver';
  return 'bronze';
}

// Get tier benefits
function getTierBenefits(tier: LoyaltyPoints['tier']): string[] {
  const benefits = {
    bronze: ['Earn 5% points on bookings', 'Birthday bonus points'],
    silver: ['Earn 7% points on bookings', 'Priority customer support', 'Early access to offers'],
    gold: ['Earn 10% points on bookings', 'Free cancellation once per month', 'Exclusive discounts'],
    platinum: ['Earn 15% points on bookings', 'Unlimited free cancellations', 'VIP support', 'Lounge access']
  };
  return benefits[tier];
}

// Get or create loyalty account
export async function getLoyaltyAccount(userId: string) {
  try {
    const loyaltyRef = doc(db, 'loyaltyPoints', userId);
    const loyaltySnap = await getDoc(loyaltyRef);

    if (loyaltySnap.exists()) {
      return { id: loyaltySnap.id, ...loyaltySnap.data() } as LoyaltyPoints;
    }

    // Create new loyalty account
    const newAccount: Omit<LoyaltyPoints, 'id'> = {
      userId,
      totalPoints: 0,
      availablePoints: 0,
      tier: 'bronze',
      tierBenefits: getTierBenefits('bronze'),
      createdAt: new Date() as any,
      updatedAt: new Date() as any
    };

    await setDoc(loyaltyRef, newAccount);
    return { id: userId, ...newAccount };
  } catch (error) {
    console.error('Error getting loyalty account:', error);
    throw new Error('Failed to get loyalty account');
  }
}

// Add points
export async function addPoints(
  userId: string,
  points: number,
  reason: string,
  bookingId?: string
) {
  try {
    const account = await getLoyaltyAccount(userId);
    const newTotalPoints = account.totalPoints + points;
    const newAvailablePoints = account.availablePoints + points;
    const newTier = calculateTier(newTotalPoints);

    // Update loyalty account
    const loyaltyRef = doc(db, 'loyaltyPoints', userId);
    await updateDoc(loyaltyRef, {
      totalPoints: newTotalPoints,
      availablePoints: newAvailablePoints,
      tier: newTier,
      tierBenefits: getTierBenefits(newTier),
      updatedAt: new Date()
    });

    // Create transaction record
    const transaction: Omit<PointsTransaction, 'id'> = {
      userId,
      type: 'earned',
      points,
      reason,
      bookingId,
      balanceBefore: account.availablePoints,
      balanceAfter: newAvailablePoints,
      createdAt: new Date() as any
    };

    await addDoc(collection(db, 'pointsTransactions'), transaction);

    return {
      success: true,
      newBalance: newAvailablePoints,
      tier: newTier,
      tierUpgraded: newTier !== account.tier
    };
  } catch (error) {
    console.error('Error adding points:', error);
    throw new Error('Failed to add points');
  }
}

// Redeem points
export async function redeemPoints(
  userId: string,
  points: number,
  reason: string,
  bookingId?: string
) {
  try {
    const account = await getLoyaltyAccount(userId);

    if (account.availablePoints < points) {
      throw new Error('Insufficient points');
    }

    const newAvailablePoints = account.availablePoints - points;

    // Update loyalty account
    const loyaltyRef = doc(db, 'loyaltyPoints', userId);
    await updateDoc(loyaltyRef, {
      availablePoints: newAvailablePoints,
      updatedAt: new Date()
    });

    // Create transaction record
    const transaction: Omit<PointsTransaction, 'id'> = {
      userId,
      type: 'redeemed',
      points: -points,
      reason,
      bookingId,
      balanceBefore: account.availablePoints,
      balanceAfter: newAvailablePoints,
      createdAt: new Date() as any
    };

    await addDoc(collection(db, 'pointsTransactions'), transaction);

    return {
      success: true,
      newBalance: newAvailablePoints,
      pointsRedeemed: points
    };
  } catch (error: any) {
    console.error('Error redeeming points:', error);
    throw new Error(error.message || 'Failed to redeem points');
  }
}

// Calculate points for booking
export async function calculateBookingPoints(userId: string, bookingAmount: number) {
  try {
    const account = await getLoyaltyAccount(userId);
    let percentage = POINTS_RULES.bookingPercentage;

    // Adjust percentage based on tier
    if (account.tier === 'silver') percentage = 7;
    if (account.tier === 'gold') percentage = 10;
    if (account.tier === 'platinum') percentage = 15;

    const points = Math.floor((bookingAmount * percentage) / 100);

    return {
      points,
      percentage,
      tier: account.tier
    };
  } catch (error) {
    console.error('Error calculating booking points:', error);
    throw new Error('Failed to calculate points');
  }
}

// Get points transactions
export async function getPointsTransactions(userId: string, limitCount: number = 50) {
  try {
    const q = query(
      collection(db, 'pointsTransactions'),
      where('userId', '==', userId)
    );

    const snapshot = await getDocs(q);
    const transactions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as PointsTransaction));

    // Sort by date descending
    transactions.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

    return transactions.slice(0, limitCount);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw new Error('Failed to fetch transactions');
  }
}

// Convert points to currency
export function pointsToCurrency(points: number): number {
  return points / 10; // 10 points = ₹1
}

// Convert currency to points
export function currencyToPoints(amount: number): number {
  return amount * 10; // ₹1 = 10 points
}
