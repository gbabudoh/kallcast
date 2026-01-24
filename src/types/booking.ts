export interface Booking {
  _id: string;
  slotId: string;
  learnerId: string;
  coachId: string;
  
  // Payment
  amount: number;
  platformFee: number; // 20%
  stripeFee: number;
  coachPayout: number;
  
  paymentIntentId: string;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  
  // Session
  sessionStatus: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  videoRoomUrl: string;
  videoRoomId: string;
  
  // Cancellation
  cancellationReason?: string;
  cancelledBy?: string;
  cancelledAt?: Date;
  refundAmount?: number;
  
  // Review
  isReviewed: boolean;
  reviewId?: string;
  
  scheduledFor: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBookingRequest {
  slotId: string;
  paymentMethodId: string;
}

export interface BookingWithDetails extends Booking {
  slot: {
    _id: string;
    title: string;
    description: string;
    duration: number;
    maxParticipants: number;
    category: string;
  };
  coach: {
    _id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
    hourlyRate: number;
  };
  learner: {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
    profileImage?: string;
  };
}

export interface BookingStats {
  totalBookings: number;
  upcomingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalSpent: number;
}
