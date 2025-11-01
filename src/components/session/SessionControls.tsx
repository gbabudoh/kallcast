'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Settings,
  MessageCircle,
  Share2,
  Users,
  Clock
} from 'lucide-react';

interface SessionControlsProps {
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isConnected: boolean;
  sessionTime: number;
  participantCount: number;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onLeaveSession: () => void;
  onOpenChat?: () => void;
  onOpenSettings?: () => void;
  onShareScreen?: () => void;
}

export default function SessionControls({
  isVideoEnabled,
  isAudioEnabled,
  isConnected,
  sessionTime,
  participantCount,
  onToggleVideo,
  onToggleAudio,
  onLeaveSession,
  onOpenChat,
  onOpenSettings,
  onShareScreen,
}: SessionControlsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-800 border-t border-gray-700 p-4">
      {/* Session Info */}
      <div className="flex items-center justify-center space-x-6 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-300">
          <Clock className="h-4 w-4" />
          <span>{formatTime(sessionTime)}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-300">
          <Users className="h-4 w-4" />
          <span>{participantCount} participants</span>
        </div>
        
        <Badge variant={isConnected ? "default" : "secondary"}>
          {isConnected ? "Connected" : "Connecting..."}
        </Badge>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center space-x-4">
        <Button
          variant={isAudioEnabled ? "default" : "destructive"}
          size="lg"
          onClick={onToggleAudio}
          className="rounded-full w-12 h-12"
          disabled={!isConnected}
        >
          {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </Button>
        
        <Button
          variant={isVideoEnabled ? "default" : "destructive"}
          size="lg"
          onClick={onToggleVideo}
          className="rounded-full w-12 h-12"
          disabled={!isConnected}
        >
          {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </Button>
        
        {onOpenChat && (
          <Button
            variant="ghost"
            size="lg"
            onClick={onOpenChat}
            className="rounded-full w-12 h-12"
            disabled={!isConnected}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        )}
        
        {onShareScreen && (
          <Button
            variant="ghost"
            size="lg"
            onClick={onShareScreen}
            className="rounded-full w-12 h-12"
            disabled={!isConnected}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        )}
        
        {onOpenSettings && (
          <Button
            variant="ghost"
            size="lg"
            onClick={onOpenSettings}
            className="rounded-full w-12 h-12"
            disabled={!isConnected}
          >
            <Settings className="h-5 w-5" />
          </Button>
        )}
        
        <Button
          variant="destructive"
          size="lg"
          onClick={onLeaveSession}
          className="rounded-full w-12 h-12"
        >
          <PhoneOff className="h-5 w-5" />
        </Button>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center justify-center space-x-4 mt-4">
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <div className={`w-2 h-2 rounded-full ${isAudioEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>Audio {isAudioEnabled ? 'On' : 'Off'}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <div className={`w-2 h-2 rounded-full ${isVideoEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>Video {isVideoEnabled ? 'On' : 'Off'}</span>
        </div>
      </div>
    </div>
  );
}
