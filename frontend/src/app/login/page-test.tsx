import { Link } from 'react-router-dom';

export default function LoginPageTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🚌</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Login to book your bus tickets</p>
        </div>
        
        <div className="text-center p-8 bg-gray-100 rounded">
          <p>OTPLogin Component Would Go Here</p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600 mb-4">
            Are you a service provider?
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/agent/login"
              className="text-center py-2 px-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition text-sm font-medium"
            >
              Agent Login
            </Link>
            <Link
              to="/admin/login"
              className="text-center py-2 px-4 border border-gray-600 text-gray-600 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
            >
              Admin Login
            </Link>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
