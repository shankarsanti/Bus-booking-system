import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { bookingService } from '../../services/bookingService';
import { paymentService } from '../../services/paymentService';

export default function PaymentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'upi' | 'netbanking' | 'wallet' | 'cash'>('card');

  const tripId = searchParams.get('tripId') || '';
  const seats = searchParams.get('seats')?.split(',') || [];
  const amount = seats.length * 500;

  const handlePayment = async () => {
    if (!user) {
      setError('Please login to continue');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // Step 1: Create booking
      const bookingId = await bookingService.createBooking({
        userId: user.uid,
        tripId,
        busId: 'bus-1',
        routeId: 'route-1',
        seats,
        totalAmount: amount,
        status: 'pending',
        paymentStatus: 'pending',
        pnr: `PNR${Date.now()}`,
        bookingDate: new Date().toISOString()
      });

      // Step 2: Create payment record
      const payment = await paymentService.initiatePayment({
        bookingId,
        userId: user.uid,
        amount,
        method: selectedMethod,
        status: 'pending'
      });

      // Step 3: Process payment (simulated)
      const success = await paymentService.processPayment(payment.id);

      if (success) {
        // Step 4: Update booking status
        await bookingService.updatePaymentStatus(bookingId, 'completed');

        // Step 5: Navigate to ticket page
        navigate(`/ticket/${bookingId}`);
      } else {
        throw new Error('Payment processing failed');
      }
    } catch (error: any) {
      console.error('Payment failed:', error);
      setError(error.message || 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Payment</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Seats:</span>
            <span className="font-semibold">{seats.join(', ')}</span>
          </div>
          <div className="flex justify-between">
            <span>Number of Seats:</span>
            <span className="font-semibold">{seats.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Price per Seat:</span>
            <span className="font-semibold">₹500</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between text-lg font-bold">
            <span>Total Amount:</span>
            <span>₹{amount}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="font-semibold mb-4">Select Payment Method</h3>
        <div className="space-y-3">
          {[
            { value: 'card', label: 'Credit/Debit Card', icon: '💳' },
            { value: 'upi', label: 'UPI', icon: '📱' },
            { value: 'netbanking', label: 'Net Banking', icon: '🏦' },
            { value: 'wallet', label: 'Wallet', icon: '👛' },
            { value: 'cash', label: 'Cash on Counter', icon: '💵' }
          ].map((method) => (
            <label
              key={method.value}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                selectedMethod === method.value
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.value}
                checked={selectedMethod === method.value}
                onChange={(e) => setSelectedMethod(e.target.value as any)}
                className="mr-3"
              />
              <span className="text-2xl mr-3">{method.icon}</span>
              <span className="font-medium">{method.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button 
        onClick={handlePayment}
        disabled={processing}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
      >
        {processing ? 'Processing...' : `Pay ₹{amount}`}
      </button>

      <p className="text-center text-sm text-gray-500 mt-4">
        By proceeding, you agree to our Terms & Conditions
      </p>
    </div>
  );
}
