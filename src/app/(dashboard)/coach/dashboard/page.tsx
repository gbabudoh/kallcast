'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import DashboardStats from '@/components/dashboard/DashboardStats';
import UpcomingSessions from '@/components/dashboard/UpcomingSessions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users,
  Star,
  Zap,
  ArrowRight,
  TrendingUp,
  Calendar,
  DollarSign,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useUserProfile, useReviews, useApi } from '@/hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as UserType } from '@/types/user';
import { BookingWithDetails } from '@/types/booking';
import { ROUTES } from '@/constants/routes';

// Create a client-only time component
const ClientTimeDisplay = dynamic(() => Promise.resolve(function TimeDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-right">
      <div className="text-white/80 text-sm">Current Time</div>
      <div className="text-white font-mono text-lg">
        {currentTime.toLocaleTimeString()}
      </div>
    </div>
  );
}), { ssr: false });

export default function CoachDashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // Fetch real data
  const { data: profileData, loading: loadingProfile } = useUserProfile(session?.user?.id || '');
  const { data: reviewsData, loading: loadingReviews } = useReviews(session?.user?.id || '');

  const fetchBookings = useCallback(async () => {
    const response = await fetch(`/api/bookings?role=coach&type=all`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return response.json();
  }, []);

  const { data: bookingsData } = useApi(fetchBookings, { immediate: true });

  const userProfile = profileData?.user as UserType | undefined;
  const recentReviews = (reviewsData?.reviews || []).slice(0, 3);
  const bookings = (bookingsData?.bookings || []) as BookingWithDetails[];
  
  // Calculate completion rate
  const completedCount = bookings.filter((b) => b.sessionStatus === 'completed').length;
  const totalFinished = bookings.filter((b) => ['completed', 'no-show'].includes(b.sessionStatus)).length;
  const completionRate = totalFinished > 0 ? Math.round((completedCount / totalFinished) * 100) : 100;

  const [onboardingLoading, setOnboardingLoading] = useState(false);

  const fetchOnboarding = useCallback(async () => {
    const response = await fetch(`/api/payments/connect/onboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to start onboarding');
    return response.json();
  }, []);

  const { execute: startOnboarding } = useApi(fetchOnboarding, { immediate: false });

  const handleStripeOnboarding = async () => {
    try {
      setOnboardingLoading(true);
      const data = await startOnboarding();
      if (data?.onboardingUrl) {
        window.location.href = data.onboardingUrl;
      }
    } catch (error) {
      toast.error('Failed to start Stripe onboarding');
      console.error(error);
    } finally {
      setOnboardingLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const coachQuickActions = [
    {
      title: 'Create Session',
      description: 'Schedule a new coaching slot',
      icon: Calendar,
      href: ROUTES.COACH.CREATE_SESSION,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-700'
    },
    {
      title: 'View Earnings',
      description: 'Track your income',
      icon: DollarSign,
      href: ROUTES.COACH.EARNINGS,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      textColor: 'text-green-700'
    },
    {
      title: 'My Students',
      description: 'Manage your learner list',
      icon: Users,
      href: ROUTES.COACH.STUDENTS,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-700'
    }
  ];

  if (loadingProfile && !userProfile) {
     return (
       <div className="min-h-screen flex items-center justify-center">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
       </div>
     );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/50">
      {/* Dynamic Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 rounded-2xl p-8 mb-8 shadow-2xl">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {getGreeting()}, Coach {session?.user?.firstName}! 
                </h1>
                <p className="text-blue-100 text-lg">
                  Ready to inspire and share your knowledge today?
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <ClientTimeDisplay />
            <Button 
              onClick={() => router.push(ROUTES.DASHBOARD.LEARNER_BASE)}
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Learn Access
            </Button>
          </div>
        </div>
      </div>

      {/* Stripe Onboarding Alert */}
      {!userProfile?.stripeOnboardingComplete && (
        <div className="mb-8 bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 shadow-xl shadow-amber-900/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <ShieldCheck className="w-32 h-32 text-amber-600" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                <AlertCircle className="w-8 h-8 text-amber-600" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-black text-amber-900 leading-tight">Complete your Payout Setup</h2>
                <p className="text-amber-800/80 font-medium">To receive payments and unlock all features, you must connect your Stripe account.</p>
              </div>
            </div>
            <Button 
              onClick={handleStripeOnboarding}
              disabled={onboardingLoading}
              className="bg-amber-600 hover:bg-amber-700 text-white font-black px-8 py-6 rounded-xl shadow-lg shadow-amber-600/20 w-full md:w-auto"
            >
              {onboardingLoading ? 'Connecting...' : (
                <>
                  Connect Stripe <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="mb-8">
        <DashboardStats userRole="coach" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mb-8">
        {/* Quick Actions */}
        <div className="xl:col-span-1">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                Coach Tools
              </CardTitle>
              <CardDescription>Manage your practice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {coachQuickActions.map((action, index) => (
                <Link key={index} href={action.href} className="block">
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${action.bgColor} border border-white/50 hover:shadow-lg transition-all duration-300 cursor-pointer group`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${action.textColor} text-sm`}>
                          {action.title}
                        </h3>
                        <p className="text-xs text-gray-600">{action.description}</p>
                      </div>
                      <ArrowRight className={`w-4 h-4 ${action.textColor} group-hover:translate-x-1 transition-transform duration-300`} />
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Teaching Sessions */}
        <div className="xl:col-span-3">
          <UpcomingSessions userRole="coach" limit={5} />
        </div>
      </div>

      {/* Performance & Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="bg-gradient-to-br from-white to-green-50/50 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Recent Feedback
            </CardTitle>
            <CardDescription>What your students are saying</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingReviews ? (
               <div className="space-y-4">
                 {[1, 2].map((i) => (
                   <div key={i} className="flex items-start space-x-4 animate-pulse">
                     <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                     <div className="flex-1 space-y-2">
                       <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                       <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                     </div>
                   </div>
                 ))}
               </div>
            ) : recentReviews.length > 0 ? (
               <div className="space-y-4">
                 {recentReviews.map((review: { learnerId?: { profileImage?: string; firstName?: string; lastName?: string }; rating: number; comment: string }, index: number) => (
                   <div key={index} className="p-4 bg-white/60 rounded-xl border border-white/50 space-y-2">
                     <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-2">
                         <Avatar className="w-8 h-8">
                           <AvatarImage src={review.learnerId?.profileImage} />
                           <AvatarFallback>
                             {review.learnerId?.firstName?.[0]}{review.learnerId?.lastName?.[0]}
                           </AvatarFallback>
                         </Avatar>
                         <span className="text-sm font-semibold">{review.learnerId?.firstName} {review.learnerId?.lastName}</span>
                       </div>
                       <div className="flex items-center">
                         <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                         <span className="text-sm font-medium">{review.rating}</span>
                       </div>
                     </div>
                     <p className="text-sm text-gray-600 italic">&quot;{review.comment}&quot;</p>
                   </div>
                 ))}
                 <Button variant="ghost" size="sm" className="w-full text-indigo-600 hover:text-indigo-700" onClick={() => router.push('/reviews')}>
                   View All Reviews
                 </Button>
               </div>
            ) : (
              <div className="space-y-4 text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">New feedback will appear here once you complete sessions.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
              Growth Insights
            </CardTitle>
            <CardDescription>Your monthly impact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between">
                <div>
                  <div className="text-sm text-blue-700 font-medium">Profile Views</div>
                  <div className="text-2xl font-bold text-blue-900">{userProfile?.profileViews || 0}</div>
                </div>
                <Badge className="bg-blue-200 text-blue-800">Lifetime</Badge>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 flex items-center justify-between">
                <div>
                  <div className="text-sm text-purple-700 font-medium">Session Completion Rate</div>
                  <div className="text-2xl font-bold text-purple-900">{completionRate}%</div>
                </div>
                <Badge className="bg-purple-200 text-purple-800">All Time</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
