// Application Routes
export const ROUTES = {
  // Public Routes
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRICING: '/pricing',
  HELP: '/help',
  RESOURCES: '/resources',
  EXPLAIN: '/explain',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  
  // Authentication Routes
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    REGISTER_COACH: '/register-coach',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    VERIFY_EMAIL: '/verify-email',
  },
  
  // Dashboard Routes
  DASHBOARD: {
    BASE: '/dashboard',
    LEARNER_BASE: '/learner/dashboard',
    COACH_BASE: '/coach/dashboard',
    PROFILE: '/dashboard/profile',
    SETTINGS: '/dashboard/settings',
    NOTIFICATIONS: '/dashboard/notifications',
    BILLING: '/dashboard/billing',
  },
  
  // Learner Routes
  LEARNER: {
    EXPLORE: '/learner/explore',
    MY_BOOKINGS: '/learner/my-bookings',
    MY_SESSIONS: '/learner/my-sessions',
    FAVORITES: '/learner/favorites',
    LEARNING_HISTORY: '/learner/learning-history',
  },
  
  // Coach Routes
  COACH: {
    MY_SESSIONS: '/coach/my-sessions',
    CREATE_SESSION: '/coach/my-sessions/create',
    EARNINGS: '/coach/earnings',
    STUDENTS: '/coach/students',
    ANALYTICS: '/analytics',
    ONBOARDING: '/coach-onboarding',
  },
  
  // Coach Profile Routes
  COACH_PROFILE: {
    BASE: (coachId: string) => `/coach/${coachId}`,
    REVIEWS: (coachId: string) => `/coach/${coachId}/reviews`,
    AVAILABILITY: (coachId: string) => `/coach/${coachId}/availability`,
  },
  
  // Booking Routes
  BOOKING: {
    BASE: (slotId: string) => `/booking/${slotId}`,
    CONFIRM: (bookingId: string) => `/booking/${bookingId}/confirm`,
    CANCEL: (bookingId: string) => `/booking/${bookingId}/cancel`,
  },
  
  // Session Routes
  SESSION: {
    BASE: (bookingId: string) => `/session/${bookingId}`,
    ROOM: (bookingId: string) => `/session/${bookingId}`,
    RECORDING: (bookingId: string) => `/session/${bookingId}/recording`,
    FEEDBACK: (bookingId: string) => `/session/${bookingId}/feedback`,
  },
  
  // Admin Routes
  ADMIN: {
    BASE: '/admin',
    USERS: '/admin/users',
    COACHES: '/admin/coaches',
    SESSIONS: '/admin/sessions',
    PAYMENTS: '/admin/payments',
    ANALYTICS: '/admin/analytics',
    SETTINGS: '/admin/settings',
  },
  
  // API Routes
  API: {
    AUTH: '/api/auth',
    USERS: '/api/users',
    COACHES: '/api/coaches',
    SLOTS: '/api/slots',
    BOOKINGS: '/api/bookings',
    PAYMENTS: '/api/payments',
    VIDEO: '/api/video',
    REVIEWS: '/api/reviews',
    UPLOAD: '/api/upload',
  },
} as const;

// Route Protection
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD.BASE,
  ROUTES.DASHBOARD.LEARNER_BASE,
  ROUTES.DASHBOARD.COACH_BASE,
  ROUTES.DASHBOARD.PROFILE,
  ROUTES.DASHBOARD.SETTINGS,
  ROUTES.DASHBOARD.NOTIFICATIONS,
  ROUTES.DASHBOARD.BILLING,
  ROUTES.LEARNER.EXPLORE,
  ROUTES.LEARNER.MY_BOOKINGS,
  ROUTES.LEARNER.MY_SESSIONS,
  ROUTES.LEARNER.FAVORITES,
  ROUTES.LEARNER.LEARNING_HISTORY,
  ROUTES.COACH.MY_SESSIONS,
  ROUTES.COACH.CREATE_SESSION,
  ROUTES.COACH.EARNINGS,
  ROUTES.COACH.STUDENTS,
  ROUTES.COACH.ANALYTICS,
  ROUTES.COACH.ONBOARDING,
] as const;

// Public Routes (accessible without authentication)
export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.ABOUT,
  ROUTES.CONTACT,
  ROUTES.PRICING,
  ROUTES.RESOURCES,
  ROUTES.EXPLAIN,
  ROUTES.HELP,
  ROUTES.TERMS,
  ROUTES.PRIVACY,
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.REGISTER,
  ROUTES.AUTH.REGISTER_COACH,
  ROUTES.AUTH.FORGOT_PASSWORD,
  ROUTES.AUTH.RESET_PASSWORD,
  ROUTES.AUTH.VERIFY_EMAIL,
] as const;

// Coach-Only Routes
export const COACH_ROUTES = [
  ROUTES.DASHBOARD.COACH_BASE,
  ROUTES.COACH.MY_SESSIONS,
  ROUTES.COACH.CREATE_SESSION,
  ROUTES.COACH.EARNINGS,
  ROUTES.COACH.STUDENTS,
  ROUTES.COACH.ANALYTICS,
  ROUTES.COACH.ONBOARDING,
] as const;

// Admin-Only Routes
export const ADMIN_ROUTES = [
  ROUTES.ADMIN.BASE,
  ROUTES.ADMIN.USERS,
  ROUTES.ADMIN.COACHES,
  ROUTES.ADMIN.SESSIONS,
  ROUTES.ADMIN.PAYMENTS,
  ROUTES.ADMIN.ANALYTICS,
  ROUTES.ADMIN.SETTINGS,
] as const;

// Redirect Routes
export const REDIRECT_ROUTES = {
  AFTER_LOGIN: ROUTES.DASHBOARD.BASE,
  AFTER_LOGOUT: ROUTES.HOME,
  AFTER_REGISTER: ROUTES.DASHBOARD.BASE,
  UNAUTHORIZED: ROUTES.AUTH.LOGIN,
  NOT_FOUND: ROUTES.HOME,
} as const;
