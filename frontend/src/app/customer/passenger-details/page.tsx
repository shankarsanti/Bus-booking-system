'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { firestoreService } from '../../../lib/firestore';
import { generatePNR } from '../../../utils/generatePNR';

interface PassengerDetail {
  name: string;
  age: string;
  gender: string;
}

export default function CustomerPassengerDetails() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookingData, setBookingData] = useState<any>(null);
  const [passengers, setPassengers] = useState<PassengerDetail[]>([]);
  const [contactDetails, setContactDetails] = useState({
    name: user?.displayName || '',
    mobile: user?.phoneNumber || '',
    email: user?.email || ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('customerBooking');
    if (!stored) {
      navigate('/customer/dashboard');
      return;
    }

    const data = JSON.parse(stored);
    setBookingData(data);

    // Initialize passenger forms
    const initialPassengers = data.selectedSeats.map(() => ({
      name: '',
      age: '',
      gender: 'Male'
    }));
    setPassengers(initialPassengers);
  }, []);

  const updatePassenger = (index: number, field: keyof PassengerDetail, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const validateForm = () => {
    if (!contactDetails.name || !contactDetails.mobile || !contactDetails.email) {
      alert('Please fill in all contact details');
      return false;
    }

    if (!/^[0-9]{10}$/.test(contactDetails.mobile.replace(/\D/g, ''))) {
      alert('Please enter a valid 10-digit mobile number');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactDetails.email)) {
      alert('Please enter a valid email address');
      return false;
    }

    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.name || !p.age || !p.gender) {
        alert(`Please fill in all details for passenger ${i + 1}`);
        return false;
      }

      const age = parseInt(p.age);
      if (isNaN(age) || age < 1 || age > 120) {
        alert(`Please enter a valid age (1-120) for passenger ${i + 1}`);
        return false;
      }
    }

    return true;
  };

  const handleConfirmBooking = async () => {
    if (!validateForm()) return;

    if (!user?.uid) {
      alert('User not authenticated');
      return;
    }

    setLoading(true);

    try {
      const pnr = generatePNR();
      const now = new Date().toISOString();

      const bookingDoc = {
        tripId: bookingData.tripId,
        busId: bookingData.trip.busId,
        routeId: bookingData.trip.routeId,
        userId: user.uid,
        seats: bookingData.selectedSeats,
        passengerDetails: passengers.map((p, i) => ({
          seatNumber: bookingData.selectedSeats[i],
          name: p.name,
          age: parseInt(p.age),
          gender: p.gender
        })),
        passengerName: contactDetails.name,
        passengerMobile: contactDetails.mobile,
        passengerEmail: contactDetails.email,
        totalAmount: bookingData.totalAmount,
        status: 'pending',
        paymentStatus: 'pending',
        pnr,
        bookingDate: now,
        createdAt: now
      };

      const bookingRef = await firestoreService.create('bookings', bookingDoc);

      // Update trip available seats
      const newAvailableSeats = bookingData.trip.availableSeats - bookingData.selectedSeats.length;
      await firestoreService.update('trips', bookingData.tripId, {
        availableSeats: newAvailableSeats
      });

      sessionStorage.setItem('pendingBookingId', bookingRef.id);
      sessionStorage.setItem('pendingBookingPNR', pnr);

      navigate(`/customer/payment?bookingId=${bookingRef.id}`);

    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-blue-600 hover:text-blue-800"
        >
          ← Back to Seat Selection
        </button>

        <h1 className="text-3xl font-bold mb-6">Enter Passenger Details</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Contact Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={contactDetails.name}
                    onChange={(e) => setContactDetails({ ...contactDetails, name: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={contactDetails.mobile}
                    onChange={(e) => setContactDetails({ ...contactDetails, mobile: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="10-digit mobile"
                    maxLength={10}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={contactDetails.email}
                    onChange={(e) => setContactDetails({ ...contactDetails, email: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Passenger Details */}
            {passengers.map((passenger, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold mb-4">
                  Passenger {index + 1} - Seat {bookingData.selectedSeats[index]}
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <input
                      type="text"
                      required
                      value={passenger.name}
                      onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                      className="w-full border rounded-lg px-4 py-2"
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Age *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="120"
                      value={passenger.age}
                      onChange={(e) => updatePassenger(index, 'age', e.target.value)}
                      className="w-full border rounded-lg px-4 py-2"
                      placeholder="Age"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Gender *</label>
                    <select
                      value={passenger.gender}
                      onChange={(e) => updatePassenger(index, 'gender', e.target.value)}
                      className="w-full border rounded-lg px-4 py-2"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Booking Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-6">
            <h3 className="text-xl font-bold mb-4">Booking Summary</h3>

            <div className="space-y-3 mb-6">
              <div>
                <p className="text-sm text-gray-600">Route</p>
                <p className="font-semibold">{bookingData.route?.source} → {bookingData.route?.destination}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bus</p>
                <p className="font-semibold">{bookingData.bus?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date & Time</p>
                <p className="font-semibold">
                  {new Date(bookingData.trip?.date).toLocaleDateString()}
                </p>
                <p className="text-sm">{bookingData.trip?.departureTime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Seats</p>
                <p className="font-semibold">{bookingData.selectedSeats.join(', ')}</p>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2 mb-6">
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Total Amount:</span>
                <span className="font-bold text-blue-600">₹{bookingData.totalAmount}</span>
              </div>
            </div>

            <button
              onClick={handleConfirmBooking}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
