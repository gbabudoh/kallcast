import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { SessionStatus } from '@/generated/client';
import prisma from '@/lib/db';
import { createLiveKitToken } from '@/lib/livekit';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json({ message: 'Booking ID is required' }, { status: 400 });
    }

    // Get booking details
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        coach: true,
        learner: true,
      }
    });

    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    // Check if user has access to this booking
    if (booking.learnerId !== session.user.id && 
        booking.coachId !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Check if booking is in progress
    if (booking.sessionStatus !== SessionStatus.in_progress) {
      return NextResponse.json({ message: 'Session is not in progress' }, { status: 400 });
    }

    if (!booking.videoRoomId || booking.videoRoomId === 'pending') {
      return NextResponse.json({ message: 'Video room not found or not yet initialized' }, { status: 404 });
    }

    // Determine if user is the coach (owner) or learner
    const isOwner = booking.coachId === session.user.id;
    const userProfile = isOwner ? booking.coach : booking.learner;
    const userName = `${userProfile.firstName} ${userProfile.lastName}`;

    // Create meeting token
    const result = await createLiveKitToken({
      roomName: booking.videoRoomId || `kallcast-${booking.id}`,
      participantName: userName,
      participantId: session.user.id,
      isOwner: isOwner,
    });

    return NextResponse.json({ 
      token: result.token,
      roomUrl: result.url,
      serverUrl: result.url,
    });
  } catch (error) {
    console.error('Get video token error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
