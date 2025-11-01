'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Video, 
  User, 
  Play,
  Star,
  MapPin,
  CheckCircle,
  AlertCircle,
  XCircle,
  MoreHorizontal,
  Filter,
  Search,
  Zap,
  Target,
  Award,
  TrendingUp,
  BookOpen,
  ArrowRight,
  Sparkles,
  Globe,
  MessageCircle
} from 'lucide-react';

const tabs = [
  { id: 'all', label: 'All Sessions', count: 8 },
  { id: 'upcoming', label: 'Upcoming', count: 3 },
  { id: 'completed', label: 'Completed', count: 4 },
  { id: 'cancelled', label: 'Cancelled', count: 1 },
];

const mockBookings = [
  {
    id: 1,
    coach: {
      name: 'Sarah Johnson',
      title: 'Senior Product Manager',
      company: 'Google',
      avatar: 'SJ',
      rating: 4.9,
      gradient: 'from-blue-500 to-purple-600'
    },
    session: {
      title: 'Product Strategy Deep Dive',
      date: '2024-11-15',
      time: '2:00 PM - 3:00 PM',
      duration: 60,
      price: 150,
      status: 'upcoming',
      meetingLink: 'https://kallcast.com/session/abc123',
      description: 'Learn advanced product strategy techniques and roadmap planning'
    },
    skills: ['Product Strategy', 'Leadership', 'Roadmapping']
  },
  {
    id: 2,
    coach: {
      name: 'Michael Chen',
      title: 'Full Stack Engineer',
      company: 'Meta',
      avatar: 'MC',
      rating: 4.8,
      gradient: 'from-purple-500 to-indigo-600'
    },
    session: {
      title: 'React Performance Optimization',
      date: '2024-11-16',
      time: '10:00 AM - 11:30 AM',
      duration: 90,
      price: 180,
      status: 'upcoming',
      meetingLink: 'https://kallcast.com/session/def456',
      description: 'Master React performance patterns and optimization techniques'
    },
    skills: ['React', 'Performance', 'JavaScript']
  },
  {
    id: 3,
    coach: {
      name: 'Emily Rodriguez',
      title: 'UX Design Lead',
      company: 'Airbnb',
      avatar: 'ER',
      rating: 5.0,
      gradient: 'from-indigo-500 to-blue-600'
    },
    session: {
      title: 'Design System Fundamentals',
      date: '2024-11-10',
      time: '3:00 PM - 4:00 PM',
      duration: 60,
      price: 140,
      status: 'completed',
      meetingLink: 'https://kallcast.com/session/ghi789',
      description: 'Build scalable design systems from scratch',
      feedback: 'Excellent session! Emily provided great insights into design system architecture.'
    },
    skills: ['Design Systems', 'UI/UX', 'Figma']
  },
  {
    id: 4,
    coach: {
      name: 'David Kim',
      title: 'Marketing Director',
      company: 'Shopify',
      avatar: 'DK',
      rating: 4.7,
      gradient: 'from-green-500 to-teal-600'
    },
    session: {
      title: 'Growth Marketing Strategies',
      date: '2024-11-08',
      time: '1:00 PM - 2:00 PM',
      duration: 60,
      price: 110,
      status: 'completed',
      meetingLink: 'https://kallcast.com/session/jkl012',
      description: 'Learn proven growth hacking techniques and analytics',
      feedback: 'Great practical examples and actionable strategies!'
    },
    skills: ['Growth Marketing', 'Analytics', 'SEO']
  }
];

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming': return <Clock className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'cancelled': return <XCircle className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  const filteredBookings = mockBookings.filter(booking => {
    if (activeTab !== 'all' && booking.session.status !== activeTab) return false;
    if (searchQuery && !booking.coach.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !booking.session.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Dynamic Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 mb-8 shadow-2xl">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                My Learning Journey
              </h1>
              <p className="text-blue-100 text-lg max-w-2xl">
                Track your progress, manage sessions, and continue growing with expert coaches
              </p>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">8</div>
                <div className="text-blue-200 text-sm">Total Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">12h</div>
                <div className="text-blue-200 text-sm">Learning Hours</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">4.9★</div>
                <div className="text-blue-200 text-sm">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: 'Upcoming Sessions',
            value: '3',
            description: 'Sessions scheduled',
            icon: Calendar,
            gradient: 'from-blue-500 to-blue-600',
            bgGradient: 'from-blue-50 to-blue-100',
            textColor: 'text-blue-700'
          },
          {
            title: 'Completed Sessions',
            value: '4',
            description: 'Sessions finished',
            icon: CheckCircle,
            gradient: 'from-green-500 to-green-600',
            bgGradient: 'from-green-50 to-green-100',
            textColor: 'text-green-700'
          },
          {
            title: 'Learning Hours',
            value: '12',
            description: 'Hours of coaching',
            icon: Clock,
            gradient: 'from-purple-500 to-purple-600',
            bgGradient: 'from-purple-50 to-purple-100',
            textColor: 'text-purple-700'
          },
          {
            title: 'Learning Streak',
            value: '7',
            description: 'Days in a row',
            icon: Zap,
            gradient: 'from-orange-500 to-orange-600',
            bgGradient: 'from-orange-50 to-orange-100',
            textColor: 'text-orange-700'
          }
        ].map((stat, index) => (
          <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${stat.bgGradient} ${stat.textColor} text-xs font-medium`}>
                  +2 this week
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.description}</div>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
                <div className={`h-1 rounded-full bg-gradient-to-r ${stat.gradient} transition-all duration-1000`} style={{ width: '75%' }}></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs and Search */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {tab.count}
                  </Badge>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search sessions..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sessions List */}
      <div className="space-y-6">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <Card key={booking.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  {/* Session Info */}
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      {/* Coach Avatar */}
                      <div className={`w-16 h-16 bg-gradient-to-r ${booking.coach.gradient} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {booking.coach.avatar}
                      </div>

                      {/* Session Details */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                            {booking.session.title}
                          </h3>
                          <Badge className={`${getStatusColor(booking.session.status)} border`}>
                            {getStatusIcon(booking.session.status)}
                            <span className="ml-1 capitalize">{booking.session.status}</span>
                          </Badge>
                        </div>

                        <div className="flex items-center space-x-4 text-gray-600 mb-3">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            <span className="font-medium">{booking.coach.name}</span>
                            <span className="mx-2">•</span>
                            <span>{booking.coach.title}</span>
                          </div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                            <span>{booking.coach.rating}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{booking.session.date}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{booking.session.time}</span>
                          </div>
                          <div className="flex items-center">
                            <Globe className="w-4 h-4 mr-2" />
                            <span>${booking.session.price}</span>
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {booking.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        <p className="text-gray-700 text-sm">{booking.session.description}</p>

                        {/* Feedback for completed sessions */}
                        {booking.session.status === 'completed' && booking.session.feedback && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center mb-2">
                              <MessageCircle className="w-4 h-4 text-green-600 mr-2" />
                              <span className="text-sm font-medium text-green-800">Your Feedback</span>
                            </div>
                            <p className="text-sm text-green-700 italic">"{booking.session.feedback}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-3 min-w-[200px]">
                    {booking.session.status === 'upcoming' && (
                      <>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white cursor-pointer">
                          <Video className="w-4 h-4 mr-2" />
                          Join Session
                        </Button>
                        <Button variant="outline" className="cursor-pointer">
                          <Calendar className="w-4 h-4 mr-2" />
                          Reschedule
                        </Button>
                      </>
                    )}
                    
                    {booking.session.status === 'completed' && (
                      <>
                        <Button variant="outline" className="cursor-pointer">
                          <Star className="w-4 h-4 mr-2" />
                          Rate Session
                        </Button>
                        <Button variant="outline" className="cursor-pointer">
                          <BookOpen className="w-4 h-4 mr-2" />
                          View Recording
                        </Button>
                      </>
                    )}

                    <Button variant="ghost" size="sm" className="cursor-pointer">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          /* Enhanced Empty State */
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-12">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {activeTab === 'all' ? 'No sessions yet' : `No ${activeTab} sessions`}
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                  {activeTab === 'all' 
                    ? "Ready to start your learning journey? Explore our amazing coaches and book your first session."
                    : `You don't have any ${activeTab} sessions at the moment.`
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/explore">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white cursor-pointer">
                      <Target className="w-4 h-4 mr-2" />
                      Explore Coaches
                    </Button>
                  </Link>
                  <Button variant="outline" className="cursor-pointer">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Browse Categories
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Learning Progress Section */}
      <Card className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 border-0 shadow-2xl text-white mt-12">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-2 flex items-center">
                <Award className="w-6 h-6 mr-2" />
                Keep Learning & Growing
              </h3>
              <p className="text-blue-100 mb-4">
                You're doing great! Continue your learning streak and unlock new achievements.
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span>7-day streak</span>
                </div>
                <div className="flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  <span>3 goals completed</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link href="/explore">
                <Button className="bg-white text-indigo-600 hover:bg-gray-100 font-medium cursor-pointer">
                  <Play className="w-4 h-4 mr-2" />
                  Book Next Session
                </Button>
              </Link>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 cursor-pointer">
                <BookOpen className="w-4 h-4 mr-2" />
                View Progress
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
