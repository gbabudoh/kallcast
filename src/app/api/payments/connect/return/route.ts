import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import { getAccount } from '@/lib/stripe';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'coach') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user || !user.stripeAccountId) {
      return NextResponse.json({ message: 'User or Stripe account not found' }, { status: 404 });
    }

    // Get account details from Stripe
    const account = await getAccount(user.stripeAccountId);

    // Update user onboarding status using Prisma
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        stripeOnboardingComplete: account.details_submitted && account.charges_enabled
      }
    });

    return NextResponse.json({ 
      account,
      onboardingComplete: updatedUser.stripeOnboardingComplete 
    });
  } catch (error) {
    console.error('Stripe return error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
