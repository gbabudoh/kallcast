import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';

export async function GET(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const booking = await Booking.findById(params.bookingId)
      .populate('slotId', 'title description duration category')
      .populate('coachId', 'firstName lastName profileImage')
      .populate('learnerId', 'firstName lastName profileImage');

    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    // Check if user has access to this booking
    if (booking.learnerId._id.toString() !== session.user.id && 
        booking.coachId._id.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
