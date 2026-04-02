import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import OTPLogin from '../../../components/OTPLogin';
import UsernamePasswordLogin from '../../../components/UsernamePasswordLogin';
import ResetPassword from '../../../components/ResetPassword';
import { useAuth } from '../../../hooks/useAuth';
import { Shield, Phone } from 'lucide-react';

type LoginMode = 'password' | 'otp' | 'reset';

export default function AgentLogin() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const [loginMode, setLoginMode] = useState<LoginMode>('password');

  useEffect(() => {
    if (!loading && user && profile) {
      // Redirect authenticated users to their dashboard
      if (profile.role === 'agent') {
        navigate('/agent/dashboard', { replace: true });
      } else if (profile.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/customer/dashboard', { replace: true });
      }
    }
  }, [user, profile, loading, navigate]);

  const handleLoginSuccess = () => {
    // The OTPLogin component will handle navigation based on role
    // This is just a callback if needed
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: 'linear-gradient(rgba(30, 58, 138, 0.85), rgba(15, 23, 42, 0.9)), url(/bus-background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎫</div>
          <h1 className="text-4xl font-bold text-white mb-2">Agent Portal</h1>
          <p className="text-blue-100">Login to manage customer bookings</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Login Mode Tabs */}
          {loginMode !== 'reset' && (
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setLoginMode('password')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all ${
                  loginMode === 'password'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <Shield className="w-4 h-4" />
                Password
              </button>
              <button
                onClick={() => setLoginMode('otp')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all ${
                  loginMode === 'otp'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <Phone className="w-4 h-4" />
                OTP
              </button>
            </div>
          )}

          {/* Login Forms */}
          {loginMode === 'password' && (
            <>
              {/* Development Mode Hint */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                <p className="text-xs text-blue-800 text-center font-mono">
                  🔓 Dev Mode: Email: agent@shankarsbustravels.com | Password: agent123
                </p>
              </div>
              <UsernamePasswordLogin 
                defaultRole="agent" 
                onForgotPassword={() => setLoginMode('reset')}
              />
            </>
          )}

          {loginMode === 'otp' && (
            <>
              {/* Development Mode Hint */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                <p className="text-xs text-blue-800 text-center font-mono">
                  🔓 Dev Mode: Phone: 9999999999 | OTP: 123456
                </p>
              </div>
              <OTPLogin
                defaultRole="agent"
                showRoleSelector={false}
                onSuccess={handleLoginSuccess}
              />
            </>
          )}

          {loginMode === 'reset' && (
            <ResetPassword onBack={() => setLoginMode('password')} />
          )}
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-white hover:text-blue-100 transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
