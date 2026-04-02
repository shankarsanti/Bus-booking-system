import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { DataProvider } from './context/DataContext'
import Home from './pages/Home'
import SearchResults from './pages/SearchResults'
import BookingPage from './pages/BookingPage'
import MyBookings from './pages/MyBookings'
import TrackBus from './pages/TrackBus'
import ContactUs from './pages/ContactUs'
import AboutUs from './pages/AboutUs'
import Login from './pages/Login'
import Register from './pages/Register'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsConditions from './pages/TermsConditions'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminBuses from './pages/admin/AdminBuses'
import AdminBookings from './pages/admin/AdminBookings'
import AdminUsers from './pages/admin/AdminUsers'
import AdminOffers from './pages/admin/AdminOffers'
import AdminSettings from './pages/admin/AdminSettings'
import AdminReports from './pages/admin/AdminReports'
import AdminSeatPricing from './pages/admin/AdminSeatPricing'
import './App.css'

function App() {
  return (
    <DataProvider>
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/booking/:busId" element={<BookingPage />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/track-bus" element={<TrackBus />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/buses" element={<AdminBuses />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/offers" element={<AdminOffers />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/seat-pricing" element={<AdminSeatPricing />} />
      </Routes>
    </Router>
    </DataProvider>
  )
}

export default App
