import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import Slot from '@/models/Slot';
import { cancelBookingSchema } from '@/validations/booking';

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

    // Check if user has permission to cancel this booking
    if (booking.learnerId.toString() !== session.user.id && 
        booking.coachId.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Check if booking can be cancelled
    if (booking.sessionStatus === 'cancelled') {
      return NextResponse.json({ message: 'Booking already cancelled' }, { status: 400 });
    }

    if (booking.sessionStatus === 'completed') {
      return NextResponse.json({ message: 'Cannot cancel completed booking' }, { status: 400 });
    }

    const body = await request.json();
    const validationResult = cancelBookingSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          message: 'Validation failed', 
          errors: validationResult.error.issues 
        },
        { status: 400 }
      );
    }

    const { reason } = validationResult.data;

    // Update booking
    booking.sessionStatus = 'cancelled';
    booking.cancellationReason = reason;
    booking.cancelledBy = session.user.id;
    booking.cancelledAt = new Date();
    await booking.save();

    // Update slot participants
    const slot = await Slot.findById(booking.slotId);
    if (slot) {
      slot.currentParticipants = Math.max(0, slot.currentParticipants - 1);
      if (slot.status === 'booked' && slot.currentParticipants < slot.maxParticipants) {
        slot.status = 'available';
      }
      await slot.save();
    }

    // TODO: Handle refund logic here
    // This would typically involve calling Stripe's refund API

    return NextResponse.json({ 
      message: 'Booking cancelled successfully',
      booking: await booking.populate([
        { path: 'slotId', select: 'title description duration category' },
        { path: 'coachId', select: 'firstName lastName profileImage' },
        { path: 'learnerId', select: 'firstName lastName profileImage' }
      ])
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
