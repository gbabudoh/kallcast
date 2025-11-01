// UI Constants
export const UI_CONSTANTS = {
  // Breakpoints (matching Tailwind CSS)
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
  },
  
  // Animation Durations (in milliseconds)
  ANIMATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
    VERY_SLOW: 1000,
  },
  
  // Z-Index Layers
  Z_INDEX: {
    DROPDOWN: 1000,
    STICKY: 1020,
    FIXED: 1030,
    MODAL_BACKDROP: 1040,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070,
    TOAST: 1080,
  },
  
  // Colors (matching design system)
  COLORS: {
    PRIMARY: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    SUCCESS: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    WARNING: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    ERROR: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
  },
  
  // Spacing (matching Tailwind CSS)
  SPACING: {
    0: '0px',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem',     // 128px
  },
  
  // Border Radius
  BORDER_RADIUS: {
    NONE: '0px',
    SM: '0.125rem',   // 2px
    DEFAULT: '0.25rem', // 4px
    MD: '0.375rem',   // 6px
    LG: '0.5rem',     // 8px
    XL: '0.75rem',    // 12px
    '2XL': '1rem',    // 16px
    '3XL': '1.5rem',  // 24px
    FULL: '9999px',
  },
  
  // Font Sizes
  FONT_SIZES: {
    XS: '0.75rem',    // 12px
    SM: '0.875rem',   // 14px
    BASE: '1rem',     // 16px
    LG: '1.125rem',   // 18px
    XL: '1.25rem',    // 20px
    '2XL': '1.5rem',  // 24px
    '3XL': '1.875rem', // 30px
    '4XL': '2.25rem', // 36px
    '5XL': '3rem',    // 48px
    '6XL': '3.75rem', // 60px
  },
  
  // Font Weights
  FONT_WEIGHTS: {
    THIN: 100,
    EXTRALIGHT: 200,
    LIGHT: 300,
    NORMAL: 400,
    MEDIUM: 500,
    SEMIBOLD: 600,
    BOLD: 700,
    EXTRABOLD: 800,
    BLACK: 900,
  },
  
  // Line Heights
  LINE_HEIGHTS: {
    NONE: 1,
    TIGHT: 1.25,
    SNUG: 1.375,
    NORMAL: 1.5,
    RELAXED: 1.625,
    LOOSE: 2,
  },
  
  // Shadows
  SHADOWS: {
    SM: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    MD: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    LG: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    XL: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2XL': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    INNER: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    NONE: '0 0 #0000',
  },
  
  // Component Sizes
  COMPONENT_SIZES: {
    BUTTON: {
      SM: { height: '2rem', padding: '0.5rem 0.75rem', fontSize: '0.875rem' },
      DEFAULT: { height: '2.5rem', padding: '0.5rem 1rem', fontSize: '1rem' },
      LG: { height: '3rem', padding: '0.75rem 1.5rem', fontSize: '1.125rem' },
    },
    INPUT: {
      SM: { height: '2rem', padding: '0.5rem 0.75rem', fontSize: '0.875rem' },
      DEFAULT: { height: '2.5rem', padding: '0.5rem 0.75rem', fontSize: '1rem' },
      LG: { height: '3rem', padding: '0.75rem 1rem', fontSize: '1.125rem' },
    },
    AVATAR: {
      SM: { size: '2rem' },
      DEFAULT: { size: '2.5rem' },
      LG: { size: '3rem' },
      XL: { size: '4rem' },
    },
  },
  
  // Loading States
  LOADING: {
    SPINNER_SIZE: {
      SM: '1rem',
      DEFAULT: '1.5rem',
      LG: '2rem',
    },
    SKELETON_HEIGHT: {
      SM: '1rem',
      DEFAULT: '1.25rem',
      LG: '1.5rem',
    },
  },
  
  // Toast/Notification
  TOAST: {
    DURATION: {
      SHORT: 3000,
      DEFAULT: 5000,
      LONG: 10000,
    },
    POSITION: {
      TOP_LEFT: 'top-left',
      TOP_CENTER: 'top-center',
      TOP_RIGHT: 'top-right',
      BOTTOM_LEFT: 'bottom-left',
      BOTTOM_CENTER: 'bottom-center',
      BOTTOM_RIGHT: 'bottom-right',
    },
  },
  
  // Modal/Dialog
  MODAL: {
    MAX_WIDTH: {
      SM: '24rem',
      DEFAULT: '32rem',
      LG: '48rem',
      XL: '64rem',
      FULL: '100%',
    },
  },
  
  // Table
  TABLE: {
    ROW_HEIGHT: '3rem',
    HEADER_HEIGHT: '2.5rem',
    CELL_PADDING: '0.75rem 1rem',
  },
  
  // Form
  FORM: {
    LABEL_MARGIN: '0.5rem',
    FIELD_MARGIN: '1rem',
    GROUP_MARGIN: '1.5rem',
  },
} as const;
