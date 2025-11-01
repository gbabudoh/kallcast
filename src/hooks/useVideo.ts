'use client';

import { useState, useEffect, useCallback } from 'react';
import DailyIframe from '@daily-co/daily-js';
import { toast } from 'sonner';

interface UseVideoOptions {
  roomUrl?: string;
  token?: string;
  onJoined?: () => void;
  onLeft?: () => void;
  onError?: (error: any) => void;
}

interface UseVideoResult {
  call: any | null;
  isJoined: boolean;
  isJoining: boolean;
  participants: any[];
  error: string | null;
  joinRoom: (roomUrl: string, token?: string) => Promise<void>;
  leaveRoom: () => Promise<void>;
  toggleCamera: () => void;
  toggleMicrophone: () => void;
  isCameraOn: boolean;
  isMicrophoneOn: boolean;
}

export function useVideo(options: UseVideoOptions = {}): UseVideoResult {
  const { onJoined, onLeft, onError } = options;
  const [call, setCall] = useState<any | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);

  const joinRoom = useCallback(async (roomUrl: string, token?: string) => {
    try {
      setIsJoining(true);
      setError(null);

      const newCall = DailyIframe.createCallObject({
        showLeaveButton: false,
        showFullscreenButton: false,
        showLocalVideo: true,
        showParticipantsBar: true,
      });

      newCall.on('joined-meeting', () => {
        setIsJoined(true);
        setIsJoining(false);
        onJoined?.();
      });

      newCall.on('left-meeting', () => {
        setIsJoined(false);
        setIsJoining(false);
        onLeft?.();
      });

      newCall.on('participant-joined', (event) => {
        setParticipants(prev => [...prev, event.participant]);
      });

      newCall.on('participant-left', (event) => {
        setParticipants(prev => prev.filter(p => p.session_id !== event.participant.session_id));
      });

      newCall.on('error', (event) => {
        setError(event.error?.message || 'Video call error');
        onError?.(event.error);
        toast.error('Video call error occurred');
      });

      setCall(newCall);

      if (token) {
        await newCall.join({ url: roomUrl, token });
      } else {
        await newCall.join({ url: roomUrl });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to join room');
      setIsJoining(false);
      toast.error('Failed to join video room');
    }
  }, [onJoined, onLeft, onError]);

  const leaveRoom = useCallback(async () => {
    if (call) {
      try {
        await call.leave();
        call.destroy();
        setCall(null);
        setIsJoined(false);
        setParticipants([]);
      } catch (err: any) {
        console.error('Error leaving room:', err);
      }
    }
  }, [call]);

  const toggleCamera = useCallback(() => {
    if (call) {
      call.setLocalVideo(!isCameraOn);
      setIsCameraOn(!isCameraOn);
    }
  }, [call, isCameraOn]);

  const toggleMicrophone = useCallback(() => {
    if (call) {
      call.setLocalAudio(!isMicrophoneOn);
      setIsMicrophoneOn(!isMicrophoneOn);
    }
  }, [call, isMicrophoneOn]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (call) {
        call.destroy();
      }
    };
  }, [call]);

  return {
    call,
    isJoined,
    isJoining,
    participants,
    error,
    joinRoom,
    leaveRoom,
    toggleCamera,
    toggleMicrophone,
    isCameraOn,
    isMicrophoneOn,
  };
}
