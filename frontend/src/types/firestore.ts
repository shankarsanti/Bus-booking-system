import { Timestamp } from 'firebase/firestore';

export interface User {
  id?: string;
  userId?: string;
  name: string;
  mobile: string;
  email: string;
  role: 'customer' | 'agent' | 'admin' | 'super_admin' | 'operator' | 'support';
  status?: 'active' | 'inactive';
  commission?: number;
  operatorId?: string; // For operators
  createdAt?: Timestamp;
}

export interface Bus {
  id?: string;
  busId?: string;
  name: string;
  number: string;
  type: string;
  totalSeats: number;
  operator?: string;
  operatorId?: string; // Reference to operator
  amenities?: string[];
  rating?: number; // Average rating from reviews
  totalReviews?: number;
  createdAt?: Timestamp;
}

export interface Route {
  id?: string;
  routeId?: string;
  source: string;
  destination: string;
  distance: number;
  duration: number;
  stops?: string[];
  createdAt?: Timestamp;
}

export interface Trip {
  id?: string;
  tripId?: string;
  busId: string;
  routeId: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  basePrice: number;
  availableSeats: number;
  createdAt?: Timestamp;
}

export interface Booking {
  id?: string;
  bookingId?: string;
  tripId: string;
  busId: string;
  routeId: string;
  userId: string;
  agentId?: string; // If booked by agent
  seats: string[];
  passengerName?: string;
  passengerMobile?: string;
  passengerEmail?: string;
  totalAmount: number;
  loyaltyPointsUsed?: number; // Points redeemed
  loyaltyPointsEarned?: number; // Points earned
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  status: 'confirmed' | 'pending' | 'cancelled';
  pnr: string;
  bookingDate: string;
  createdAt?: Timestamp;
}

