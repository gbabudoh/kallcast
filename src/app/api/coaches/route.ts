import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@/generated/client';
import prisma from '@/lib/db';
import { APP_CONFIG } from '@/config/app';

export async function GET(request: NextRequest) {
  try {
    
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || APP_CONFIG.PAGINATION.DEFAULT_PAGE.toString());
    const limit = parseInt(searchParams.get('limit') || APP_CONFIG.PAGINATION.DEFAULT_LIMIT.toString());
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minRating = parseFloat(searchParams.get('minRating') || APP_CONFIG.SEARCH.DEFAULT_MIN_RATING.toString());
    const maxPrice = parseFloat(searchParams.get('maxPrice') || APP_CONFIG.SEARCH.DEFAULT_MAX_PRICE.toString());

    // Build query for Prisma
    const where: Prisma.UserWhereInput = {
      role: 'coach',
      isVerified: true,
    };

    if (category) {
      where.expertise = { has: category };
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
        { expertise: { has: search } }, // Case-sensitive for array elements in Prisma usually, but good enough for now
      ];
    }

    if (minRating > 0) {
      where.averageRating = { gte: minRating };
    }

    if (maxPrice < APP_CONFIG.SEARCH.DEFAULT_MAX_PRICE) {
      where.hourlyRate = { lte: maxPrice };
    }

    // Get coaches with pagination
    const skip = (page - 1) * limit;
    const coaches = await prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        profileImage: true,
        bio: true,
        expertise: true,
        yearsExperience: true,
        hourlyRate: true,
        averageRating: true,
        totalSessions: true,
        title: true,
        company: true,
        location: true,
        sessionTitle: true,
        sessionGains: true,
      },
      orderBy: [
        { averageRating: 'desc' },
        { totalSessions: 'desc' },
      ],
      skip,
      take: limit,
    });

    const total = await prisma.user.count({ where });

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
