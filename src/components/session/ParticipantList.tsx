'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Crown,
  MoreVertical
} from 'lucide-react';
import { APP_CONFIG } from '@/config/app';

interface Participant {
  id: string;
  name: string;
  email?: string;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isOwner: boolean;
  isMuted?: boolean;
  joinTime?: Date;
  profileImage?: string;
}

interface ParticipantListProps {
  participants: Participant[];
  currentUserId: string;
  isOwner: boolean;
  onMuteParticipant?: (participantId: string) => void;
  onRemoveParticipant?: (participantId: string) => void;
  onToggleParticipantVideo?: (participantId: string) => void;
}

export default function ParticipantList({
  participants,
  currentUserId,
  isOwner,
  onMuteParticipant,
  onRemoveParticipant,
  onToggleParticipantVideo,
}: ParticipantListProps) {
  const formatJoinTime = (joinTime?: Date) => {
    if (!joinTime) return '';
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - joinTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just joined';
    if (diffInMinutes < 60) return `Joined ${diffInMinutes}m ago`;
    const hours = Math.floor(diffInMinutes / 60);
    return `Joined ${hours}h ago`;
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Participants ({participants.length})</span>
        </CardTitle>
        <CardDescription>
          People in this session
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {participants.map((participant) => {
          const isCurrentUser = participant.id === currentUserId;
          
          return (
            <div
              key={participant.id}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isCurrentUser ? 'bg-primary/10 border border-primary/20' : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={participant.profileImage} alt={participant.name} />
                  <AvatarFallback>
                    {participant.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                {/* Status indicators */}
                <div className="absolute -bottom-1 -right-1 flex space-x-1">
                  {participant.isAudioEnabled ? (
                    <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                      <Mic className="h-2 w-2 text-white" />
                    </div>
                  ) : (
                    <div className="w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                      <MicOff className="h-2 w-2 text-white" />
                    </div>
                  )}
                  
                  {participant.isVideoEnabled ? (
                    <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                      <Video className="h-2 w-2 text-white" />
                    </div>
                  ) : (
                    <div className="w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                      <VideoOff className="h-2 w-2 text-white" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="font-medium truncate">
                    {participant.name}
                    {isCurrentUser && (
                      <span className="text-sm text-muted-foreground ml-1">(You)</span>
                    )}
                  </p>
                  
                  {participant.isOwner && (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
                
                <div className="flex items-center space-x-2 mt-1">
                  {participant.isMuted && (
                    <Badge variant="secondary" className="text-xs">
                      Muted
                    </Badge>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    {formatJoinTime(participant.joinTime)}
                  </p>
                </div>
              </div>
              
              {/* Actions for owner */}
              {isOwner && !isCurrentUser && (
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMuteParticipant?.(participant.id)}
                    className="h-8 w-8 p-0"
                    title={participant.isMuted ? 'Unmute' : 'Mute'}
                  >
                    {participant.isMuted ? (
                      <Mic className="h-4 w-4" />
                    ) : (
                      <MicOff className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveParticipant?.(participant.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    title="Remove participant"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
        
        {/* Empty state */}
        {participants.length === 0 && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No participants yet</p>
            <p className="text-sm text-gray-500">
              Share the session link to invite others
            </p>
          </div>
        )}
        
        {/* Session info */}
        <div className="pt-4 border-t">
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Maximum {participants.length > 0 ? participants[0].isOwner ? APP_CONFIG.SESSION.MAX_PARTICIPANTS.COACH_OWNED : APP_CONFIG.SESSION.MAX_PARTICIPANTS.LEARNER_VIEW : APP_CONFIG.SESSION.MAX_PARTICIPANTS.DEFAULT} participants</p>
            <p>• Session recording is enabled</p>
            <p>• Chat and screen sharing available</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
