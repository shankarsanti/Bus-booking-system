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
  const [wallet, setWallet] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookingId && user) {
      loadBookingAndWallet();
    } else if (!bookingId) {
      setError('No booking ID provided');
      setLoading(false);
    }
  }, [bookingId, user]);

  const loadBookingAndWallet = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.uid) {
        console.error('No user ID available');
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      console.log('Loading booking:', bookingId);
      const bookingData = await firestoreService.read('bookings', bookingId!);
      
      if (!bookingData) {
        console.error('Booking not found:', bookingId);
        setError('Booking not found');
        setLoading(false);
        return;
      }

      console.log('Booking loaded:', bookingData);
      setBooking(bookingData);

      console.log('Loading wallet for user:', user.uid);
      let walletData = await firestoreService.read('wallets', user.uid);
      
      if (!walletData) {
        console.warn('Wallet not found for user:', user.uid);
        console.log('Creating wallet for user...');
        
        // Create wallet with user ID as document ID
        await firestoreService.createWithId('wallets', user.uid, {
          agentId: user.uid,
          balance: 0,
          totalCommissionEarned: 0,
          totalBookings: 0
        });
        
        // Read the newly created wallet
        walletData = await firestoreService.read('wallets', user.uid);
        
        if (!walletData) {
          setError('Failed to create wallet');
          setLoading(false);
          return;
        }
      }
      
      console.log('Wallet loaded:', walletData);
      setWallet(walletData);

      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load booking details: ' + (error as Error).message);
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!booking || !wallet || !user?.uid) return;

    // Check wallet balance
    if (wallet.balance < booking.totalAmount) {
      alert('Insufficient wallet balance. Please add funds to continue.');
      return;
    }

    setProcessing(true);

    try {
      // Create wallet transactions
      const now = new Date().toISOString();

      // Debit transaction for booking payment
      await firestoreService.create('walletTransactions', {
        agentId: user.uid,
        bookingId: booking.id,
        type: 'debit',
        amount: booking.totalAmount,
        balanceBefore: wallet.balance,
        balanceAfter: wallet.balance - booking.totalAmount,
        description: `Booking payment for PNR: ${booking.pnr}`,
        createdAt: now
      });

      // Credit transaction for commission
      const newBalance = wallet.balance - booking.totalAmount + booking.commission;
      await firestoreService.create('walletTransactions', {
        agentId: user.uid,
        bookingId: booking.id,
        type: 'credit',
        amount: booking.commission,
        balanceBefore: wallet.balance - booking.totalAmount,
        balanceAfter: newBalance,
        description: `Commission for PNR: ${booking.pnr}`,
        createdAt: now
      });

      // Update wallet
      await firestoreService.update('wallets', user.uid, {
        balance: newBalance,
        totalCommissionEarned: (wallet.totalCommissionEarned || 0) + booking.commission,
        totalBookings: (wallet.totalBookings || 0) + 1
      });

      // Update booking status
      await firestoreService.update('bookings', bookingId!, {
        status: 'confirmed',
        paymentStatus: 'completed'
      });

      // Clear session storage
      sessionStorage.removeItem('agentBooking');
      sessionStorage.removeItem('pendingBookingId');
      sessionStorage.removeItem('pendingBookingPNR');

      // Navigate to success page
      navigate(`/agent/booking-success?pnr=${booking.pnr}`);

    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <div className="text-xl text-gray-700">Loading payment details...</div>
        <div className="text-sm text-gray-500 mt-2">Please wait</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/agent/dashboard')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!booking || !wallet) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Data Not Found</h1>
          <p className="text-gray-600 mb-6">Booking or wallet information is missing.</p>
          <button
            onClick={() => navigate('/agent/dashboard')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const hasInsufficientBalance = wallet.balance < booking.totalAmount;

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
            <span className="font-bold">₹{booking.totalAmount}</span>
          </div>
          <div className="flex justify-between py-2 border-b text-green-600">
            <span>Commission Earned:</span>
            <span className="font-bold">₹{booking.commission.toFixed(0)}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Wallet Balance:</span>
            <span className={`font-bold ${hasInsufficientBalance ? 'text-red-600' : 'text-green-600'}`}>
              ₹{wallet.balance}
            </span>
          </div>
          <div className="flex justify-between py-2 text-lg">
            <span className="font-semibold">Balance After:</span>
            <span className="font-bold text-blue-600">
              ₹{(wallet.balance - booking.totalAmount + booking.commission).toFixed(0)}
            </span>
          </div>
        </div>

        {hasInsufficientBalance ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm font-semibold mb-2">
              Insufficient wallet balance. You need ₹{(booking.totalAmount - wallet.balance).toFixed(0)} more to complete this booking.
            </p>
            <p className="text-red-700 text-xs mt-2">
              Please contact your admin to add funds to your wallet.
            </p>
            <div className="mt-3 pt-3 border-t border-red-200">
              <p className="text-xs text-red-600">
                <strong>Current Balance:</strong> ₹{wallet.balance.toLocaleString()} <br />
                <strong>Required Amount:</strong> ₹{booking.totalAmount.toLocaleString()} <br />
                <strong>Shortfall:</strong> ₹{(booking.totalAmount - wallet.balance).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              ₹{booking.totalAmount} will be deducted from your wallet and ₹{booking.commission.toFixed(0)} commission will be credited.
            </p>
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={processing || hasInsufficientBalance}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
        >
          {processing ? 'Processing...' : hasInsufficientBalance ? 'Insufficient Balance' : 'Confirm Payment'}
        </button>

        {hasInsufficientBalance && (
          <button
            onClick={() => navigate('/agent/wallet')}
            className="w-full mt-3 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            View Wallet
          </button>
        )}

        <button
          onClick={() => navigate('/agent/dashboard')}
          className="w-full mt-3 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function AgentPayment() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
