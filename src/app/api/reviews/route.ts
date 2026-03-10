import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { SessionStatus, Prisma } from '@/generated/client';
import prisma from '@/lib/db';
import { createReviewSchema } from '@/validations/review';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const coachId = searchParams.get('coachId');
    const bookingId = searchParams.get('bookingId');

    const where: Prisma.ReviewWhereInput = {};

    if (coachId) {
      where.coachId = coachId;
    }

    if (bookingId) {
      where.bookingId = bookingId;
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        coach: {
          select: { firstName: true, lastName: true, profileImage: true }
        },
        learner: {
          select: { firstName: true, lastName: true, profileImage: true }
        },
        booking: {
          select: { scheduledFor: true, slotId: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Get reviews error:', error);
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

    const body = await request.json();
    const validationResult = createReviewSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          message: 'Validation failed', 
          errors: validationResult.error.issues 
        },
        { status: 400 }
      );
    }

    const { bookingId, rating, comment } = validationResult.data;

    // Check if booking exists and belongs to user
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });
    
    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    if (booking.learnerId !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Check if booking is completed
    if (booking.sessionStatus !== SessionStatus.completed) {
      return NextResponse.json({ message: 'Can only review completed sessions' }, { status: 400 });
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: { bookingId }
    });
    if (existingReview) {
      return NextResponse.json({ message: 'Review already exists for this booking' }, { status: 400 });
    }

    // Create review and update booking in a transaction
    const review = await prisma.$transaction(async (tx) => {
      const newReview = await tx.review.create({
        data: {
          bookingId,
          coachId: booking.coachId,
          learnerId: session.user.id,
          rating,
          comment,
        },
        include: {
          coach: { select: { firstName: true, lastName: true, profileImage: true } },
          learner: { select: { firstName: true, lastName: true, profileImage: true } },
          booking: { select: { scheduledFor: true } }
        }
      });

      // Update booking to mark as reviewed
      await tx.booking.update({
        where: { id: bookingId },
        data: {
          isReviewed: true,
          reviewId: newReview.id,
          rating: rating,
          feedback: comment
        }
      });

      // Update coach's average rating
      const coachReviews = await tx.review.findMany({
        where: { coachId: booking.coachId }
      });
      const allRatings = [...coachReviews.map(r => r.rating), rating];
      const averageRating = allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length;
      
      await tx.user.update({
        where: { id: booking.coachId },
        data: {
          averageRating: Math.round(averageRating * 10) / 10,
        }
      });

      return newReview;
    });

    return NextResponse.json(
      { 
        message: 'Review created successfully', 
        review
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
