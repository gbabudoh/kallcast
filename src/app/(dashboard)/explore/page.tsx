'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Star, 
  Users, 
  Clock, 
  Video,
  Play,
  MapPin,
  Award,
  Zap,
  TrendingUp,
  Globe,
  Calendar,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  BookOpen
} from 'lucide-react';

const categories = [
  { name: 'All', count: 127, active: true },
  { name: 'Business', count: 45, active: false },
  { name: 'Technology', count: 32, active: false },
  { name: 'Design', count: 28, active: false },
  { name: 'Marketing', count: 22, active: false },
];

const featuredCoaches = [
  {
    id: 1,
    name: 'Sarah Johnson',
    title: 'Senior Product Manager',
    company: 'Google',
    avatar: 'SJ',
    rating: 4.9,
    reviews: 127,
    hourlyRate: 150,
    expertise: ['Product Strategy', 'Leadership', 'Agile'],
    bio: 'Former Google PM with 8+ years building products used by millions. Specialized in product strategy and team leadership.',
    location: 'San Francisco, CA',
    languages: ['English', 'Spanish'],
    totalSessions: 340,
    responseTime: '< 2 hours',
    isOnline: true,
    nextAvailable: 'Today 3:00 PM',
    gradient: 'from-blue-500 to-purple-600'
  },
  {
    id: 2,
    name: 'Michael Chen',
    title: 'Full Stack Engineer',
    company: 'Meta',
    avatar: 'MC',
    rating: 4.8,
    reviews: 89,
    hourlyRate: 120,
    expertise: ['React', 'Node.js', 'System Design'],
    bio: 'Senior engineer at Meta with expertise in scalable web applications and modern JavaScript frameworks.',
    location: 'Seattle, WA',
    languages: ['English', 'Mandarin'],
    totalSessions: 256,
    responseTime: '< 1 hour',
    isOnline: false,
    nextAvailable: 'Tomorrow 10:00 AM',
    gradient: 'from-purple-500 to-indigo-600'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    title: 'UX Design Lead',
    company: 'Airbnb',
    avatar: 'ER',
    rating: 5.0,
    reviews: 156,
    hourlyRate: 140,
    expertise: ['UI/UX Design', 'Design Systems', 'User Research'],
    bio: 'Design lead at Airbnb focusing on user experience and design systems. Passionate about creating intuitive interfaces.',
    location: 'Austin, TX',
    languages: ['English', 'Portuguese'],
    totalSessions: 423,
    responseTime: '< 30 min',
    isOnline: true,
    nextAvailable: 'Today 1:30 PM',
    gradient: 'from-indigo-500 to-blue-600'
  },
  {
    id: 4,
    name: 'David Kim',
    title: 'Marketing Director',
    company: 'Shopify',
    avatar: 'DK',
    rating: 4.7,
    reviews: 203,
    hourlyRate: 110,
    expertise: ['Digital Marketing', 'Growth Hacking', 'Analytics'],
    bio: 'Marketing expert with proven track record of scaling startups from 0 to millions in revenue.',
    location: 'Toronto, CA',
    languages: ['English', 'Korean'],
    totalSessions: 189,
    responseTime: '< 4 hours',
    isOnline: true,
    nextAvailable: 'Today 5:00 PM',
    gradient: 'from-green-500 to-teal-600'
  },
  {
    id: 5,
    name: 'Lisa Thompson',
    title: 'Data Scientist',
    company: 'Netflix',
    avatar: 'LT',
    rating: 4.9,
    reviews: 94,
    hourlyRate: 160,
    expertise: ['Machine Learning', 'Python', 'Data Analysis'],
    bio: 'Senior data scientist at Netflix working on recommendation algorithms and machine learning systems.',
    location: 'Los Angeles, CA',
    languages: ['English', 'French'],
    totalSessions: 167,
    responseTime: '< 3 hours',
    isOnline: false,
    nextAvailable: 'Tomorrow 2:00 PM',
    gradient: 'from-orange-500 to-red-600'
  },
  {
    id: 6,
    name: 'James Wilson',
    title: 'Startup Founder',
    company: 'TechCorp (Acquired)',
    avatar: 'JW',
    rating: 4.8,
    reviews: 178,
    hourlyRate: 200,
    expertise: ['Entrepreneurship', 'Fundraising', 'Business Strategy'],
    bio: 'Serial entrepreneur with 2 successful exits. Mentor to 50+ startups and expert in fundraising strategies.',
    location: 'New York, NY',
    languages: ['English'],
    totalSessions: 298,
    responseTime: '< 6 hours',
    isOnline: true,
    nextAvailable: 'Today 4:30 PM',
    gradient: 'from-yellow-500 to-orange-600'
  }
];

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

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
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Discover Amazing Coaches
              </h1>
              <p className="text-blue-100 text-lg max-w-2xl">
                Connect with world-class experts for live video coaching sessions. 
                Learn from industry leaders and accelerate your growth.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-blue-200 text-sm">Expert Coaches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-blue-200 text-sm">Sessions Completed</div>
              </div>
            </div>
          </div>
          
          {/* Live Sessions Indicator */}
          <div className="flex items-center space-x-4 text-white/90">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm">23 coaches available now</span>
            </div>
            <div className="flex items-center">
              <Video className="w-4 h-4 mr-2" />
              <span className="text-sm">12 live sessions happening</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search coaches, skills, or companies..."
                  className="pl-12 h-12 text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Category Filters */}
            <div className="flex items-center space-x-2 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category.name}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  className={`whitespace-nowrap ${
                    selectedCategory === category.name 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                      : 'hover:bg-blue-50'
                  }`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
            
            <Button variant="outline" className="flex items-center gap-2 h-12">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Featured Coaches Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
        {featuredCoaches.map((coach) => (
          <Card key={coach.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group overflow-hidden">
            {/* Coach Header */}
            <CardHeader className="pb-4 relative">
              {coach.isOnline && (
                <div className="absolute top-4 right-4 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600 font-medium">Online</span>
                </div>
              )}
              
              <div className="flex items-start space-x-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${coach.gradient} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {coach.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                    {coach.name}
                  </h3>
                  <p className="text-blue-600 font-medium">{coach.title}</p>
                  <p className="text-gray-600 text-sm">{coach.company}</p>
                  
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium ml-1">{coach.rating}</span>
                      <span className="text-xs text-gray-500 ml-1">({coach.reviews})</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="text-xs">{coach.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Bio */}
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                {coach.bio}
              </p>

              {/* Expertise Tags */}
              <div className="flex flex-wrap gap-2">
                {coach.expertise.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100">
                    {skill}
                  </Badge>
                ))}
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">${coach.hourlyRate}</div>
                  <div className="text-xs text-gray-600">per hour</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{coach.totalSessions}</div>
                  <div className="text-xs text-gray-600">sessions</div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Response time
                  </span>
                  <span className="font-medium">{coach.responseTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    Next available
                  </span>
                  <span className="font-medium text-green-600">{coach.nextAvailable}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-4">
                <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white group cursor-pointer">
                  <Video className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Book Session
                </Button>
                <Button variant="outline" className="px-4 cursor-pointer">
                  <Play className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 border-0 shadow-2xl text-white">
        <CardContent className="p-8">
          <div className="text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
            <h3 className="text-2xl font-bold mb-4">Ready to Start Learning?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of learners who are already growing their skills with expert coaches. 
              Book your first session today and unlock your potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-indigo-600 hover:bg-gray-100 font-medium cursor-pointer">
                <Target className="w-4 h-4 mr-2" />
                Find My Perfect Coach
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 cursor-pointer">
                <BookOpen className="w-4 h-4 mr-2" />
                Browse All Categories
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
