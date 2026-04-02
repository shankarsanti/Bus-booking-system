'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { firestoreService, COLLECTIONS } from '../../../lib/firestore';
import { busService } from '../../../services/busService';
import { routeService } from '../../../services/routeService';
import { tripService } from '../../../services/tripService';
import { downloadTicketPDF, printTicketPDF } from '../../../utils/ticketPDF';
import { Download, Printer, CreditCard } from 'lucide-react';

export default function AgentBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  useEffect(() => {
    filterBookings();
  }, [searchTerm, statusFilter, bookings]);

  const loadBookings = async () => {
    try {
      if (!user?.uid) {
        console.error('No user ID available');
        return;
      }
      
      const allBookings = await firestoreService.getAll(COLLECTIONS.BOOKINGS);
      const agentBookings = allBookings.filter((b: any) => b.agentId === user.uid);

      // Enrich with bus and route data
      const enriched = await Promise.all(
        agentBookings.map(async (booking: any) => {
          try {
            const [bus, route, trip] = await Promise.all([
              busService.getBus(booking.busId),
              routeService.getRoute(booking.routeId),
              tripService.getTrip(booking.tripId)
            ]);
            return { 
              ...booking, 
              bus, 
              route,
              busName: bus?.name,
              busNumber: bus?.number,
              busType: bus?.type,
              source: route?.source,
              destination: route?.destination,
              departureTime: trip?.departureTime,
              arrivalTime: trip?.arrivalTime,
              date: trip?.date
            };
          } catch (error) {
            return booking;
          }
        })
      );

      // Sort by date (newest first)
      enriched.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());

      setBookings(enriched);
      setFilteredBookings(enriched);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(b =>
        b.pnr?.toLowerCase().includes(term) ||
        b.passengerName?.toLowerCase().includes(term) ||
        b.passengerMobile?.includes(term)
      );
    }

    setFilteredBookings(filtered);
  };

  const handleCancelBooking = async (booking: any) => {
    if (!confirm(`Are you sure you want to cancel booking ${booking.pnr}?`)) {
      return;
    }

    if (!user?.uid) {
      alert('User not authenticated');
      return;
    }

    try {
      // Update booking status
      await firestoreService.update(COLLECTIONS.BOOKINGS, booking.id, {
        status: 'cancelled'
      });

      // Refund to wallet
      const walletData = await firestoreService.read('wallets', user.uid);
      if (!walletData) {
        alert('Wallet not found');
        return;
      }

      const wallet = walletData as any;
      const refundAmount = booking.totalAmount;
      const commissionDeduction = booking.commission;

      // Create refund transaction
      await firestoreService.create('walletTransactions', {
        agentId: user.uid,
        bookingId: booking.id,
        type: 'credit',
        amount: refundAmount,
        balanceBefore: wallet.balance,
        balanceAfter: wallet.balance + refundAmount,
        description: `Refund for cancelled PNR: ${booking.pnr}`,
        createdAt: new Date().toISOString()
      });

      // Deduct commission
      await firestoreService.create('walletTransactions', {
        agentId: user.uid,
        bookingId: booking.id,
        type: 'debit',
        amount: commissionDeduction,
        balanceBefore: wallet.balance + refundAmount,
        balanceAfter: wallet.balance + refundAmount - commissionDeduction,
        description: `Commission reversal for PNR: ${booking.pnr}`,
        createdAt: new Date().toISOString()
      });

      // Update wallet
      await firestoreService.update('wallets', user.uid, {
        balance: wallet.balance + refundAmount - commissionDeduction,
        totalCommissionEarned: wallet.totalCommissionEarned - commissionDeduction,
        totalBookings: wallet.totalBookings - 1
      });

      // Update trip seats
      const tripData = await firestoreService.read(COLLECTIONS.TRIPS, booking.tripId);
      if (tripData) {
        const trip = tripData as any;
        await firestoreService.update(COLLECTIONS.TRIPS, booking.tripId, {
          availableSeats: trip.availableSeats + booking.seats.length
        });
      }

      alert('Booking cancelled successfully');
      loadBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking');
    }
  };

  const handleDownloadReceipt = (booking: any) => {
    try {
      console.log('Downloading receipt for booking:', booking.pnr);
      downloadTicketPDF(booking);
    } catch (error) {
      console.error('Error in handleDownloadReceipt:', error);
      alert('Failed to download receipt. Please check the console for details.');
    }
  };

  const handlePrintReceipt = (booking: any) => {
    try {
      console.log('Printing receipt for booking:', booking.pnr);
      printTicketPDF(booking);
    } catch (error) {
      console.error('Error in handlePrintReceipt:', error);
      alert('Failed to print receipt. Please check the console for details.');
    }
  };

  const handleCompletePayment = (booking: any) => {
    // Navigate to payment page with booking ID
    navigate(`/agent/payment?bookingId=${booking.id}`);
  };

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Total Bookings</h3>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Confirmed</h3>
            <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Pending</h3>
            <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Cancelled</h3>
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-4">
          <input
            type="text"
            placeholder="Search by PNR, name, or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">PNR: {booking.pnr}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-gray-600">{booking.passengerName} • {booking.passengerMobile}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Booking Date</p>
                  <p className="font-semibold">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Route</p>
                  <p className="font-semibold">{booking.route?.source} → {booking.route?.destination}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bus</p>
                  <p className="font-semibold">{booking.bus?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Seats</p>
                  <p className="font-semibold">{booking.seats?.join(', ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Passengers</p>
                  <p className="font-semibold">{booking.passengerDetails?.length || booking.seats?.length}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="text-lg font-bold text-blue-600">₹{booking.totalAmount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Commission</p>
                    <p className="text-lg font-bold text-green-600">₹{booking.commission?.toFixed(0)}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handleCompletePayment(booking)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                      title="Complete Payment"
                    >
                      <CreditCard className="w-4 h-4" />
                      Complete Payment
                    </button>
                  )}
                  {booking.status === 'confirmed' && (
                    <>
                      <button
                        onClick={() => handleDownloadReceipt(booking)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                        title="Download Receipt"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                      <button
                        onClick={() => handlePrintReceipt(booking)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                        title="Print Receipt"
                      >
                        <Printer className="w-4 h-4" />
                        Print
                      </button>
                    </>
                  )}
                  {(booking.status === 'confirmed' || booking.status === 'pending') && (
                    <button
                      onClick={() => handleCancelBooking(booking)}
                      className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredBookings.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-2xl font-bold mb-2">No bookings found</h2>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Start booking tickets for your customers'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
