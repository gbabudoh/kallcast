export interface Payment {
  _id: string;
  bookingId: string;
  coachId: string;
  learnerId: string;
  
  amount: number;
  platformFee: number;
  stripeFee: number;
  coachPayout: number;
  
  stripePaymentIntentId: string;
  stripeTransferId?: string;
  
  status: 'pending' | 'held' | 'transferred' | 'refunded';
  
  paidAt: Date;
  transferredAt?: Date;
  refundedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

export interface StripeConnectAccount {
  id: string;
  type: 'express';
  country: string;
  email: string;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  details_submitted: boolean;
}

export interface PaymentStats {
  totalEarnings: number;
  monthlyEarnings: number;
  pendingPayouts: number;
  totalPayouts: number;
  platformFees: number;
}
