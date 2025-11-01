import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  bookingId: mongoose.Types.ObjectId;
  coachId: mongoose.Types.ObjectId;
  learnerId: mongoose.Types.ObjectId;
  
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

const PaymentSchema = new Schema<IPayment>({
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  coachId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  learnerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  platformFee: {
    type: Number,
    required: true,
    min: 0,
  },
  stripeFee: {
    type: Number,
    required: true,
    min: 0,
  },
  coachPayout: {
    type: Number,
    required: true,
    min: 0,
  },
  
  stripePaymentIntentId: {
    type: String,
    required: true,
  },
  stripeTransferId: {
    type: String,
  },
  
  status: {
    type: String,
    required: true,
    enum: ['pending', 'held', 'transferred', 'refunded'],
    default: 'pending',
  },
  
  paidAt: {
    type: Date,
    required: true,
  },
  transferredAt: {
    type: Date,
  },
  refundedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Indexes
PaymentSchema.index({ bookingId: 1 });
PaymentSchema.index({ coachId: 1 });
PaymentSchema.index({ learnerId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ paidAt: 1 });

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
