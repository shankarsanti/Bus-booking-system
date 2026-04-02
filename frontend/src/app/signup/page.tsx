import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bus, Shield, Users, ArrowLeft, Sparkles, Mail, Lock, User, Phone, ArrowRight, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { registerUser } from '../../lib/auth';
import { setAuthCookies } from '../../lib/authCookies';

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate inputs
      if (!formData.name || !formData.email || !formData.phone || !formData.password) {
        throw new Error('Please fill in all fields');
      }

      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (!/^\d{10}$/.test(formData.phone)) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      // Register user with Firebase
      const user = await registerUser(formData.email, formData.password, formData.name, 'customer');
      
      // Update profile with phone number
      const { updateUserProfile } = await import('../../lib/auth');
      await updateUserProfile(user.uid, {
        uid: user.uid,
        email: formData.email,
        phone: `+91${formData.phone}`,
        name: formData.name,
        role: 'customer',
        createdAt: new Date()
      });

      // Get Firebase ID token and set cookies
      const token = await user.getIdToken();
      setAuthCookies(token, 'customer');

      // Redirect to customer dashboard
      navigate('/customer/dashboard');
    } catch (err: any) {
      console.error('Signup error:', err);
      
      // User-friendly error messages
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please login instead.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use a stronger password.');
      } else {
        setError(err.message || 'Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex">
      {/* Left Side - Branding */}
      <div 
        className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between relative overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(rgba(30, 58, 138, 0.85), rgba(15, 23, 42, 0.9)), url(/bus-background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse-soft"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 text-white hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Bus className="w-7 h-7" />
            </div>
            <span className="text-2xl font-bold">SHANKAR'S BUS TRAVEL</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 leading-tight">
              Join Us Today!
            </h1>
            <p className="text-xl text-primary-100">
              Create your account and start booking
            </p>
          </div>

          <div className="space-y-6">
            {[
              { icon: <Bus className="w-6 h-6" />, text: 'Book buses across 500+ routes' },
              { icon: <Shield className="w-6 h-6" />, text: 'Secure & instant booking' },
              { icon: <Sparkles className="w-6 h-6" />, text: 'Best prices guaranteed' }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="flex items-center gap-4 text-white animate-slide-left"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  {feature.icon}
                </div>
                <p className="text-lg">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-primary-100 text-sm">
          © 2024 SHANKAR'S BUS TRAVEL. All rights reserved.
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>

          {/* Signup Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-neutral-100">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                Create Account
              </h2>
              <p className="text-neutral-600">
                Sign up to start booking your bus tickets
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-5">
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
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-neutral-900 placeholder-neutral-400"
                    required
                  />
                </div>
              </div>

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
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-neutral-900 placeholder-neutral-400"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

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
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full pl-24 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-neutral-900 placeholder-neutral-400"
                    required
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
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className="w-full pl-12 pr-12 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-neutral-900 placeholder-neutral-400"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  Must be at least 6 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="w-full pl-12 pr-12 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-neutral-900 placeholder-neutral-400"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-all font-medium shadow-sm hover:shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-neutral-500">
                  Other login options
                </span>
              </div>
            </div>

            {/* Other Login Options */}
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/agent/login"
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-neutral-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all group"
              >
                <Users className="w-5 h-5 text-neutral-600 group-hover:text-primary-600" />
                <span className="font-medium text-neutral-700 group-hover:text-primary-600">
                  Agent
                </span>
              </Link>
              <Link
                to="/admin/login"
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-neutral-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all group"
              >
                <Shield className="w-5 h-5 text-neutral-600 group-hover:text-primary-600" />
                <span className="font-medium text-neutral-700 group-hover:text-primary-600">
                  Admin
                </span>
              </Link>
            </div>
          </div>

          {/* Help Text */}
          <p className="text-center text-sm text-neutral-500 mt-6">
            By continuing, you agree to our{' '}
            <Link to="/terms" className="text-primary-600 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-primary-600 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
