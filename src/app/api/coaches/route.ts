import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { APP_CONFIG } from '@/config/app';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || APP_CONFIG.PAGINATION.DEFAULT_PAGE.toString());
    const limit = parseInt(searchParams.get('limit') || APP_CONFIG.PAGINATION.DEFAULT_LIMIT.toString());
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minRating = parseFloat(searchParams.get('minRating') || APP_CONFIG.SEARCH.DEFAULT_MIN_RATING.toString());
    const maxPrice = parseFloat(searchParams.get('maxPrice') || APP_CONFIG.SEARCH.DEFAULT_MAX_PRICE.toString());

    // Build query
    const query: any = {
      role: 'coach',
      isVerified: true,
    };

    if (category) {
      query.expertise = { $in: [category] };
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { expertise: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (minRating > 0) {
      query.averageRating = { $gte: minRating };
    }

    if (maxPrice < APP_CONFIG.SEARCH.DEFAULT_MAX_PRICE) {
      query.hourlyRate = { $lte: maxPrice };
    }

    // Get coaches with pagination
    const skip = (page - 1) * limit;
    const coaches = await User.find(query)
      .select('-password -email')
      .sort({ averageRating: -1, totalSessions: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    return NextResponse.json({
      coaches,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get coaches error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
