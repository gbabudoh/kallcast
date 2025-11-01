import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getAccount } from '@/lib/stripe';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'coach') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    
    const user = await User.findById(session.user.id);
    if (!user || !user.stripeAccountId) {
      return NextResponse.json({ message: 'User or Stripe account not found' }, { status: 404 });
    }

    // Get account details from Stripe
    const account = await getAccount(user.stripeAccountId);

    // Update user onboarding status
    user.stripeOnboardingComplete = account.details_submitted && account.charges_enabled;
    await user.save();

    return NextResponse.json({ 
      account,
      onboardingComplete: user.stripeOnboardingComplete 
    });
  } catch (error) {
    console.error('Stripe return error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
