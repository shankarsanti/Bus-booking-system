import { 
  collection, 
  addDoc, 
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { LoginHistory } from '../types/loginHistory';
import type { UserRole } from './auth';

const COLLECTION_NAME = 'loginHistory';

export const loginHistoryService = {
  /**
   * Save login information to database
   */
  async saveLoginInfo(data: {
    userId: string;
    userRole: UserRole;
    loginMethod: 'email_password' | 'phone_otp';
    email?: string;
    phone?: string;
    status: 'success' | 'failed';
    failureReason?: string;
  }): Promise<string> {
    try {
      // Get device and browser info
      const deviceInfo = typeof navigator !== 'undefined' 
        ? `${navigator.platform} - ${navigator.userAgent.substring(0, 100)}`
        : 'Unknown';

      const loginRecord: Omit<LoginHistory, 'id'> = {
        userId: data.userId,
        userRole: data.userRole,
        loginMethod: data.loginMethod,
        email: data.email,
        phone: data.phone,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        deviceInfo,
        loginTime: Timestamp.now(),
        status: data.status,
        failureReason: data.failureReason
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), loginRecord);
      console.log('✅ Login info saved:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Failed to save login info:', error);
      // Don't throw error - login should succeed even if history fails
      return '';
    }
  },

  /**
   * Get login history for a specific user
   */
  async getUserLoginHistory(userId: string, limitCount: number = 10): Promise<LoginHistory[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('loginTime', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LoginHistory[];
    } catch (error) {
      console.error('Failed to fetch login history:', error);
      return [];
    }
  },

  /**
   * Get all login history (admin only)
   */
  async getAllLoginHistory(limitCount: number = 50): Promise<LoginHistory[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy('loginTime', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LoginHistory[];
    } catch (error) {
      console.error('Failed to fetch all login history:', error);
      return [];
    }
  },

  /**
   * Get login history by role
   */
  async getLoginHistoryByRole(role: UserRole, limitCount: number = 50): Promise<LoginHistory[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('userRole', '==', role),
        orderBy('loginTime', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LoginHistory[];
    } catch (error) {
      console.error('Failed to fetch login history by role:', error);
      return [];
    }
  },

  /**
   * Get failed login attempts for security monitoring
   */
  async getFailedLoginAttempts(limitCount: number = 50): Promise<LoginHistory[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('status', '==', 'failed'),
        orderBy('loginTime', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LoginHistory[];
    } catch (error) {
      console.error('Failed to fetch failed login attempts:', error);
      return [];
    }
  }
};
