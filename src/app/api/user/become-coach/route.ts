import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import { Role } from '@/generated/client';

export async function POST() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update user role to coach
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { role: Role.coach }
    });

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
