import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import { Prisma, SlotStatus } from '@/generated/client';
import { createSlotSchema } from '@/validations/coach';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const coachId = searchParams.get('coachId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build query for Prisma
    const where: Prisma.SlotWhereInput = {
      status: SlotStatus.available,
      startTime: { gte: startDate ? new Date(startDate) : new Date() },
      endTime: endDate ? { lte: new Date(endDate) } : undefined,
      coachId: coachId || undefined,
      category: category ? { contains: category, mode: 'insensitive' } : undefined,
      OR: search ? [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { coach: { firstName: { contains: search, mode: 'insensitive' } } },
        { coach: { lastName: { contains: search, mode: 'insensitive' } } },
      ] : undefined,
    };

    const skip = (page - 1) * limit;
    const slots = await prisma.slot.findMany({
      where,
      include: {
        coach: {
          select: {
            firstName: true,
            lastName: true,
            profileImage: true,
            hourlyRate: true,
            averageRating: true,
            isVerified: true,
            id: true
          }
        }
      },
      orderBy: {
        startTime: 'asc'
      },
      skip,
      take: limit,
    });

    const total = await prisma.slot.count({ where });

    return NextResponse.json({ 
      slots,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
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

    
    
    const body = await request.json();
    
    // Support batch creation
    if (Array.isArray(body)) {
      const slotsData = body.map((slotData) => {
        const validation = createSlotSchema.safeParse(slotData);
        if (!validation.success) {
          throw new Error(`Validation failed for one or more slots: ${validation.error.message}`);
        }
        return {
          ...validation.data,
          coachId: session.user.id,
          status: (validation.data.status as SlotStatus) || SlotStatus.available,
        };
      });

      const slots = await prisma.slot.createMany({
        data: slotsData,
      });

      return NextResponse.json(
        { message: `${slots.count} slots created successfully`, count: slots.count },
        { status: 201 }
      );
    }

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
    const slot = await prisma.slot.create({
      data: {
        ...data,
        coachId: session.user.id,
        status: (data.status as SlotStatus) || SlotStatus.available,
      },
      include: {
        coach: {
          select: {
            firstName: true,
            lastName: true,
            profileImage: true,
          }
        }
      }
    });

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
