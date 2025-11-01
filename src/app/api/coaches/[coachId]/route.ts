import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Slot from '@/models/Slot';

export async function GET(
  request: NextRequest,
  { params }: { params: { coachId: string } }
) {
  try {
    await connectDB();
    
    const coach = await User.findOne({
      _id: params.coachId,
      role: 'coach',
    }).select('-password -email');

    if (!coach) {
      return NextResponse.json({ message: 'Coach not found' }, { status: 404 });
    }

    // Get coach's available slots
    const slots = await Slot.find({
      coachId: params.coachId,
      status: 'available',
      startTime: { $gte: new Date() },
    }).sort({ startTime: 1 });

    return NextResponse.json({
      coach,
      availableSlots: slots,
    });
  } catch (error) {
    console.error('Get coach error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
