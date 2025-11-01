// Application Configuration
export const APP_CONFIG = {
  // Basic App Info
  NAME: process.env.NEXT_PUBLIC_APP_NAME || 'KallKast',
  DESCRIPTION: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Live Coaching Platform - Connect with expert coaches for live learning sessions',
  VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // Contact Information
  SUPPORT_EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@kallkast.com',
  CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@kallkast.com',
  
  // API Configuration
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // Pagination Defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },
  
  // Search & Filter Defaults
  SEARCH: {
    DEFAULT_MIN_RATING: 0,
    DEFAULT_MAX_PRICE: 1000,
    MAX_ADVANCE_BOOKING_DAYS: 30,
    MIN_ADVANCE_BOOKING_HOURS: 2,
  },
  
  // Session Configuration
  SESSION: {
    MAX_PARTICIPANTS: {
      DEFAULT: 5,
      COACH_OWNED: 5,
      LEARNER_VIEW: 4,
    },
    DEFAULT_DURATION: 60, // minutes
    MIN_DURATION: 15, // minutes
    MAX_DURATION: 240, // minutes (4 hours)
  },
  
  // Video Configuration
  VIDEO: {
    MAX_PARTICIPANTS: 5,
    ENABLE_RECORDING: true,
    ENABLE_CHAT: true,
    ENABLE_SCREEN_SHARING: true,
  },
  
  // Demo/Development Configuration
  DEMO: {
    ENABLED: process.env.NODE_ENV === 'development',
    MOCK_PARTICIPANTS: process.env.NODE_ENV === 'development',
  },
} as const;

// User Roles
export const USER_ROLES = {
  LEARNER: 'learner',
  COACH: 'coach',
  ADMIN: 'admin',
} as const;

// Session Status
export const SESSION_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const;

// Slot Status
export const SLOT_STATUS = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  CANCELLED: 'cancelled',
} as const;
