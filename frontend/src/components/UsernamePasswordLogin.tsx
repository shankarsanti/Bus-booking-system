import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { loginUser, getUserProfile, UserRole } from '../lib/auth';
import { setAuthCookies } from '../lib/authCookies';

interface UsernamePasswordLoginProps {
  defaultRole: UserRole;
  onForgotPassword?: () => void;
}

export default function UsernamePasswordLogin({ defaultRole, onForgotPassword }: UsernamePasswordLoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }

      // DEMO MODE: Bypass Firebase for testing
      if (email === 'admin@shankarsbustravels.com' && password === 'admin123' && defaultRole === 'admin') {
        console.log('Demo mode: Admin login successful');
        // Set demo user in localStorage
        const demoProfile = {
          uid: 'demo-admin-001',
          email: 'admin@shankarsbustravels.com',
          phone: '+919035123514',
          role: 'admin' as UserRole,
          name: 'Admin User',
          createdAt: new Date()
        };
        localStorage.setItem('demo_mode_user', JSON.stringify(demoProfile));
        
        // Force page reload to trigger useAuth hook
        window.location.href = '/admin/dashboard';
        return;
      }

      if (email === 'agent@shankarsbustravels.com' && password === 'agent123' && defaultRole === 'agent') {
        console.log('Demo mode: Agent login successful');
        // Set demo user in localStorage
        const demoProfile = {
          uid: 'demo-agent-001',
          email: 'agent@shankarsbustravels.com',
          phone: '+919035123514',
          role: 'agent' as UserRole,
          name: 'Agent User',
          createdAt: new Date()
        };
        localStorage.setItem('demo_mode_user', JSON.stringify(demoProfile));
        
        // Force page reload to trigger useAuth hook
        window.location.href = '/agent/dashboard';
        return;
      }

      // Login with Firebase
      const userCredential = await loginUser(email, password);
      const user = userCredential.user;

      // Get user profile to verify role
      const profile = await getUserProfile(user.uid);
      
      if (!profile) {
        throw new Error('User profile not found');
      }

      // Verify role matches
      if (profile.role !== defaultRole) {
        throw new Error(`This login is for ${defaultRole}s only. Please use the correct login page.`);
      }

      // Get Firebase ID token and set cookies
      const token = await user.getIdToken();
      setAuthCookies(token, profile.role);

      // Redirect based on role
      redirectUser(profile.role);
    } catch (err: any) {
      console.error('Login error:', err);
      
      // User-friendly error messages
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Try demo: agent@shankarsbustravels.com / agent123');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else if (err.code === 'auth/user-disabled') {
        setError('This account has been disabled. Please contact support.');
      } else if (err.code === 'auth/configuration-not-found') {
        setError('⚠️ Firebase not configured. Try demo credentials: admin@shankarsbustravels.com / admin123');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const redirectUser = (userRole: UserRole) => {
    switch (userRole) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'agent':
        navigate('/agent/dashboard');
        break;
      default:
        navigate('/customer/dashboard');
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-neutral-900 placeholder-neutral-400"
            required
            autoComplete="email"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full pl-12 pr-12 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-neutral-900 placeholder-neutral-400"
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-neutral-600">Remember me</span>
        </label>
        
        {onForgotPassword && (
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Forgot password?
          </button>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || !email || !password}
        className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-all font-medium shadow-sm hover:shadow-md"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            Sign In
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
}
