import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();
    
    const users = await User.find({}).select('-password');
    const userCount = await User.countDocuments();
    
    return NextResponse.json({ 
      status: 'success', 
      userCount,
      users: users.slice(0, 5), // Show first 5 users
      message: `Found ${userCount} users in database`
    });
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'error', 
      message: error.message,
      userCount: 0
    }, { status: 500 });
  }
}
