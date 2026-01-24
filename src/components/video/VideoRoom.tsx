'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, PhoneOff, Maximize2, AlertTriangle } from 'lucide-react';
import {
  JITSI_DOMAIN,
  buildJitsiOptions,
  SESSION_CONFIG,
  calculateSessionEnd,
  getRemainingTime,
  formatTime,
  shouldShowWarning,
  type JitsiRoomConfig,
} from '@/lib/jitsi';

declare global {
  interface Window {
    JitsiMeetExternalAPI: new (domain: string, options: object) => JitsiAPI;
  }
}

interface JitsiAPI {
  executeCommand: (command: string, ...args: unknown[]) => void;
  addEventListener: (event: string, listener: (...args: unknown[]) => void) => void;
  removeEventListener: (event: string, listener: (...args: unknown[]) => void) => void;
  dispose: () => void;
}

interface VideoRoomProps {
  sessionId: string;
  bookingId: string;
  displayName: string;
  email?: string;
  avatarUrl?: string;
  sessionTitle?: string;
  durationMinutes?: number;
  startTime: Date;
  onSessionEnd?: () => void;
  onParticipantJoined?: (participant: { displayName: string }) => void;
  onParticipantLeft?: (participant: { displayName: string }) => void;
}

export default function VideoRoom({
  // bookingId available for future use
  sessionId,
  displayName,
  email,
  avatarUrl,
  sessionTitle,
  durationMinutes = SESSION_CONFIG.defaultDuration,
  startTime,
  onSessionEnd,
  onParticipantJoined,
  onParticipantLeft,
}: VideoRoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<JitsiAPI | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(durationMinutes * 60);
  const [warningLevel, setWarningLevel] = useState<'none' | 'warning' | 'final'>('none');
  const [isEnding, setIsEnding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sessionEndTime = calculateSessionEnd(startTime, durationMinutes);

  // End session handler
  const handleEndSession = useCallback(async () => {
    if (isEnding) return;
    setIsEnding(true);

    if (apiRef.current) {
      apiRef.current.executeCommand('hangup');
    }

    // Navigate to confirmation page
    if (onSessionEnd) {
      onSessionEnd();
    }
  }, [isEnding, onSessionEnd]);

  // Initialize Jitsi
  useEffect(() => {
    const loadJitsi = async () => {
      console.log('🎥 Jitsi: Starting load process...');
      // Load Jitsi External API script
      if (!window.JitsiMeetExternalAPI) {
        console.log('🎥 Jitsi: Script not found, creating script element...');
        const script = document.createElement('script');
        script.src = `https://${JITSI_DOMAIN}/external_api.js`;
        script.async = true;
        script.onload = () => {
          console.log('🎥 Jitsi: Script loaded successfully.');
          initializeJitsi();
        };
        script.onerror = (e) => {
          console.error('🎥 Jitsi: Script failed to load!', e);
          setError('Failed to load video script. Your network or browser may be blocking the Jitsi server.');
        };
        document.body.appendChild(script);
      } else {
        console.log('🎥 Jitsi: Script already exists, initializing...');
        initializeJitsi();
      }
    };

    const initializeJitsi = () => {
      if (!containerRef.current || apiRef.current) {
        console.log('🎥 Jitsi: Container not ready or API already initialized.');
        return;
      }

      console.log(`🎥 Jitsi: Initializing room kallcast-${sessionId} on ${JITSI_DOMAIN}`);

      const roomConfig: JitsiRoomConfig = {
        roomName: `kallcast-${sessionId}`,
        displayName,
        email,
        avatarUrl,
        subject: sessionTitle || 'KallCast Coaching Session',
        sessionDuration: durationMinutes,
      };

      const options = buildJitsiOptions(roomConfig, containerRef.current);

      try {
        const api = new window.JitsiMeetExternalAPI(JITSI_DOMAIN, options);
        apiRef.current = api;
        console.log('🎥 Jitsi: API Instance created.');

        // Set session subject
        api.executeCommand('subject', sessionTitle || 'KallCast Coaching Session');

        // Event listeners
        api.addEventListener('videoConferenceJoined', () => {
          console.log('🎥 Jitsi: Participant joined room successfully.');
        });

        api.addEventListener('participantJoined', (participant: unknown) => {
          console.log('🎥 Jitsi: Another participant joined:', participant);
          if (onParticipantJoined && participant && typeof participant === 'object') {
            onParticipantJoined(participant as { displayName: string });
          }
        });

        api.addEventListener('participantLeft', (participant: unknown) => {
          console.log('🎥 Jitsi: Participant left:', participant);
          if (onParticipantLeft && participant && typeof participant === 'object') {
            onParticipantLeft(participant as { displayName: string });
          }
        });

        api.addEventListener('videoConferenceLeft', () => {
          console.log('🎥 Jitsi: Video conference left.');
          handleEndSession();
        });
      } catch (error) {
        console.error('🎥 Jitsi: Critical initialization error:', error);
        setError('Failed to connect to the video room. Please try again.');
      }
    };

    if (!error) { 
      loadJitsi();
    }

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
  }, [sessionId, displayName, email, avatarUrl, sessionTitle, durationMinutes, onParticipantJoined, onParticipantLeft, handleEndSession, error]);

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getRemainingTime(sessionEndTime);
      setRemainingTime(remaining);
      setWarningLevel(shouldShowWarning(remaining));

      // Auto-end session when time is up
      if (remaining <= 0) {
        clearInterval(timer);
        handleEndSession();
      }

      // Show in-room notification at warning times
      if (apiRef.current) {
        if (remaining === SESSION_CONFIG.warningTime * 60) {
          apiRef.current.executeCommand('displayNotification', {
            title: '⏰ 5 Minutes Remaining',
            description: 'Your coaching session will end soon.',
          });
        }
        if (remaining === SESSION_CONFIG.finalWarning * 60) {
          apiRef.current.executeCommand('displayNotification', {
            title: '⏰ 1 Minute Remaining',
            description: 'Session ending in 1 minute.',
          });
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionEndTime, handleEndSession]);

  // Retry handler
  const handleRetry = () => {
    setError(null);
    // Reload the page to retry cleanly
    window.location.reload(); 
  };

  return (
    <div className="relative w-full h-full min-h-[600px] bg-slate-900 rounded-2xl overflow-hidden">
      {/* Session Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-slate-900/90 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2" />
              Live
            </Badge>
            {sessionTitle && (
              <span className="text-white/80 font-medium text-sm truncate max-w-xs">
                {sessionTitle}
              </span>
            )}
          </div>

          {/* Timer */}
          <div
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
              warningLevel === 'final'
                ? 'bg-red-500/20 text-red-400 animate-pulse'
                : warningLevel === 'warning'
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-slate-800/80 text-white'
            }`}
          >
            {warningLevel !== 'none' && <AlertTriangle className="w-4 h-4" />}
            <Clock className="w-4 h-4" />
            <span className="font-mono font-bold">{formatTime(remainingTime)}</span>
          </div>
        </div>
      </div>

      {/* Jitsi Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-20">
          <div className="text-center max-w-md px-6">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <PhoneOff className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Connection Failed</h3>
            <p className="text-white/60 mb-2">{error}</p>
            <div className="text-xs text-amber-400 bg-amber-500/10 px-3 py-2 rounded border border-amber-500/20 mb-6">
              Trying to reach: <span className="font-mono">{JITSI_DOMAIN}</span>
              <br/>
              Ensure this domain allows embedding (CORS/Frameguard).
            </div>
            <div className="flex justify-center space-x-4">
              <Button 
                variant="outline" 
                onClick={handleEndSession}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleRetry}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Retry Connection
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-slate-900/90 to-transparent">
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            className="bg-slate-800/80 border-slate-700 text-white hover:bg-slate-700"
            onClick={() => apiRef.current?.executeCommand('toggleTileView')}
          >
            <Maximize2 className="w-4 h-4 mr-2" />
            Tile View
          </Button>

          <Button
            variant="destructive"
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 rounded-full"
            onClick={handleEndSession}
            disabled={isEnding}
          >
            <PhoneOff className="w-5 h-5 mr-2" />
            {isEnding ? 'Ending...' : 'End Session'}
          </Button>
        </div>
      </div>

      {/* Warning Overlay */}
      {warningLevel === 'final' && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20">
          <Card className="bg-red-500/90 border-red-400 text-white px-6 py-3 animate-bounce">
            <p className="font-bold text-sm">⏰ Session ending in {formatTime(remainingTime)}!</p>
          </Card>
        </div>
      )}
    </div>
  );
}
