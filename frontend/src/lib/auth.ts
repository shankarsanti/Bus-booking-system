import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  User,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  PhoneAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { loginHistoryService } from './loginHistoryService';

export type UserRole = 'customer' | 'agent' | 'admin' | 'super_admin' | 'operator' | 'support';

export interface UserProfile {
  uid: string;
  email?: string;
  phone: string;
  role: UserRole;
  name?: string;
  createdAt: Date;
}

// Email/Password Auth
export const registerUser = async (
  email: string, 
  password: string, 
  name: string, 
  role: UserRole = 'customer'
) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email,
    name,
    role,
    createdAt: new Date()
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user profile to determine role
    const profile = await getUserProfile(user.uid);
    
    // Save successful login to history
    if (profile) {
      await loginHistoryService.saveLoginInfo({
        userId: user.uid,
        userRole: profile.role,
        loginMethod: 'email_password',
        email: email,
        status: 'success'
      });
    }
    
    return userCredential;
  } catch (error: any) {
    // Save failed login attempt
    await loginHistoryService.saveLoginInfo({
      userId: email, // Use email as identifier for failed attempts
      userRole: 'customer', // Default role for failed attempts
      loginMethod: 'email_password',
      email: email,
      status: 'failed',
      failureReason: error.code || error.message
    });
    
    throw error;
  }
};

// Phone OTP Auth
let recaptchaVerifier: RecaptchaVerifier | null = null;

export const initializeRecaptcha = (containerId: string) => {
  if (!recaptchaVerifier) {
    try {
      recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA verified');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
          // Reset verifier on expiration
          recaptchaVerifier = null;
        }
      });
    } catch (error) {
      console.error('Failed to initialize reCAPTCHA:', error);
      throw new Error('reCAPTCHA initialization failed. Please refresh the page.');
    }
  }
  return recaptchaVerifier;
};

export const sendOTP = async (phoneNumber: string): Promise<ConfirmationResult> => {
  if (!recaptchaVerifier) {
    throw new Error('Recaptcha not initialized');
  }
  
  try {
    // Format phone number with country code if not present
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
    
    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
    return confirmationResult;
  } catch (error: any) {
    // Reset verifier on error to allow retry
    recaptchaVerifier = null;
    
    // Provide user-friendly error messages
    if (error.code === 'auth/configuration-not-found') {
      throw new Error('Phone authentication is not properly configured. Please contact support.');
    } else if (error.code === 'auth/invalid-phone-number') {
      throw new Error('Invalid phone number format.');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many attempts. Please try again later.');
    }
    throw error;
  }
};

export const verifyOTP = async (
  confirmationResult: ConfirmationResult, 
  otp: string,
  phoneNumber: string,
  role: UserRole = 'customer'
): Promise<User> => {
  try {
    const result = await confirmationResult.confirm(otp);
    const user = result.user;
    
    // Save successful OTP login to history
    await loginHistoryService.saveLoginInfo({
      userId: user.uid,
      userRole: role,
      loginMethod: 'phone_otp',
      phone: phoneNumber,
      status: 'success'
    });
    
    return user;
  } catch (error: any) {
    // Save failed OTP verification
    await loginHistoryService.saveLoginInfo({
      userId: phoneNumber, // Use phone as identifier for failed attempts
      userRole: role,
      loginMethod: 'phone_otp',
      phone: phoneNumber,
      status: 'failed',
      failureReason: error.code || error.message
    });
    
    throw error;
  }
};

export const createUserProfile = async (
  uid: string,
  phone: string,
  role: UserRole = 'customer',
  name?: string
) => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid,
      phone,
      role,
      name: name || '',
      createdAt: new Date()
    });
  }
  
  return await getUserProfile(uid);
};

export const updateUserProfile = async (
  uid: string,
  data: Partial<UserProfile>
) => {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, data, { merge: true });
  return await getUserProfile(uid);
};

export const logoutUser = async () => {
  // Clear cookies on logout (if running in browser)
  if (typeof document !== 'undefined') {
    const { clearAuthCookies } = await import('./authCookies');
    clearAuthCookies();
  }
  return await signOut(auth);
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
};
