export interface Seat {
  id: string;
  row: number;
  column: number;
  type: 'seater' | 'sleeper';
  isBooked: boolean;
  isSelected?: boolean;
}

export const generateSeats = (totalSeats: number, type: 'seater' | 'sleeper'): Seat[] => {
  const seats: Seat[] = [];
  const seatsPerRow = type === 'seater' ? 4 : 3;
  
  for (let i = 0; i < totalSeats; i++) {
    seats.push({
      id: `${i + 1}`,
      row: Math.floor(i / seatsPerRow),
      column: i % seatsPerRow,
      type,
      isBooked: false
    });
  }
  
  return seats;
};

export const getSeatLabel = (seat: Seat): string => {
  return seat.id;
};
