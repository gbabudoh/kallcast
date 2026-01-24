import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Slot from '@/models/Slot';
import mongoose from 'mongoose';

import { CoachProfile } from '@/types/coach';

// Mock data for demonstration purposes
const mockCoaches: Record<string, CoachProfile> = {
  '65af5656c5435016c6800101': {
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
  '65af5656c5435016c6800102': {
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
  '65af5656c5435016c6800103': {
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
  '65af5656c5435016c6800104': {
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
  '65af5656c5435016c6800105': {
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
  '65af5656c5435016c6800106': {
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
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ coachId: string }> }
) {
  const { coachId } = await params;
  try {
    await connectDB();
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(coachId)) {
      return NextResponse.json({ message: 'Invalid coach ID format' }, { status: 400 });
    }
    
    let coach = await User.findOne({
      _id: coachId,
      role: 'coach',
    }).select('-password -email').lean<CoachProfile | null>();

    // Fallback to mock data if not found in DB
    if (!coach && mockCoaches[coachId]) {
      coach = mockCoaches[coachId];
    }

    if (!coach) {
      return NextResponse.json({ message: 'Coach not found' }, { status: 404 });
    }

    // Get coach's available slots
    const dbSlots = await Slot.find({
      coachId: coachId,
      status: 'available',
      startTime: { $gte: new Date() },
    }).sort({ startTime: 1 }).lean();

    // Mock slots if using mock coach and no real slots exist
    let availableSlots: Array<{
      id: string;
      coachId: string;
      startTime: string | Date;
      endTime: string | Date;
      isAvailable: boolean;
      price: number;
    }> = dbSlots.map(slot => ({
      id: slot._id?.toString() || '',
      coachId: slot.coachId?.toString() || coachId,
      startTime: slot.startTime,
      endTime: slot.endTime,
      isAvailable: slot.status === 'available',
      price: slot.price
    }));

    if (availableSlots.length === 0 && mockCoaches[coachId]) {
      const now = new Date();
      availableSlots = [
        {
          id: 'mock-slot-1',
          coachId: coachId,
          startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(),
          isAvailable: true,
          price: coach?.hourlyRate || 100
        },
        {
          id: 'mock-slot-2',
          coachId: coachId,
          startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(now.getTime() + 25 * 60 * 60 * 1000).toISOString(),
          isAvailable: true,
          price: coach?.hourlyRate || 100
        }
      ];
    }

    return NextResponse.json({
      coach,
      availableSlots,
    });
  } catch (error) {
    console.error('Get coach error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
