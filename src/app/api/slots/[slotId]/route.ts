import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import Slot from '@/models/Slot';
import { updateSlotSchema } from '@/validations/coach';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slotId: string }> }
) {
  const { slotId } = await params;
  try {
    await connectDB();
    
    let slot;
    if (mongoose.Types.ObjectId.isValid(slotId)) {
      slot = await Slot.findById(slotId)
        .populate('coachId', 'firstName lastName profileImage hourlyRate averageRating bio expertise');
    }

    if (!slot && slotId.startsWith('mock-slot-')) {
      // Return a mock slot for testing the booking flow
      slot = {
        _id: slotId,
        title: 'Strategy & Leadership Acceleration Session',
        price: 150,
        duration: 60,
        maxParticipants: 1,
        currentParticipants: 0,
        startTime: new Date(Date.now() + 86400000).toISOString(),
        endTime: new Date(Date.now() + 90000000).toISOString(),
        category: 'Product Strategy',
        coachId: {
          _id: '65af5656c5435016c6800101',
          firstName: 'Sarah',
          lastName: 'Johnson',
          profileImage: undefined,
          hourlyRate: 150,
          averageRating: 4.9,
          bio: 'Former Google PM with 8+ years building products used by millions.',
          expertise: ['Product Strategy', 'Leadership', 'Agile']
        }
      };
    }

    if (!slot) {
      return NextResponse.json({ message: 'Slot not found' }, { status: 404 });
    }

    return NextResponse.json({ slot });
  } catch (error) {
    console.error('Get slot error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slotId: string }> }
) {
  const { slotId } = await params;
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const slot = await Slot.findById(slotId);
    if (!slot) {
      return NextResponse.json({ message: 'Slot not found' }, { status: 404 });
    }

    // Check if user is the coach who owns this slot
    if (slot.coachId.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validationResult = updateSlotSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          message: 'Validation failed', 
          errors: validationResult.error.issues 
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    const updatedSlot = await Slot.findByIdAndUpdate(
      slotId,
      data,
      { new: true, runValidators: true }
    ).populate('coachId', 'firstName lastName profileImage');

    return NextResponse.json({
      message: 'Slot updated successfully',
      slot: updatedSlot,
    });
  } catch (error) {
    console.error('Update slot error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slotId: string }> }
) {
  const { slotId } = await params;
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const slot = await Slot.findById(slotId);
    if (!slot) {
      return NextResponse.json({ message: 'Slot not found' }, { status: 404 });
    }

    // Check if user is the coach who owns this slot
    if (slot.coachId.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Check if slot has any bookings
    if (slot.currentParticipants > 0) {
      return NextResponse.json(
        { message: 'Cannot delete slot with existing bookings' },
        { status: 400 }
      );
    }

    await Slot.findByIdAndDelete(slotId);

    return NextResponse.json({ message: 'Slot deleted successfully' });
  } catch (error) {
    console.error('Delete slot error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
