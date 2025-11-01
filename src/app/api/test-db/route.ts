import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ 
      status: 'success', 
      message: 'Database connected successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'error', 
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
