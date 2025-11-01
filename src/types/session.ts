export interface Session {
  _id: string;
  bookingId: string;
  videoRoomId: string;
  
  startedAt: Date;
  endedAt?: Date;
  duration?: number; // actual duration in minutes
  
  participants: SessionParticipant[];
  
  recording: {
    isRecorded: boolean;
    recordingUrl?: string;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionParticipant {
  userId: string;
  joinedAt: Date;
  leftAt?: Date;
  duration?: number;
}

export interface VideoRoom {
  id: string;
  name: string;
  url: string;
  config: {
    max_participants: number;
    nbf?: number; // not before
    exp?: number; // expiration
    enable_recording?: boolean;
    enable_chat?: boolean;
    enable_screenshare?: boolean;
  };
}

export interface VideoToken {
  token: string;
  room_url: string;
  expires_at: number;
}

export interface SessionStats {
  totalSessions: number;
  totalDuration: number; // in minutes
  averageDuration: number;
  totalParticipants: number;
  completedSessions: number;
}
