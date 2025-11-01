import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Review from '@/models/Review';
import Booking from '@/models/Booking';
import User from '@/models/User';
import { createReviewSchema } from '@/validations/review';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const coachId = searchParams.get('coachId');
    const bookingId = searchParams.get('bookingId');

    let query: any = {};

    if (coachId) {
      query.coachId = coachId;
    }

    if (bookingId) {
      query.bookingId = bookingId;
    }

    const reviews = await Review.find(query)
      .populate('coachId', 'firstName lastName profileImage')
      .populate('learnerId', 'firstName lastName profileImage')
      .populate('bookingId', 'scheduledFor slotId')
      .sort({ createdAt: -1 });

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

    await connectDB();
    
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
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    if (booking.learnerId.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Check if booking is completed
    if (booking.sessionStatus !== 'completed') {
      return NextResponse.json({ message: 'Can only review completed sessions' }, { status: 400 });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return NextResponse.json({ message: 'Review already exists for this booking' }, { status: 400 });
    }

    // Create review
    const review = new Review({
      bookingId,
      coachId: booking.coachId,
      learnerId: session.user.id,
      rating,
      comment,
    });

    await review.save();

    // Update booking to mark as reviewed
    booking.isReviewed = true;
    booking.reviewId = review._id;
    await booking.save();

    // Update coach's average rating
    const coachReviews = await Review.find({ coachId: booking.coachId });
    const averageRating = coachReviews.reduce((sum, r) => sum + r.rating, 0) / coachReviews.length;
    
    await User.findByIdAndUpdate(booking.coachId, {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
    });

    return NextResponse.json(
      { 
        message: 'Review created successfully', 
        review: await review.populate([
          { path: 'coachId', select: 'firstName lastName profileImage' },
          { path: 'learnerId', select: 'firstName lastName profileImage' },
          { path: 'bookingId', select: 'scheduledFor' }
        ])
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
