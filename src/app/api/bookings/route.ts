import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { SessionStatus, SlotStatus, PaymentStatus, Prisma } from '@/generated/client';
import prisma from '@/lib/db';
import { createBookingSchema } from '@/validations/booking';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all'; // all, upcoming, completed, cancelled
    const role = searchParams.get('role') || 'learner'; // learner, coach

    const query: Prisma.BookingWhereInput = {};

    if (role === 'learner') {
      query.learnerId = session.user.id;
    } else if (role === 'coach') {
      query.coachId = session.user.id;
    }

    // Filter by status
    if (type === 'upcoming') {
      query.sessionStatus = { in: [SessionStatus.scheduled, SessionStatus.in_progress] };
      query.scheduledFor = { gte: new Date() };
    } else if (type === 'completed') {
      query.sessionStatus = SessionStatus.completed;
    } else if (type === 'cancelled') {
      query.sessionStatus = SessionStatus.cancelled;
    }

    const bookings = await prisma.booking.findMany({
      where: query,
      include: {
        slot: {
          select: {
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
            email: true,
          }
        }
      },
      orderBy: {
        scheduledFor: 'desc'
      }
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'learner') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validationResult = createBookingSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          message: 'Validation failed', 
          errors: validationResult.error.issues 
        },
        { status: 400 }
      );
    }

    const { slotId } = validationResult.data;

    // Get slot details
    const slot = await prisma.slot.findUnique({
      where: { id: slotId },
      include: { coach: true }
    });

    if (!slot) {
      return NextResponse.json({ message: 'Slot not found' }, { status: 404 });
    }

    // Check if slot is available
    if (slot.status !== SlotStatus.available) {
      return NextResponse.json({ message: 'Slot is not available' }, { status: 400 });
    }

    // Check if slot is full
    if (slot.currentParticipants >= slot.maxParticipants) {
      return NextResponse.json({ message: 'Slot is full' }, { status: 400 });
    }

    // Check if slot is in the future
    if (slot.startTime <= new Date()) {
      return NextResponse.json({ message: 'Cannot book past slots' }, { status: 400 });
    }

    // Calculate payment details
    const amount = slot.price;
    const platformFee = Math.round(amount * 0.20); // 20% platform fee
    const coachPayout = amount - platformFee;

    // Use transaction to ensure both booking is created and slot is updated
    const booking = await prisma.$transaction(async (tx) => {
      const newBooking = await tx.booking.create({
        data: {
          slotId,
          learnerId: session.user.id,
          coachId: slot.coachId,
          amount,
          platformFee,
          stripeFee: 0,
          coachPayout,
          paymentIntentId: 'temp_' + Date.now(),
          paymentStatus: PaymentStatus.pending,
          sessionStatus: SessionStatus.scheduled,
          videoRoomUrl: '',
          videoRoomId: '',
          scheduledFor: slot.startTime,
        },
        include: {
          slot: {
            select: {
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
      const newParticipants = slot.currentParticipants + 1;
      await tx.slot.update({
        where: { id: slotId },
        data: {
          currentParticipants: newParticipants,
          status: newParticipants >= slot.maxParticipants ? SlotStatus.booked : SlotStatus.available
        }
      });

      return newBooking;
    });

    return NextResponse.json(
      { 
        message: 'Booking created successfully', 
        booking 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
