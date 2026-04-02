import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from './components/ProtectedRoute';

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Lazy load pages for better performance
const HomePage = lazy(() => import('./app/page'));
const NewHomePage = lazy(() => import('./app/home-new/page'));
const DemoPage = lazy(() => import('./app/demo/page'));
const LoginPage = lazy(() => import('./app/login/page'));
const SearchPage = lazy(() => import('./app/search/page'));
const SeatSelectionPage = lazy(() => import('./app/seat-selection/page'));
const PaymentPage = lazy(() => import('./app/payment/page'));
const TicketPage = lazy(() => import('./app/ticket/page'));

// Admin Pages
const AdminLoginPage = lazy(() => import('./app/admin/login/page'));
const AdminLayout = lazy(() => import('./app/admin/layout'));
const AdminDashboard = lazy(() => import('./app/admin/dashboard/page'));
const AdminBuses = lazy(() => import('./app/admin/buses/page'));
const AdminRoutes = lazy(() => import('./app/admin/routes/page'));
const AdminTrips = lazy(() => import('./app/admin/trips/page'));
const AdminBookings = lazy(() => import('./app/admin/bookings/page'));
const AdminAgents = lazy(() => import('./app/admin/agents/page'));
const AdminWallets = lazy(() => import('./app/admin/wallets/page'));
const AdminReports = lazy(() => import('./app/admin/reports/page'));
const AdminLoginHistory = lazy(() => import('./app/admin/login-history/page'));

// Agent Pages
const AgentLoginPage = lazy(() => import('./app/agent/login/page'));
const AgentLayout = lazy(() => import('./app/agent/layout'));
const AgentDashboard = lazy(() => import('./app/agent/dashboard/page'));
const AgentSearch = lazy(() => import('./app/agent/search/page'));
const AgentSeatSelection = lazy(() => import('./app/agent/seat-selection/page'));
const AgentPassengerDetails = lazy(() => import('./app/agent/passenger-details/page'));
const AgentPayment = lazy(() => import('./app/agent/payment/page'));
const AgentBookingSuccess = lazy(() => import('./app/agent/booking-success/page'));
const AgentBookings = lazy(() => import('./app/agent/bookings/page'));
const AgentWallet = lazy(() => import('./app/agent/wallet/page'));
const AgentProfile = lazy(() => import('./app/agent/profile/page'));

// Customer Pages
const CustomerDashboard = lazy(() => import('./app/customer/dashboard/page'));

import './App.css';

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/home-new" element={<NewHomePage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/seat-selection/:tripId" element={<SeatSelectionPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/buses" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <AdminBuses />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/routes" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <AdminRoutes />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/trips" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <AdminTrips />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/bookings" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <AdminBookings />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/agents" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <AdminAgents />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/wallets" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <AdminWallets />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/reports" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <AdminReports />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/login-history" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <AdminLoginHistory />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />

          {/* Agent Routes */}
          <Route path="/agent/login" element={<AgentLoginPage />} />
          <Route 
            path="/agent/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['agent']}>
                <AgentLayout>
                  <AgentDashboard />
                </AgentLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/agent/search" 
            element={
              <ProtectedRoute allowedRoles={['agent']}>
                <AgentLayout>
                  <AgentSearch />
                </AgentLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/agent/seat-selection" 
            element={
              <ProtectedRoute allowedRoles={['agent']}>
                <AgentLayout>
                  <AgentSeatSelection />
                </AgentLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/agent/passenger-details" 
            element={
              <ProtectedRoute allowedRoles={['agent']}>
                <AgentLayout>
                  <AgentPassengerDetails />
                </AgentLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/agent/payment" 
            element={
              <ProtectedRoute allowedRoles={['agent']}>
                <AgentLayout>
                  <AgentPayment />
                </AgentLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/agent/booking-success" 
            element={
              <ProtectedRoute allowedRoles={['agent']}>
                <AgentLayout>
                  <AgentBookingSuccess />
                </AgentLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/agent/bookings" 
            element={
              <ProtectedRoute allowedRoles={['agent']}>
                <AgentLayout>
                  <AgentBookings />
                </AgentLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/agent/wallet" 
            element={
              <ProtectedRoute allowedRoles={['agent']}>
                <AgentLayout>
                  <AgentWallet />
                </AgentLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/agent/profile" 
            element={
              <ProtectedRoute allowedRoles={['agent']}>
                <AgentLayout>
                  <AgentProfile />
                </AgentLayout>
              </ProtectedRoute>
            } 
          />

          {/* Customer Routes */}
          <Route 
            path="/customer/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payment" 
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ticket/:bookingId" 
            element={
              <ProtectedRoute>
                <TicketPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
