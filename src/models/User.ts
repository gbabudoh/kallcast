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
  
  // Enhanced Coach fields
  title?: string;
  company?: string;
  location?: string;
  responseTime?: number; // in hours
  specialties?: string[];
  background?: string;
  sessionTitle?: string;
  sessionGains?: string[];
  coachAchievements?: {
    title: string;
    description?: string;
  }[];
  
  // Stats
  totalSessions?: number;
  averageRating?: number;
  totalEarnings?: number;
  profileViews?: number;

  // Learner specific tracking
  learningGoals?: {
    title: string;
    target: number;
    current: number;
    category?: string;
  }[];
  achievements?: {
    title: string;
    icon: string;
    description?: string;
    unlockedAt: Date;
  }[];
  learningStreak?: number;
  lastActivityDate?: Date;
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
  
  // Enhanced Coach fields
  title: {
    type: String,
    trim: true,
  },
  company: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  responseTime: {
    type: Number,
    min: 0,
  },
  specialties: [{
    type: String,
  }],
  background: {
    type: String,
  },
  sessionTitle: {
    type: String,
    trim: true,
  },
  sessionGains: [{
    type: String,
  }],
  coachAchievements: [{
    title: { type: String, required: true },
    description: String,
  }],
  
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
  profileViews: {
    type: Number,
    default: 0,
    min: 0,
  },
  
  // Learner specific tracking
  learningGoals: [{
    title: String,
    target: Number,
    current: { type: Number, default: 0 },
    category: String,
  }],
  achievements: [{
    title: String,
    icon: String,
    description: String,
    unlockedAt: { type: Date, default: Date.now },
  }],
  learningStreak: {
    type: Number,
    default: 0,
  },
  lastActivityDate: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Indexes
UserSchema.index({ role: 1 });
UserSchema.index({ isVerified: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
