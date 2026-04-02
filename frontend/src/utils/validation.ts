/**
 * Validation utilities to prevent data errors and security issues
 */

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation (Indian format)
export function isValidPhone(phone: string): boolean {
  // Remove spaces, dashes, and parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Check for Indian phone number (10 digits) or with country code
  const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
  return phoneRegex.test(cleaned);
}

// Format phone number with country code
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return cleaned.startsWith('+91') ? cleaned : `+91${cleaned}`;
}

// Password strength validation
export function isValidPassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  
  return { valid: true };
}

// Sanitize user input to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Validate PNR format
export function isValidPNR(pnr: string): boolean {
  // PNR should be alphanumeric, 6-10 characters
  const pnrRegex = /^[A-Z0-9]{6,10}$/;
  return pnrRegex.test(pnr.toUpperCase());
}

// Validate seat number
export function isValidSeatNumber(seatNumber: string): boolean {
  // Seat format: A1, B2, etc. (Letter + Number)
  const seatRegex = /^[A-Z]\d{1,2}$/;
  return seatRegex.test(seatNumber);
}

// Validate amount (positive number with max 2 decimal places)
export function isValidAmount(amount: number): boolean {
  if (amount <= 0) return false;
  if (amount > 100000) return false; // Max 1 lakh
  
  // Check decimal places
  const decimalPlaces = (amount.toString().split('.')[1] || '').length;
  return decimalPlaces <= 2;
}

// Validate date (must be today or future)
export function isValidTravelDate(dateString: string): boolean {
  const travelDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return travelDate >= today;
}

// Validate time format (HH:MM)
export function isValidTime(time: string): boolean {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(time);
}

// Validate bus number
export function isValidBusNumber(busNumber: string): boolean {
  // Bus number format: State code + numbers (e.g., KA01AB1234)
  const busRegex = /^[A-Z]{2}\d{2}[A-Z]{0,2}\d{4}$/;
  return busRegex.test(busNumber.toUpperCase().replace(/[\s\-]/g, ''));
}

// Validate age
export function isValidAge(age: number): boolean {
  return age >= 1 && age <= 120;
}

// Validate passenger name
export function isValidName(name: string): boolean {
  if (name.length < 2 || name.length > 50) return false;
  
  // Only letters, spaces, and common name characters
  const nameRegex = /^[a-zA-Z\s\.\-']+$/;
  return nameRegex.test(name);
}

// Validate OTP (6 digits)
export function isValidOTP(otp: string): boolean {
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
}

// Validate discount code
export function isValidDiscountCode(code: string): boolean {
  // Alphanumeric, 4-20 characters
  const codeRegex = /^[A-Z0-9]{4,20}$/;
  return codeRegex.test(code.toUpperCase());
}

// Rate limiting helper
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 60000 // 1 minute
  ) {}
  
  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    
    return true;
  }
  
  reset(key: string): void {
    this.attempts.delete(key);
  }
}

// Export all validators
export const validators = {
  email: isValidEmail,
  phone: isValidPhone,
  password: isValidPassword,
  pnr: isValidPNR,
  seatNumber: isValidSeatNumber,
  amount: isValidAmount,
  travelDate: isValidTravelDate,
  time: isValidTime,
  busNumber: isValidBusNumber,
  age: isValidAge,
  name: isValidName,
  otp: isValidOTP,
  discountCode: isValidDiscountCode
};
