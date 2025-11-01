// Note: APP_CONFIG and USER_ROLES are now in @/config/app
// Import them directly from there to avoid circular dependencies

// Session Status
export const SESSION_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
} as const;

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  REFUNDED: 'refunded',
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  CANCELLED: 'cancelled',
} as const;

// Stripe Connect Account Status
export const STRIPE_ACCOUNT_STATUS = {
  PENDING: 'pending',
  RESTRICTED: 'restricted',
  ENABLED: 'enabled',
  DISABLED: 'disabled',
} as const;

// Session Types
export const SESSION_TYPES = {
  ONE_ON_ONE: 'one_on_one',
  GROUP: 'group',
  WORKSHOP: 'workshop',
} as const;

// Time Zones
export const COMMON_TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Kolkata',
  'Australia/Sydney',
] as const;

// Session Duration Options (in minutes)
export const SESSION_DURATIONS = [
  30,   // 30 minutes
  45,   // 45 minutes
  60,   // 1 hour
  90,   // 1.5 hours
  120,  // 2 hours
] as const;

// Pricing Tiers
export const PRICING_TIERS = {
  FREE: {
    name: 'Free',
    price: 0,
    features: ['Basic profile', 'Up to 5 sessions per month'],
  },
  PRO: {
    name: 'Pro',
    price: 29,
    features: ['Unlimited sessions', 'Advanced analytics', 'Priority support'],
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 99,
    features: ['Everything in Pro', 'Custom branding', 'Dedicated support'],
  },
} as const;

// Platform Fees
export const PLATFORM_FEES = {
  COACH_FEE_PERCENTAGE: 20, // 20% of session price
  MINIMUM_FEE: 2, // Minimum $2 fee
  MAXIMUM_FEE: 50, // Maximum $50 fee
} as const;

// File Upload Limits
export const FILE_LIMITS = {
  PROFILE_IMAGE: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  },
  DOCUMENTS: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
  },
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
} as const;

// Cache Durations (in seconds)
export const CACHE_DURATION = {
  SHORT: 300,    // 5 minutes
  MEDIUM: 1800,  // 30 minutes
  LONG: 3600,    // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const;
