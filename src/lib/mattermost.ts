// Mattermost Webhook Notification Service for KallCast
// Sends automated notifications to Mattermost channels

const MATTERMOST_WEBHOOK_URL = process.env.MATTERMOST_WEBHOOK_URL;

export interface NotificationPayload {
  text: string;
  username?: string;
  icon_emoji?: string;
  channel?: string;
  props?: {
    attachments?: Array<{
      fallback?: string;
      color?: string;
      pretext?: string;
      author_name?: string;
      title?: string;
      text?: string;
      fields?: Array<{
        short: boolean;
        title: string;
        value: string;
      }>;
    }>;
  };
}

class MattermostNotifier {
  private webhookUrl: string | undefined;

  constructor() {
    this.webhookUrl = MATTERMOST_WEBHOOK_URL;
  }

  private async send(payload: NotificationPayload): Promise<boolean> {
    if (!this.webhookUrl) {
      console.warn('Mattermost webhook URL not configured');
      return false;
    }

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          username: payload.username || 'KallCast Bot',
          icon_emoji: payload.icon_emoji || ':calendar:',
        }),
      });

      if (!response.ok) {
        console.error('Mattermost notification failed:', response.statusText);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error sending Mattermost notification:', error);
      return false;
    }
  }

  // Session booked notification
  async sessionBooked(data: {
    coachName: string;
    clientName: string;
    sessionTitle: string;
    sessionDate: string;
    sessionTime: string;
    duration: number;
    amount: number;
    sessionId: string;
  }): Promise<boolean> {
    const message = `
### 📅 New Session Booked

**Coach**: ${data.coachName}
**Client**: ${data.clientName}
**Session**: ${data.sessionTitle}
**Date**: ${data.sessionDate}
**Time**: ${data.sessionTime}
**Duration**: ${data.duration} minutes
**Amount**: $${data.amount}

[View Session](${process.env.NEXTAUTH_URL}/session/${data.sessionId})
    `.trim();

    return this.send({
      text: message,
      username: 'KallCast Bookings',
      icon_emoji: ':calendar:',
    });
  }

  // Session reminder (30 min before)
  async sessionReminder(data: {
    coachName: string;
    clientName: string;
    sessionTitle: string;
    sessionTime: string;
    jitsiRoom: string;
    isForCoach: boolean;
  }): Promise<boolean> {
    const recipient = data.isForCoach ? data.clientName : data.coachName;
    const role = data.isForCoach ? 'Client' : 'Coach';

    const message = `
### ⏰ Session Starting in 30 Minutes!

Your session with **${recipient}** (${role}) starts soon.

**Session**: ${data.sessionTitle}
**Time**: ${data.sessionTime}

[Join Video Call](https://jitsi.feendesk.com/${data.jitsiRoom})
    `.trim();

    return this.send({
      text: message,
      username: 'KallCast Reminders',
      icon_emoji: ':bell:',
    });
  }

  // Payment released notification
  async paymentReleased(data: {
    coachName: string;
    clientName: string;
    sessionTitle: string;
    amount: number;
    platformFee: number;
    netPayout: number;
    bookingId: string;
  }): Promise<boolean> {
    const message = `
### 💰 Payment Released

**Coach**: ${data.coachName}
**Client**: ${data.clientName}
**Session**: ${data.sessionTitle}
**Gross Amount**: $${data.amount}
**Platform Fee (20%)**: $${data.platformFee}
**Net Payout**: $${data.netPayout}

Payment has been transferred to the coach's account.

[View Transaction](${process.env.NEXTAUTH_URL}/payments/${data.bookingId})
    `.trim();

    return this.send({
      text: message,
      username: 'KallCast Payments',
      icon_emoji: ':money_with_wings:',
    });
  }

  // Session completed notification
  async sessionCompleted(data: {
    coachName: string;
    clientName: string;
    sessionTitle: string;
    duration: number;
    rating?: number;
  }): Promise<boolean> {
    const ratingText = data.rating ? `${'⭐'.repeat(data.rating)}` : 'Not rated';

    const message = `
### ✅ Session Completed

**Coach**: ${data.coachName}
**Client**: ${data.clientName}
**Session**: ${data.sessionTitle}
**Duration**: ${data.duration} minutes
**Rating**: ${ratingText}

Both parties confirmed. Payment has been released.
    `.trim();

    return this.send({
      text: message,
      username: 'KallCast Sessions',
      icon_emoji: ':white_check_mark:',
    });
  }

  // Dispute notification
  async disputeRaised(data: {
    sessionId: string;
    coachName: string;
    clientName: string;
    raisedBy: 'coach' | 'client';
    reason?: string;
  }): Promise<boolean> {
    const message = `
### ⚠️ DISPUTE RAISED

**Session ID**: ${data.sessionId}
**Coach**: ${data.coachName}
**Client**: ${data.clientName}
**Raised By**: ${data.raisedBy === 'coach' ? 'Coach' : 'Client'}
${data.reason ? `**Reason**: ${data.reason}` : ''}

Admin review required. Payment is on hold.

[Review Dispute](${process.env.NEXTAUTH_URL}/admin/disputes/${data.sessionId})
    `.trim();

    return this.send({
      text: message,
      username: 'KallCast Admin',
      icon_emoji: ':warning:',
    });
  }

  // Coach no-show notification
  async noShow(data: {
    sessionId: string;
    coachName: string;
    clientName: string;
    noShowParty: 'coach' | 'client';
  }): Promise<boolean> {
    const message = `
### 🚫 No-Show Reported

**Session ID**: ${data.sessionId}
**${data.noShowParty === 'coach' ? 'Coach' : 'Client'} did not join**: ${
      data.noShowParty === 'coach' ? data.coachName : data.clientName
    }

${data.noShowParty === 'coach' 
  ? 'Client will be refunded automatically.' 
  : 'Coach will receive partial compensation.'}
    `.trim();

    return this.send({
      text: message,
      username: 'KallCast Admin',
      icon_emoji: ':no_entry_sign:',
    });
  }

  // Generic custom message
  async custom(message: string, options?: {
    username?: string;
    emoji?: string;
  }): Promise<boolean> {
    return this.send({
      text: message,
      username: options?.username,
      icon_emoji: options?.emoji,
    });
  }
}

// Export singleton instance
export const mattermostNotifier = new MattermostNotifier();
