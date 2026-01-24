import { z } from 'zod';

// Base slot schema without refinements for extension
const baseSlotSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z.number().min(10, 'Price must be at least $10'),
  duration: z.number().min(15, 'Duration must be at least 15 minutes').max(480, 'Duration cannot exceed 8 hours'),
  maxParticipants: z.number().min(1, 'Must allow at least 1 participant').max(100, 'Cannot exceed 100 participants'),
  category: z.string().min(1, 'Category is required'),
  startTime: z.date(),
  endTime: z.date(),
  isRecurring: z.boolean(),
  recurrenceRule: z.string().optional(),
});

// Create slot schema with time validation refinement
export const createSlotSchema = baseSlotSchema.refine((data) => data.endTime > data.startTime, {
  message: "End time must be after start time",
  path: ["endTime"],
});

// Update slot schema without refinements (since partial fields might not have both startTime and endTime)
export const updateSlotSchema = baseSlotSchema.partial();

export const coachProfileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  bio: z.string().min(50, 'Bio must be at least 50 characters'),
  expertise: z.array(z.string()).min(1, 'At least one expertise area is required'),
  yearsExperience: z.number().min(0, 'Years of experience must be 0 or more'),
  hourlyRate: z.number().min(10, 'Hourly rate must be at least $10'),
  timezone: z.string().min(1, 'Timezone is required'),
});

export type CreateSlotInput = z.infer<typeof createSlotSchema>;
export type UpdateSlotInput = z.infer<typeof updateSlotSchema>;
export type CoachProfileInput = z.infer<typeof coachProfileSchema>;
