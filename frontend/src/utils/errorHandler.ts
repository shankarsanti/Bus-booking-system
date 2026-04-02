/**
 * Centralized error handling utilities
 * Provides consistent error messages and logging
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Firebase Auth error codes
export const AUTH_ERRORS: Record<string, string> = {
  'auth/email-already-in-use': 'This email is already registered',
  'auth/invalid-email': 'Invalid email address',
  'auth/operation-not-allowed': 'This operation is not allowed',
  'auth/weak-password': 'Password is too weak',
  'auth/user-disabled': 'This account has been disabled',
  'auth/user-not-found': 'No account found with this email',
  'auth/wrong-password': 'Incorrect password',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later',
  'auth/network-request-failed': 'Network error. Please check your connection',
  'auth/invalid-phone-number': 'Invalid phone number format',
  'auth/invalid-verification-code': 'Invalid OTP code',
  'auth/code-expired': 'OTP has expired. Please request a new one',
  'auth/configuration-not-found': 'Phone authentication not configured',
  'auth/missing-phone-number': 'Phone number is required',
  'auth/quota-exceeded': 'SMS quota exceeded. Please try again later',
  'auth/captcha-check-failed': 'reCAPTCHA verification failed',
  'auth/invalid-app-credential': 'Invalid app credentials',
  'auth/app-not-authorized': 'App not authorized for this operation'
};

// Firestore error codes
export const FIRESTORE_ERRORS: Record<string, string> = {
  'permission-denied': 'You do not have permission to perform this action',
  'not-found': 'The requested resource was not found',
  'already-exists': 'This resource already exists',
  'resource-exhausted': 'Resource quota exceeded',
  'failed-precondition': 'Operation cannot be performed in current state',
  'aborted': 'Operation was aborted',
  'out-of-range': 'Operation out of valid range',
  'unimplemented': 'Operation not implemented',
  'internal': 'Internal server error',
  'unavailable': 'Service temporarily unavailable',
  'data-loss': 'Data loss or corruption detected',
  'unauthenticated': 'Authentication required'
};

// Payment error codes
export const PAYMENT_ERRORS: Record<string, string> = {
  'payment_failed': 'Payment failed. Please try again',
  'payment_cancelled': 'Payment was cancelled',
  'invalid_amount': 'Invalid payment amount',
  'gateway_error': 'Payment gateway error',
  'insufficient_funds': 'Insufficient funds',
  'card_declined': 'Card was declined',
  'expired_card': 'Card has expired',
  'invalid_card': 'Invalid card details',
  'network_error': 'Network error during payment'
};

// Booking error codes
export const BOOKING_ERRORS: Record<string, string> = {
  'seats_unavailable': 'Selected seats are no longer available',
  'trip_full': 'This trip is fully booked',
  'trip_not_found': 'Trip not found',
  'invalid_seats': 'Invalid seat selection',
  'booking_expired': 'Booking session has expired',
  'duplicate_booking': 'Duplicate booking detected',
  'invalid_passenger_data': 'Invalid passenger information'
};

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: any): string {
  // Handle AppError
  if (error instanceof AppError) {
    return error.message;
  }

  // Handle Firebase Auth errors
  if (error?.code && error.code.startsWith('auth/')) {
    return AUTH_ERRORS[error.code] || 'Authentication error occurred';
  }

  // Handle Firestore errors
  if (error?.code && FIRESTORE_ERRORS[error.code]) {
    return FIRESTORE_ERRORS[error.code];
  }

  // Handle Payment errors
  if (error?.code && PAYMENT_ERRORS[error.code]) {
    return PAYMENT_ERRORS[error.code];
  }

  // Handle Booking errors
  if (error?.code && BOOKING_ERRORS[error.code]) {
    return BOOKING_ERRORS[error.code];
  }

  // Handle network errors
  if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
    return 'Network error. Please check your internet connection';
  }

  // Default error message
  return error?.message || 'An unexpected error occurred';
}

/**
 * Log error for debugging
 */
export function logError(error: any, context?: string): void {
  const timestamp = new Date().toISOString();
  const errorInfo = {
    timestamp,
    context,
    message: error?.message,
    code: error?.code,
    stack: error?.stack,
    name: error?.name
  };

  console.error('Error logged:', errorInfo);

  // In production, send to error tracking service (e.g., Sentry)
  if (import.meta.env.PROD) {
    // TODO: Send to error tracking service
    // Sentry.captureException(error, { contexts: { custom: errorInfo } });
  }
}

/**
 * Handle async errors with consistent error handling
 */
export async function handleAsync<T>(
  promise: Promise<T>,
  context?: string
): Promise<[T | null, Error | null]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error: any) {
    logError(error, context);
    return [null, error];
  }
}

/**
 * Retry failed operations with exponential backoff
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      if (attempt < maxRetries) {
        // Exponential backoff
        const delay = delayMs * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}

/**
 * Validate and sanitize error for client response
 */
export function sanitizeError(error: any): { message: string; code?: string } {
  const message = getErrorMessage(error);
  const code = error?.code;

  // Don't expose internal error details in production
  if (import.meta.env.PROD) {
    return {
      message,
      code: code?.startsWith('auth/') || code?.startsWith('payment_') ? code : undefined
    };
  }

  return { message, code };
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: any): boolean {
  const retryableCodes = [
    'unavailable',
    'deadline-exceeded',
    'resource-exhausted',
    'network-request-failed'
  ];

  return retryableCodes.some(code => 
    error?.code?.includes(code) || error?.message?.toLowerCase().includes(code)
  );
}

/**
 * Create error response for API routes
 */
export function createErrorResponse(error: any, statusCode?: number) {
  const sanitized = sanitizeError(error);
  
  return {
    error: sanitized.message,
    code: sanitized.code,
    timestamp: new Date().toISOString()
  };
}
