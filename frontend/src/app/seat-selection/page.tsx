import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripService } from '../../services/tripService';
import SeatLayout from '../../components/SeatLayout';
import { generateSeats } from '../../utils/seatUtils';

export default function SeatSelectionPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  useEffect(() => {
    loadSeats();
  }, [tripId]);

  const loadSeats = async () => {
    if (tripId) {
      const trip = await tripService.getTrip(tripId);
      const seatData = generateSeats(40, 'seater');
      setSeats(seatData);
    }
  };

  const handleSeatSelect = (seatId: string) => {
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleContinue = () => {
    navigate(`/payment?tripId=${tripId}&seats=${selectedSeats.join(',')}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Select Your Seats</h1>
      <SeatLayout 
        seats={seats} 
        selectedSeats={selectedSeats}
        onSeatSelect={handleSeatSelect}
      />
      <div className="mt-6 text-center">
        <button 
          onClick={handleContinue}
          disabled={selectedSeats.length === 0}
          className="bg-blue-600 text-white px-8 py-3 rounded disabled:bg-gray-400"
        >
          Continue to Payment ({selectedSeats.length} seats)
        </button>
      </div>
    </div>
  );
}
