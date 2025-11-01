import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import { createRoom } from '@/lib/daily';

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
      .populate('slotId')
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

    // Check if booking is scheduled and ready
    if (booking.sessionStatus !== 'scheduled') {
      return NextResponse.json({ message: 'Booking is not scheduled' }, { status: 400 });
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
    if (booking.videoRoomId) {
      // Room already exists, just return the details
      room = {
        id: booking.videoRoomId,
        url: booking.videoRoomUrl,
      };
    } else {
      // Create new room
      room = await createRoom({
        name: `session-${booking._id}`,
        maxParticipants: booking.slotId.maxParticipants,
        startTime: sessionStart,
        endTime: new Date(sessionStart.getTime() + booking.slotId.duration * 60 * 1000),
        enableRecording: true,
        enableChat: true,
        enableScreenshare: true,
      });

      // Update booking with room details
      booking.videoRoomUrl = room.url;
      booking.videoRoomId = room.id;
      booking.sessionStatus = 'in-progress';
      await booking.save();
    }

    return NextResponse.json({ 
      room,
      booking: {
        id: booking._id,
        status: booking.sessionStatus,
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
