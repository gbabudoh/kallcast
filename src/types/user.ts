export interface User {
  _id: string;
  email: string;
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

  // Enhanced Coach fields
  title?: string;
  company?: string;
  location?: string;
  responseTime?: number;
  specialties?: string[];
  background?: string;
  sessionTitle?: string;
  sessionGains?: string[];
  coachAchievements?: {
    title: string;
    description?: string;
  }[];
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'learner' | 'coach';
  timezone: string;
  bio?: string;
  expertise?: string[];
  yearsExperience?: number;
  hourlyRate?: number;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  timezone?: string;
  profileImage?: string;
  expertise?: string[];
  yearsExperience?: number;
  hourlyRate?: number;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'learner' | 'coach';
  profileImage?: string;
  isVerified?: boolean;
  stripeOnboardingComplete?: boolean;
  title?: string;
  company?: string;
}
