import mongoose, { Document, Schema } from 'mongoose';

export interface ISlot extends Document {
  coachId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  duration: number; // minutes
  maxParticipants: number; // 1-5
  category: string;
  
  // Availability
  startTime: Date;
  endTime: Date;
  isRecurring: boolean;
  recurrenceRule?: string;
  
  status: 'available' | 'booked' | 'completed' | 'cancelled';
  currentParticipants: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const SlotSchema = new Schema<ISlot>({
  coachId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  duration: {
    type: Number,
    required: true,
    min: 15,
    max: 480, // 8 hours
  },
  maxParticipants: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  
  // Availability
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  recurrenceRule: {
    type: String,
  },
  
  status: {
    type: String,
    required: true,
    enum: ['available', 'booked', 'completed', 'cancelled'],
    default: 'available',
  },
  currentParticipants: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
});

// Indexes
SlotSchema.index({ coachId: 1 });
SlotSchema.index({ startTime: 1, endTime: 1 });
SlotSchema.index({ status: 1 });
SlotSchema.index({ category: 1 });

// Validation
SlotSchema.pre('save', function(next) {
  if (this.endTime <= this.startTime) {
    next(new Error('End time must be after start time'));
  }
  if (this.currentParticipants > this.maxParticipants) {
    next(new Error('Current participants cannot exceed max participants'));
  }
  next();
});

export default mongoose.models.Slot || mongoose.model<ISlot>('Slot', SlotSchema);
