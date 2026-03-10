'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import DashboardStats from '@/components/dashboard/DashboardStats';
import UpcomingSessions from '@/components/dashboard/UpcomingSessions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Video,
  Users,
  Star,
  Zap,
  Target,
  Award,
  ArrowRight,
  Sparkles,
  GraduationCap,
  CheckCircle,
  Briefcase
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCoaches, useUserProfile } from '@/hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as UserType } from '@/types/user';
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

export default function LearnerDashboardPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isSwitching, setIsSwitching] = useState(false);

  // Fetch real data
  const { data: coachesData, loading: loadingCoaches } = useCoaches();
  const { data: profileData, loading: loadingProfile } = useUserProfile(session?.user?.id || '');

  const userProfile = profileData?.user as UserType | undefined;
  const recommendedCoaches = (coachesData?.coaches || []) as UserType[];
  const learningGoals = userProfile?.learningGoals || [];
  const achievements = userProfile?.achievements || [];
  const learningStreak = userProfile?.learningStreak || 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleBecomeCoach = async () => {
    setIsSwitching(true);
    try {
      const response = await fetch('/api/user/become-coach', {
        method: 'POST',
      });
      if (response.ok) {
        await update({ role: 'coach' });
        router.push(ROUTES.DASHBOARD.COACH_BASE);
      }
    } catch (error) {
      console.error('Failed to become coach:', error);
    } finally {
      setIsSwitching(false);
    }
  };

  const learnerQuickActions = [
    {
      title: 'Browse Coaches',
      description: 'Find expert coaches in your field',
      icon: Users,
      href: ROUTES.LEARNER.EXPLORE,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-700'
    },
    {
      title: 'Join Live Session',
      description: 'Start learning right now',
      icon: Video,
      href: ROUTES.LEARNER.MY_SESSIONS,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-700'
    },
    {
      title: 'My Learning Path',
      description: 'Track your progress',
      icon: Target,
      href: ROUTES.LEARNER.MY_BOOKINGS,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      textColor: 'text-green-700'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Dynamic Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 mb-8 shadow-2xl">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center cursor-pointer">
                <GraduationCap className="w-6 h-6 text-white cursor-pointer" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {getGreeting()}, {session?.user?.firstName}! 
                </h1>
                <p className="text-blue-100 text-lg">
                  Ready to unlock new skills today?
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <ClientTimeDisplay />
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8">
        <DashboardStats userRole="learner" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mb-8">
        {/* Quick Actions */}
        <div className="xl:col-span-1">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                Quick Actions
              </CardTitle>
              <CardDescription>Jump into learning</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {learnerQuickActions.map((action, index) => (
                <Link key={index} href={action.href} className="block">
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${action.bgColor} border border-white/50 hover:shadow-lg transition-all duration-300 cursor-pointer group`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 cursor-pointer`}>
                        <action.icon className="w-5 h-5 text-white cursor-pointer" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${action.textColor} text-sm`}>
                          {action.title}
                        </h3>
                        <p className="text-xs text-gray-600 cursor-pointer">{action.description}</p>
                      </div>
                      <ArrowRight className={`w-4 h-4 ${action.textColor} group-hover:translate-x-1 transition-transform duration-300 cursor-pointer`} />
                    </div>
                  </div>
                </Link>
              ))}

              <div className="pt-4 border-t mt-4">
                <Button 
                  onClick={handleBecomeCoach} 
                  disabled={isSwitching}
                   className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                >
                  <Briefcase className="w-4 h-4 mr-2 cursor-pointer" />
                  {isSwitching ? 'Updating...' : 'Become a Coach'}
                </Button>
                <p className="text-[10px] text-center text-gray-400 mt-2">
                  Share your expertise and start earning
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Sessions */}
        <div className="xl:col-span-2">
          <UpcomingSessions userRole="learner" limit={3} />
        </div>

        {/* Learning Goals */}
        <div className="xl:col-span-1">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-500" />
                Learning Goals
              </CardTitle>
              <CardDescription>Track your progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {learningGoals.length > 0 ? (
                learningGoals.map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">{goal.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {goal.current}/{goal.target}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600">{Math.round((goal.current / goal.target) * 100)}% complete</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <Target className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Set your first learning goal in settings!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recommended Coaches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Recommended for You
            </CardTitle>
            <CardDescription>Top-rated coaches in your interests</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingCoaches ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4 animate-pulse">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recommendedCoaches.length > 0 ? (
              <div className="space-y-4">
                {recommendedCoaches.slice(0, 3).map((coach, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/60 transition-colors cursor-pointer" onClick={() => router.push(`/coach/${coach.id}`)}>
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={coach.profileImage} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold">
                        {coach.firstName?.[0]}{coach.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{coach.firstName} {coach.lastName}</h4>
                      <p className="text-sm text-gray-600">{coach.expertise?.join(', ') || 'Expert Coach'}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600 ml-1">{coach.averageRating?.toFixed(1) || '0.0'}</span>
                        </div>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-600">{coach.totalSessions || 0} sessions</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs cursor-pointer">
                      View Profile
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                 <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                 <p className="text-gray-500">No coaches found. Check back later!</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-purple-50/50 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2 text-purple-500" />
              Achievements
            </CardTitle>
            <CardDescription>Your learning milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
                <div className="text-3xl font-bold text-orange-600 mb-1">{learningStreak}</div>
                <div className="text-sm text-orange-700 font-medium">Day Learning Streak</div>
                <div className="text-xs text-orange-600 mt-1">
                  {learningStreak > 0 ? 'Keep it up! 🔥' : 'Start your streak today!'}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 text-sm">Recent Badges</h4>
                {achievements.length > 0 ? (
                  achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-white/60 cursor-pointer hover:bg-white/80 transition-colors">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">{achievement.title}</div>
                        <div className="text-xs text-gray-600 font-medium">{achievement.unlockedAt ? new Date(achievement.unlockedAt).toLocaleDateString() : 'Recent'}</div>
                      </div>
                      <CheckCircle className="w-4 h-4 text-green-500 cursor-pointer" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <Award className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Collect badges by completing sessions!</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Sessions Banner */}
      <Card className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 border-0 shadow-2xl text-white mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-bold mb-2 flex items-center">
                <Sparkles className="w-6 h-6 mr-2" />
                Join Live Sessions Now
              </h3>
              <p className="text-blue-100 mb-4">
                Expert coaches are ready to help you learn in real-time
              </p>
            </div>
            <div className="flex space-x-3">
              <Button onClick={() => router.push(ROUTES.LEARNER.EXPLORE)} className="bg-white text-indigo-600 hover:bg-gray-100 font-medium cursor-pointer">
                <Video className="w-4 h-4 mr-2" />
                Browse Live Coaches
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
