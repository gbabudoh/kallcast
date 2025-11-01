import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailTemplate) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'KallKast <noreply@kallkast.com>',
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Email send error:', error);
      throw new Error('Failed to send email');
    }

    return data;
  } catch (error) {
    console.error('Email service error:', error);
    throw error;
  }
}

export function generateBookingConfirmationEmail(
  learnerName: string,
  coachName: string,
  sessionTitle: string,
  scheduledFor: Date,
  videoRoomUrl: string
) {
  const formattedDate = scheduledFor.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  return {
    subject: `Booking Confirmed - ${sessionTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Booking Confirmed!</h2>
        <p>Hi ${learnerName},</p>
        <p>Your coaching session has been successfully booked!</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Session Details</h3>
          <p><strong>Coach:</strong> ${coachName}</p>
          <p><strong>Session:</strong> ${sessionTitle}</p>
          <p><strong>Date & Time:</strong> ${formattedDate}</p>
        </div>
        
        <p>You can join your session using this link:</p>
        <a href="${videoRoomUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Join Session
        </a>
        
        <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
          We'll send you a reminder 24 hours and 15 minutes before your session.
        </p>
      </div>
    `,
  };
}

export function generateSessionReminderEmail(
  learnerName: string,
  coachName: string,
  sessionTitle: string,
  scheduledFor: Date,
  videoRoomUrl: string
) {
  const formattedDate = scheduledFor.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  return {
    subject: `Session Reminder - ${sessionTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Session Reminder</h2>
        <p>Hi ${learnerName},</p>
        <p>This is a reminder that your coaching session is coming up!</p>
        
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="margin-top: 0;">Session Details</h3>
          <p><strong>Coach:</strong> ${coachName}</p>
          <p><strong>Session:</strong> ${sessionTitle}</p>
          <p><strong>Date & Time:</strong> ${formattedDate}</p>
        </div>
        
        <p>Click the link below to join your session:</p>
        <a href="${videoRoomUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Join Session
        </a>
        
        <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
          Please join a few minutes early to test your audio and video.
        </p>
      </div>
    `,
  };
}

export function generatePaymentReceivedEmail(
  coachName: string,
  learnerName: string,
  sessionTitle: string,
  amount: number
) {
  return {
    subject: `Payment Received - ${sessionTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Payment Received!</h2>
        <p>Hi ${coachName},</p>
        <p>Great news! You've received a payment for your coaching session.</p>
        
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
          <h3 style="margin-top: 0;">Payment Details</h3>
          <p><strong>Student:</strong> ${learnerName}</p>
          <p><strong>Session:</strong> ${sessionTitle}</p>
          <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
        </div>
        
        <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
          The payment will be transferred to your account within 2-3 business days.
        </p>
      </div>
    `,
  };
}

export function generateReviewRequestEmail(
  learnerName: string,
  coachName: string,
  sessionTitle: string,
  reviewUrl: string
) {
  return {
    subject: `How was your session with ${coachName}?`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">How was your session?</h2>
        <p>Hi ${learnerName},</p>
        <p>We hope you enjoyed your coaching session with ${coachName}!</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Session Details</h3>
          <p><strong>Coach:</strong> ${coachName}</p>
          <p><strong>Session:</strong> ${sessionTitle}</p>
        </div>
        
        <p>Your feedback helps other learners find great coaches and helps coaches improve their services.</p>
        <a href="${reviewUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Leave a Review
        </a>
        
        <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
          Thank you for using KallKast!
        </p>
      </div>
    `,
  };
}
