import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Slot from '@/models/Slot';
import { createSlotSchema } from '@/validations/coach';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const coachId = searchParams.get('coachId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const category = searchParams.get('category');

    // Build query
    const query: any = {
      status: 'available',
      startTime: { $gte: new Date() },
    };

    if (coachId) {
      query.coachId = coachId;
    }

    if (startDate) {
      query.startTime.$gte = new Date(startDate);
    }

    if (endDate) {
      query.endTime = { ...query.endTime, $lte: new Date(endDate) };
    }

    if (category) {
      query.category = category;
    }

    const slots = await Slot.find(query)
      .populate('coachId', 'firstName lastName profileImage hourlyRate averageRating')
      .sort({ startTime: 1 });

    return NextResponse.json({ slots });
  } catch (error) {
    console.error('Get slots error:', error);
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

    if (session.user.role !== 'coach') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    
    const body = await request.json();
    const validationResult = createSlotSchema.safeParse(body);

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
    const slot = new Slot({
      ...data,
      coachId: session.user.id,
    });

    await slot.save();
    await slot.populate('coachId', 'firstName lastName profileImage');

    return NextResponse.json(
      { message: 'Slot created successfully', slot },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create slot error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
