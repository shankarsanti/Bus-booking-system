import { Timestamp } from 'firebase/firestore';

// Notification System
export interface Notification {
  id?: string;
  userId: string;
  type: 'booking' | 'payment' | 'cancellation' | 'offer' | 'system' | 'reminder';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
  createdAt: Timestamp;
}

// Review & Rating System
export interface Review {
  id?: string;
  bookingId: string;
  userId: string;
  busId: string;
  tripId: string;
  rating: number; // 1-5
  comment?: string;
  aspects?: {
    cleanliness?: number;
    punctuality?: number;
    staff?: number;
    comfort?: number;
  };
  helpful: number; // Count of helpful votes
  verified: boolean; // Verified booking
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

// Loyalty Program
export interface LoyaltyPoints {
  id?: string;
  userId: string;
  totalPoints: number;
  availablePoints: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  tierBenefits: string[];
  expiringPoints?: {
    points: number;
    expiryDate: Timestamp;
  }[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PointsTransaction {
  id?: string;
  userId: string;
  type: 'earned' | 'redeemed' | 'expired' | 'bonus';
  points: number;
  reason: string;
  bookingId?: string;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: Timestamp;
}

// Bus Tracking
export interface BusLocation {
  id?: string;
  tripId: string;
  busId: string;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  accuracy?: number;
  lastUpdated: Timestamp;
}

export interface TrackingUpdate {
  id?: string;
  tripId: string;
  status: 'scheduled' | 'departed' | 'in_transit' | 'delayed' | 'arrived' | 'cancelled';
  currentStop?: string;
  nextStop?: string;
  estimatedArrival?: Timestamp;
  delay?: number; // in minutes
  message?: string;
  createdAt: Timestamp;
}

// Operator Profile
export interface Operator {
  id?: string;
  operatorId?: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  address?: string;
  licenseNumber: string;
  gstNumber?: string;
  panNumber?: string;
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    bankName: string;
  };
  busIds: string[]; // Buses owned by operator
  rating?: number;
  totalTrips?: number;
  status: 'active' | 'inactive' | 'suspended';
  verificationStatus: 'pending' | 'verified' | 'rejected';
  documents?: {
    type: string;
    url: string;
    verified: boolean;
  }[];
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

// Support Ticket System
export interface SupportTicket {
  id?: string;
  ticketNumber: string;
  userId: string;
  bookingId?: string;
  category: 'booking' | 'payment' | 'refund' | 'technical' | 'feedback' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string; // Support staff ID
  messages: TicketMessage[];
  attachments?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  resolvedAt?: Timestamp;
}

export interface TicketMessage {
  id: string;
  userId: string;
  userRole: string;
  message: string;
  attachments?: string[];
  createdAt: Timestamp;
}

// Refund System
export interface Refund {
  id?: string;
  refundId: string;
  bookingId: string;
  userId: string;
  amount: number;
  reason: string;
  cancellationCharges: number;
  refundAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  paymentMethod: 'original' | 'wallet' | 'bank_transfer';
  processedBy?: string;
  remarks?: string;
  createdAt: Timestamp;
  processedAt?: Timestamp;
}

// Offer/Coupon Extended
export interface Offer {
  id?: string;
  code: string;
  title: string;
  description: string;
  type: 'percentage' | 'fixed' | 'cashback';
  value: number;
  minAmount?: number;
  maxDiscount?: number;
  applicableRoutes?: string[];
  applicableBuses?: string[];
  userType?: ('customer' | 'agent' | 'all')[];
  usageLimit?: number;
  usagePerUser?: number;
  currentUsage: number;
  validFrom: Timestamp;
  validUntil: Timestamp;
  status: 'active' | 'inactive' | 'expired';
  termsAndConditions?: string[];
  createdAt: Timestamp;
}

// Analytics & Reports
export interface ReportConfig {
  id?: string;
  name: string;
  type: 'booking' | 'revenue' | 'operator' | 'route' | 'customer' | 'agent';
  filters: Record<string, any>;
  dateRange: {
    from: Timestamp;
    to: Timestamp;
  };
  groupBy?: string;
  metrics: string[];
  format: 'pdf' | 'excel' | 'csv';
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
  };
  createdBy: string;
  createdAt: Timestamp;
}
