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
  id: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  bio: string | null;
  expertise: string[];
  yearsExperience: number | null;
  hourlyRate: number | null;
  averageRating: number;
  totalSessions: number;
  isVerified: boolean;
  title: string | null;
  company: string | null;
  location: string | null;
  responseTime: number | null;
  background: string | null;
  specialties: string[] | null;
  sessionTitle: string | null;
  sessionGains: string[];
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
