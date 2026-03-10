import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Base schema without refinements for extension
const baseRegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  role: z.enum(['learner', 'coach']),
  timezone: z.string().min(1, 'Timezone is required'),
});

// Register schema with password confirmation refinement
export const registerSchema = baseRegisterSchema.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Coach registration schema with additional fields
export const registerCoachSchema = baseRegisterSchema.extend({
  bio: z.string().min(50, 'Bio must be at least 50 characters'),
  expertise: z.array(z.string()).min(1, 'At least one expertise area is required'),
  yearsExperience: z.number().min(0, 'Years of experience must be 0 or more'),
  hourlyRate: z.number().min(10, 'Hourly rate must be at least $10'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').optional(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').optional(),
  bio: z.string().min(50, 'Bio must be at least 50 characters').optional(),
  timezone: z.string().min(1, 'Timezone is required').optional(),
  expertise: z.array(z.string()).min(1, 'At least one expertise area is required').optional(),
  yearsExperience: z.number().min(0, 'Years of experience must be 0 or more').optional(),
  hourlyRate: z.number().min(10, 'Hourly rate must be at least $10').optional(),
  title: z.string().min(2, 'Professional title is too short').optional(),
  company: z.string().optional(),
  location: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  profileImage: z.string().url('Invalid image URL').optional().or(z.literal('')),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RegisterCoachInput = z.infer<typeof registerCoachSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
