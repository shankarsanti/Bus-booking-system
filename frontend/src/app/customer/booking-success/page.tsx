'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { firestoreService } from '../../../lib/firestore';
import { Link } from 'react-router-dom';
import { Download, CheckCircle } from 'lucide-react';
import { downloadTicketPDF } from '../../../utils/ticketPDF';

function BookingSuccessContent() {
  const [searchParams] = useSearchParams();
  const pnr = searchParams.get('pnr');

  const [booking, setBooking] = useState<any>(null);
  const [trip, setTrip] = useState<any>(null);
  const [bus, setBus] = useState<any>(null);
  const [route, setRoute] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pnr) {
      loadBooking();
    }
  }, [pnr]);

  const loadBooking = async () => {
    try {
      const bookings = await firestoreService.queryDocs('bookings', []);
      const found = bookings.find((b: any) => b.pnr === pnr);
      setBooking(found);

      if (found) {
        const foundAny = found as any;
        const [tripData, busData, routeData] = await Promise.all([
          firestoreService.read('trips', foundAny.tripId || ''),
          firestoreService.read('buses', foundAny.busId || ''),
          firestoreService.read('routes', foundAny.routeId || '')
        ]);
        setTrip(tripData);
        setBus(busData);
        setRoute(routeData);
      }
    } catch (error) {
      console.error('Error loading booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadStatement = () => {
    if (booking && trip && bus && route) {
      const ticketData = {
        ...booking,
        busName: bus.name,
        busNumber: bus.number,
        busType: bus.type,
        source: route.source,
        destination: route.destination,
        departureTime: trip.departureTime,
        arrivalTime: trip.arrivalTime,
        date: trip.date
      };
      downloadTicketPDF(ticketData);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading booking details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-20 h-20 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600 mb-6">Your booking has been successfully completed</p>

        {booking && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">PNR Number</p>
                <p className="text-2xl font-bold text-blue-600">{booking.pnr}</p>
              </div>
              {route && (
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-600">Route</p>
                  <p className="font-semibold">{route.source} → {route.destination}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                <div>
                  <p className="text-sm text-gray-600">Seats</p>
                  <p className="font-semibold">{booking.seats?.join(', ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount Paid</p>
                  <p className="font-semibold">₹{booking.totalAmount}</p>
                </div>
              </div>
              {trip && (
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-600">Journey Date</p>
                  <p className="font-semibold">{new Date(trip.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500">{trip.departureTime}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleDownloadStatement}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2"
          >
            <Download size={20} />
            Download Booking Statement
          </button>
          
          <Link
            to="/customer/bookings"
            className="block w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            View All Bookings
          </Link>
          
          <Link
            to="/customer/dashboard"
            className="block w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition"
          >
            Book Another Ticket
          </Link>
          
          <Link
            to="/customer/dashboard"
            className="block w-full text-blue-600 hover:text-blue-800 py-2"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CustomerBookingSuccess() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <BookingSuccessContent />
    </Suspense>
  );
}
