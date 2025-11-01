import { z } from 'zod';

// Base review schema
const baseReviewSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(500, 'Comment cannot exceed 500 characters'),
});

export const createReviewSchema = baseReviewSchema;

export const updateReviewSchema = baseReviewSchema.partial().omit({ bookingId: true });

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
