// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/signin',
    REGISTER: '/api/users',
    LOGOUT: '/api/auth/signout',
    SESSION: '/api/auth/session',
  },
  
  // Users
  USERS: {
    BASE: '/api/users',
    BY_ID: (id: string) => `/api/users/${id}`,
    PROFILE: (id: string) => `/api/users/${id}/profile`,
  },
  
  // Coaches
  COACHES: {
    BASE: '/api/coaches',
    BY_ID: (id: string) => `/api/coaches/${id}`,
    FEATURED: '/api/coaches/featured',
    SEARCH: '/api/coaches/search',
  },
  
  // Slots
  SLOTS: {
    BASE: '/api/slots',
    BY_ID: (id: string) => `/api/slots/${id}`,
    BY_COACH: (coachId: string) => `/api/slots?coachId=${coachId}`,
    AVAILABLE: '/api/slots/available',
  },
  
  // Bookings
  BOOKINGS: {
    BASE: '/api/bookings',
    BY_ID: (id: string) => `/api/bookings/${id}`,
    BY_USER: (userId: string) => `/api/bookings?userId=${userId}`,
    CANCEL: (id: string) => `/api/bookings/${id}/cancel`,
    COMPLETE: (id: string) => `/api/bookings/${id}/complete`,
  },
  
  // Payments
  PAYMENTS: {
    CREATE_CHECKOUT: '/api/payments/create-checkout',
    WEBHOOK: '/api/payments/webhook',
    CONNECT_ONBOARD: '/api/payments/connect/onboard',
    CONNECT_RETURN: '/api/payments/connect/return',
    CONNECT_STATUS: '/api/payments/connect/status',
  },
  
  // Video
  VIDEO: {
    CREATE_ROOM: '/api/video/create-room',
    GET_TOKEN: '/api/video/get-token',
  },
  
  // Reviews
  REVIEWS: {
    BASE: '/api/reviews',
    BY_COACH: (coachId: string) => `/api/reviews?coachId=${coachId}`,
    BY_BOOKING: (bookingId: string) => `/api/reviews?bookingId=${bookingId}`,
  },
} as const;

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

// API Response Status Codes
export const API_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
} as const;

// Request Headers
export const API_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  ACCEPT: 'Accept',
} as const;

// Content Types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
} as const;
