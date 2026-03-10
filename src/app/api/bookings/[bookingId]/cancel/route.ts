import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import { SessionStatus, SlotStatus } from '@/generated/client';
import { cancelBookingSchema } from '@/validations/booking';

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

    // Check if user has permission to cancel this booking
    if (booking.learnerId !== session.user.id && booking.coachId !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Check if booking can be cancelled
    if (booking.sessionStatus === SessionStatus.cancelled) {
      return NextResponse.json({ message: 'Booking already cancelled' }, { status: 400 });
    }

    if (booking.sessionStatus === SessionStatus.completed) {
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

    // Use transaction to update booking and slot
    const updatedBooking = await prisma.$transaction(async (tx) => {
      // Update booking
      const b = await tx.booking.update({
        where: { id: bookingId },
        data: {
          sessionStatus: SessionStatus.cancelled,
          cancellationReason: reason,
          cancelledById: session.user.id,
          cancelledAt: new Date(),
        },
        include: {
          slot: {
            select: {
              id: true,
              currentParticipants: true,
              maxParticipants: true,
              status: true,
              title: true,
              description: true,
              duration: true,
              category: true,
            }
          },
          coach: {
            select: {
              firstName: true,
              lastName: true,
              profileImage: true,
            }
          },
          learner: {
            select: {
              firstName: true,
              lastName: true,
              profileImage: true,
            }
          }
        }
      });

      // Update slot participants
      if (b.slot) {
        const newParticipants = Math.max(0, b.slot.currentParticipants - 1);
        await tx.slot.update({
          where: { id: b.slotId },
          data: {
            currentParticipants: newParticipants,
            status: newParticipants < b.slot.maxParticipants ? SlotStatus.available : b.slot.status
          }
        });
      }

      return b;
    });

    // TODO: Handle refund logic here
    // This would typically involve calling Stripe's refund API

    return NextResponse.json({ 
      message: 'Booking cancelled successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
