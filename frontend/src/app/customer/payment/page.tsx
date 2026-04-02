'use client';

import { useEffect, useState, Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { firestoreService } from '../../../lib/firestore';

function PaymentContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const bookingId = searchParams.get('bookingId');

  const [booking, setBooking] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (bookingId && user) {
      loadBooking();
    }
  }, [bookingId, user]);

  const loadBooking = async () => {
    try {
      const bookingData = await firestoreService.read('bookings', bookingId!);
      setBooking(bookingData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load booking details');
    }
  };

  const handlePayment = async () => {
    if (!booking || !user?.uid) return;

    setProcessing(true);

    try {
      // Update booking status (in real app, integrate with payment gateway)
      await firestoreService.update('bookings', bookingId!, {
        status: 'confirmed',
        paymentStatus: 'completed'
      });

      // Clear session storage
      sessionStorage.removeItem('customerBooking');
      sessionStorage.removeItem('pendingBookingId');
      sessionStorage.removeItem('pendingBookingPNR');

      // Navigate to success page
      navigate(`/customer/booking-success?pnr=${booking.pnr}`);

    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (!booking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading payment details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">💳</div>
          <h1 className="text-2xl font-bold">Complete Payment</h1>
          <p className="text-gray-600 mt-2">PNR: {booking.pnr}</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Booking Amount:</span>
            <span className="font-bold text-blue-600 text-xl">₹{booking.totalAmount}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Seats:</span>
            <span className="font-semibold">{booking.seats?.join(', ')}</span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm">
            You will be redirected to payment gateway to complete the transaction.
          </p>
        </div>

        <button
          onClick={handlePayment}
          disabled={processing}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
        >
          {processing ? 'Processing...' : 'Pay Now'}
        </button>

        <button
          onClick={() => navigate('/customer/dashboard')}
          className="w-full mt-3 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function CustomerPayment() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
