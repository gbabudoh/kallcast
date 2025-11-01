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
}
