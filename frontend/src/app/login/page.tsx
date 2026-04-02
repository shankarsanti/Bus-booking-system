import { Link } from 'react-router-dom';
import { Bus, Shield, Users, ArrowLeft, Sparkles } from 'lucide-react';
import OTPLogin from '../../components/OTPLogin';

export default function LoginPage() {
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
              Welcome Back!
            </h1>
            <p className="text-xl text-primary-100">
              Login to continue your journey with us
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

      {/* Right Side - Login Form */}
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

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-neutral-100">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                Customer Login
              </h2>
              <p className="text-neutral-600">
                Enter your phone number to get started
              </p>
            </div>

            <OTPLogin defaultRole="customer" showRoleSelector={false} />

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