import { UserRole } from './auth';

// Cookie management utilities for client-side
export const setAuthCookies = (token: string, role: UserRole) => {
  // Set cookies with 7 days expiry
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  
  document.cookie = `auth-token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  document.cookie = `user-role=${role}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
};

export const clearAuthCookies = () => {
  document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'user-role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

export const getAuthCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};
