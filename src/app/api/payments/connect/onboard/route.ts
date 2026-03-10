import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import { createStripeConnectAccount, createAccountLink } from '@/lib/stripe';
import { APP_CONFIG } from '@/config/app';

export async function POST() {
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

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check if user already has a Stripe account
    if (user.stripeAccountId) {
      return NextResponse.json({ message: 'Stripe account already exists' }, { status: 400 });
    }

    // Create Stripe Connect account
    const account = await createStripeConnectAccount(user.email);

    // Update user with Stripe account ID using Prisma
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        stripeAccountId: account.id
      }
    });

    // Create account link for onboarding
    const accountLink = await createAccountLink(
      account.id,
      `${APP_CONFIG.URL}/dashboard/earnings?onboarded=true`,
      `${APP_CONFIG.URL}/dashboard/earnings?onboarded=false`
    );

    return NextResponse.json({ 
      accountId: account.id,
      onboardingUrl: accountLink.url 
    });
  } catch (error) {
    console.error('Stripe onboarding error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
