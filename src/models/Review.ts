import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  bookingId: mongoose.Types.ObjectId;
  coachId: mongoose.Types.ObjectId;
  learnerId: mongoose.Types.ObjectId;
  
  rating: number; // 1-5
  comment: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>({
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
  
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
}, {
  timestamps: true,
});

// Indexes
ReviewSchema.index({ bookingId: 1 });
ReviewSchema.index({ coachId: 1 });
ReviewSchema.index({ learnerId: 1 });
ReviewSchema.index({ rating: 1 });

// Ensure one review per booking
ReviewSchema.index({ bookingId: 1 }, { unique: true });

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
