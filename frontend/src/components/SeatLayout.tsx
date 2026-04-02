import React, { useState } from 'react';
import './SeatLayout.css';

export type SeatStatus = 'available' | 'booked' | 'blocked';

export interface Seat {
  id: string;
  row: number;
  column: string;
  status: SeatStatus;
  price?: number;
}

interface SeatLayoutProps {
  seats: Seat[];
  onSeatSelect?: (seat: Seat) => void;
  selectedSeats?: string[];
}

const SeatLayout: React.FC<SeatLayoutProps> = ({ 
  seats, 
  onSeatSelect,
  selectedSeats = []
}) => {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'available' && onSeatSelect) {
      onSeatSelect(seat);
    }
  };

  const getSeatClassName = (seat: Seat) => {
    const classes = ['seat'];
    
    if (seat.status === 'available') {
      classes.push('seat-available');
    } else if (seat.status === 'booked') {
      classes.push('seat-booked');
    } else if (seat.status === 'blocked') {
      classes.push('seat-blocked');
    }

    if (selectedSeats.includes(seat.id)) {
      classes.push('seat-selected');
    }

    if (hoveredSeat === seat.id && seat.status === 'available') {
      classes.push('seat-hover');
    }

    return classes.join(' ');
  };

  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<number, Seat[]>);

  const sortedRows = Object.keys(seatsByRow)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="seat-layout">
      <div className="seat-legend">
        <div className="legend-item">
          <div className="legend-box seat-available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-box seat-booked"></div>
          <span>Booked</span>
        </div>
        <div className="legend-item">
          <div className="legend-box seat-blocked"></div>
          <span>Blocked</span>
        </div>
        <div className="legend-item">
          <div className="legend-box seat-selected"></div>
          <span>Selected</span>
        </div>
      </div>

      <div className="seat-grid">
        {sortedRows.map((row) => (
          <div key={row} className="seat-row">
            <div className="row-label">{row}</div>
            <div className="seats">
              {seatsByRow[row]
                .sort((a, b) => a.column.localeCompare(b.column))
                .map((seat) => (
                  <button
                    key={seat.id}
                    className={getSeatClassName(seat)}
                    onClick={() => handleSeatClick(seat)}
                    onMouseEnter={() => setHoveredSeat(seat.id)}
                    onMouseLeave={() => setHoveredSeat(null)}
                    disabled={seat.status !== 'available'}
                    title={`${seat.row}${seat.column} - ${seat.status}${seat.price ? ` - ₹${seat.price}` : ''}`}
                  >
                    {seat.row}{seat.column}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatLayout;
