import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  slotId: mongoose.Types.ObjectId;
  learnerId: mongoose.Types.ObjectId;
  coachId: mongoose.Types.ObjectId;
  
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
  cancelledBy?: mongoose.Types.ObjectId;
  cancelledAt?: Date;
  refundAmount?: number;
  
  // Review
  isReviewed: boolean;
  reviewId?: mongoose.Types.ObjectId;
  
  scheduledFor: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  slotId: {
    type: Schema.Types.ObjectId,
    ref: 'Slot',
    required: true,
  },
  learnerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  coachId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  // Payment
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
  
  paymentIntentId: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending',
  },
  
  // Session
  sessionStatus: {
    type: String,
    required: true,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled',
  },
  videoRoomUrl: {
    type: String,
    required: true,
  },
  videoRoomId: {
    type: String,
    required: true,
  },
  
  // Cancellation
  cancellationReason: {
    type: String,
  },
  cancelledBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  cancelledAt: {
    type: Date,
  },
  refundAmount: {
    type: Number,
    min: 0,
  },
  
  // Review
  isReviewed: {
    type: Boolean,
    default: false,
  },
  reviewId: {
    type: Schema.Types.ObjectId,
    ref: 'Review',
  },
  
  scheduledFor: {
    type: Date,
    required: true,
  },
  completedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Indexes
BookingSchema.index({ learnerId: 1 });
BookingSchema.index({ coachId: 1 });
BookingSchema.index({ slotId: 1 });
BookingSchema.index({ scheduledFor: 1 });
BookingSchema.index({ sessionStatus: 1 });
BookingSchema.index({ paymentStatus: 1 });

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
