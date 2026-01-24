'use client';

// Jitsi Meet Configuration for KallCast
// Domain: jitsi.feendesk.com

export const JITSI_DOMAIN = process.env.NEXT_PUBLIC_JITSI_DOMAIN || 'meet.jit.si';

export interface JitsiRoomConfig {
  roomName: string;
  displayName: string;
  email?: string;
  avatarUrl?: string;
  subject?: string;
  sessionDuration?: number; // in minutes, default 60
}

export interface JitsiOptions {
  roomName: string;
  width: string | number;
  height: string | number;
  parentNode: Element | null;
  configOverwrite: {
    startWithAudioMuted: boolean;
    startWithVideoMuted: boolean;
    enableWelcomePage: boolean;
    prejoinPageEnabled: boolean;
    disableDeepLinking: boolean;
    defaultLanguage: string;
  };
  interfaceConfigOverwrite: {
    TOOLBAR_BUTTONS: string[];
    SHOW_JITSI_WATERMARK: boolean;
    SHOW_WATERMARK_FOR_GUESTS: boolean;
    SHOW_BRAND_WATERMARK: boolean;
    BRAND_WATERMARK_LINK: string;
    SHOW_POWERED_BY: boolean;
    DEFAULT_BACKGROUND: string;
    DISABLE_VIDEO_BACKGROUND: boolean;
    MOBILE_APP_PROMO: boolean;
  };
  userInfo: {
    displayName: string;
    email?: string;
    avatarURL?: string;
  };
}

// Generate unique room name for session
export function generateRoomName(sessionId: string): string {
  return `kallcast-${sessionId}`;
}

// Build Jitsi options for embedding
export function buildJitsiOptions(
  config: JitsiRoomConfig,
  parentNode: Element | null
): JitsiOptions {
  return {
    roomName: config.roomName,
    width: '100%',
    height: 700,
    parentNode,
    configOverwrite: {
      startWithAudioMuted: true,
      startWithVideoMuted: false,
      enableWelcomePage: false,
      prejoinPageEnabled: false,
      disableDeepLinking: true,
      defaultLanguage: 'en',
    },
    interfaceConfigOverwrite: {
      TOOLBAR_BUTTONS: [
        'microphone',
        'camera',
        'closedcaptions',
        'desktop',
        'fullscreen',
        'fodeviceselection',
        'hangup',
        'chat',
        'recording',
        'raisehand',
        'tileview',
        'settings',
        'videoquality',
      ],
      SHOW_JITSI_WATERMARK: false,
      SHOW_WATERMARK_FOR_GUESTS: false,
      SHOW_BRAND_WATERMARK: false,
      BRAND_WATERMARK_LINK: '',
      SHOW_POWERED_BY: false,
      DEFAULT_BACKGROUND: '#1e293b',
      DISABLE_VIDEO_BACKGROUND: false,
      MOBILE_APP_PROMO: false,
    },
    userInfo: {
      displayName: config.displayName,
      email: config.email,
      avatarURL: config.avatarUrl,
    },
  };
}

// Session timer configuration
export const SESSION_CONFIG = {
  defaultDuration: 60, // 1 hour in minutes
  warningTime: 5, // Warn 5 min before end
  finalWarning: 1, // Final warning 1 min before end
  gracePeriod: 2, // 2 min grace period after time's up
  allowExtension: true,
  extensionDuration: 30, // 30-minute extension
  maxExtensions: 1,
};

// Calculate session end time
export function calculateSessionEnd(startTime: Date, durationMinutes: number): Date {
  return new Date(startTime.getTime() + durationMinutes * 60 * 1000);
}

// Calculate remaining time in session
export function getRemainingTime(endTime: Date): number {
  const now = new Date();
  const remaining = endTime.getTime() - now.getTime();
  return Math.max(0, Math.floor(remaining / 1000)); // Return seconds
}

// Format time for display (MM:SS)
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Check if should show warning
export function shouldShowWarning(remainingSeconds: number): 'none' | 'warning' | 'final' {
  const remainingMinutes = remainingSeconds / 60;
  if (remainingMinutes <= SESSION_CONFIG.finalWarning) return 'final';
  if (remainingMinutes <= SESSION_CONFIG.warningTime) return 'warning';
  return 'none';
}
