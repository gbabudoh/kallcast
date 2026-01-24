import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import Slot from '@/models/Slot';

export async function POST() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // 1. Setup Test Data
    const coachId = session.user.id;
    const learnerId = session.user.id;
    const duration = 60;
    const startTime = new Date(Date.now() + 3600000);
    const endTime = new Date(startTime.getTime() + duration * 60000);

    const testSlot = await Slot.create({
      coachId,
      title: 'TEST INTEGRATION SESSION',
      description: 'Verifying Jitsi + Stripe + Mattermost',
      startTime,
      endTime,
      duration,
      price: 50,
      maxParticipants: 5,
      category: 'Technology',
      status: 'booked',
    });

    const testBooking = await Booking.create({
      slotId: testSlot._id,
      learnerId,
      coachId,
      amount: 50,
      platformFee: 10,
      stripeFee: 1.75,
      coachPayout: 38.25,
      paymentIntentId: 'pi_test_verification',
      paymentStatus: 'authorized', // Escrowed
      escrowStatus: 'authorized',
      sessionStatus: 'scheduled',
      videoRoomUrl: 'https://jitsi.feendesk.com/kallcast-test-room',
      videoRoomId: 'test-room-id',
      scheduledFor: testSlot.startTime,
    });

    // 2. Simulate Video Session Start
    testBooking.sessionStatus = 'in-progress';
    testBooking.actualStartTime = new Date();
    await testBooking.save();

    // 3. Simulate Session Completion
    testBooking.sessionStatus = 'pending_confirmation';
    testBooking.actualEndTime = new Date();
    await testBooking.save();

    // 4. Return the test booking ID for manual confirmation test
    return NextResponse.json({
      message: 'Test booking created and advanced to pending_confirmation',
      bookingId: testBooking._id,
      nextStep: 'Call /api/sessions/confirm with this bookingId to test payment release',
      status: testBooking.sessionStatus,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('Test flow error:', error);
    return NextResponse.json({ message: 'Internal server error', error: errorMessage }, { status: 500 });
  }
}
