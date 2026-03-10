'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApi } from '@/hooks';
import { useRouter } from 'next/navigation';
import { BookingWithDetails } from '@/types/booking';
import { 
  Calendar, 
  DollarSign, 
  Star,
  Clock,
  BookOpen,
  Video,
  LucideIcon
} from 'lucide-react';

interface DashboardStatsProps {
  userRole: 'learner' | 'coach';
}

interface StatCard {
  title: string;
  value: string | number;
  rawVal: number;
  description: string;
  icon: LucideIcon;
  color: string;
  href?: string;
}

interface Stats {
  totalSessions: number;
  upcomingSessions: number;
  completedSessions: number;
  totalEarnings?: number;
  averageRating?: number;
  totalHours?: number;
}

export default function DashboardStats({ userRole }: DashboardStatsProps) {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalSessions: 0,
    upcomingSessions: 0,
    completedSessions: 0,
    totalEarnings: 0,
    averageRating: 0,
    totalHours: 0,
  });


  const fetchBookings = useCallback(async () => {
    const response = await fetch(`/api/bookings?role=${userRole}&type=all`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    return response.json();
  }, [userRole]);

  const { data: bookingsData } = useApi(fetchBookings, { immediate: true, onError: () => {
    // Don't show toast for this error, just handle it silently
  }});

  useEffect(() => {
    if (bookingsData) {
      const bookings = bookingsData.bookings || [];
      
      // Calculate stats
      const totalSessions = bookings.length;
      const upcomingSessions = bookings.filter((b: BookingWithDetails) => 
        b.sessionStatus === 'scheduled' && new Date(b.scheduledFor) > new Date()
      ).length;
      const completedSessions = bookings.filter((b: BookingWithDetails) => 
        b.sessionStatus === 'completed'
      ).length;
      
      const totalEarnings = userRole === 'coach' 
        ? bookings
            .filter((b: BookingWithDetails) => b.sessionStatus === 'completed')
            .reduce((sum: number, b: BookingWithDetails) => sum + (b.coachPayout || 0), 0)
        : bookings
            .filter((b: BookingWithDetails) => b.sessionStatus === 'completed')
            .reduce((sum: number, b: BookingWithDetails) => sum + b.amount, 0);
      
      const totalHours = bookings
        .filter((b: BookingWithDetails) => b.sessionStatus === 'completed')
        .reduce((sum: number, b: BookingWithDetails) => sum + (b.slot?.duration || 0), 0) / 60;
      
      setStats({
        totalSessions,
        upcomingSessions,
        completedSessions,
        totalEarnings,
        totalHours,
      });
    }
  }, [bookingsData, userRole]);



  const statsCards = userRole === 'learner' ? [
    {
      title: 'Total Sessions',
      value: stats.totalSessions,
      rawVal: stats.totalSessions,
      description: 'Sessions booked',
      icon: BookOpen,
      color: 'text-blue-600',
      href: '/learner/my-sessions',
    },
    {
      title: 'Upcoming Sessions',
      value: stats.upcomingSessions,
      rawVal: stats.upcomingSessions,
      description: 'Sessions scheduled',
      icon: Calendar,
      color: 'text-green-600',
      href: '/learner/my-sessions',
    },
    {
      title: 'Completed Sessions',
      value: stats.completedSessions,
      rawVal: stats.completedSessions,
      description: 'Sessions finished',
      icon: Video,
      color: 'text-purple-600',
      href: '/learner/my-sessions',
    },
    {
      title: 'Learning Hours',
      value: Math.round(stats.totalHours || 0),
      rawVal: Math.round(stats.totalHours || 0),
      description: 'Hours of learning',
      icon: Clock,
      color: 'text-orange-600',
      href: '/learner/my-sessions',
    },
  ] : [
    {
      title: 'Total Sessions',
      value: stats.totalSessions,
      rawVal: stats.totalSessions,
      description: 'Sessions conducted',
      icon: BookOpen,
      color: 'text-blue-600',
      href: '/coach/my-sessions',
    },
    {
      title: 'Upcoming Sessions',
      value: stats.upcomingSessions,
      rawVal: stats.upcomingSessions,
      description: 'Sessions scheduled',
      icon: Calendar,
      color: 'text-green-600',
      href: '/coach/my-sessions',
    },
    {
      title: 'Total Earnings',
      value: `$${stats.totalEarnings || 0}`,
      rawVal: stats.totalEarnings || 0,
      description: 'Lifetime earnings',
      icon: DollarSign,
      color: 'text-green-600',
      href: '/coach/earnings',
    },
    {
      title: 'Average Rating',
      value: stats.averageRating || 0,
      rawVal: stats.averageRating || 0,
      description: 'Based on reviews',
      icon: Star,
      color: 'text-yellow-600',
      href: '#', // Or reviews page if implemented
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((stat, index) => {
        const Icon = (stat as StatCard).icon;
        const href = (stat as StatCard).href;
        const rawVal = (stat as StatCard).rawVal;
        const progressWidth = rawVal > 0 ? Math.min(rawVal * 10, 100) : 0;
        
        return (
          <Card 
            key={index} 
            className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer" 
            onClick={() => href && router.push(href)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">{(stat as StatCard).title}</CardTitle>
              <div className={`h-10 w-10 rounded-xl bg-gradient-to-r ${
                (stat as StatCard).color.includes('blue') ? 'from-blue-500 to-blue-600' :
                (stat as StatCard).color.includes('green') ? 'from-green-500 to-green-600' :
                (stat as StatCard).color.includes('purple') ? 'from-purple-500 to-purple-600' :
                (stat as StatCard).color.includes('orange') ? 'from-orange-500 to-orange-600' :
                'from-yellow-500 to-yellow-600'
              } flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">{(stat as StatCard).value}</div>
              <p className="text-sm text-gray-600">
                {(stat as StatCard).description}
              </p>
              {/* Progress indicator */}
              <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
                <div 
                  className={`h-1 rounded-full bg-gradient-to-r ${
                    (stat as StatCard).color.includes('blue') ? 'from-blue-500 to-blue-600' :
                    (stat as StatCard).color.includes('green') ? 'from-green-500 to-green-600' :
                    (stat as StatCard).color.includes('purple') ? 'from-purple-500 to-purple-600' :
                    (stat as StatCard).color.includes('orange') ? 'from-orange-500 to-orange-600' :
                    'from-yellow-500 to-yellow-600'
                  } transition-all duration-1000`}
                  style={{ width: `${progressWidth}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
