import { APP_CONFIG } from '@/config/app';

// Validation Rules
export const VALIDATION_RULES = {
  // User Validation
  USER: {
    FIRST_NAME: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 50,
      PATTERN: /^[a-zA-Z\s]+$/,
    },
    LAST_NAME: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 50,
      PATTERN: /^[a-zA-Z\s]+$/,
    },
    EMAIL: {
      PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      MAX_LENGTH: 254,
    },
    PASSWORD: {
      MIN_LENGTH: 8,
      MAX_LENGTH: 128,
      PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    },
    PHONE: {
      PATTERN: /^\+?[\d\s\-\(\)]+$/,
      MIN_LENGTH: 10,
      MAX_LENGTH: 20,
    },
    BIO: {
      MIN_LENGTH: 10,
      MAX_LENGTH: 1000,
    },
  },
  
  // Coach Validation
  COACH: {
    EXPERTISE: {
      MIN_LENGTH: 3,
      MAX_LENGTH: 100,
    },
    YEARS_EXPERIENCE: {
      MIN: 0,
      MAX: 50,
    },
    HOURLY_RATE: {
      MIN: 10,
      MAX: 1000,
    },
    DESCRIPTION: {
      MIN_LENGTH: 50,
      MAX_LENGTH: 2000,
    },
    EDUCATION: {
      MIN_LENGTH: 10,
      MAX_LENGTH: 500,
    },
    CERTIFICATIONS: {
      MIN_LENGTH: 10,
      MAX_LENGTH: 500,
    },
  },
  
  // Session Validation
  SESSION: {
    TITLE: {
      MIN_LENGTH: 5,
      MAX_LENGTH: 100,
    },
    DESCRIPTION: {
      MIN_LENGTH: 20,
      MAX_LENGTH: 1000,
    },
    DURATION: {
      MIN: APP_CONFIG.SESSION.MIN_DURATION,
      MAX: APP_CONFIG.SESSION.MAX_DURATION,
    },
    MAX_PARTICIPANTS: {
      MIN: 1,
      MAX: APP_CONFIG.SESSION.MAX_PARTICIPANTS.DEFAULT,
    },
    PRICE: {
      MIN: 5,
      MAX: APP_CONFIG.SEARCH.DEFAULT_MAX_PRICE,
    },
  },
  
  // Review Validation
  REVIEW: {
    RATING: {
      MIN: 1,
      MAX: 5,
    },
    COMMENT: {
      MIN_LENGTH: 10,
      MAX_LENGTH: 500,
    },
  },
  
  // File Upload Validation
  FILE: {
    PROFILE_IMAGE: {
      MAX_SIZE: 5 * 1024 * 1024, // 5MB
      ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    },
    DOCUMENT: {
      MAX_SIZE: 10 * 1024 * 1024, // 10MB
      ALLOWED_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
    },
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  // General
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_URL: 'Please enter a valid URL',
  INVALID_DATE: 'Please enter a valid date',
  INVALID_TIME: 'Please enter a valid time',
  
  // User
  FIRST_NAME_REQUIRED: 'First name is required',
  FIRST_NAME_TOO_SHORT: 'First name must be at least 2 characters',
  FIRST_NAME_TOO_LONG: 'First name must be less than 50 characters',
  FIRST_NAME_INVALID: 'First name can only contain letters and spaces',
  
  LAST_NAME_REQUIRED: 'Last name is required',
  LAST_NAME_TOO_SHORT: 'Last name must be at least 2 characters',
  LAST_NAME_TOO_LONG: 'Last name must be less than 50 characters',
  LAST_NAME_INVALID: 'Last name can only contain letters and spaces',
  
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  EMAIL_TOO_LONG: 'Email must be less than 254 characters',
  
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
  PASSWORD_TOO_LONG: 'Password must be less than 128 characters',
  PASSWORD_WEAK: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  PASSWORDS_NOT_MATCH: 'Passwords do not match',
  
  // Coach
  EXPERTISE_REQUIRED: 'Expertise is required',
  EXPERTISE_TOO_SHORT: 'Expertise must be at least 3 characters',
  EXPERTISE_TOO_LONG: 'Expertise must be less than 100 characters',
  
  YEARS_EXPERIENCE_INVALID: 'Years of experience must be between 0 and 50',
  HOURLY_RATE_INVALID: 'Hourly rate must be between $10 and $1000',
  
  BIO_TOO_SHORT: 'Bio must be at least 10 characters',
  BIO_TOO_LONG: 'Bio must be less than 1000 characters',
  
  // Session
  TITLE_REQUIRED: 'Session title is required',
  TITLE_TOO_SHORT: 'Title must be at least 5 characters',
  TITLE_TOO_LONG: 'Title must be less than 100 characters',
  
  DESCRIPTION_REQUIRED: 'Session description is required',
  DESCRIPTION_TOO_SHORT: 'Description must be at least 20 characters',
  DESCRIPTION_TOO_LONG: 'Description must be less than 1000 characters',
  
  DURATION_INVALID: 'Duration must be between 15 and 240 minutes',
  PRICE_INVALID: 'Price must be between $5 and $1000',
  
  // Review
  RATING_REQUIRED: 'Rating is required',
  RATING_INVALID: 'Rating must be between 1 and 5',
  COMMENT_TOO_SHORT: 'Comment must be at least 10 characters',
  COMMENT_TOO_LONG: 'Comment must be less than 500 characters',
  
  // File Upload
  FILE_TOO_LARGE: 'File size is too large',
  FILE_TYPE_INVALID: 'File type is not supported',
  FILE_REQUIRED: 'File is required',
  
  // Booking
  SLOT_NOT_AVAILABLE: 'This time slot is no longer available',
  BOOKING_TOO_EARLY: 'Cannot book sessions more than 30 days in advance',
  BOOKING_TOO_LATE: 'Cannot book sessions less than 2 hours in advance',
  BOOKING_CONFLICT: 'You already have a session at this time',
  
  // Payment
  PAYMENT_FAILED: 'Payment failed. Please try again',
  PAYMENT_CANCELLED: 'Payment was cancelled',
  INSUFFICIENT_FUNDS: 'Insufficient funds',
  
  // Network
  NETWORK_ERROR: 'Network error. Please check your connection',
  SERVER_ERROR: 'Server error. Please try again later',
  TIMEOUT_ERROR: 'Request timed out. Please try again',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  // User
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  EMAIL_VERIFIED: 'Email verified successfully',
  
  // Coach
  COACH_PROFILE_CREATED: 'Coach profile created successfully',
  COACH_PROFILE_UPDATED: 'Coach profile updated successfully',
  
  // Session
  SESSION_CREATED: 'Session created successfully',
  SESSION_UPDATED: 'Session updated successfully',
  SESSION_DELETED: 'Session deleted successfully',
  
  // Booking
  BOOKING_CREATED: 'Booking created successfully',
  BOOKING_CANCELLED: 'Booking cancelled successfully',
  BOOKING_CONFIRMED: 'Booking confirmed successfully',
  
  // Payment
  PAYMENT_SUCCESSFUL: 'Payment successful',
  REFUND_PROCESSED: 'Refund processed successfully',
  
  // Review
  REVIEW_SUBMITTED: 'Review submitted successfully',
  REVIEW_UPDATED: 'Review updated successfully',
  REVIEW_DELETED: 'Review deleted successfully',
  
  // File Upload
  FILE_UPLOADED: 'File uploaded successfully',
  FILE_DELETED: 'File deleted successfully',
} as const;
