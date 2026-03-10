import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { SessionStatus, PaymentStatus, EscrowStatus, Prisma } from '@/generated/client';
import prisma from '@/lib/db';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { bookingId, confirmed, rating, feedback } = await request.json();

    if (!bookingId) {
      return NextResponse.json({ message: 'Booking ID is required' }, { status: 400 });
    }

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

    const userId = session.user.id;
    const isCoach = booking.coachId === userId;
    const isClient = booking.learnerId === userId;

    if (!isCoach && !isClient) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const data: Prisma.BookingUpdateInput = {};
    const now = new Date();

    // Update session status to pending confirmation if not already
    if (booking.sessionStatus === SessionStatus.in_progress) {
      data.sessionStatus = SessionStatus.pending_confirmation;
      data.actualEndTime = now;
      if (booking.actualStartTime) {
        data.actualDuration = Math.round(
          (now.getTime() - booking.actualStartTime.getTime()) / 60000
        );
      }
    }

    // Record confirmation
    if (isCoach) {
      data.coachConfirmed = confirmed;
      data.coachConfirmedAt = now;
    } else {
      data.clientConfirmed = confirmed;
      data.clientConfirmedAt = now;
      // Save rating and feedback from client
      if (rating) data.rating = rating;
      if (feedback) data.feedback = feedback;
    }

    // Update booking initially
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data
    });

    // Check if both parties have confirmed
    const bothConfirmed = updatedBooking.coachConfirmed === true && updatedBooking.clientConfirmed === true;
    const anyDisputed = updatedBooking.coachConfirmed === false || updatedBooking.clientConfirmed === false;

    if (bothConfirmed) {
      // Release payment to coach
      try {
        // Capture the payment if using manual capture
        if (updatedBooking.paymentStatus === PaymentStatus.authorized) {
          await stripe.paymentIntents.capture(updatedBooking.paymentIntentId);
          await prisma.booking.update({
            where: { id: bookingId },
            data: { paymentStatus: PaymentStatus.captured }
          });
        }

        // Transfer to coach via Stripe Connect
        const coach = booking.coach;
        if (coach?.stripeAccountId) {
          const transferAmount = updatedBooking.coachPayout;
          
          await stripe.transfers.create({
            amount: Math.round(transferAmount * 100),
            currency: 'usd',
            destination: coach.stripeAccountId,
            transfer_group: `booking_${updatedBooking.id}`,
            metadata: {
              bookingId: updatedBooking.id,
              coachId: coach.id,
            },
          });

          await prisma.$transaction([
            prisma.booking.update({
              where: { id: bookingId },
              data: {
                escrowStatus: EscrowStatus.released,
                paymentStatus: PaymentStatus.paid,
                sessionStatus: SessionStatus.completed,
                completedAt: now,
              }
            }),
            prisma.user.update({
              where: { id: coach.id },
              data: {
                totalEarnings: { increment: transferAmount },
                totalSessions: { increment: 1 },
              }
            })
          ]);
        }

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
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          sessionStatus: SessionStatus.disputed,
          escrowStatus: EscrowStatus.disputed,
        }
      });

      return NextResponse.json({
        message: 'Issue reported. Admin will review.',
        status: 'disputed',
      });
    }

    // Waiting for other party to confirm
    return NextResponse.json({
      message: 'Confirmation recorded. Waiting for other party.',
      status: 'pending_confirmation',
      coachConfirmed: updatedBooking.coachConfirmed,
      clientConfirmed: updatedBooking.clientConfirmed,
    });
  } catch (error) {
    console.error('Session confirm error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
