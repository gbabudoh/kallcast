import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    await prisma.$connect();
    return NextResponse.json({ 
      status: 'success', 
      message: 'PostgreSQL connected successfully via Prisma',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      status: 'error', 
      message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
