'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useVideo } from '@/hooks';
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
  Share2
} from 'lucide-react';
import { toast } from 'sonner';
import { APP_CONFIG } from '@/config/app';

interface VideoRoomProps {
  bookingId: string;
  userRole: 'learner' | 'coach';
}

interface Participant {
  id: string;
  name: string;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isOwner: boolean;
}

export default function VideoRoom({ bookingId, userRole }: VideoRoomProps) {
  const [sessionTime, setSessionTime] = useState(0);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const {
    call,
    isJoined,
    isJoining,
    participants: videoParticipants,
    error,
    joinRoom,
    leaveRoom,
    toggleCamera,
    toggleMicrophone,
    isCameraOn,
    isMicrophoneOn,
  } = useVideo({
    onJoined: () => {
      // Start session timer
      startSessionTimer();
      
      // Simulate participants for demo
      if (APP_CONFIG.DEMO.MOCK_PARTICIPANTS) {
        setParticipants([
          {
            id: '1',
            name: 'You',
            isVideoEnabled: isCameraOn,
            isAudioEnabled: isMicrophoneOn,
            isOwner: userRole === 'coach',
          },
          {
            id: '2',
            name: userRole === 'learner' ? 'Coach' : 'Learner',
            isVideoEnabled: true,
            isAudioEnabled: true,
            isOwner: userRole !== 'coach',
          },
        ]);
      }
    },
    onLeft: () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.location.href = '/dashboard';
    },
    onError: (error) => {
      console.error('Video error:', error);
    },
  });

  useEffect(() => {
    const initializeVideoRoom = async () => {
      try {
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
        
        // Join the video room
        await joinRoom(roomUrl, token);

      } catch (err) {
        console.error('Failed to initialize video room:', err);
      }
    };

    initializeVideoRoom();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [bookingId, joinRoom]);

  const startSessionTimer = () => {
    intervalRef.current = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
  };

  const handleLeaveSession = async () => {
    try {
      await leaveRoom();
      toast.success('Left session successfully');
    } catch (error) {
      toast.error('Failed to leave session');
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
              <span className="text-sm">{participants.length} participants</span>
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

      {/* Main Video Area */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          {participants.map((participant) => (
            <div key={participant.id} className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
              {participant.isVideoEnabled ? (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  {/* Daily.co Video Element - This will be populated by Daily.co SDK */}
                  <div 
                    id={`video-${participant.id}`}
                    className="w-full h-full bg-gray-600 rounded-lg"
                    style={{ 
                      background: 'linear-gradient(45deg, #1f2937, #374151)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div className="text-center text-white">
                      <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm opacity-75">Video Stream</p>
                      <p className="text-xs opacity-50 mt-1">{participant.name}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <div className="text-center">
                    <Avatar className="h-16 w-16 mx-auto mb-2">
                      <AvatarFallback className="bg-gray-600 text-white">
                        {participant.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm text-gray-300">{participant.name}</p>
                    <Badge variant="secondary" className="mt-2 bg-gray-600 text-gray-300">
                      Camera Off
                    </Badge>
                  </div>
                </div>
              )}
              
              {/* Participant Info */}
              <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                <span className="text-sm font-medium text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                  {participant.name}
                </span>
                {participant.isOwner && (
                  <Badge variant="secondary" className="text-xs bg-blue-600">Host</Badge>
                )}
              </div>
              
              {/* Audio Status */}
              <div className="absolute bottom-4 right-4">
                {participant.isAudioEnabled ? (
                  <div className="bg-black bg-opacity-50 p-1 rounded">
                    <Mic className="h-4 w-4 text-green-400" />
                  </div>
                ) : (
                  <div className="bg-black bg-opacity-50 p-1 rounded">
                    <MicOff className="h-4 w-4 text-red-400" />
                  </div>
                )}
              </div>
            </div>
          ))}
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
            onClick={handleLeaveSession}
            className="rounded-full w-12 h-12"
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
