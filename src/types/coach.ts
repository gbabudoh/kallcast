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
  title?: string;
  company?: string;
  location?: string;
  responseTime?: number;
  background?: string;
  specialties?: string[];
  sessionTitle?: string;
  sessionGains?: string[];
  coachAchievements?: {
    title: string;
    description?: string;
  }[];
}

export interface CoachStats {
  totalSessions: number;
  totalEarnings: number;
  averageRating: number;
  totalBookings: number;
  upcomingSessions: number;
  monthlyEarnings: number;
}
