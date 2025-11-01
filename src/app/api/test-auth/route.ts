import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'No active session found',
        authenticated: false
      }, { status: 401 });
    }

    return NextResponse.json({ 
      status: 'success', 
      message: 'Authentication working',
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role
      }
    });
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'error', 
      message: error.message,
      authenticated: false
    }, { status: 500 });
  }
}
