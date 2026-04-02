import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getUserProfile, UserProfile, logoutUser } from '../lib/auth';
import { setAuthCookies, clearAuthCookies } from '../lib/authCookies';

// Demo mode support
const DEMO_MODE_KEY = 'demo_mode_user';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isDemoModeActive = false;

    // Check for demo mode user first
    const checkDemoMode = () => {
      const demoUser = localStorage.getItem(DEMO_MODE_KEY);
      if (demoUser) {
        try {
          const demoProfile = JSON.parse(demoUser) as UserProfile;
          if (!isDemoModeActive) {
            console.log('Demo mode active');
            isDemoModeActive = true;
          }
          setProfile(demoProfile);
          setUser({ uid: demoProfile.uid } as User);
          setLoading(false);
          return true;
        } catch (error) {
          console.error('Error parsing demo user:', error);
          localStorage.removeItem(DEMO_MODE_KEY);
        }
      }
      return false;
    };

    // Check immediately
    if (checkDemoMode()) {
      return;
    }

    // Normal Firebase auth flow
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Double-check demo mode in case it was set during auth
      if (checkDemoMode()) {
        return;
      }

      setUser(user);
      if (user) {
        const userProfile = await getUserProfile(user.uid);
        setProfile(userProfile);
        
        // Set auth cookies when user is authenticated
        if (userProfile) {
          const token = await user.getIdToken();
          setAuthCookies(token, userProfile.role);
        }
      } else {
        setProfile(null);
        clearAuthCookies();
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    // Clear demo mode
    localStorage.removeItem(DEMO_MODE_KEY);
    
    // Clear Firebase auth
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Reset state
    setUser(null);
    setProfile(null);
  };

  return { user, profile, loading, logout };
};
