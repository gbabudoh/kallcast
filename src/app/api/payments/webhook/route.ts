import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { createRoom } from '@/lib/daily';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import Slot from '@/models/Slot';
import Payment from '@/models/Payment';
import User from '@/models/User';
import { sendEmail, generateBookingConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ message: 'No signature' }, { status: 400 });
    }

    let event;

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

    await connectDB();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const metadata = session.metadata || {};
        const { bookingId, slotId, coachId, learnerId } = metadata;

        if (!bookingId) {
          console.error('No bookingId in session metadata');
          break;
        }

        // Find existing pending booking
        const booking = await Booking.findById(bookingId);
        if (!booking) {
          console.error(`Booking not found: ${bookingId}`);
          break;
        }

        // Finalize booking with Stripe details and precise fees
        booking.paymentIntentId = session.payment_intent as string;
        booking.paymentStatus = 'authorized'; // Escrowed
        booking.escrowStatus = 'authorized';
        
        // Re-calculate fees for precision based on actual amount_total
        const amountTotal = (session.amount_total || 0) / 100;
        const platformFee = parseFloat(metadata.platformFee || '0');
        const stripeFee = parseFloat(metadata.stripeFee || '0');
        const coachPayout = parseFloat(metadata.coachPayout || '0');

        booking.amount = amountTotal;
        booking.platformFee = platformFee;
        booking.stripeFee = stripeFee;
        booking.coachPayout = coachPayout;

        // Create video room
        const slot = await Slot.findById(slotId);
        if (slot) {
          // Note: createRoom in lib/daily handled name conflict previously
          const room = await createRoom({
            name: `session-${booking._id}`,
            maxParticipants: slot.maxParticipants,
            startTime: slot.startTime,
            endTime: slot.endTime,
            enableRecording: true,
          });

          booking.videoRoomUrl = room.url;
          booking.videoRoomId = room.id;
          booking.scheduledFor = slot.startTime;
        }

        await booking.save();

        // Update slot participants
        if (slot) {
          slot.currentParticipants += 1;
          if (slot.currentParticipants >= slot.maxParticipants) {
            slot.status = 'booked';
          }
          await slot.save();
        }

        // Create/Update payment record
        await Payment.findOneAndUpdate(
          { bookingId: booking._id },
          {
            coachId,
            learnerId,
            amount: booking.amount,
            platformFee: booking.platformFee,
            stripeFee: booking.stripeFee,
            coachPayout: booking.coachPayout,
            stripePaymentIntentId: session.payment_intent as string,
            status: 'held',
            paidAt: new Date(),
          },
          { upsert: true, new: true }
        );

        // Send confirmation emails
        const learner = await User.findById(learnerId);
        const coach = await User.findById(coachId);
        
        if (learner && coach && slot) {
          const emailData = generateBookingConfirmationEmail(
            learner.firstName,
            coach.firstName,
            slot.title,
            slot.startTime,
            booking.videoRoomUrl
          );

          await sendEmail({
            to: learner.email,
            subject: emailData.subject,
            html: emailData.html,
          });
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
