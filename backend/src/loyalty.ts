import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const TIER_THRESHOLDS = {
  bronze: 0,
  silver: 1000,
  gold: 5000,
  platinum: 10000
};

type Tier = 'bronze' | 'silver' | 'gold' | 'platinum';

function calculateTier(points: number): Tier {
  if (points >= TIER_THRESHOLDS.platinum) return 'platinum';
  if (points >= TIER_THRESHOLDS.gold) return 'gold';
  if (points >= TIER_THRESHOLDS.silver) return 'silver';
  return 'bronze';
}

function getTierBenefits(tier: Tier): string[] {
  const benefits = {
    bronze: ['Earn 5% points on bookings', 'Birthday bonus points'],
    silver: ['Earn 7% points on bookings', 'Priority customer support', 'Early access to offers'],
    gold: ['Earn 10% points on bookings', 'Free cancellation once per month', 'Exclusive discounts'],
    platinum: ['Earn 15% points on bookings', 'Unlimited free cancellations', 'VIP support', 'Lounge access']
  };
  return benefits[tier];
}

export const getLoyaltyAccount = functions.https.onCall(async (data: any, context: functions.https.CallableContext) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = data.userId || context.auth.uid;

  try {
    const loyaltyRef = admin.firestore().collection('loyaltyPoints').doc(userId);
    const loyaltySnap = await loyaltyRef.get();

    if (loyaltySnap.exists) {
      return { id: loyaltySnap.id, ...loyaltySnap.data() };
    }

    const newAccount = {
      userId,
      totalPoints: 0,
      availablePoints: 0,
      tier: 'bronze',
      tierBenefits: getTierBenefits('bronze'),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await loyaltyRef.set(newAccount);
    return { id: userId, ...newAccount };
  } catch (error: any) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

export const addLoyaltyPoints = functions.https.onCall(async (data: any, context: functions.https.CallableContext) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userId, points, reason, bookingId } = data;

  try {
    const db = admin.firestore();
    const result = await db.runTransaction(async (transaction: admin.firestore.Transaction) => {
      const loyaltyRef = db.collection('loyaltyPoints').doc(userId);
      const loyaltyDoc = await transaction.get(loyaltyRef);

      let currentTotal = 0;
      let currentAvailable = 0;

      if (loyaltyDoc.exists) {
        const data = loyaltyDoc.data()!;
        currentTotal = data.totalPoints || 0;
        currentAvailable = data.availablePoints || 0;
      }

      const newTotal = currentTotal + points;
      const newAvailable = currentAvailable + points;
      const newTier = calculateTier(newTotal);

      const updateData = {
        totalPoints: newTotal,
        availablePoints: newAvailable,
        tier: newTier,
        tierBenefits: getTierBenefits(newTier),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      if (loyaltyDoc.exists) {
        transaction.update(loyaltyRef, updateData);
      } else {
        transaction.set(loyaltyRef, { userId, ...updateData, createdAt: admin.firestore.FieldValue.serverTimestamp() });
      }

      const transactionRef = db.collection('pointsTransactions').doc();
      transaction.set(transactionRef, {
        userId,
        type: 'earned',
        points,
        reason,
        bookingId,
        balanceBefore: currentAvailable,
        balanceAfter: newAvailable,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return { newBalance: newAvailable, tier: newTier, tierUpgraded: loyaltyDoc.exists && newTier !== loyaltyDoc.data()!.tier };
    });

    return { success: true, ...result };
  } catch (error: any) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

export const redeemLoyaltyPoints = functions.https.onCall(async (data: any, context: functions.https.CallableContext) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userId, points, reason, bookingId } = data;

  try {
    const db = admin.firestore();
    const result = await db.runTransaction(async (transaction: admin.firestore.Transaction) => {
      const loyaltyRef = db.collection('loyaltyPoints').doc(userId);
      const loyaltyDoc = await transaction.get(loyaltyRef);

      if (!loyaltyDoc.exists) {
        throw new Error('Loyalty account not found');
      }

      const currentAvailable = loyaltyDoc.data()!.availablePoints || 0;

      if (currentAvailable < points) {
        throw new Error('Insufficient points');
      }

      const newAvailable = currentAvailable - points;

      transaction.update(loyaltyRef, {
        availablePoints: newAvailable,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      const transactionRef = db.collection('pointsTransactions').doc();
      transaction.set(transactionRef, {
        userId,
        type: 'redeemed',
        points: -points,
        reason,
        bookingId,
        balanceBefore: currentAvailable,
        balanceAfter: newAvailable,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return { newBalance: newAvailable, pointsRedeemed: points };
    });

    return { success: true, ...result };
  } catch (error: any) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
