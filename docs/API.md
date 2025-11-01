# 🔌 API Documentation

This document provides comprehensive information about Kallcast's API endpoints, authentication, and usage examples.

## 🔐 Authentication

Kallcast uses NextAuth.js for authentication. All protected endpoints require a valid session.

### Session Management
```javascript
// Get current session
const session = await getServerSession(authOptions);

// Check if user is authenticated
if (!session) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### Role-Based Access
```javascript
// Check user role
if (session.user.role !== 'coach') {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

## 📚 API Endpoints

### Authentication Endpoints

#### `POST /api/auth/signin`
Sign in a user with credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "learner"
  },
  "expires": "2024-12-15T10:00:00.000Z"
}
```

#### `POST /api/auth/signout`
Sign out the current user.

**Response:**
```json
{
  "message": "Signed out successfully"
}
```

### User Management

#### `POST /api/users`
Create a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "learner",
  "timezone": "America/New_York"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "userId": "user_id"
}
```

#### `GET /api/users/[userId]`
Get user profile information.

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "learner",
    "timezone": "America/New_York",
    "profileImage": "https://example.com/avatar.jpg",
    "bio": "Passionate learner",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

#### `PUT /api/users/[userId]`
Update user profile.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "bio": "Updated bio",
  "timezone": "America/Los_Angeles"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Smith",
    "bio": "Updated bio"
  }
}
```

### Coach Management

#### `GET /api/coaches`
Get list of coaches with filtering options.

**Query Parameters:**
- `search` (string): Search by name or expertise
- `category` (string): Filter by category
- `minRating` (number): Minimum rating filter
- `maxRate` (number): Maximum hourly rate filter
- `page` (number): Page number for pagination
- `limit` (number): Number of results per page

**Response:**
```json
{
  "coaches": [
    {
      "id": "coach_id",
      "firstName": "Sarah",
      "lastName": "Johnson",
      "profileImage": "https://example.com/avatar.jpg",
      "bio": "Expert product manager",
      "expertise": ["Product Strategy", "Leadership"],
      "hourlyRate": 150,
      "averageRating": 4.9,
      "totalSessions": 127,
      "isVerified": true,
      "responseTime": "< 2 hours"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

#### `GET /api/coaches/[coachId]`
Get detailed coach profile.

**Response:**
```json
{
  "coach": {
    "id": "coach_id",
    "firstName": "Sarah",
    "lastName": "Johnson",
    "email": "sarah@example.com",
    "profileImage": "https://example.com/avatar.jpg",
    "bio": "Expert product manager with 8+ years experience",
    "expertise": ["Product Strategy", "Leadership", "Agile"],
    "hourlyRate": 150,
    "yearsExperience": 8,
    "averageRating": 4.9,
    "totalSessions": 127,
    "isVerified": true,
    "stripeOnboardingComplete": true,
    "availability": {
      "timezone": "America/New_York",
      "schedule": {
        "monday": ["09:00", "17:00"],
        "tuesday": ["09:00", "17:00"]
      }
    }
  }
}
```

### Slot Management

#### `GET /api/slots`
Get available time slots.

**Query Parameters:**
- `coachId` (string): Filter by coach ID
- `date` (string): Filter by date (YYYY-MM-DD)
- `startDate` (string): Start date range
- `endDate` (string): End date range

**Response:**
```json
{
  "slots": [
    {
      "id": "slot_id",
      "coachId": "coach_id",
      "startTime": "2024-11-15T14:00:00.000Z",
      "endTime": "2024-11-15T15:00:00.000Z",
      "duration": 60,
      "price": 150,
      "isAvailable": true,
      "maxParticipants": 1,
      "currentParticipants": 0
    }
  ]
}
```

#### `POST /api/slots`
Create a new time slot (coaches only).

**Request Body:**
```json
{
  "startTime": "2024-11-15T14:00:00.000Z",
  "endTime": "2024-11-15T15:00:00.000Z",
  "duration": 60,
  "price": 150,
  "maxParticipants": 1,
  "title": "Product Strategy Session",
  "description": "Learn advanced product strategy techniques"
}
```

**Response:**
```json
{
  "message": "Slot created successfully",
  "slot": {
    "id": "slot_id",
    "startTime": "2024-11-15T14:00:00.000Z",
    "endTime": "2024-11-15T15:00:00.000Z",
    "price": 150
  }
}
```

#### `PUT /api/slots/[slotId]`
Update a time slot (coaches only).

**Request Body:**
```json
{
  "price": 175,
  "description": "Updated session description"
}
```

#### `DELETE /api/slots/[slotId]`
Delete a time slot (coaches only).

**Response:**
```json
{
  "message": "Slot deleted successfully"
}
```

### Booking Management

#### `GET /api/bookings`
Get user's bookings.

**Query Parameters:**
- `status` (string): Filter by status (upcoming, completed, cancelled)
- `role` (string): User role (learner, coach)
- `page` (number): Page number
- `limit` (number): Results per page

**Response:**
```json
{
  "bookings": [
    {
      "id": "booking_id",
      "slotId": "slot_id",
      "learnerId": "learner_id",
      "coachId": "coach_id",
      "amount": 150,
      "platformFee": 30,
      "coachPayout": 120,
      "paymentStatus": "paid",
      "sessionStatus": "scheduled",
      "scheduledFor": "2024-11-15T14:00:00.000Z",
      "videoRoomUrl": "https://kallcast.daily.co/room123",
      "coach": {
        "firstName": "Sarah",
        "lastName": "Johnson",
        "profileImage": "https://example.com/avatar.jpg"
      },
      "slot": {
        "title": "Product Strategy Session",
        "duration": 60
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

#### `POST /api/bookings`
Create a new booking.

**Request Body:**
```json
{
  "slotId": "slot_id",
  "paymentMethodId": "pm_stripe_payment_method_id"
}
```

**Response:**
```json
{
  "message": "Booking created successfully",
  "booking": {
    "id": "booking_id",
    "amount": 150,
    "sessionStatus": "scheduled",
    "videoRoomUrl": "https://kallcast.daily.co/room123"
  }
}
```

#### `GET /api/bookings/[bookingId]`
Get booking details.

**Response:**
```json
{
  "booking": {
    "id": "booking_id",
    "amount": 150,
    "sessionStatus": "scheduled",
    "scheduledFor": "2024-11-15T14:00:00.000Z",
    "videoRoomUrl": "https://kallcast.daily.co/room123",
    "coach": {
      "firstName": "Sarah",
      "lastName": "Johnson"
    },
    "learner": {
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

#### `PUT /api/bookings/[bookingId]/cancel`
Cancel a booking.

**Request Body:**
```json
{
  "reason": "Schedule conflict"
}
```

**Response:**
```json
{
  "message": "Booking cancelled successfully",
  "refundAmount": 150
}
```

#### `PUT /api/bookings/[bookingId]/complete`
Mark booking as completed (coaches only).

**Response:**
```json
{
  "message": "Session marked as completed"
}
```

### Payment Management

#### `POST /api/payments/create-checkout`
Create Stripe checkout session.

**Request Body:**
```json
{
  "slotId": "slot_id",
  "successUrl": "https://kallcast.com/success",
  "cancelUrl": "https://kallcast.com/cancel"
}
```

**Response:**
```json
{
  "checkoutUrl": "https://checkout.stripe.com/pay/cs_session_id"
}
```

#### `POST /api/payments/connect/onboard`
Create Stripe Connect onboarding link (coaches only).

**Response:**
```json
{
  "onboardingUrl": "https://connect.stripe.com/express/onboarding/account_id"
}
```

#### `GET /api/payments/connect/return`
Handle Stripe Connect return.

**Response:**
```json
{
  "message": "Onboarding completed successfully",
  "accountComplete": true
}
```

### Video Management

#### `POST /api/video/create-room`
Create Daily.co video room.

**Request Body:**
```json
{
  "bookingId": "booking_id"
}
```

**Response:**
```json
{
  "roomUrl": "https://kallcast.daily.co/room123",
  "roomName": "room123"
}
```

#### `POST /api/video/get-token`
Get Daily.co access token.

**Request Body:**
```json
{
  "roomName": "room123",
  "userId": "user_id"
}
```

**Response:**
```json
{
  "token": "daily_access_token",
  "roomUrl": "https://kallcast.daily.co/room123"
}
```

### Review Management

#### `GET /api/reviews`
Get reviews for a coach.

**Query Parameters:**
- `coachId` (string): Coach ID
- `page` (number): Page number
- `limit` (number): Results per page

**Response:**
```json
{
  "reviews": [
    {
      "id": "review_id",
      "bookingId": "booking_id",
      "learnerId": "learner_id",
      "coachId": "coach_id",
      "rating": 5,
      "comment": "Excellent session!",
      "createdAt": "2024-11-10T15:00:00.000Z",
      "learner": {
        "firstName": "John",
        "lastName": "D."
      }
    }
  ]
}
```

#### `POST /api/reviews`
Create a review.

**Request Body:**
```json
{
  "bookingId": "booking_id",
  "rating": 5,
  "comment": "Excellent session! Very helpful."
}
```

**Response:**
```json
{
  "message": "Review created successfully",
  "review": {
    "id": "review_id",
    "rating": 5,
    "comment": "Excellent session!"
  }
}
```

## 🔄 Webhooks

### Stripe Webhooks

#### `POST /api/payments/webhook`
Handle Stripe webhook events.

**Supported Events:**
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

**Request Headers:**
```
stripe-signature: webhook_signature
```

## 📊 Error Handling

### Error Response Format
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Specific field error"
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `500` - Internal Server Error

### Common Error Codes
- `VALIDATION_ERROR` - Input validation failed
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource conflict
- `PAYMENT_FAILED` - Payment processing failed
- `SLOT_UNAVAILABLE` - Time slot no longer available

## 🔒 Rate Limiting

API endpoints are rate-limited to prevent abuse:
- **Authentication**: 5 requests per minute
- **General API**: 100 requests per minute
- **Payment API**: 10 requests per minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 📝 Request/Response Examples

### Complete Booking Flow

1. **Get Available Slots**
```bash
curl -X GET "https://kallcast.com/api/slots?coachId=coach123&date=2024-11-15" \
  -H "Authorization: Bearer session_token"
```

2. **Create Booking**
```bash
curl -X POST "https://kallcast.com/api/bookings" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer session_token" \
  -d '{
    "slotId": "slot123",
    "paymentMethodId": "pm_stripe123"
  }'
```

3. **Get Video Room Token**
```bash
curl -X POST "https://kallcast.com/api/video/get-token" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer session_token" \
  -d '{
    "roomName": "room123",
    "userId": "user123"
  }'
```

## 🧪 Testing

### Test Environment
- Base URL: `https://test.kallcast.com/api`
- Use Stripe test keys
- Use Daily.co test domain

### Postman Collection
Import our Postman collection for easy API testing:
```json
{
  "info": {
    "name": "Kallcast API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{session_token}}",
        "type": "string"
      }
    ]
  }
}
```

## 📞 Support

For API support:
- Documentation: [docs.kallcast.com/api](https://docs.kallcast.com/api)
- Issues: [GitHub Issues](https://github.com/gbabudoh/kallcast/issues)
- Email: api@kallcast.com