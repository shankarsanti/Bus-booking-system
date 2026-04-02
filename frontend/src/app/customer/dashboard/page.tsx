import { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { bookingService, Booking } from '../../../services/bookingService';
import { Link } from 'react-router-dom';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    if (user) {
      const data = await bookingService.getUserBookings(user.uid);
      setBookings(data as Booking[]);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Link to="/customer/bookings" className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700">
          <h3 className="text-xl font-semibold">My Bookings</h3>
          <p className="text-3xl font-bold mt-2">{bookings.length}</p>
        </Link>
        <Link to="/customer/profile" className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700">
          <h3 className="text-xl font-semibold">My Profile</h3>
          <p className="mt-2">Manage your account</p>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
        {bookings.slice(0, 5).map((booking) => (
          <div key={booking.id} className="border-b py-3 flex justify-between">
            <div>
              <p className="font-semibold">PNR: {booking.pnr}</p>
              <p className="text-sm text-gray-600">Seats: {booking.seats.join(', ')}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">₹{booking.totalAmount}</p>
              <p className="text-sm text-gray-600">{booking.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
