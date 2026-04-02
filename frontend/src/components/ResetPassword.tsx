import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface ResetPasswordProps {
  onBack: () => void;
}

export default function ResetPassword({ onBack }: ResetPasswordProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email) {
        throw new Error('Please enter your email address');
      }

      // Send password reset email
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      
      // User-friendly error messages
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many requests. Please try again later.');
      } else {
        setError(err.message || 'Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-neutral-900 mb-2">
            Check Your Email
          </h3>
          <p className="text-neutral-600">
            We've sent password reset instructions to
          </p>
          <p className="text-primary-600 font-semibold mt-1">
            {email}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Next steps:</strong>
          </p>
          <ol className="text-sm text-blue-700 mt-2 space-y-1 list-decimal list-inside">
            <li>Check your email inbox</li>
            <li>Click the reset link in the email</li>
            <li>Create a new password</li>
            <li>Sign in with your new password</li>
          </ol>
        </div>

        <button
          onClick={onBack}
          className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-all font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Login
        </button>

        <p className="text-center text-sm text-neutral-500">
          Didn't receive the email?{' '}
          <button
            onClick={() => {
              setSuccess(false);
              setEmail('');
            }}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Try again
          </button>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleResetPassword} className="space-y-5">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-neutral-900 mb-2">
          Reset Password
        </h3>
        <p className="text-neutral-600">
          Enter your email and we'll send you instructions to reset your password
        </p>
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-neutral-900 placeholder-neutral-400"
            required
            autoFocus
            autoComplete="email"
          />
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
        disabled={loading || !email}
        className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-all font-medium shadow-sm hover:shadow-md"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send Reset Link
            <Mail className="w-5 h-5" />
          </>
        )}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="w-full flex items-center justify-center gap-2 text-neutral-600 hover:text-neutral-900 py-2 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Login
      </button>
    </form>
  );
}
