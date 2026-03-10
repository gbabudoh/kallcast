import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import { SessionStatus } from '@/generated/client';
import { completeBookingSchema } from '@/validations/booking';
import { createTransfer } from '@/lib/stripe';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  const { bookingId } = await params;
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    // Check if user is the coach for this booking
    if (booking.coachId !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Check if booking can be completed
    if (booking.sessionStatus !== SessionStatus.in_progress) {
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

    const { duration } = validationResult.data;

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        sessionStatus: SessionStatus.completed,
        completedAt: new Date(),
        actualDuration: duration,
      },
      include: {
        slot: true,
        coach: true,
        learner: true,
      }
    });

    // Payout coach using Stripe Connect
    if (updatedBooking.coach.stripeAccountId && updatedBooking.coach.stripeOnboardingComplete) {
      try {
        // Find the payment record
        const paymentRecord = await prisma.payment.findFirst({
          where: { bookingId: updatedBooking.id }
        });

        if (paymentRecord && paymentRecord.status === 'held') {
          // Trigger Stripe Transfer
          const transfer = await createTransfer(
            updatedBooking.coachPayout,
            updatedBooking.coach.stripeAccountId,
            updatedBooking.id
          );

          // Update payment record with transfer info
          await prisma.payment.update({
            where: { id: paymentRecord.id },
            data: {
              status: 'transferred',
              stripeTransferId: transfer.id,
              transferredAt: new Date(),
            }
          });

          // Update booking payment status
          await prisma.booking.update({
            where: { id: bookingId },
            data: { paymentStatus: 'captured' }
          });
          
          // Update coach earnings
          await prisma.user.update({
            where: { id: updatedBooking.coachId },
            data: { 
              totalEarnings: { increment: updatedBooking.coachPayout },
              totalSessions: { increment: 1 }
            }
          });
        }
      } catch (payoutError) {
        console.error('Coach payout failed:', payoutError);
        // We don't fail the whole request, but we log the error.
        // We could flag the payment for manual retry.
      }
    }

    return NextResponse.json({ 
      message: 'Session completed successfully. Payout initiated.',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Complete booking error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
