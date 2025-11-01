import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import { createMeetingToken } from '@/lib/daily';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json({ message: 'Booking ID is required' }, { status: 400 });
    }

    // Get booking details
    const booking = await Booking.findById(bookingId)
      .populate('coachId')
      .populate('learnerId');

    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    // Check if user has access to this booking
    if (booking.learnerId._id.toString() !== session.user.id && 
        booking.coachId._id.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Check if booking is in progress
    if (booking.sessionStatus !== 'in-progress') {
      return NextResponse.json({ message: 'Session is not in progress' }, { status: 400 });
    }

    if (!booking.videoRoomId) {
      return NextResponse.json({ message: 'Video room not found' }, { status: 404 });
    }

    // Determine if user is the coach (owner) or learner
    const isOwner = booking.coachId._id.toString() === session.user.id;
    const userName = isOwner 
      ? `${booking.coachId.firstName} ${booking.coachId.lastName}`
      : `${booking.learnerId.firstName} ${booking.learnerId.lastName}`;

    // Create meeting token
    const token = await createMeetingToken(
      booking.videoRoomId,
      session.user.id,
      userName,
      isOwner
    );

    return NextResponse.json({ 
      token: token.token,
      roomUrl: booking.videoRoomUrl,
      expiresAt: token.exp,
    });
  } catch (error) {
    console.error('Get video token error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
