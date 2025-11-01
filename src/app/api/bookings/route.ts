import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import Slot from '@/models/Slot';
import User from '@/models/User';
import { createBookingSchema } from '@/validations/booking';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all'; // all, upcoming, completed, cancelled
    const role = searchParams.get('role') || 'learner'; // learner, coach

    let query: any = {};

    if (role === 'learner') {
      query.learnerId = session.user.id;
    } else if (role === 'coach') {
      query.coachId = session.user.id;
    }

    // Filter by status
    if (type === 'upcoming') {
      query.sessionStatus = { $in: ['scheduled', 'in-progress'] };
      query.scheduledFor = { $gte: new Date() };
    } else if (type === 'completed') {
      query.sessionStatus = 'completed';
    } else if (type === 'cancelled') {
      query.sessionStatus = 'cancelled';
    }

    const bookings = await Booking.find(query)
      .populate('slotId', 'title description duration category')
      .populate('coachId', 'firstName lastName profileImage')
      .populate('learnerId', 'firstName lastName profileImage')
      .sort({ scheduledFor: -1 });

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

    await connectDB();
    
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

    const { slotId, paymentMethodId } = validationResult.data;

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

    // Calculate payment details
    const amount = slot.price;
    const platformFee = Math.round(amount * 0.20); // 20% platform fee
    const coachPayout = amount - platformFee;

    // Create booking (payment will be handled by Stripe webhook)
    const booking = new Booking({
      slotId,
      learnerId: session.user.id,
      coachId: slot.coachId._id,
      amount,
      platformFee,
      stripeFee: 0, // Will be updated by webhook
      coachPayout,
      paymentIntentId: 'temp_' + Date.now(), // Temporary, will be updated by Stripe
      paymentStatus: 'pending',
      sessionStatus: 'scheduled',
      videoRoomUrl: '', // Will be created when payment is confirmed
      videoRoomId: '', // Will be created when payment is confirmed
      scheduledFor: slot.startTime,
    });

    await booking.save();

    // Update slot participants
    slot.currentParticipants += 1;
    if (slot.currentParticipants >= slot.maxParticipants) {
      slot.status = 'booked';
    }
    await slot.save();

    return NextResponse.json(
      { 
        message: 'Booking created successfully', 
        booking: await booking.populate([
          { path: 'slotId', select: 'title description duration category' },
          { path: 'coachId', select: 'firstName lastName profileImage' },
          { path: 'learnerId', select: 'firstName lastName profileImage' }
        ])
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
