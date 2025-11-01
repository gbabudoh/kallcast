'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Users,
  Clock,
  Settings,
  Maximize,
  MessageCircle,
  Share2,
  Monitor
} from 'lucide-react';
import { toast } from 'sonner';

interface DailyVideoRoomProps {
  bookingId: string;
  userRole: 'learner' | 'coach';
}

export default function DailyVideoRoom({ bookingId, userRole }: DailyVideoRoomProps) {
  const [sessionTime, setSessionTime] = useState(0);
  const [participants, setParticipants] = useState<any[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  const callRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const initializeVideoRoom = async () => {
      try {
        setIsJoining(true);
        setError(null);
        
        // Get video token
        const tokenResponse = await fetch('/api/video/get-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bookingId }),
        });

        if (!tokenResponse.ok) {
          throw new Error('Failed to get video token');
        }

        const { token, roomUrl } = await tokenResponse.json();
        
        // Initialize Daily.co call object
        const call = (window as any).DailyIframe.createCallObject({
          showLeaveButton: false,
          showFullscreenButton: false,
          showLocalVideo: true,
          showParticipantsBar: true,
          theme: {
            accent: '#3b82f6',
            accentText: '#ffffff',
            background: '#1f2937',
            backgroundAccent: '#374151',
            baseText: '#ffffff',
            border: '#4b5563',
            mainAreaBg: '#111827',
            supportiveText: '#9ca3af',
          },
        });

        // Set up event listeners
        call.on('joined-meeting', () => {
          setIsJoined(true);
          setIsJoining(false);
          startSessionTimer();
          toast.success('Joined video session successfully!');
        });

        call.on('left-meeting', () => {
          setIsJoined(false);
          setIsJoining(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          toast.success('Left session successfully');
          window.location.href = '/dashboard';
        });

        call.on('participant-joined', (event: any) => {
          setParticipants(prev => [...prev, event.participant]);
          toast.info(`${event.participant.user_name || 'Someone'} joined the session`);
        });

        call.on('participant-left', (event: any) => {
          setParticipants(prev => prev.filter(p => p.session_id !== event.participant.session_id));
          toast.info(`${event.participant.user_name || 'Someone'} left the session`);
        });

        call.on('participant-updated', (event: any) => {
          setParticipants(prev => 
            prev.map(p => 
              p.session_id === event.participant.session_id 
                ? { ...p, ...event.participant }
                : p
            )
          );
        });

        call.on('error', (event: any) => {
          setError(event.error?.message || 'Video call error');
          toast.error('Video call error occurred');
        });

        call.on('camera-error', (event: any) => {
          toast.error('Camera error: ' + (event.error?.message || 'Unknown error'));
        });

        call.on('microphone-error', (event: any) => {
          toast.error('Microphone error: ' + (event.error?.message || 'Unknown error'));
        });

        callRef.current = call;

        // Join the room
        await call.join({ url: roomUrl, token });

      } catch (err: any) {
        setError(err.message || 'Failed to join video room');
        setIsJoining(false);
        toast.error('Failed to join video room');
      }
    };

    initializeVideoRoom();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (callRef.current) {
        callRef.current.destroy();
      }
    };
  }, [bookingId]);

  const startSessionTimer = () => {
    intervalRef.current = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
  };

  const toggleCamera = () => {
    if (callRef.current) {
      callRef.current.setLocalVideo(!isCameraOn);
      setIsCameraOn(!isCameraOn);
      toast.success(`Camera ${!isCameraOn ? 'enabled' : 'disabled'}`);
    }
  };

  const toggleMicrophone = () => {
    if (callRef.current) {
      callRef.current.setLocalAudio(!isMicrophoneOn);
      setIsMicrophoneOn(!isMicrophoneOn);
      toast.success(`Microphone ${!isMicrophoneOn ? 'enabled' : 'disabled'}`);
    }
  };

  const toggleScreenShare = async () => {
    if (callRef.current) {
      try {
        if (isScreenSharing) {
          await callRef.current.stopScreenShare();
          setIsScreenSharing(false);
          toast.success('Stopped screen sharing');
        } else {
          await callRef.current.startScreenShare();
          setIsScreenSharing(true);
          toast.success('Started screen sharing');
        }
      } catch (error) {
        toast.error('Failed to toggle screen sharing');
      }
    }
  };

  const leaveSession = async () => {
    if (callRef.current) {
      try {
        await callRef.current.leave();
      } catch (error) {
        console.error('Error leaving session:', error);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isJoining) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <div>
                <h3 className="text-lg font-medium">Joining session...</h3>
                <p className="text-gray-600">Please wait while we connect you to the video room.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <PhoneOff className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-red-900">Connection Failed</h3>
                <p className="text-red-600">{error}</p>
              </div>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Live Session</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{formatTime(sessionTime)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="text-sm">{participants.length + 1} participants</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Daily.co Video Container */}
      <div className="flex-1 p-4">
        <div 
          id="daily-video-container"
          className="w-full h-full min-h-[600px] bg-gray-800 rounded-lg overflow-hidden"
          style={{ 
            background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
          }}
        >
          {/* Daily.co will inject the video elements here */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Video Room Loading...</p>
              <p className="text-sm mt-2">Daily.co video streams will appear here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant={isMicrophoneOn ? "default" : "destructive"}
            size="lg"
            onClick={toggleMicrophone}
            className="rounded-full w-12 h-12"
          >
            {isMicrophoneOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>
          
          <Button
            variant={isCameraOn ? "default" : "destructive"}
            size="lg"
            onClick={toggleCamera}
            className="rounded-full w-12 h-12"
          >
            {isCameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>
          
          <Button
            variant={isScreenSharing ? "default" : "outline"}
            size="lg"
            onClick={toggleScreenShare}
            className="rounded-full w-12 h-12"
          >
            <Monitor className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            className="rounded-full w-12 h-12"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            className="rounded-full w-12 h-12"
          >
            <Share2 className="h-5 w-5" />
          </Button>
          
          <Button
            variant="destructive"
            size="lg"
            onClick={leaveSession}
            className="rounded-full w-12 h-12"
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
