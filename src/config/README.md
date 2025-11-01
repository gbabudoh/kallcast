# Configuration Guide

This document outlines all the configuration options available in the KallKast application.

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

### Application Configuration
```env
NEXT_PUBLIC_APP_NAME=KallKast
NEXT_PUBLIC_APP_DESCRIPTION=Live Coaching Platform - Connect with expert coaches for live learning sessions
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

### Contact Information
```env
NEXT_PUBLIC_SUPPORT_EMAIL=support@kallkast.com
NEXT_PUBLIC_CONTACT_EMAIL=contact@kallkast.com
```

### Database
```env
MONGODB_URI=mongodb://localhost:27017/kallkast
```

### Authentication
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

### Stripe Configuration
```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Daily.co Video Configuration
```env
DAILY_API_KEY=your_daily_api_key
```

### Email Configuration
```env
RESEND_API_KEY=your_resend_api_key
```

### Development Configuration
```env
NODE_ENV=development
```

## Configuration Structure

The application uses a centralized configuration system located in `src/config/app.ts`. This configuration includes:

### Application Settings
- App name, description, and version
- Base URLs for API and frontend
- Contact information

### Pagination Defaults
- Default page size and limits
- Maximum allowed limits

### Search & Filter Defaults
- Default rating and price ranges
- Booking advance time limits

### Session Configuration
- Maximum participants per session
- Default and min/max duration limits
- Video room settings

### Demo/Development Settings
- Mock participants for development
- Demo mode toggle

## Usage

Import the configuration in your components:

```typescript
import { APP_CONFIG } from '@/config/app';

// Use configuration values
const maxParticipants = APP_CONFIG.SESSION.MAX_PARTICIPANTS.DEFAULT;
const defaultLimit = APP_CONFIG.PAGINATION.DEFAULT_LIMIT;
```

## Benefits

1. **Centralized Configuration**: All hardcoded values are now in one place
2. **Environment-Specific**: Different values for development, staging, and production
3. **Type Safety**: TypeScript ensures correct usage of configuration values
4. **Easy Maintenance**: Update values in one place to affect the entire application
5. **Better Testing**: Easy to mock configuration for tests
