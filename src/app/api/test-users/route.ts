import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      },
      take: 5
    });
    const userCount = await prisma.user.count();
    
    return NextResponse.json({ 
      status: 'success', 
      userCount,
      users,
      message: `Found ${userCount} users in database`
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      status: 'error', 
      message: errorMessage,
      userCount: 0
    }, { status: 500 });
  }
}
