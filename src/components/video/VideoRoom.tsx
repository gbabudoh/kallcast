'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle } from 'lucide-react';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from '@livekit/components-react';
import '@livekit/components-styles';

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
  bookingId,
  displayName,
  sessionTitle,
  durationMinutes = 60,
  startTime,
  onSessionEnd,
}: VideoRoomProps) {
  const [token, setToken] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(durationMinutes * 60);
  const [warningLevel, setWarningLevel] = useState<'none' | 'warning' | 'final'>('none');
  const [isEnding, setIsEnding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatTimeRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const sessionEndTime = useMemo(() => 
    new Date(startTime.getTime() + durationMinutes * 60000),
    [startTime, durationMinutes]
  );

  // Fetch LiveKit token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        // Ensure room is created/ready
        await fetch('/api/video/create-room', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingId }),
        });

        // Get token
        const resp = await fetch('/api/video/get-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingId }),
        });
        
        const data = await resp.json();
        if (data.token) {
          setToken(data.token);
          setServerUrl(data.serverUrl);
        } else {
          setError(data.message || 'Failed to get video token');
        }
      } catch (e) {
        console.error('Error fetching token:', e);
        setError('Connection error. Please check your internet.');
      }
    };

    fetchToken();
  }, [bookingId]);

  // Session timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = sessionEndTime.getTime();
      const remaining = Math.max(0, Math.floor((end - now) / 1000));
      
      setRemainingTime(remaining);
      
      if (remaining <= 60) setWarningLevel('final');
      else if (remaining <= 300) setWarningLevel('warning');
      else setWarningLevel('none');

      if (remaining <= 0) {
        clearInterval(timer);
        onSessionEnd?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionEndTime, onSessionEnd]);

  const handleEndSession = useCallback(() => {
    if (isEnding) return;
    setIsEnding(true);
    onSessionEnd?.();
  }, [isEnding, onSessionEnd]);


  return (
    <div className="relative w-full h-full min-h-[600px] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
      {/* Session Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-slate-900/90 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2" />
              Live
            </Badge>
            <div className="flex flex-col">
              {sessionTitle && (
                <span className="text-white font-bold text-sm truncate max-w-xs">
                  {sessionTitle}
                </span>
              )}
              <span className="text-white/60 text-xs">
                With {displayName}
              </span>
            </div>
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
            <span className="font-mono font-bold">{formatTimeRemaining(remainingTime)}</span>
          </div>
        </div>
      </div>

      {/* Main Video Content */}
      <div className="w-full h-full">
        {error ? (
          <div className="flex flex-col items-center justify-center h-full text-white p-8">
            <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Connection Failed</h3>
            <p className="text-slate-400 mb-6 text-center">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
              Retry Connection
            </Button>
          </div>
        ) : !token || !serverUrl ? (
          <div className="flex flex-col items-center justify-center h-full text-white">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-400 font-medium">Initializing secure session...</p>
          </div>
        ) : (
          <LiveKitRoom
            video={true}
            audio={true}
            token={token}
            serverUrl={serverUrl}
            data-lk-theme="default"
            onDisconnected={handleEndSession}
            style={{ height: '100%' }}
          >
            <VideoConference />
            <RoomAudioRenderer />
          </LiveKitRoom>
        )}
      </div>

      {/* Warning Overlay */}
      {warningLevel === 'final' && !error && token && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20">
          <Card className="bg-red-500/90 border-red-400 text-white px-6 py-3 animate-bounce">
            <p className="font-bold text-sm">⏰ Session ending in {formatTimeRemaining(remainingTime)}!</p>
          </Card>
        </div>
      )}
    </div>
  );
}
