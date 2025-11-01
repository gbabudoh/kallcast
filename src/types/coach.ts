import { User } from './user';

export interface Coach extends User {
  role: 'coach';
  isVerified: boolean;
  stripeAccountId: string;
  stripeOnboardingComplete: boolean;
  hourlyRate: number;
  expertise: string[];
  yearsExperience: number;
  totalSessions: number;
  averageRating: number;
  totalEarnings: number;
}

export interface CoachProfile {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  bio?: string;
  expertise: string[];
  yearsExperience: number;
  hourlyRate: number;
  averageRating: number;
  totalSessions: number;
  isVerified: boolean;
}

export interface CoachStats {
  totalSessions: number;
  totalEarnings: number;
  averageRating: number;
  totalBookings: number;
  upcomingSessions: number;
  monthlyEarnings: number;
}
