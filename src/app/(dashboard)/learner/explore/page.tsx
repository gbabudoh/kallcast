'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Sparkles,
  Target,
  BookOpen
} from 'lucide-react';

import CoachCard from '@/components/coach/CoachCard';
import { CoachProfile } from '@/types/coach';

const categories = [
  { name: 'All', count: 127, active: true },
  { name: 'Business', count: 45, active: false },
  { name: 'Technology', count: 32, active: false },
  { name: 'Design', count: 28, active: false },
  { name: 'Marketing', count: 22, active: false },
];

const featuredCoachesData: CoachProfile[] = [
  {
    _id: '65af5656c5435016c6800101',
    firstName: 'Sarah',
    lastName: 'Johnson',
    sessionTitle: 'Master Your Product Strategy: From Vision to Execution',
    sessionGains: [
      'Create a winning product roadmap',
      'Master stakeholder management',
      'Build a data-driven culture'
    ],
    title: 'Senior Product Manager',
    company: 'Google',
    profileImage: undefined,
    averageRating: 4.9,
    totalSessions: 340,
    hourlyRate: 150,
    expertise: ['Product Strategy', 'Leadership', 'Agile'],
    specialties: ['Product Strategy', 'Leadership', 'Agile'],
    background: 'Former Google PM with 8+ years building products used by millions. Specialized in product strategy and team leadership.',
    location: 'San Francisco, CA',
    responseTime: 2,
    isVerified: true,
    yearsExperience: 8,
    coachAchievements: [
      { title: 'Google PM Award' },
      { title: 'Built Google Maps features' }
    ]
  },
  {
    _id: '65af5656c5435016c6800102',
    firstName: 'Michael',
    lastName: 'Chen',
    sessionTitle: 'React & Node.js: Building Scalable Full-Stack Apps',
    sessionGains: [
      'Optimize React performance',
      'Design robust API architectures',
      'Master system design patterns'
    ],
    title: 'Full Stack Engineer',
    company: 'Meta',
    profileImage: undefined,
    averageRating: 4.8,
    totalSessions: 256,
    hourlyRate: 120,
    expertise: ['React', 'Node.js', 'System Design'],
    specialties: ['React', 'Node.js', 'System Design'],
    background: 'Senior engineer at Meta with expertise in scalable web applications and modern JavaScript frameworks.',
    location: 'Seattle, WA',
    responseTime: 1,
    isVerified: false,
    yearsExperience: 10,
  },
  {
    _id: '65af5656c5435016c6800103',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    sessionTitle: 'UX Design Systems: Scale Your Design Impact',
    sessionGains: [
      'Build scalable component libraries',
      'Streamline designer-developer handoff',
      'Create intuitive user experiences'
    ],
    title: 'UX Design Lead',
    company: 'Airbnb',
    profileImage: undefined,
    averageRating: 5.0,
    totalSessions: 423,
    hourlyRate: 140,
    expertise: ['UI/UX Design', 'Design Systems', 'User Research'],
    specialties: ['UI/UX Design', 'Design Systems', 'User Research'],
    background: 'Design lead at Airbnb focusing on user experience and design systems. Passionate about creating intuitive interfaces.',
    location: 'Austin, TX',
    responseTime: 0.5,
    isVerified: true,
    yearsExperience: 12,
  },
  {
    _id: '65af5656c5435016c6800104',
    firstName: 'David',
    lastName: 'Kim',
    sessionTitle: 'Growth Hacking: Scaling to Your First $1M ARR',
    sessionGains: [
      'Optimize your marketing funnel',
      'Master customer acquisition costs',
      'Scale revenue with data-driven tests'
    ],
    title: 'Marketing Director',
    company: 'Shopify',
    profileImage: undefined,
    averageRating: 4.7,
    totalSessions: 189,
    hourlyRate: 110,
    expertise: ['Digital Marketing', 'Growth Hacking', 'Analytics'],
    specialties: ['Digital Marketing', 'Growth Hacking', 'Analytics'],
    background: 'Marketing expert with proven track record of scaling startups from 0 to millions in revenue.',
    location: 'Toronto, CA',
    responseTime: 4,
    isVerified: true,
    yearsExperience: 7,
  },
  {
    _id: '65af5656c5435016c6800105',
    firstName: 'Lisa',
    lastName: 'Thompson',
    sessionTitle: 'Applied Machine Learning for Business Impact',
    sessionGains: [
      'Build effective prediction models',
      'Deploy ML systems to production',
      'Measure model ROI accurately'
    ],
    title: 'Data Scientist',
    company: 'Netflix',
    profileImage: undefined,
    averageRating: 4.9,
    totalSessions: 167,
    hourlyRate: 160,
    expertise: ['Machine Learning', 'Python', 'Data Analysis'],
    specialties: ['Machine Learning', 'Python', 'Data Analysis'],
    background: 'Senior data scientist at Netflix working on recommendation algorithms and machine learning systems.',
    location: 'Los Angeles, CA',
    responseTime: 3,
    isVerified: false,
    yearsExperience: 9,
  },
  {
    _id: '65af5656c5435016c6800106',
    firstName: 'James',
    lastName: 'Wilson',
    sessionTitle: 'Founders Playbook: Raising Your Seed Round',
    sessionGains: [
      'Perfect your investor pitch deck',
      'Navigate term sheets and valuation',
      'Build a powerful founder network'
    ],
    title: 'Startup Founder',
    company: 'TechCorp (Acquired)',
    profileImage: undefined,
    averageRating: 4.8,
    totalSessions: 298,
    hourlyRate: 200,
    expertise: ['Entrepreneurship', 'Fundraising', 'Business Strategy'],
    specialties: ['Entrepreneurship', 'Fundraising', 'Business Strategy'],
    background: 'Serial entrepreneur with 2 successful exits. Mentor to 50+ startups and expert in fundraising strategies.',
    location: 'New York, NY',
    responseTime: 6,
    isVerified: true,
    yearsExperience: 15,
  }
];

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Header Section */}
      <div className="pt-16 pb-10 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest">
            <Sparkles className="w-3 h-3 mr-2" />
            Discover Elite Mentorship
          </Badge>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Find the perfect coach to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">accelerate your career</span>
          </h1>
          <p className="text-base text-slate-500 max-w-2xl mx-auto font-bold">
            Learn from industry leaders at Google, Meta, Airbnb, and more through 1-on-1 personalized sessions.
          </p>
          
          <div className="relative max-w-xl mx-auto pt-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none pt-6">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <Input 
              type="text"
              placeholder="Search by topic, company, or expertise..."
              className="pl-10 pr-28 h-14 bg-white border-slate-200 shadow-lg rounded-xl text-base focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button size="sm" className="absolute right-1.5 top-1/2 -translate-y-1/2 mt-3 h-10 px-4 bg-slate-900 hover:bg-black text-white rounded-lg font-black text-xs cursor-pointer">
              <Filter className="w-3 h-3 mr-2 cursor-pointer" />
              Filters
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                className={`rounded-lg px-4 py-2 font-black text-[12px] transition-all h-9 ${
                  selectedCategory === category.name 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                  : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50'
                }`}
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
                <span className={`ml-2 text-[9px] px-1.5 py-0.5 rounded-full ${
                  selectedCategory === category.name ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {category.count}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Coaches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 mb-12 px-6">
        {featuredCoachesData.map((coach) => (
          <CoachCard key={coach._id} coach={coach} />
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
