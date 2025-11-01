import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'learner' | 'coach';
  profileImage?: string;
  bio?: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Coach-specific fields
  isVerified?: boolean;
  stripeAccountId?: string;
  stripeOnboardingComplete?: boolean;
  hourlyRate?: number;
  expertise?: string[];
  yearsExperience?: number;
  
  // Stats
  totalSessions?: number;
  averageRating?: number;
  totalEarnings?: number;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['learner', 'coach'],
  },
  profileImage: {
    type: String,
  },
  bio: {
    type: String,
  },
  timezone: {
    type: String,
    required: true,
    default: 'UTC',
  },
  
  // Coach-specific fields
  isVerified: {
    type: Boolean,
    default: false,
  },
  stripeAccountId: {
    type: String,
  },
  stripeOnboardingComplete: {
    type: Boolean,
    default: false,
  },
  hourlyRate: {
    type: Number,
    min: 0,
  },
  expertise: [{
    type: String,
  }],
  yearsExperience: {
    type: Number,
    min: 0,
  },
  
  // Stats
  totalSessions: {
    type: Number,
    default: 0,
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalEarnings: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
});

// Indexes
UserSchema.index({ role: 1 });
UserSchema.index({ isVerified: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
