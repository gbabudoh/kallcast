import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { SessionStatus } from '@/generated/client';
import prisma from '@/lib/db';

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
        slot: true,
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

    // Check if booking is scheduled and ready
    if (booking.sessionStatus !== SessionStatus.scheduled && booking.sessionStatus !== SessionStatus.in_progress) {
      return NextResponse.json({ message: 'Booking is not scheduled or in progress' }, { status: 400 });
    }

    // Check if it's time for the session (allow 15 minutes early)
    const now = new Date();
    const sessionStart = new Date(booking.scheduledFor);
    const earlyAccess = new Date(sessionStart.getTime() - 15 * 60 * 1000);

    if (now < earlyAccess) {
      return NextResponse.json({ 
        message: 'Session not yet available',
        availableAt: earlyAccess 
      }, { status: 400 });
    }

    // Create or get existing room
    let room;
    if (booking.videoRoomId && booking.videoRoomId !== 'pending') {
      // Room already exists, just return the details
      room = {
        id: booking.videoRoomId,
        url: booking.videoRoomUrl,
      };
    } else {
      // For LiveKit, the room name IS the ID. 
      // We use a prefix to avoid collisions.
      const roomName = `kallcast-${booking.id}`;
      const roomUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || '';

      room = {
        id: roomName,
        url: roomUrl,
      };

      // Update booking with room details
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          videoRoomUrl: roomUrl,
          videoRoomId: roomName,
          sessionStatus: SessionStatus.in_progress,
        }
      });
    }

    return NextResponse.json({ 
      room,
      booking: {
        id: booking.id,
        status: SessionStatus.in_progress,
        scheduledFor: booking.scheduledFor,
      }
    });
  } catch (error) {
    console.error('Create video room error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
