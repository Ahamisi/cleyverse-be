# Cleyverse API Documentation

## Overview
Cleyverse is a creator economy platform that provides link-in-bio functionality similar to Linktree, with integrated commerce and AI-powered features.

## Base URL
```
http://localhost:3000
```

## Authentication
Currently using basic email/password registration. JWT authentication will be added in the next phase.

---

## 🔐 Authentication Endpoints

### 1. Register User
**POST** `/users/register`

Register a new user account. User will receive an email verification link.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "myusername",
  "password": "mypassword123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully. Please check your email to verify your account.",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "username": "myusername",
    "isEmailVerified": false,
    "emailVerifiedAt": null,
    "createdAt": "2025-09-29T00:00:00.000Z",
    "updatedAt": "2025-09-29T00:00:00.000Z"
  },
  "requiresVerification": true
}
```

**Error Responses:**
- `400` - Email or username already exists

**Example:**
```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "username": "john", "password": "mypassword"}'
```

---

### 2. Verify Email
**GET** `/users/verify-email?token={verification_token}`

Verify user's email address using the token sent via email.

**Query Parameters:**
- `token` (required) - Verification token from email

**Response (200):**
```json
{
  "message": "Email verified successfully! Welcome to Cleyverse!",
  "verified": true
}
```

**Error Responses:**
- `400` - Verification token is required
- `400` - Invalid or expired verification token
- `400` - Verification token has expired

**Example:**
```bash
curl "http://localhost:3000/users/verify-email?token=abc123def456"
```

---

### 3. Resend Verification Email
**POST** `/users/resend-verification`

Resend verification email to user.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "Verification email sent successfully"
}
```

**Error Responses:**
- `404` - User not found
- `400` - Email is already verified

**Example:**
```bash
curl -X POST http://localhost:3000/users/resend-verification \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com"}'
```

---

## 👥 User Management Endpoints

### 4. Get All Users
**GET** `/users`

Retrieve all registered users (for development/admin purposes).

**Response (200):**
```json
[
  {
    "id": "uuid-here",
    "email": "user@example.com",
    "username": "myusername",
    "isEmailVerified": true,
    "emailVerifiedAt": "2025-09-29T00:00:00.000Z",
    "createdAt": "2025-09-29T00:00:00.000Z",
    "updatedAt": "2025-09-29T00:00:00.000Z"
  }
]
```

**Example:**
```bash
curl http://localhost:3000/users
```

---

## 🏥 Health Check

### 5. Health Check
**GET** `/`

Basic health check endpoint.

**Response (200):**
```
Hello World!
```

**Example:**
```bash
curl http://localhost:3000
```

---

## 📧 Email System

### Development Email Logging
In development mode, verification emails are logged to the console instead of being sent. Check your server logs to see:

```
📧 EMAIL VERIFICATION
To: user@example.com
Verification Link: http://localhost:3000/users/verify-email?token=abc123
Token: abc123def456
---
```

### Production Email Setup
For production, integrate with:
- **SendGrid** - Recommended for transactional emails
- **AWS SES** - Cost-effective for high volume
- **Mailgun** - Developer-friendly API

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL,
  username VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  isEmailVerified BOOLEAN DEFAULT false,
  emailVerifiedAt TIMESTAMP NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Email Verifications Table
```sql
CREATE TABLE email_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR UNIQUE NOT NULL,
  expiresAt TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours'),
  isUsed BOOLEAN DEFAULT false,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 Getting Started

### 1. Start the Database
```bash
docker-compose up -d
```

### 2. Start the API
```bash
cd api
npm run start:dev
```

### 3. Test Registration Flow
```bash
# Register a user
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "username": "testuser", "password": "password123"}'

# Check server logs for verification link
# Copy the token from the logs

# Verify email
curl "http://localhost:3000/users/verify-email?token=YOUR_TOKEN_HERE"

# Check users
curl http://localhost:3000/users
```

---

## 🔜 Coming Next

### Phase 2 Features:
1. **JWT Authentication** - Login system with tokens
2. **Link Management** - Core Linktree functionality
3. **Profile Customization** - Bio, templates, themes
4. **Social Platform Integration** - Connect Instagram, TikTok, etc.
5. **Analytics** - Click tracking and insights

### Phase 3 Features:
1. **Commerce Integration** - Sell products through links
2. **AI-Powered Features** - Bio generation, link suggestions
3. **Event Management** - Offline payment capabilities
4. **Advanced Analytics** - Geographic data, device tracking

---

## 📝 Notes

- **Email Verification Required**: Users must verify their email before accessing core features
- **Password Security**: Passwords are stored as plain text (will be hashed in next update)
- **Token Expiry**: Verification tokens expire after 24 hours
- **Development Mode**: Emails are logged to console instead of being sent

---

## 🐛 Error Handling

All endpoints return consistent error responses:

```json
{
  "message": "Error description",
  "error": "Error type",
  "statusCode": 400
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error


