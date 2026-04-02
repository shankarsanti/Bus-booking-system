import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { 
  initializeRecaptcha, 
  sendOTP, 
  verifyOTP, 
  createUserProfile,
  UserRole 
} from '../lib/auth';
import { auth } from '../lib/firebase';
import { setAuthCookies } from '../lib/authCookies';
import { ConfirmationResult } from 'firebase/auth';

interface OTPLoginProps {
  defaultRole?: UserRole;
  onSuccess?: () => void;
  showRoleSelector?: boolean; // New prop to control role selector visibility
}

export default function OTPLogin({ defaultRole = 'customer', onSuccess, showRoleSelector = false }: OTPLoginProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<'phone' | 'otp' | 'details'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    // Initialize reCAPTCHA
    initializeRecaptcha('recaptcha-container');
  }, []);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate phone number (10 digits for India)
      if (!/^\d{10}$/.test(phoneNumber)) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      // DUMMY OTP BYPASS FOR ADMIN - Skip actual OTP sending
      if (role === 'admin' && phoneNumber === '9999999999') {
        console.log('🔓 Admin dummy mode: Skipping OTP send. Use OTP: 123456');
        // Create a dummy confirmation result
        setConfirmationResult({} as ConfirmationResult);
        setStep('otp');
        setLoading(false);
        return;
      }

      if (role === 'agent' && phoneNumber === '8888888888') {
        console.log('🔓 Agent dummy mode: Skipping OTP send. Use OTP: 123456');
        // Create a dummy confirmation result
        setConfirmationResult({} as ConfirmationResult);
        setStep('otp');
        setLoading(false);
        return;
      }

      const result = await sendOTP(phoneNumber);
      setConfirmationResult(result);
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
      console.error('OTP send error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!confirmationResult) {
        throw new Error('Please request OTP first');
      }

      if (!/^\d{6}$/.test(otp)) {
        throw new Error('Please enter a valid 6-digit OTP');
      }

      // DUMMY OTP BYPASS FOR ADMIN - Remove in production!
      if (role === 'admin' && phoneNumber === '9999999999' && otp === '123456') {
        console.log('🔓 Admin dummy OTP bypass activated');
        
        // Set demo user in localStorage
        const demoProfile = {
          uid: 'demo-admin-otp-001',
          email: 'admin@shankarsbustravels.com',
          phone: '+919999999999',
          role: 'admin' as UserRole,
          name: 'Admin User',
          createdAt: new Date()
        };
        localStorage.setItem('demo_mode_user', JSON.stringify(demoProfile));
        
        // Redirect to admin dashboard
        setTimeout(() => {
          window.location.href = '/admin/dashboard';
        }, 500);
        setLoading(false);
        return;
      }

      if (role === 'agent' && phoneNumber === '8888888888' && otp === '123456') {
        console.log('🔓 Agent dummy OTP bypass activated');
        
        // Set demo user in localStorage
        const demoProfile = {
          uid: 'demo-agent-otp-001',
          email: 'agent@shankarsbustravels.com',
          phone: '+918888888888',
          role: 'agent' as UserRole,
          name: 'Agent User',
          createdAt: new Date()
        };
        localStorage.setItem('demo_mode_user', JSON.stringify(demoProfile));
        
        // Redirect to agent dashboard
        setTimeout(() => {
          window.location.href = '/agent/dashboard';
        }, 500);
        setLoading(false);
        return;
      }

      const user = await verifyOTP(confirmationResult, otp, phoneNumber, role);
      
      // Get Firebase ID token
      const token = await user.getIdToken();
      
      // Check if user profile exists
      const profile = await createUserProfile(user.uid, `+91${phoneNumber}`, role);
      
      if (!profile?.name) {
        setStep('details');
      } else {
        // Set auth cookies
        setAuthCookies(token, profile.role);
        
        // User already has profile, redirect based on role
        redirectUser(profile.role);
      }
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
      console.error('OTP verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not found');

      const profile = await createUserProfile(user.uid, `+91${phoneNumber}`, role, name);
      
      // Get Firebase ID token and set cookies
      const token = await user.getIdToken();
      setAuthCookies(token, profile?.role || role);
      
      if (onSuccess) {
        onSuccess();
      } else {
        redirectUser(profile?.role || role);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create profile');
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
    <div className="w-full">
      <div id="recaptcha-container"></div>

      {step === 'phone' && (
        <form onSubmit={handleSendOTP} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-neutral-400" />
              </div>
              <div className="absolute inset-y-0 left-12 flex items-center pointer-events-none">
                <span className="text-neutral-500 font-medium">+91</span>
              </div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Enter 10-digit mobile number"
                className="w-full pl-24 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-neutral-900 placeholder-neutral-400"
                required
              />
            </div>
            <p className="mt-2 text-xs text-neutral-500">
              We'll send you a verification code
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
              <span className="text-red-500 font-bold">!</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || phoneNumber.length !== 10}
            className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-all font-medium shadow-sm hover:shadow-md"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending OTP...
              </>
            ) : (
              <>
                Send OTP
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleVerifyOTP} className="space-y-5">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 mb-3">
              <Lock className="w-6 h-6 text-primary-600" />
            </div>
            <p className="text-sm text-neutral-600">
              OTP sent to <span className="font-semibold text-neutral-900">+91 {phoneNumber}</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Enter OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit OTP"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-center text-2xl font-bold tracking-widest text-neutral-900"
              maxLength={6}
              required
              autoFocus
            />
            <p className="mt-2 text-xs text-neutral-500 text-center">
              Check your SMS for the verification code
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
              <span className="text-red-500 font-bold">!</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-all font-medium shadow-sm hover:shadow-md"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                Verify OTP
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setStep('phone')}
            className="w-full text-primary-600 hover:text-primary-700 py-2 text-sm font-medium transition-colors"
          >
            Change Phone Number
          </button>
        </form>
      )}

      {step === 'details' && (
        <form onSubmit={handleCompleteProfile} className="space-y-5">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">Complete Your Profile</h3>
            <p className="text-sm text-neutral-600 mt-1">Just one more step to get started</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-neutral-900"
                required
              />
            </div>
          </div>

          {showRoleSelector && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Account Type
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-neutral-900"
              >
                <option value="customer">Customer</option>
                <option value="agent">Agent</option>
              </select>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
              <span className="text-red-500 font-bold">!</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !name}
            className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-all font-medium shadow-sm hover:shadow-md"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Profile...
              </>
            ) : (
              <>
                Complete Registration
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
