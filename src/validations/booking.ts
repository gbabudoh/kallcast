import { z } from 'zod';

export const createBookingSchema = z.object({
  slotId: z.string().min(1, 'Slot ID is required'),
  paymentMethodId: z.string().min(1, 'Payment method is required'),
});

export const cancelBookingSchema = z.object({
  reason: z.string().min(10, 'Cancellation reason must be at least 10 characters'),
});

export const completeBookingSchema = z.object({
  notes: z.string().optional(),
  duration: z.number().min(1, 'Duration must be at least 1 minute').optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;
export type CompleteBookingInput = z.infer<typeof completeBookingSchema>;
