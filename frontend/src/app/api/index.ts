/**
 * Bus Booking System - API Index
 * 
 * Central export file for all API functions
 * Import from this file for cleaner imports
 * 
 * @example
 * import { createNotification, addPoints } from '@/app/api';
 */

// Notifications API
export {
  createNotification,
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from './notifications/route';

// Reviews API
export {
  createReview,
  getReviews,
  updateReviewStatus,
  markReviewHelpful,
  getBusRating
} from './reviews/route';

// Loyalty Program API
export {
  getLoyaltyAccount,
  addPoints,
  redeemPoints,
  calculateBookingPoints,
  getPointsTransactions,
  pointsToCurrency,
  currencyToPoints
} from './loyalty/route';

// Bus Tracking API
export {
  updateBusLocation,
  getBusLocation,
  createTrackingUpdate,
  getTrackingUpdates,
  getLatestTrackingStatus,
  calculateDistance,
  estimateArrival
} from './tracking/route';

// Operators API
export {
  createOperator,
  getOperator,
  getOperators,
  updateOperator,
  deleteOperator,
  assignBusToOperator,
  removeBusFromOperator,
  getOperatorStats
} from './operators/route';

// Support Tickets API
export {
  createSupportTicket,
  getSupportTicket,
  getUserTickets,
  getAllTickets,
  addTicketMessage,
  updateTicketStatus,
  assignTicket,
  updateTicketPriority,
  getTicketStats
} from './support/route';

// Refunds API
export {
  createRefund,
  getRefund,
  getUserRefunds,
  getAllRefunds,
  processRefund,
  updateRefundStatus,
  getRefundStats
} from './refunds/route';

// Payment APIs
export {
  createOrder
} from './create-order/route';

export {
  verifyPayment
} from './verify-payment/route';

// Type exports for convenience
export type {
  CreateNotificationRequest,
  GetNotificationsRequest
} from './notifications/route';

export type {
  CreateReviewRequest,
  GetReviewsRequest
} from './reviews/route';

export type {
  UpdateLocationRequest,
  CreateTrackingUpdateRequest
} from './tracking/route';

export type {
  CreateOperatorRequest,
  UpdateOperatorRequest
} from './operators/route';

export type {
  CreateTicketRequest,
  AddMessageRequest
} from './support/route';

export type {
  CreateRefundRequest
} from './refunds/route';

export type {
  CreateOrderRequest,
  CreateOrderResponse
} from './create-order/route';

export type {
  VerifyPaymentRequest
} from './verify-payment/route';
