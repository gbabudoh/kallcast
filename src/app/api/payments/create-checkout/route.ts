import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import { createCheckoutSession } from '@/lib/stripe';
import { APP_CONFIG } from '@/config/app';
import { SlotStatus, SessionStatus, PaymentStatus } from '@/generated/client';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'learner') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { slotId } = await request.json();

    if (!slotId) {
      return NextResponse.json({ message: 'Slot ID is required' }, { status: 400 });
    }

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

    // Create a pending booking first to get an ID for tracking
    const booking = await prisma.booking.create({
      data: {
        slotId,
        learnerId: session.user.id,
        coachId: slot.coachId,
        amount: slot.price,
        // Fees will be finalized in the webhook, but we store initial estimates
        platformFee: Math.round(slot.price * 0.2),
        stripeFee: 0,
        coachPayout: 0,
        paymentIntentId: 'pending', // Will be updated by Stripe
        paymentStatus: PaymentStatus.pending,
        sessionStatus: SessionStatus.scheduled,
        videoRoomUrl: 'pending',
        videoRoomId: 'pending',
        scheduledFor: slot.startTime,
      }
    });

    // Create Stripe checkout session with local booking ID
    const checkoutSession = await createCheckoutSession({
      slotId,
      bookingId: booking.id,
      coachId: slot.coachId,
      learnerId: session.user.id,
      amount: slot.price,
      successUrl: `${APP_CONFIG.URL}/booking/success?payment_id={CHECKOUT_SESSION_ID}&booking_id=${booking.id}`,
      cancelUrl: `${APP_CONFIG.URL}/booking/cancel?booking_id=${booking.id}`,
    });

    return NextResponse.json({ 
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id 
    });
  } catch (err: unknown) {
    console.error('Create checkout session error:', err);
    
    // Cast to access properties safely while satisfying linter
    const error = err as { type?: string; message?: string };
    
    // Provide more specific error messages for debugging
    if (error.type === 'StripeAuthenticationError') {
      return NextResponse.json(
        { message: 'Stripe Authentication Error: Invalid API Key in .env.local' },
        { status: 500 }
      );
    }

    if (typeof error.type === 'string' && error.type.startsWith('Stripe')) {
      return NextResponse.json(
        { message: `Stripe Error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
