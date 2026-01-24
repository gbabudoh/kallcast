'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Video, Mic, MicOff, VideoOff, Calendar, CheckCircle, X } from 'lucide-react';

interface SessionLobbyProps {
  sessionTitle: string;
  coachName: string;
  coachImage?: string;
  clientName: string;
  clientImage?: string;
  scheduledTime: Date;
  duration: number;
  isCoach: boolean;
  onJoinSession: () => void;
  onClose?: () => void;
  canJoin: boolean;
}

export default function SessionLobby({
  sessionTitle,
  coachName,
  coachImage,
  clientName,
  clientImage,
  scheduledTime,
  duration,
  isCoach,
  onJoinSession,
  onClose,
  canJoin,
}: SessionLobbyProps) {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [timeUntilSession, setTimeUntilSession] = useState<string>('');
  const [isReady, setIsReady] = useState(false);

  // Calculate time until session
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const diff = scheduledTime.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeUntilSession('Session is ready');
        setIsReady(true);
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      if (minutes > 60) {
        const hours = Math.floor(minutes / 60);
        setTimeUntilSession(`${hours}h ${minutes % 60}m`);
      } else if (minutes > 0) {
        setTimeUntilSession(`${minutes}m ${seconds}s`);
      } else {
        setTimeUntilSession(`${seconds}s`);
      }

      // Allow joining 15 minutes early
      if (diff <= 15 * 60 * 1000) {
        setIsReady(true);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [scheduledTime]);

  const otherParticipant = isCoach
    ? { name: clientName, image: clientImage, role: 'Client' }
    : { name: coachName, image: coachImage, role: 'Coach' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <Card className="max-w-xl w-full border-none shadow-2xl rounded-[2rem] overflow-hidden bg-white/95 backdrop-blur-xl relative">
        {/* Close Button */}
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors z-30 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-slate-400 cursor-pointer" />
          </button>
        )}
        <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
        
        <CardHeader className="p-8 pb-4 text-center">
          <Badge className="w-fit mx-auto mb-4 bg-blue-100 text-blue-700 border-none px-3 py-1 text-xs font-black uppercase tracking-wider">
            {isReady ? '🟢 Ready to Join' : '⏳ Waiting Room'}
          </Badge>
          <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">
            {sessionTitle}
          </CardTitle>
          <CardDescription className="text-slate-500 font-medium">
            Your {duration}-minute coaching session
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 pt-0 space-y-6">
          {/* Session Info */}
          <div className="bg-slate-50 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Scheduled</p>
                  <p className="text-slate-900 font-bold">
                    {scheduledTime.toLocaleDateString()} at{' '}
                    {scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <Badge className={`${isReady ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'} border-none`}>
                {timeUntilSession}
              </Badge>
            </div>

            <div className="border-t border-slate-100 pt-4 flex items-center space-x-4">
              <Avatar className="w-12 h-12 border-2 border-white shadow-md">
                <AvatarImage src={otherParticipant.image} />
                <AvatarFallback className="bg-slate-200 text-slate-600 font-bold">
                  {otherParticipant.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">{otherParticipant.role}</p>
                <p className="text-slate-900 font-bold">{otherParticipant.name}</p>
              </div>
            </div>
          </div>

          {/* Device Check */}
          <div className="space-y-3">
            <p className="text-slate-900 font-bold text-sm flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              Pre-Session Checklist
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`flex-1 h-14 rounded-xl font-bold ${
                  audioEnabled
                    ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                    : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                }`}
              >
                {audioEnabled ? (
                  <>
                    <Mic className="w-5 h-5 mr-2" /> Mic On
                  </>
                ) : (
                  <>
                    <MicOff className="w-5 h-5 mr-2" /> Mic Off
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setVideoEnabled(!videoEnabled)}
                className={`flex-1 h-14 rounded-xl font-bold ${
                  videoEnabled
                    ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                    : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                }`}
              >
                {videoEnabled ? (
                  <>
                    <Video className="w-5 h-5 mr-2" /> Camera On
                  </>
                ) : (
                  <>
                    <VideoOff className="w-5 h-5 mr-2" /> Camera Off
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Join Button */}
          <Button
            onClick={onJoinSession}
            disabled={!canJoin || !isReady}
            className={`w-full h-16 rounded-xl text-lg font-black transition-all ${
              canJoin && isReady
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Video className="w-6 h-6 mr-3" />
            {canJoin && isReady ? 'Join Session' : 'Waiting for session time...'}
          </Button>

          {!isReady && (
            <p className="text-xs text-slate-400 text-center">
              You can join up to 15 minutes before the scheduled start time.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
