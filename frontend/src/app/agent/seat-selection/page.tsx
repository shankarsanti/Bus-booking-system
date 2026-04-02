'use client';

import { useEffect, useState, Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { tripService } from '../../../services/tripService';
import { busService } from '../../../services/busService';
import { routeService } from '../../../services/routeService';
import { firestoreService } from '../../../lib/firestore';

function SeatSelectionContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const tripId = searchParams.get('tripId');

  const [trip, setTrip] = useState<any>(null);
  const [bus, setBus] = useState<any>(null);
  const [route, setRoute] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tripId && user) {
      loadTripData();
      loadWallet();
    }
  }, [tripId, user]);

  const loadTripData = async () => {
    try {
      const tripData = await tripService.getTrip(tripId!);
      setTrip(tripData);

      const busData = await busService.getBus(tripData.busId);
      setBus(busData);

      const routeData = await routeService.getRoute(tripData.routeId);
      setRoute(routeData);

      // Get booked seats for this trip
      const bookings = await firestoreService.queryDocs('bookings', []);
      const tripBookings = bookings.filter((b: any) => b.tripId === tripId && b.status !== 'cancelled');
      const booked = tripBookings.flatMap((b: any) => b.seats || []);
      setBookedSeats(booked);

    } catch (error) {
      console.error('Error loading trip data:', error);
      alert('Failed to load trip details');
    } finally {
      setLoading(false);
    }
  };

  const loadWallet = async () => {
    try {
      if (!user?.uid) {
        console.error('No user ID available');
        return;
      }
      
      const walletData = await firestoreService.read('wallets', user.uid);
      setWallet(walletData);
    } catch (error) {
      console.error('Error loading wallet:', error);
    }
  };

  const toggleSeat = (seatNumber: string) => {
    if (bookedSeats.includes(seatNumber)) return;

    setSelectedSeats(prev =>
      prev.includes(seatNumber)
        ? prev.filter(s => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const generateSeats = () => {
    const totalSeats = bus?.totalSeats || 40;
    const seats = [];
    for (let i = 1; i <= totalSeats; i++) {
      seats.push(`S${i}`);
    }
    return seats;
  };

  const totalAmount = selectedSeats.length * (trip?.basePrice || 0);
  const commission = totalAmount * ((user as any)?.commissionRate || 0.05);
  const hasInsufficientBalance = wallet && totalAmount > wallet.balance;

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    if (hasInsufficientBalance) {
      alert('Insufficient wallet balance. Please add funds to continue.');
      return;
    }

    // Store selection in sessionStorage and navigate
    sessionStorage.setItem('agentBooking', JSON.stringify({
      tripId,
      selectedSeats,
      totalAmount,
      commission,
      trip,
      bus,
      route
    }));

    navigate('/agent/passenger-details');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading seat layout...</div>
      </div>
    );
  }

  const seats = generateSeats();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-blue-600 hover:text-blue-800"
        >
          ← Back to Search
        </button>

        <h1 className="text-3xl font-bold mb-6">Select Seats for Customer</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Seat Layout */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">{bus?.name}</h2>
              <p className="text-gray-600">{route?.source} → {route?.destination}</p>
              <p className="text-sm text-gray-500">
                {new Date(trip?.date).toLocaleDateString()} • {trip?.departureTime}
              </p>
            </div>

            {/* Legend */}
            <div className="flex gap-6 mb-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 border-2 border-gray-300 rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 border-2 border-blue-600 rounded"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-200 border-2 border-red-300 rounded"></div>
                <span>Booked</span>
              </div>
            </div>

            {/* Seats Grid */}
            <div className="grid grid-cols-4 gap-3">
              {seats.map((seat) => {
                const isBooked = bookedSeats.includes(seat);
                const isSelected = selectedSeats.includes(seat);

                return (
                  <button
                    key={seat}
                    onClick={() => toggleSeat(seat)}
                    disabled={isBooked}
                    className={`h-12 rounded font-semibold text-sm transition ${
                      isBooked
                        ? 'bg-red-200 border-2 border-red-300 cursor-not-allowed'
                        : isSelected
                        ? 'bg-blue-500 text-white border-2 border-blue-600'
                        : 'bg-gray-200 border-2 border-gray-300 hover:bg-gray-300'
                    }`}
                  >
                    {seat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Booking Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-6">
            <h3 className="text-xl font-bold mb-4">Booking Summary</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Selected Seats:</span>
                <span className="font-semibold">
                  {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price per seat:</span>
                <span className="font-semibold">₹{trip?.basePrice}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Total Amount:</span>
                <span className="font-bold text-blue-600">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Your Commission:</span>
                <span className="font-bold">₹{commission.toFixed(0)}</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Wallet Balance:</span>
                <span className={`font-bold ${hasInsufficientBalance ? 'text-red-600' : 'text-green-600'}`}>
                  ₹{wallet?.balance || 0}
                </span>
              </div>
              {hasInsufficientBalance && (
                <p className="text-sm text-red-600 mt-2">
                  Insufficient balance! Need ₹{(totalAmount - (wallet?.balance || 0)).toFixed(0)} more.
                </p>
              )}
            </div>

            <button
              onClick={handleProceed}
              disabled={selectedSeats.length === 0 || hasInsufficientBalance}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {selectedSeats.length === 0
                ? 'Select Seats'
                : hasInsufficientBalance
                ? 'Insufficient Balance'
                : 'Proceed to Passenger Details'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AgentSeatSelection() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <SeatSelectionContent />
    </Suspense>
  );
}
