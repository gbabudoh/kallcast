import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/db';
import { sendEmail, generateBookingConfirmationEmail } from '@/lib/email';
import { PaymentStatus, EscrowStatus, SlotStatus, PaymentRecordStatus } from '@/generated/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ message: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata || {};
        const bookingId = metadata.bookingId;
        const slotId = metadata.slotId;
        const coachId = metadata.coachId;
        const learnerId = metadata.learnerId;

        if (!bookingId) {
          console.error('No bookingId in session metadata');
          break;
        }

        // Finalized fees from metadata
        const platformFeeDollars = parseFloat(metadata.platformFee || '0');
        const stripeFeeDollars = parseFloat(metadata.stripeFee || '0');
        const coachPayoutDollars = parseFloat(metadata.coachPayout || '0');
        const amountTotalDollars = (session.amount_total || 0) / 100;

        // Update booking and related data in a transaction
        await prisma.$transaction(async (tx) => {
          await tx.booking.update({
            where: { id: bookingId },
            data: {
              paymentIntentId: session.payment_intent as string,
              paymentStatus: PaymentStatus.authorized,
              escrowStatus: EscrowStatus.authorized,
              amount: amountTotalDollars,
              platformFee: platformFeeDollars,
              stripeFee: stripeFeeDollars,
              coachPayout: coachPayoutDollars,
            }
          });

          // Create or update payment record
          await tx.payment.upsert({
            where: { id: `payment-${bookingId}` },
            create: {
              id: `payment-${bookingId}`,
              bookingId: bookingId,
              coachId: coachId || '',
              learnerId: learnerId || '',
              amount: amountTotalDollars,
              platformFee: platformFeeDollars,
              stripeFee: stripeFeeDollars,
              coachPayout: coachPayoutDollars,
              stripePaymentIntentId: session.payment_intent as string,
              status: PaymentRecordStatus.held,
              paidAt: new Date(),
            },
            update: {
              amount: amountTotalDollars,
              platformFee: platformFeeDollars,
              stripeFee: stripeFeeDollars,
              coachPayout: coachPayoutDollars,
              stripePaymentIntentId: session.payment_intent as string,
              status: PaymentRecordStatus.held,
              paidAt: new Date(),
            }
          });
          
          // Also update slot participants if not already done
          if (slotId) {
            const slot = await tx.slot.findUnique({ where: { id: slotId } });
            if (slot) {
              const newParticipants = slot.currentParticipants + 1;
              await tx.slot.update({
                where: { id: slotId },
                data: {
                  currentParticipants: newParticipants,
                  status: newParticipants >= slot.maxParticipants ? SlotStatus.booked : SlotStatus.available
                }
              });
            }
          }
        });

        // Send confirmation emails
        if (learnerId && coachId) {
          const learner = await prisma.user.findUnique({ where: { id: learnerId } });
          const coach = await prisma.user.findUnique({ where: { id: coachId } });
          const slot = slotId ? await prisma.slot.findUnique({ where: { id: slotId } }) : null;
          
          if (learner && coach) {
            try {
              const emailData = generateBookingConfirmationEmail(
                learner.firstName,
                coach.firstName,
                slot?.title || 'Coaching Session',
                slot?.startTime || new Date(),
                '' // LiveKit room URL is usually determined when session starts or stored in DB
              );

              await sendEmail({
                to: learner.email,
                subject: emailData.subject,
                html: emailData.html,
              });
            } catch (emailError) {
              console.error('Failed to send confirmation email:', emailError);
            }
          }
        }

      break;
    }

      case 'payment_intent.succeeded': {
        // Update booking payment status if needed
        break;
      }

      case 'payment_intent.payment_failed': {
        // Handle failed payment
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { message: 'Webhook error' },
      { status: 500 }
    );
  }
}
