import { Timestamp } from 'firebase/firestore';

export interface LoginHistory {
  id?: string;
  userId: string;
  userRole: 'customer' | 'agent' | 'admin' | 'super_admin' | 'operator' | 'support';
  loginMethod: 'email_password' | 'phone_otp';
  email?: string;
  phone?: string;
  ipAddress?: string;
  userAgent?: string;
  deviceInfo?: string;
  loginTime: Timestamp;
  status: 'success' | 'failed';
  failureReason?: string;
}
