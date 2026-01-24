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
  paymentStatus: 'pending' | 'authorized' | 'captured' | 'paid' | 'refunded' | 'failed';
  escrowStatus: 'authorized' | 'captured' | 'released' | 'refunded' | 'disputed';
  
  // Session
  sessionStatus: 'scheduled' | 'in-progress' | 'pending_confirmation' | 'completed' | 'cancelled' | 'no-show' | 'disputed';
  videoRoomUrl: string;
  videoRoomId: string;
  
  // Session Confirmation (dual-party)
  coachConfirmed: boolean | null;
  clientConfirmed: boolean | null;
  coachConfirmedAt?: Date;
  clientConfirmedAt?: Date;
  
  // Actual timing
  actualStartTime?: Date;
  actualEndTime?: Date;
  actualDuration?: number; // in minutes
  
  // Cancellation
  cancellationReason?: string;
  cancelledBy?: mongoose.Types.ObjectId;
  cancelledAt?: Date;
  refundAmount?: number;
  
  // Review
  isReviewed: boolean;
  reviewId?: mongoose.Types.ObjectId;
  rating?: number;
  feedback?: string;
  
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
    enum: ['pending', 'authorized', 'captured', 'paid', 'refunded', 'failed'],
    default: 'pending',
  },
  escrowStatus: {
    type: String,
    enum: ['authorized', 'captured', 'released', 'refunded', 'disputed'],
    default: 'authorized',
  },
  
  // Session
  sessionStatus: {
    type: String,
    required: true,
    enum: ['scheduled', 'in-progress', 'pending_confirmation', 'completed', 'cancelled', 'no-show', 'disputed'],
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
  
  // Session Confirmation
  coachConfirmed: {
    type: Boolean,
    default: null,
  },
  clientConfirmed: {
    type: Boolean,
    default: null,
  },
  coachConfirmedAt: {
    type: Date,
  },
  clientConfirmedAt: {
    type: Date,
  },
  
  // Actual timing
  actualStartTime: {
    type: Date,
  },
  actualEndTime: {
    type: Date,
  },
  actualDuration: {
    type: Number,
    min: 0,
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
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  feedback: {
    type: String,
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
