import mongoose, { Document, Schema } from 'mongoose';

export interface ISessionParticipant {
  userId: mongoose.Types.ObjectId;
  joinedAt: Date;
  leftAt?: Date;
  duration?: number;
}

export interface ISession extends Document {
  bookingId: mongoose.Types.ObjectId;
  videoRoomId: string;
  
  startedAt: Date;
  endedAt?: Date;
  duration?: number; // actual duration in minutes
  
  participants: ISessionParticipant[];
  
  recording: {
    isRecorded: boolean;
    recordingUrl?: string;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const SessionParticipantSchema = new Schema<ISessionParticipant>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  joinedAt: {
    type: Date,
    required: true,
  },
  leftAt: {
    type: Date,
  },
  duration: {
    type: Number,
    min: 0,
  },
});

const SessionSchema = new Schema<ISession>({
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  videoRoomId: {
    type: String,
    required: true,
  },
  
  startedAt: {
    type: Date,
    required: true,
  },
  endedAt: {
    type: Date,
  },
  duration: {
    type: Number,
    min: 0,
  },
  
  participants: [SessionParticipantSchema],
  
  recording: {
    isRecorded: {
      type: Boolean,
      default: false,
    },
    recordingUrl: {
      type: String,
    },
  },
}, {
  timestamps: true,
});

// Indexes
SessionSchema.index({ bookingId: 1 });
SessionSchema.index({ videoRoomId: 1 });
SessionSchema.index({ startedAt: 1 });

export default mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);
