'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApi } from '@/hooks';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Star,
  TrendingUp,
  Clock,
  BookOpen,
  Video
} from 'lucide-react';

interface DashboardStatsProps {
  userRole: 'learner' | 'coach';
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
  const [stats, setStats] = useState<Stats>({
    totalSessions: 0,
    upcomingSessions: 0,
    completedSessions: 0,
    totalEarnings: 0,
    averageRating: 0,
    totalHours: 0,
  });
  const [hasTimedOut, setHasTimedOut] = useState(false);

  const { data: bookingsData, loading: isLoading } = useApi(async () => {
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
  }, { immediate: true, onError: () => {
    // Don't show toast for this error, just handle it silently
  }});

  useEffect(() => {
    if (bookingsData) {
      const bookings = bookingsData.bookings || [];
      
      // Calculate stats
      const totalSessions = bookings.length;
      const upcomingSessions = bookings.filter((b: any) => 
        b.sessionStatus === 'scheduled' && new Date(b.scheduledFor) > new Date()
      ).length;
      const completedSessions = bookings.filter((b: any) => 
        b.sessionStatus === 'completed'
      ).length;
      
      const totalEarnings = userRole === 'coach' 
        ? bookings
            .filter((b: any) => b.sessionStatus === 'completed')
            .reduce((sum: number, b: any) => sum + (b.coachPayout || 0), 0)
        : bookings
            .filter((b: any) => b.sessionStatus === 'completed')
            .reduce((sum: number, b: any) => sum + b.amount, 0);
      
      const totalHours = bookings
        .filter((b: any) => b.sessionStatus === 'completed')
        .reduce((sum: number, b: any) => sum + (b.slot?.duration || 0), 0) / 60;
      
      setStats({
        totalSessions,
        upcomingSessions,
        completedSessions,
        totalEarnings,
        totalHours,
      });
    }
  }, [bookingsData, userRole]);

  // Add timeout to prevent infinite loading
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        setHasTimedOut(true);
      }, 10000); // 10 second timeout

      return () => clearTimeout(timeout);
    } else {
      setHasTimedOut(false);
    }
  }, [isLoading]);

  const statsCards = userRole === 'learner' ? [
    {
      title: 'Total Sessions',
      value: stats.totalSessions,
      description: 'Sessions booked',
      icon: BookOpen,
      color: 'text-blue-600',
    },
    {
      title: 'Upcoming Sessions',
      value: stats.upcomingSessions,
      description: 'Sessions scheduled',
      icon: Calendar,
      color: 'text-green-600',
    },
    {
      title: 'Completed Sessions',
      value: stats.completedSessions,
      description: 'Sessions finished',
      icon: Video,
      color: 'text-purple-600',
    },
    {
      title: 'Learning Hours',
      value: Math.round(stats.totalHours || 0),
      description: 'Hours of learning',
      icon: Clock,
      color: 'text-orange-600',
    },
  ] : [
    {
      title: 'Total Sessions',
      value: stats.totalSessions,
      description: 'Sessions conducted',
      icon: BookOpen,
      color: 'text-blue-600',
    },
    {
      title: 'Upcoming Sessions',
      value: stats.upcomingSessions,
      description: 'Sessions scheduled',
      icon: Calendar,
      color: 'text-green-600',
    },
    {
      title: 'Total Earnings',
      value: `$${stats.totalEarnings || 0}`,
      description: 'Lifetime earnings',
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Average Rating',
      value: stats.averageRating || 0,
      description: 'Based on reviews',
      icon: Star,
      color: 'text-yellow-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">{stat.title}</CardTitle>
              <div className={`h-10 w-10 rounded-xl bg-gradient-to-r ${
                stat.color.includes('blue') ? 'from-blue-500 to-blue-600' :
                stat.color.includes('green') ? 'from-green-500 to-green-600' :
                stat.color.includes('purple') ? 'from-purple-500 to-purple-600' :
                stat.color.includes('orange') ? 'from-orange-500 to-orange-600' :
                'from-yellow-500 to-yellow-600'
              } flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <p className="text-sm text-gray-600">
                {stat.description}
              </p>
              {/* Progress indicator */}
              <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
                <div 
                  className={`h-1 rounded-full bg-gradient-to-r ${
                    stat.color.includes('blue') ? 'from-blue-500 to-blue-600' :
                    stat.color.includes('green') ? 'from-green-500 to-green-600' :
                    stat.color.includes('purple') ? 'from-purple-500 to-purple-600' :
                    stat.color.includes('orange') ? 'from-orange-500 to-orange-600' :
                    'from-yellow-500 to-yellow-600'
                  } transition-all duration-1000`}
                  style={{ width: `${Math.min((stat.value as number) * 10, 100)}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
