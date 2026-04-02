'use client';

import { useEffect, useState, Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { firestoreService } from '../../../lib/firestore';
import { tripService } from '../../../services/tripService';
import { busService } from '../../../services/busService';
import { routeService } from '../../../services/routeService';
import { downloadTicketPDF, printTicketPDF } from '../../../utils/ticketPDF';
import { Link } from 'react-router-dom';
import { Download, Printer } from 'lucide-react';

function BookingSuccessContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pnr = searchParams.get('pnr');

  const [booking, setBooking] = useState<any>(null);
  const [enrichedBooking, setEnrichedBooking] = useState<any>(null);
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
        // Enrich with trip, bus, and route data
        const [trip, bus, route] = await Promise.all([
          tripService.getTrip(found.tripId),
          busService.getBus(found.busId),
          routeService.getRoute(found.routeId)
        ]);

        const enriched = {
          ...found,
          busName: bus?.name,
          busNumber: bus?.registrationNumber,
          busType: bus?.type,
          source: route?.source,
          destination: route?.destination,
          departureTime: trip?.departureTime,
          arrivalTime: trip?.arrivalTime,
          date: trip?.date
        };

        setEnrichedBooking(enriched);
      }
    } catch (error) {
      console.error('Error loading booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = () => {
    if (enrichedBooking) {
      try {
        console.log('Downloading receipt for PNR:', enrichedBooking.pnr);
        downloadTicketPDF(enrichedBooking);
      } catch (error) {
        console.error('Error downloading receipt:', error);
        alert('Failed to download receipt. Please try again.');
      }
    }
  };

  const handlePrintReceipt = () => {
    if (enrichedBooking) {
      try {
        console.log('Printing receipt for PNR:', enrichedBooking.pnr);
        printTicketPDF(enrichedBooking);
      } catch (error) {
        console.error('Error printing receipt:', error);
        alert('Failed to print receipt. Please try again.');
      }
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
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600 mb-6">Your customer's booking has been successfully completed</p>

        {booking && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">PNR Number</p>
                <p className="text-2xl font-bold text-blue-600">{booking.pnr}</p>
              </div>
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
              <div className="pt-3 border-t">
                <p className="text-sm text-gray-600">Your Commission</p>
                <p className="text-xl font-bold text-green-600">₹{booking.commission?.toFixed(0)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {enrichedBooking && (
            <div className="flex gap-3">
              <button
                onClick={handleDownloadReceipt}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
              >
                <Download className="w-5 h-5" />
                Download Receipt
              </button>
              <button
                onClick={handlePrintReceipt}
                className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
              >
                <Printer className="w-5 h-5" />
                Print Receipt
              </button>
            </div>
          )}
          <Link
            to={`/agent/bookings`}
            className="block w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            View All Bookings
          </Link>
          <Link
            to="/agent/search"
            className="block w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition"
          >
            Book Another Ticket
          </Link>
          <Link
            to="/agent/dashboard"
            className="block w-full text-blue-600 hover:text-blue-800 py-2"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BookingSuccess() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <BookingSuccessContent />
    </Suspense>
  );
}
