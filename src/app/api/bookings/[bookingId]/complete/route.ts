import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import { completeBookingSchema } from '@/validations/booking';

export async function POST(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const booking = await Booking.findById(params.bookingId);
    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    // Check if user is the coach for this booking
    if (booking.coachId.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Check if booking can be completed
    if (booking.sessionStatus !== 'in-progress') {
      return NextResponse.json({ message: 'Booking is not in progress' }, { status: 400 });
    }

    const body = await request.json();
    const validationResult = completeBookingSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          message: 'Validation failed', 
          errors: validationResult.error.issues 
        },
        { status: 400 }
      );
    }

    const { notes, duration } = validationResult.data;

    // Update booking
    booking.sessionStatus = 'completed';
    booking.completedAt = new Date();
    await booking.save();

    // TODO: Trigger payment transfer to coach
    // TODO: Send review request email to learner
    // TODO: Update coach stats

    return NextResponse.json({ 
      message: 'Session completed successfully',
      booking: await booking.populate([
        { path: 'slotId', select: 'title description duration category' },
        { path: 'coachId', select: 'firstName lastName profileImage' },
        { path: 'learnerId', select: 'firstName lastName profileImage' }
      ])
    });
  } catch (error) {
    console.error('Complete booking error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
