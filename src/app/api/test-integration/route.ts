import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import { SessionStatus, SlotStatus, PaymentStatus, EscrowStatus } from '@/generated/client';

export async function POST() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // 1. Setup Test Data
    const coachId = session.user.id;
    const learnerId = session.user.id;
    const duration = 60;
    const startTime = new Date(Date.now() + 3600000);
    const endTime = new Date(startTime.getTime() + duration * 60000);

    const testSlot = await prisma.slot.create({
      data: {
        coachId,
        title: 'TEST INTEGRATION SESSION',
        description: 'Verifying Jitsi + Stripe + Mattermost',
        startTime,
        endTime,
        duration,
        price: 50,
        maxParticipants: 5,
        category: 'Technology',
        status: SlotStatus.booked,
      }
    });

    const testBooking = await prisma.booking.create({
      data: {
        slotId: testSlot.id,
        learnerId,
        coachId,
        amount: 50,
        platformFee: 10,
        stripeFee: 1.75,
        coachPayout: 38.25,
        paymentIntentId: 'pi_test_verification',
        paymentStatus: PaymentStatus.authorized, // Escrowed
        escrowStatus: EscrowStatus.authorized,
        sessionStatus: SessionStatus.scheduled,
        videoRoomUrl: 'https://jitsi.feendesk.com/kallcast-test-room',
        videoRoomId: 'test-room-id',
        scheduledFor: testSlot.startTime,
      }
    });

    // 2. Simulate Video Session Start
    await prisma.booking.update({
      where: { id: testBooking.id },
      data: {
        sessionStatus: SessionStatus.in_progress,
        actualStartTime: new Date(),
      }
    });

    // 3. Simulate Session Completion
    const finalizedBooking = await prisma.booking.update({
      where: { id: testBooking.id },
      data: {
        sessionStatus: SessionStatus.pending_confirmation,
        actualEndTime: new Date(),
      }
    });

    // 4. Return the test booking ID for manual confirmation test
    return NextResponse.json({
      message: 'Test booking created and advanced to pending_confirmation',
      bookingId: finalizedBooking.id,
      nextStep: 'Call /api/sessions/confirm with this bookingId to test payment release',
      status: finalizedBooking.sessionStatus,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('Test flow error:', error);
    return NextResponse.json({ message: 'Internal server error', error: errorMessage }, { status: 500 });
  }
}
