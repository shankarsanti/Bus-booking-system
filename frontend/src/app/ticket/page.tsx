import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { bookingService, Booking } from '../../services/bookingService';
import { busService } from '../../services/busService';
import { tripService } from '../../services/tripService';
import { downloadTicketPDF, printTicketPDF } from '../../utils/ticketPDF';

export default function TicketPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [ticketData, setTicketData] = useState<any>(null);

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  const loadBooking = async () => {
    if (bookingId) {
      const bookingData = await bookingService.getBooking(bookingId) as any;
      setBooking(bookingData as Booking);
      
      // Load additional details for PDF
      if (bookingData) {
        const tripData = await tripService.getTrip(bookingData.tripId) as any;
        const busData = await busService.getBus(bookingData.busId) as any;
        
        setTicketData({
          ...bookingData,
          busName: busData?.name,
          busNumber: busData?.number,
          busType: busData?.type,
          departureTime: tripData?.departureTime ? new Date(tripData.departureTime).toLocaleTimeString() : '',
          arrivalTime: tripData?.arrivalTime ? new Date(tripData.arrivalTime).toLocaleTimeString() : '',
          date: tripData?.date ? new Date(tripData.date).toLocaleDateString() : ''
        });
      }
    }
  };

  const handleDownload = () => {
    if (ticketData) {
      downloadTicketPDF(ticketData);
    }
  };

  const handlePrint = () => {
    if (ticketData) {
      printTicketPDF(ticketData);
    }
  };

  if (!booking) return <div className="p-6">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Your ticket has been booked successfully</p>
        </div>

        <div className="border-t border-b py-6 space-y-3">
          <div className="flex justify-between">
            <span className="font-semibold">PNR:</span>
            <span>{booking.pnr}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Seats:</span>
            <span>{booking.seats.join(', ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Total Amount:</span>
            <span>₹{booking.totalAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Status:</span>
            <span className="text-green-600">{booking.status}</span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button 
            onClick={handleDownload}
            className="bg-blue-600 text-white px-6 py-2 rounded mr-2 hover:bg-blue-700 transition"
          >
            Download Ticket
          </button>
          <button 
            onClick={handlePrint}
            className="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-50 transition"
          >
            Print Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
