'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import DashboardStats from '@/components/dashboard/DashboardStats';
import UpcomingSessions from '@/components/dashboard/UpcomingSessions';
import EarningsChart from '@/components/dashboard/EarningsChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen,
  Video,
  TrendingUp,
  Users,
  Play,
  Calendar,
  Star,
  Clock,
  Zap,
  Target,
  Award,
  ArrowRight,
  Sparkles,
  GraduationCap,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

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

export default function DashboardPage() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || 'learner';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const learnerQuickActions = [
    {
      title: 'Browse Coaches',
      description: 'Find expert coaches in your field',
      icon: Users,
      href: '/explore',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-700'
    },
    {
      title: 'Join Live Session',
      description: 'Start learning right now',
      icon: Video,
      href: '/my-bookings',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-700'
    },
    {
      title: 'My Learning Path',
      description: 'Track your progress',
      icon: Target,
      href: '/my-bookings',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      textColor: 'text-green-700'
    }
  ];

  const learningGoals = [
    { title: 'Complete 5 sessions this month', progress: 60, current: 3, target: 5 },
    { title: 'Learn 3 new skills', progress: 33, current: 1, target: 3 },
    { title: 'Get certified in JavaScript', progress: 80, current: 4, target: 5 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Dynamic Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 mb-8 shadow-2xl">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {getGreeting()}, {session?.user?.firstName}! 
                </h1>
                <p className="text-blue-100 text-lg">
                  {userRole === 'learner' 
                    ? "Ready to unlock new skills today?" 
                    : "Ready to inspire learners today?"
                  }
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
        <DashboardStats userRole={userRole} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mb-8">
        {/* Quick Actions - Learner Focused */}
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
                <Link key={index} href={action.href}>
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

        {/* Upcoming Sessions */}
        <div className="xl:col-span-2">
          <UpcomingSessions userRole={userRole} limit={3} />
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
              {learningGoals.map((goal, index) => (
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
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600">{goal.progress}% complete</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Featured Coaches & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recommended Coaches */}
        <Card className="bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Recommended for You
            </CardTitle>
            <CardDescription>Top-rated coaches in your interests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Sarah Johnson', skill: 'JavaScript Expert', rating: 4.9, sessions: 127, image: 'SJ' },
                { name: 'Michael Chen', skill: 'React Specialist', rating: 4.8, sessions: 89, image: 'MC' },
                { name: 'Emily Davis', skill: 'UI/UX Design', rating: 5.0, sessions: 156, image: 'ED' }
              ].map((coach, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/60 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {coach.image}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{coach.name}</h4>
                    <p className="text-sm text-gray-600">{coach.skill}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600 ml-1">{coach.rating}</span>
                      </div>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-600">{coach.sessions} sessions</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs">
                    View Profile
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Learning Streak & Achievements */}
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
              {/* Learning Streak */}
              <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
                <div className="text-3xl font-bold text-orange-600 mb-1">7</div>
                <div className="text-sm text-orange-700 font-medium">Day Learning Streak</div>
                <div className="text-xs text-orange-600 mt-1">Keep it up! 🔥</div>
              </div>

              {/* Recent Achievements */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 text-sm">Recent Badges</h4>
                {[
                  { title: 'First Session Complete', icon: '🎯', date: '2 days ago' },
                  { title: 'Quick Learner', icon: '⚡', date: '1 week ago' },
                  { title: 'Consistent Student', icon: '📚', date: '2 weeks ago' }
                ].map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-white/60">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900">{achievement.title}</div>
                      <div className="text-xs text-gray-600">{achievement.date}</div>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                ))}
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
                3 coaches are currently live and ready to help you learn
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                  <span>Sarah teaching React</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                  <span>Mike teaching Python</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button className="bg-white text-indigo-600 hover:bg-gray-100 font-medium">
                <Video className="w-4 h-4 mr-2" />
                Join Live Session
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Browse All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
