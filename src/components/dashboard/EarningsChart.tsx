'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  CreditCard,
  BarChart3
} from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

interface EarningsData {
  date: string;
  amount: number;
  sessions: number;
}

interface EarningsChartProps {
  timeRange?: '7d' | '30d' | '90d' | '1y';
}

export default function EarningsChart({ timeRange = '30d' }: EarningsChartProps) {
  const [earnings, setEarnings] = useState<EarningsData[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState(timeRange);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setIsLoading(true);
        
        // Calculate date range
        const endDate = new Date();
        const startDate = (() => {
          switch (selectedRange) {
            case '7d':
              return subDays(endDate, 7);
            case '30d':
              return subDays(endDate, 30);
            case '90d':
              return subDays(endDate, 90);
            case '1y':
              return subDays(endDate, 365);
            default:
              return subDays(endDate, 30);
          }
        })();

        // Fetch bookings for the date range
        const response = await fetch(`/api/bookings?role=coach&type=completed&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch earnings data');
        }
        
        const data = await response.json();
        const bookings = data.bookings || [];
        
        // Process earnings data
        const earningsMap = new Map<string, { amount: number; sessions: number }>();
        
        bookings.forEach((booking: any) => {
          if (booking.sessionStatus === 'completed') {
            const date = format(new Date(booking.completedAt || booking.scheduledFor), 'yyyy-MM-dd');
            const existing = earningsMap.get(date) || { amount: 0, sessions: 0 };
            earningsMap.set(date, {
              amount: existing.amount + (booking.coachPayout || 0),
              sessions: existing.sessions + 1,
            });
          }
        });

        // Fill in missing dates with zero earnings
        const allDates = eachDayOfInterval({ start: startDate, end: endDate });
        const earningsData = allDates.map(date => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const data = earningsMap.get(dateStr) || { amount: 0, sessions: 0 };
          return {
            date: dateStr,
            amount: data.amount,
            sessions: data.sessions,
          };
        });

        setEarnings(earningsData);
        setTotalEarnings(earningsData.reduce((sum, day) => sum + day.amount, 0));
        setTotalSessions(earningsData.reduce((sum, day) => sum + day.sessions, 0));
      } catch (error) {
        console.error('Error fetching earnings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEarnings();
  }, [selectedRange]);

  const getMaxAmount = () => {
    return Math.max(...earnings.map(e => e.amount), 1);
  };

  const getBarHeight = (amount: number) => {
    const max = getMaxAmount();
    return max > 0 ? (amount / max) * 100 : 0;
  };

  const getAverageEarnings = () => {
    const daysWithEarnings = earnings.filter(e => e.amount > 0).length;
    return daysWithEarnings > 0 ? totalEarnings / daysWithEarnings : 0;
  };

  const getTrend = () => {
    if (earnings.length < 2) return 0;
    const recent = earnings.slice(-7).reduce((sum, e) => sum + e.amount, 0);
    const previous = earnings.slice(-14, -7).reduce((sum, e) => sum + e.amount, 0);
    return previous > 0 ? ((recent - previous) / previous) * 100 : 0;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Earnings Overview</CardTitle>
          <CardDescription>Loading your earnings data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-32"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Earnings Overview</span>
            </CardTitle>
            <CardDescription>
              Your earnings for the last {selectedRange === '7d' ? '7 days' : selectedRange === '30d' ? '30 days' : selectedRange === '90d' ? '90 days' : 'year'}
            </CardDescription>
          </div>
          
          <div className="flex space-x-2">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <Button
                key={range}
                variant={selectedRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">Total Earnings</span>
            </div>
            <div className="text-2xl font-bold text-green-900">
              ${totalEarnings.toFixed(2)}
            </div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Sessions</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {totalSessions}
            </div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              {getTrend() >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
              <span className="text-sm font-medium text-purple-800">Trend</span>
            </div>
            <div className={`text-2xl font-bold ${getTrend() >= 0 ? 'text-green-900' : 'text-red-900'}`}>
              {getTrend() >= 0 ? '+' : ''}{getTrend().toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Daily Earnings</h4>
            <Badge variant="outline">
              Avg: ${getAverageEarnings().toFixed(2)}/day
            </Badge>
          </div>
          
          <div className="h-48 flex items-end space-x-1 bg-gray-50 rounded-lg p-4">
            {earnings.slice(-30).map((day, index) => (
              <div
                key={day.date}
                className="flex-1 flex flex-col items-center space-y-1 group relative"
              >
                <div
                  className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors cursor-pointer"
                  style={{ height: `${getBarHeight(day.amount)}%` }}
                  title={`${format(new Date(day.date), 'MMM dd')}: $${day.amount.toFixed(2)}`}
                />
                
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                  <div>{format(new Date(day.date), 'MMM dd')}</div>
                  <div>${day.amount.toFixed(2)}</div>
                  <div>{day.sessions} session{day.sessions !== 1 ? 's' : ''}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-2">
          <h4 className="font-medium">Recent Activity</h4>
          <div className="space-y-2">
            {earnings
              .filter(day => day.amount > 0)
              .slice(-5)
              .reverse()
              .map((day) => (
                <div key={day.date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="font-medium">
                        {format(new Date(day.date), 'MMM dd, yyyy')}
                      </div>
                      <div className="text-sm text-gray-600">
                        {day.sessions} session{day.sessions !== 1 ? 's' : ''} completed
                      </div>
                    </div>
                  </div>
                  <div className="font-semibold text-green-600">
                    +${day.amount.toFixed(2)}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
