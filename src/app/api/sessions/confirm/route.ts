import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import User from '@/models/User';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const { bookingId, confirmed, rating, feedback } = await request.json();

    if (!bookingId) {
      return NextResponse.json({ message: 'Booking ID is required' }, { status: 400 });
    }

    const booking = await Booking.findById(bookingId)
      .populate('coachId')
      .populate('learnerId');

    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    const userId = session.user.id;
    const isCoach = booking.coachId._id.toString() === userId;
    const isClient = booking.learnerId._id.toString() === userId;

    if (!isCoach && !isClient) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Update session status to pending confirmation if not already
    if (booking.sessionStatus === 'in-progress') {
      booking.sessionStatus = 'pending_confirmation';
      booking.actualEndTime = new Date();
      if (booking.actualStartTime) {
        booking.actualDuration = Math.round(
          (booking.actualEndTime.getTime() - booking.actualStartTime.getTime()) / 60000
        );
      }
    }

    // Record confirmation
    const now = new Date();
    if (isCoach) {
      booking.coachConfirmed = confirmed;
      booking.coachConfirmedAt = now;
    } else {
      booking.clientConfirmed = confirmed;
      booking.clientConfirmedAt = now;
      // Save rating and feedback from client
      if (rating) booking.rating = rating;
      if (feedback) booking.feedback = feedback;
    }

    await booking.save();

    // Check if both parties have confirmed
    const bothConfirmed = booking.coachConfirmed === true && booking.clientConfirmed === true;
    const anyDisputed = booking.coachConfirmed === false || booking.clientConfirmed === false;

    if (bothConfirmed) {
      // Release payment to coach
      try {
        // Capture the payment if using manual capture
        if (booking.paymentStatus === 'authorized') {
          await stripe.paymentIntents.capture(booking.paymentIntentId);
          booking.paymentStatus = 'captured';
        }

        // Transfer to coach via Stripe Connect
        const coach = await User.findById(booking.coachId._id);
        if (coach?.stripeAccountId) {
          const transferAmount = booking.coachPayout;
          
          await stripe.transfers.create({
            amount: Math.round(transferAmount * 100),
            currency: 'usd',
            destination: coach.stripeAccountId,
            transfer_group: `booking_${booking._id}`,
            metadata: {
              bookingId: booking._id.toString(),
              coachId: coach._id.toString(),
            },
          });

          booking.escrowStatus = 'released';
          booking.paymentStatus = 'paid';
          
          // Update coach earnings
          coach.totalEarnings = (coach.totalEarnings || 0) + transferAmount;
          coach.totalSessions = (coach.totalSessions || 0) + 1;
          await coach.save();
        }

        booking.sessionStatus = 'completed';
        booking.completedAt = new Date();
        await booking.save();

        return NextResponse.json({
          message: 'Session completed and payment released',
          status: 'completed',
          paymentReleased: true,
        });
      } catch (paymentError) {
        console.error('Payment release error:', paymentError);
        return NextResponse.json({
          message: 'Session confirmed but payment release failed',
          status: 'pending_payment',
          error: true,
        }, { status: 500 });
      }
    } else if (anyDisputed) {
      // Mark as disputed for admin review
      booking.sessionStatus = 'disputed';
      booking.escrowStatus = 'disputed';
      await booking.save();

      return NextResponse.json({
        message: 'Issue reported. Admin will review.',
        status: 'disputed',
      });
    }

    // Waiting for other party to confirm
    return NextResponse.json({
      message: 'Confirmation recorded. Waiting for other party.',
      status: 'pending_confirmation',
      coachConfirmed: booking.coachConfirmed,
      clientConfirmed: booking.clientConfirmed,
    });
  } catch (error) {
    console.error('Session confirm error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
