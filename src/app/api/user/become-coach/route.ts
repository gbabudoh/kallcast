import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Update user role to coach
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { role: 'coach' },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Role updated successfully',
      user: {
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error('Become coach error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
