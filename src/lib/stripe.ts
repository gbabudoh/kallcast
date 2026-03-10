import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // Let SDK use default version to avoid type mismatches
});

export const PLATFORM_FEE_PERCENTAGE = 0.20; // 20%

/**
 * Calculate fees based on user-provided requirements:
 * Platform keeps 20%
 * Stripe Fee = Math.ceil((amount + 30) / (1 - 0.029) - amount)
 */
export function calculateFees(amountInDollars: number) {
  const amountInCents = amountInDollars * 100;
  
  // Specific formula provided by USER
  // Math.ceil((10000 + 30) / (1 - 0.029) - 10000)
  const stripeFeeInCents = Math.ceil((amountInCents + 30) / (1 - 0.029) - amountInCents);
  const platformFeeInCents = Math.round(amountInCents * PLATFORM_FEE_PERCENTAGE);
  const coachPayoutInCents = amountInCents - platformFeeInCents - stripeFeeInCents;

  return {
    totalInCents: amountInCents,
    stripeFeeInCents,
    platformFeeInCents,
    coachPayoutInCents,
    // Dollar versions for display/storage
    totalDollars: amountInDollars,
    stripeFeeDollars: stripeFeeInCents / 100,
    platformFeeDollars: platformFeeInCents / 100,
    coachPayoutDollars: coachPayoutInCents / 100,
  };
}

export interface CreateCheckoutSessionParams {
  slotId: string;
  bookingId: string; // Add bookingId for metadata tracking
  coachId: string;
  learnerId: string;
  amount: number;
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckoutSession({
  slotId,
  bookingId,
  coachId,
  learnerId,
  amount,
  successUrl,
  cancelUrl,
}: CreateCheckoutSessionParams) {
  const fees = calculateFees(amount);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Coaching Session',
            description: `Professional coaching session - Kallcast`,
          },
          unit_amount: fees.totalInCents,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      slotId,
      bookingId, // Important for webhook identification
      coachId,
      learnerId,
      platformFee: fees.platformFeeDollars.toString(),
      stripeFee: fees.stripeFeeDollars.toString(),
      coachPayout: fees.coachPayoutDollars.toString(),
    },
    payment_intent_data: {
      transfer_group: bookingId,
    },
    // We are using 'Separate Charges and Transfers'
    // The funds will stay in our platform account until we trigger createTransfer manually.
  });

  return session;
}

export async function createStripeConnectAccount(email: string) {
  const account = await stripe.accounts.create({
    type: 'express', // Use express as requested
    country: 'US',
    email,
    capabilities: {
      transfers: { requested: true },
    },
  });

  return account;
}

export async function createAccountLink(accountId: string, returnUrl: string, refreshUrl: string) {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    return_url: returnUrl,
    refresh_url: refreshUrl,
    type: 'account_onboarding',
  });

  return accountLink;
}

export async function getAccount(accountId: string) {
  const account = await stripe.accounts.retrieve(accountId);
  return account;
}

export async function createTransfer(amountDollars: number, destinationAccountId: string, transferGroup: string) {
  const transfer = await stripe.transfers.create({
    amount: Math.round(amountDollars * 100), // Payout in cents
    currency: 'usd',
    destination: destinationAccountId,
    transfer_group: transferGroup, // Usually the bookingId or paymentIntentId
  });

  return transfer;
}

export async function createRefund(paymentIntentId: string, amountDollars?: number) {
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amountDollars ? Math.round(amountDollars * 100) : undefined,
  });

  return refund;
}
