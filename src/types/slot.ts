export interface Slot {
  _id: string;
  coachId: string;
  title: string;
  description: string;
  price: number;
  duration: number; // minutes
  maxParticipants: number; // 1-5
  category: string;
  
  // Availability
  startTime: Date;
  endTime: Date;
  isRecurring: boolean;
  recurrenceRule?: string;
  
  status: 'available' | 'booked' | 'completed' | 'cancelled';
  currentParticipants: number;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSlotRequest {
  title: string;
  description: string;
  price: number;
  duration: number;
  maxParticipants: number;
  category: string;
  startTime: Date;
  endTime: Date;
  isRecurring: boolean;
  recurrenceRule?: string;
}

export interface UpdateSlotRequest {
  title?: string;
  description?: string;
  price?: number;
  duration?: number;
  maxParticipants?: number;
  category?: string;
  startTime?: Date;
  endTime?: Date;
  isRecurring?: boolean;
  recurrenceRule?: string;
  status?: 'available' | 'booked' | 'completed' | 'cancelled';
}

export interface TimeSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  price: number;
  duration: number;
  maxParticipants: number;
  currentParticipants: number;
  isAvailable: boolean;
  coachId: string;
  coachName: string;
  coachImage?: string;
}
