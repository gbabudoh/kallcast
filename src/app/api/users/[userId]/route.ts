import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import { updateProfileSchema } from '@/validations/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        profileImage: true,
        bio: true,
        timezone: true,
        createdAt: true,
        updatedAt: true,
        isVerified: true,
        stripeAccountId: true,
        stripeOnboardingComplete: true,
        hourlyRate: true,
        expertise: true,
        yearsExperience: true,
        title: true,
        company: true,
        location: true,
        responseTime: true,
        specialties: true,
        background: true,
        sessionTitle: true,
        sessionGains: true,
        coachAchievements: true,
        totalSessions: true,
        averageRating: true,
        totalEarnings: true,
        profileViews: true,
        learningGoals: true,
        achievements: true,
        learningStreak: true,
        lastActivityDate: true,
      }
    });
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is updating their own profile
    if (session.user.id !== params.userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validationResult = updateProfileSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          message: 'Validation failed', 
          errors: validationResult.error.issues 
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    const user = await prisma.user.update({
      where: { id: params.userId },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        profileImage: true,
        bio: true,
        timezone: true,
        createdAt: true,
        updatedAt: true,
        isVerified: true,
        stripeAccountId: true,
        stripeOnboardingComplete: true,
        hourlyRate: true,
        expertise: true,
        yearsExperience: true,
        title: true,
        company: true,
        location: true,
        responseTime: true,
        specialties: true,
        background: true,
        sessionTitle: true,
        sessionGains: true,
        coachAchievements: true,
        totalSessions: true,
        averageRating: true,
        totalEarnings: true,
        profileViews: true,
        learningGoals: true,
        achievements: true,
        learningStreak: true,
        lastActivityDate: true,
      }
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Profile updated successfully', 
      user 
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
