import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

export const PLATFORM_FEE_PERCENTAGE = 0.20; // 20%

export interface CreateCheckoutSessionParams {
  slotId: string;
  coachId: string;
  learnerId: string;
  amount: number;
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckoutSession({
  slotId,
  coachId,
  learnerId,
  amount,
  successUrl,
  cancelUrl,
}: CreateCheckoutSessionParams) {
  const platformFee = Math.round(amount * PLATFORM_FEE_PERCENTAGE);
  const coachPayout = amount - platformFee;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Coaching Session',
            description: `Coaching session booking`,
          },
          unit_amount: amount * 100, // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      slotId,
      coachId,
      learnerId,
      platformFee: platformFee.toString(),
      coachPayout: coachPayout.toString(),
    },
    payment_intent_data: {
      application_fee_amount: Math.round(platformFee * 100), // Convert to cents
      transfer_data: {
        destination: coachId, // Coach's Stripe Connect account
      },
    },
  });

  return session;
}

export async function createStripeConnectAccount(email: string) {
  const account = await stripe.accounts.create({
    type: 'express',
    country: 'US',
    email,
    capabilities: {
      card_payments: { requested: true },
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

export async function createTransfer(amount: number, destination: string, transferGroup: string) {
  const transfer = await stripe.transfers.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'usd',
    destination,
    transfer_group: transferGroup,
  });

  return transfer;
}

export async function createRefund(paymentIntentId: string, amount?: number) {
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amount ? Math.round(amount * 100) : undefined, // Convert to cents
  });

  return refund;
}
