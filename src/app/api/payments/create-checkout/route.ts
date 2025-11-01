import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Slot from '@/models/Slot';
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
    const slot = await Slot.findById(slotId).populate('coachId');
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

    // Create Stripe checkout session
    const checkoutSession = await createCheckoutSession({
      slotId,
      coachId: slot.coachId._id.toString(),
      learnerId: session.user.id,
      amount: slot.price,
      successUrl: `${APP_CONFIG.URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${APP_CONFIG.URL}/booking/cancel`,
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
