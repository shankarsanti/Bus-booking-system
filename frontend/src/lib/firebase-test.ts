import { db } from './firebase';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';

/**
 * Test Firebase connection and basic operations
 */
export async function testFirebaseConnection() {
  try {
    console.log('🔥 Testing Firebase connection...');
    
    // Test 1: Check if db is initialized
    if (!db) {
      throw new Error('Firestore database not initialized');
    }
    console.log('✅ Firestore initialized');

    // Test 2: Try to read from a collection (even if empty)
    const testCollection = collection(db, 'users');
    const snapshot = await getDocs(testCollection);
    console.log(`✅ Successfully connected to Firestore`);
    console.log(`📊 Found ${snapshot.size} documents in 'users' collection`);

    return {
      success: true,
      message: 'Firebase connection successful',
      documentsCount: snapshot.size
    };
  } catch (error: any) {
    console.error('❌ Firebase connection failed:', error);
    return {
      success: false,
      message: error.message,
      error
    };
  }
}

/**
 * Initialize sample data for testing (optional)
 */
export async function initializeSampleData() {
  try {
    console.log('🚀 Initializing sample data...');

    // Add a test user
    const usersRef = collection(db, 'users');
    const testUser = {
      name: 'Test User',
      mobile: '9999999999',
      email: 'test@example.com',
      role: 'customer' as const,
      status: 'active' as const,
      createdAt: Timestamp.now()
    };

    const userDoc = await addDoc(usersRef, testUser);
    console.log('✅ Sample user created:', userDoc.id);

    return {
      success: true,
      userId: userDoc.id
    };
  } catch (error: any) {
    console.error('❌ Failed to initialize sample data:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
