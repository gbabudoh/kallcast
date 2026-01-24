import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import Slot from '@/models/Slot';
import Booking from '@/models/Booking';
import User from '@/models/User';
import { createCheckoutSession } from '@/lib/stripe';
import { APP_CONFIG } from '@/config/app';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'learner') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    
    const { slotId } = await request.json();

    if (!slotId) {
      return NextResponse.json({ message: 'Slot ID is required' }, { status: 400 });
    }

    // Get slot details
    let slot;
    if (mongoose.Types.ObjectId.isValid(slotId)) {
      slot = await Slot.findById(slotId).populate('coachId');
    }

    if (!slot && slotId.startsWith('mock-slot-')) {
      // Mock persistence for testing purposes
      const coach = await User.findOne({ role: 'coach' });
      
      let mockSlot = await Slot.findOne({ title: 'Mock Expert Session' });
      if (!mockSlot) {
        mockSlot = new Slot({
          title: 'Mock Expert Session',
          description: 'This is a mock session for testing.',
          price: 50,
          duration: 60,
          startTime: new Date(Date.now() + 86400000), // Tomorrow
          endTime: new Date(Date.now() + 86400000 + 3600000),
          coachId: coach?._id || session.user.id,
          status: 'available',
          maxParticipants: 1,
          category: 'Technology'
        });
        await mockSlot.save();
      }

      const booking = new Booking({
        slotId: mockSlot._id,
        learnerId: session.user.id,
        coachId: mockSlot.coachId,
        amount: mockSlot.price,
        platformFee: Math.round(mockSlot.price * 0.2),
        stripeFee: 2,
        coachPayout: mockSlot.price - Math.round(mockSlot.price * 0.2) - 2,
        paymentIntentId: `mock_pi_${Date.now()}`,
        paymentStatus: 'paid',
        sessionStatus: 'scheduled',
        videoRoomUrl: 'https://jitsi.feendesk.com/mock-room',
        videoRoomId: `mock-room-${Date.now()}`,
        scheduledFor: mockSlot.startTime,
      });
      await booking.save();

      return NextResponse.json({ 
        checkoutUrl: `${APP_CONFIG.URL}/booking/success?session_id=${booking.paymentIntentId}`,
        sessionId: booking.paymentIntentId 
      });
    }

    if (!slot) {
      return NextResponse.json({ message: 'Slot not found' }, { status: 404 });
    }

    // Check if slot is available
    if (slot.status !== 'available') {
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

    // Create a pending booking first to get an ID for tracking
    const booking = new Booking({
      slotId,
      learnerId: session.user.id,
      coachId: slot.coachId._id,
      amount: slot.price,
      // Fees will be finalized in the webhook, but we store initial estimates
      platformFee: Math.round(slot.price * 0.2),
      stripeFee: 0,
      coachPayout: 0,
      paymentIntentId: 'pending', // Will be updated by Stripe
      paymentStatus: 'pending',
      sessionStatus: 'scheduled',
      videoRoomUrl: 'pending',
      videoRoomId: 'pending',
      scheduledFor: slot.startTime,
    });
    await booking.save();

    // Create Stripe checkout session with local booking ID
    const checkoutSession = await createCheckoutSession({
      slotId,
      bookingId: booking._id.toString(),
      coachId: slot.coachId._id.toString(),
      learnerId: session.user.id,
      amount: slot.price,
      successUrl: `${APP_CONFIG.URL}/booking/success?payment_id={CHECKOUT_SESSION_ID}&booking_id=${booking._id}`,
      cancelUrl: `${APP_CONFIG.URL}/booking/cancel?booking_id=${booking._id}`,
    });

    return NextResponse.json({ 
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id 
    });
  } catch (error) {
    console.error('Create checkout session error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
