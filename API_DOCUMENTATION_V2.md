# 🚀 Cleyverse API Documentation v2.0

## 📋 Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Getting Started](#getting-started)
4. [Authentication](#authentication)
5. [API Endpoints](#api-endpoints)
6. [Database Schema](#database-schema)
7. [Error Handling](#error-handling)
8. [Development Workflow](#development-workflow)

---

## 1. Overview

**Cleyverse API** is an enterprise-grade backend service for the creator economy ecosystem. Built with NestJS, TypeScript, and PostgreSQL, it provides secure, scalable APIs for user management, authentication, and onboarding.

### Key Features
- 🔐 **JWT Authentication** - Secure token-based auth
- 👤 **User Management** - Complete onboarding flow
- 📧 **Email Verification** - Secure email validation
- 🔗 **Link Management** - Regular & social link system
- 🎵 **Smart Media Detection** - Auto-detect music & video URLs
- 🎬 **Rich Media Processing** - Spotify, YouTube, TikTok support
- 📱 **Social Integration** - 15+ social platforms supported
- 📊 **Analytics & Tracking** - Link click analytics
- 🗓️ **Advanced Link Features** - Scheduling, locking, archiving
- 📝 **Contact Forms** - Custom form builder with submissions
- 🏗️ **Enterprise Architecture** - Modular, scalable design
- 🛡️ **Type Safety** - Full TypeScript coverage
- 📈 **Database Migrations** - Version-controlled schema changes

---

## 2. Architecture

### 🏗️ **Enterprise Structure**
```
api/src/
├── common/                     # Shared utilities
│   ├── base/                   # Base classes (DRY)
│   ├── guards/                 # Authentication guards
│   ├── decorators/             # Custom decorators
│   └── interfaces/             # Common interfaces
├── modules/                    # Feature modules
│   ├── auth/                   # Authentication module
│   │   ├── controllers/        # AuthController
│   │   ├── services/           # AuthService
│   │   ├── strategies/         # JwtStrategy
│   │   └── auth.module.ts      # Module definition
│   ├── users/                  # Users module
│   │   ├── controllers/        # UsersController
│   │   ├── services/           # UserService + EmailVerificationService
│   │   ├── entities/           # User + EmailVerification entities
│   │   ├── dto/                # Data Transfer Objects
│   │   └── users.module.ts     # Module definition
│   └── links/                  # Links module
│       ├── controllers/        # LinksController + SocialLinksController
│       ├── services/           # LinkService + SocialLinkService
│       ├── entities/           # Link + SocialLink entities
│       ├── dto/                # Link DTOs
│       └── links.module.ts     # Module definition
├── shared/                     # Cross-module services
│   └── services/               # EmailService
└── app.module.ts               # Root module
```

### 🎯 **Design Principles**
- **DRY (Don't Repeat Yourself)** - BaseEntity, BaseService
- **Separation of Concerns** - Modules, services, controllers
- **Type Safety** - Full TypeScript coverage
- **Security First** - JWT guards, input validation
- **Scalability** - Modular architecture

---

## 3. Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- Docker & Docker Compose
- PostgreSQL (via Docker)

### Installation & Setup

1. **Clone & Install**
   ```bash
   git clone https://github.com/Ahamisi/cleyverse-be.git
   cd cleyverse-be/api
   npm install
   ```

2. **Start Database**
   ```bash
   cd ..
   docker-compose up -d
   ```

3. **Environment Setup**
   ```bash
   # api/.env
   DATABASE_URL=postgresql://postgres:password@localhost:5432/cleyverse
   NODE_ENV=development
   PORT=3000
   JWT_SECRET=cleyverse-super-secret-jwt-key-2025
   ```

4. **Start Development Server**
   ```bash
   npm run start:dev
   ```

5. **Verify Installation**
   ```bash
   curl http://localhost:3000
   # Expected: "Hello World!"
   ```

---

## 4. Authentication

### 🔐 **JWT Token-Based Authentication**

#### Login Flow
1. **Register** → Get user account (unverified)
2. **Verify Email** → Activate account
3. **Login** → Get JWT token
4. **Use Token** → Access protected endpoints

#### Token Format
```javascript
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username"
  },
  "expires_in": "24h"
}
```

#### Using JWT Tokens
```bash
# Include in Authorization header
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 5. API Endpoints

### 🌐 **Base URL**: `http://localhost:3000`

---

### 👤 **Authentication Endpoints**

#### **POST /auth/login**
Authenticate user and get JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "isEmailVerified": true,
    "hasCompletedOnboarding": false,
    "onboardingStep": 3
  },
  "expires_in": "24h"
}
```

**Errors:**
- `400` - Invalid credentials
- `401` - Unauthorized

---

### 👥 **User Management Endpoints**

#### **POST /users/register**
Register a new user account.

**Request:**
```json
{
  "email": "newuser@example.com",
  "username": "newuser123",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully. Please check your email to verify your account.",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "newuser@example.com",
    "username": "newuser123",
    "firstName": null,
    "lastName": null,
    "category": null,
    "goal": null,
    "profileTitle": null,
    "bio": null,
    "profileImageUrl": null,
    "hasCompletedOnboarding": false,
    "onboardingStep": 1,
    "isEmailVerified": false,
    "emailVerifiedAt": null,
    "createdAt": "2025-09-29T02:15:30.123Z",
    "updatedAt": "2025-09-29T02:15:30.123Z"
  },
  "requiresVerification": true
}
```

**Errors:**
- `400` - Email or username already exists
- `400` - Validation errors

---

#### **GET /users/verify-email**
Verify user's email address.

**Query Parameters:**
- `token` (required) - Email verification token

**Request:**
```bash
GET /users/verify-email?token=abc123def456ghi789
```

**Response (200):**
```json
{
  "message": "Email verified successfully! Welcome to Cleyverse!",
  "verified": true
}
```

**Errors:**
- `400` - Invalid or expired token
- `400` - Token already used

---

#### **POST /users/resend-verification**
Resend email verification link.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (201):**
```json
{
  "message": "Verification email sent successfully"
}
```

**Errors:**
- `400` - Email already verified
- `404` - User not found

---

#### **POST /users/check-username**
Check if username is available.

**Request:**
```json
{
  "username": "desiredusername"
}
```

**Response (200):**
```json
{
  "available": true,
  "username": "desiredusername",
  "message": "Username is available"
}
```

---

#### **GET /users/categories**
Get all available user categories.

**Response (200):**
```json
{
  "categories": [
    {"value": "business", "label": "Business"},
    {"value": "creative", "label": "Creative"},
    {"value": "education", "label": "Education"},
    {"value": "entertainment", "label": "Entertainment"},
    {"value": "fashion_beauty", "label": "Fashion & Beauty"},
    {"value": "food_beverage", "label": "Food & Beverage"},
    {"value": "government_politics", "label": "Government & Politics"},
    {"value": "health_wellness", "label": "Health & Wellness"},
    {"value": "non_profit", "label": "Non-Profit"},
    {"value": "other", "label": "Other"},
    {"value": "tech", "label": "Tech"},
    {"value": "travel_tourism", "label": "Travel & Tourism"}
  ]
}
```

---

#### **GET /users/goals**
Get all available user goals.

**Response (200):**
```json
{
  "goals": [
    {
      "value": "creator",
      "label": "Creator",
      "description": "Build my following and explore ways to monetize my audience."
    },
    {
      "value": "business",
      "label": "Business",
      "description": "Grow my business and reach more customers."
    },
    {
      "value": "personal",
      "label": "Personal",
      "description": "Share links with my friends and acquaintances."
    }
  ]
}
```

---

### 🔒 **Protected Onboarding Endpoints**
*All endpoints below require JWT authentication*

#### **PUT /users/personal-info**
Update user's personal information (Step 1).

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "category": "tech"
}
```

**Response (200):**
```json
{
  "message": "Personal information updated successfully",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "category": "tech",
    "onboardingStep": 2,
    // ... other fields
  },
  "nextStep": "username"
}
```

---

#### **PUT /users/username**
Update username (Step 2).

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request:**
```json
{
  "username": "john_doe_tech"
}
```

**Response (200):**
```json
{
  "message": "Username updated successfully",
  "user": {
    // Updated user object
    "username": "john_doe_tech",
    "onboardingStep": 3
  },
  "nextStep": "goal"
}
```

**Errors:**
- `400` - Username already taken

---

#### **PUT /users/goal**
Set user goal (Step 3).

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request:**
```json
{
  "goal": "creator"
}
```

**Response (200):**
```json
{
  "message": "Goal updated successfully",
  "user": {
    // Updated user object
    "goal": "creator",
    "onboardingStep": 4
  },
  "nextStep": "platforms"
}
```

---

#### **PUT /users/profile**
Update profile details (Step 4).

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request:**
```json
{
  "profileTitle": "Tech Creator & Developer",
  "bio": "Building amazing apps and sharing knowledge with the community.",
  "profileImageUrl": "https://example.com/avatar.jpg"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    // Updated user object
    "profileTitle": "Tech Creator & Developer",
    "bio": "Building amazing apps...",
    "profileImageUrl": "https://example.com/avatar.jpg",
    "onboardingStep": 5
  },
  "nextStep": "complete"
}
```

---

#### **POST /users/complete-onboarding**
Complete the onboarding process.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request:**
```json
{
  "profileTitle": "Final Title",
  "bio": "Final bio",
  "profileImageUrl": "https://example.com/final-avatar.jpg"
}
```

**Response (200):**
```json
{
  "message": "Onboarding completed successfully! Welcome to Cleyverse!",
  "user": {
    // Complete user object
    "hasCompletedOnboarding": true,
    "onboardingStep": 6
  },
  "onboardingComplete": true
}
```

**Errors:**
- `400` - Email not verified

---

#### **GET /users/onboarding-status**
Get current onboarding status.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "user": {
    // Complete user object without password
  },
  "onboardingStep": 3,
  "hasCompletedOnboarding": false,
  "isEmailVerified": true,
  "nextSteps": ["goal", "platforms", "profile"]
}
```

---

#### **GET /users/profile**
Get user profile information.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  // Same as onboarding-status response
}
```

---

### 🔗 **Link Management Endpoints**

#### **POST /links**
Create a new custom link with **🆕 Smart Media Detection**. **[AUTH REQUIRED]**

**Request:**
```json
{
  "title": "My Favorite Song",
  "url": "https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh",
  "layout": "featured",
  "isFeatured": true,
  "openInNewTab": true,
  "displayOrder": 1
}
```

**Response (200):**
```json
{
  "message": "Link created successfully",
  "link": {
    "id": "9d88b0e1-e33c-4c50-bc0f-4d369f2671f1",
    "userId": "user-id",
    "title": "My Favorite Song",
    "url": "https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh",
    "type": "regular",
    "layout": "featured",
    "mediaType": "music",          // 🆕 Auto-detected
    "thumbnailUrl": "https://via.placeholder.com/300x300?text=Album+Art",
    "previewData": {               // 🆕 Rich metadata
      "platform": "spotify",
      "title": "Sample Track Title",
      "artist": "Sample Artist",
      "album": "Sample Album",
      "duration": "3:45",
      "streamingServices": [
        {"platform": "spotify", "url": "...", "available": true},
        {"platform": "apple_music", "url": "#", "available": false}
      ]
    },
    "isActive": true,
    "isFeatured": true,
    "clickCount": 0,
    "displayOrder": 1,
    "openInNewTab": true,
    "createdAt": "2025-09-30T09:42:57.000Z",
    "updatedAt": "2025-09-30T09:42:57.000Z"
  }
}
```

#### **🆕 POST /links/preview**
Preview a URL to get metadata before creating a link. **[AUTH REQUIRED]**

**Request:**
```json
{
  "url": "https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh"
}
```

**Response (200):**
```json
{
  "message": "URL processed successfully",
  "metadata": {
    "type": "music",               // 'music' | 'video' | 'unknown'
    "platform": "spotify",
    "title": "Sample Track Title",
    "artist": "Sample Artist",
    "album": "Sample Album",
    "duration": "3:45",
    "thumbnailUrl": "https://via.placeholder.com/300x300?text=Album+Art",
    "embedUrl": "https://open.spotify.com/embed/track/4iV5W9uYEdYUVa79Axb7Rh",
    "streamingServices": [
      {"platform": "spotify", "url": "...", "available": true},
      {"platform": "apple_music", "url": "#", "available": false},
      {"platform": "youtube_music", "url": "#", "available": false}
    ]
  },
  "suggestions": {
    "title": "Sample Track Title - Sample Artist",
    "mediaType": "music",
    "thumbnailUrl": "https://via.placeholder.com/300x300?text=Album+Art",
    "previewData": {
      "platform": "spotify",
      "streamingServices": [...]
    }
  }
}
```

**🎵 Supported Music Platforms:**
- **Spotify** - `open.spotify.com/track/*`
- **Apple Music** - `music.apple.com/*`
- **YouTube Music** - `music.youtube.com/watch?v=*`
- **SoundCloud** - `soundcloud.com/*/*`
- **YouTube** - `youtube.com/watch?v=*` (detected as music)

**📹 Supported Video Platforms:**
- **YouTube** - `youtube.com/watch?v=*`
- **Vimeo** - `vimeo.com/*`
- **TikTok** - `tiktok.com/@*/video/*`
- **Instagram** - `instagram.com/(p|reel)/*`

#### **GET /links**
Get user's links with optional filtering. **[AUTH REQUIRED]**

**Query Parameters:**
- `includeInactive` (optional): "true" to include inactive links
- `type` (optional): Filter by link type ("regular", "social", "email", "phone")

**Response (200):**
```json
{
  "message": "Links retrieved successfully",
  "links": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Meet with me!",
      "url": "https://calendly.com/username",
      "type": "regular",
      "layout": "featured",
      "isActive": true,
      "isFeatured": true,
      "clickCount": 12,
      "displayOrder": 1,
      "createdAt": "2025-09-30T09:42:57.000Z"
    }
  ],
  "total": 1
}
```

#### **GET /links/featured**
Get only featured links. **[AUTH REQUIRED]**

**Response (200):**
```json
{
  "message": "Featured links retrieved successfully",
  "links": [...],
  "total": 2
}
```

#### **GET /links/analytics**
Get comprehensive link analytics. **[AUTH REQUIRED]**

**Query Parameters:**
- `linkId` (optional): Get analytics for specific link

**Response (200):**
```json
{
  "message": "Analytics retrieved successfully",
  "analytics": {
    "links": [
      {
        "id": "link-id",
        "title": "Meet with me!",
        "url": "https://calendly.com/username",
        "clickCount": 45,
        "lastClickedAt": "2025-09-30T08:30:00.000Z",
        "createdAt": "2025-09-29T10:00:00.000Z"
      }
    ],
    "totalLinks": 5,
    "totalClicks": 123,
    "avgClicksPerLink": 25
  }
}
```

#### **PUT /links/:id**
Update a specific link. **[AUTH REQUIRED]**

**Request:**
```json
{
  "title": "Updated title",
  "layout": "classic",
  "isFeatured": false,
  "isActive": true
}
```

**Response (200):**
```json
{
  "message": "Link updated successfully",
  "link": {
    // Updated link object
  }
}
```

#### **DELETE /links/:id**
Delete a specific link. **[AUTH REQUIRED]**

**Response (200):**
```json
{
  "message": "Link deleted successfully"
}
```

#### **PUT /links/reorder**
Reorder links by providing new sequence. **[AUTH REQUIRED]**

**Request:**
```json
{
  "linkIds": [
    "link-id-3",
    "link-id-1", 
    "link-id-2"
  ]
}
```

**Response (200):**
```json
{
  "message": "Links reordered successfully",
  "links": [
    // Links in new order
  ]
}
```

#### **POST /links/:id/click**
Record a click on a link. **[NO AUTH REQUIRED - PUBLIC]**

**Response (200):**
```json
{
  "message": "Click recorded successfully"
}
```
last checkout ----
---

### 🚀 **Advanced Link Features**

#### **PUT /links/:id/schedule**
Schedule link visibility with start/end dates. **[AUTH REQUIRED]**

**Request:**
```json
{
  "scheduledStartAt": "2025-10-01T10:00:00Z",
  "scheduledEndAt": "2025-10-01T18:00:00Z",
  "timezone": "America/New_York"
}
```

**Response (200):**
```json
{
  "message": "Link scheduled successfully",
  "link": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "scheduledStartAt": "2025-10-01T10:00:00.000Z",
    "scheduledEndAt": "2025-10-01T18:00:00.000Z",
    "timezone": "America/New_York",
    "...": "other link fields"
  }
}
```

#### **DELETE /links/:id/schedule**
Remove link scheduling. **[AUTH REQUIRED]**

**Response (200):**
```json
{
  "message": "Link schedule removed successfully",
  "link": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "scheduledStartAt": null,
    "scheduledEndAt": null,
    "timezone": null,
    "...": "other link fields"
  }
}
```

#### **PUT /links/:id/lock**
Lock a link with access control. **[AUTH REQUIRED]**

**Request:**
```json
{
  "isLocked": true,
  "lockType": "code",
  "lockCode": "1234",
  "lockDescription": "This link requires a 4-digit code to access."
}
```

**Lock Types:**
- `code` - Requires a numeric/text code
- `subscription` - Requires email subscription
- `age` - Requires age verification
- `sensitive` - Sensitive content warning
- `nft` - Requires NFT ownership

**Response (200):**
```json
{
  "message": "Link locked successfully",
  "link": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "isLocked": true,
    "lockType": "code",
    "lockCode": "1234",
    "lockDescription": "This link requires a 4-digit code to access.",
    "...": "other link fields"
  }
}
```

#### **POST /links/:id/unlock**
Unlock a locked link. **[NO AUTH REQUIRED - PUBLIC]**

**Request (for code lock):**
```json
{
  "code": "1234"
}
```

**Request (for subscription lock):**
```json
{
  "email": "user@example.com"
}
```

**Request (for age verification):**
```json
{
  "birthDate": "1990-01-01"
}
```

**Response (200):**
```json
{
  "message": "Link unlocked successfully",
  "success": true,
  "link": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Protected Content",
    "url": "https://example.com/content",
    "...": "other link fields"
  }
}
```

#### **PUT /links/:id/media**
Update link media properties. **[AUTH REQUIRED]**

**Request:**
```json
{
  "mediaType": "video",
  "thumbnailUrl": "https://example.com/thumbnail.jpg",
  "previewData": {
    "duration": "5:30",
    "title": "Amazing Video",
    "description": "Check out this amazing content!"
  }
}
```

**Media Types:**
- `video` - Video content
- `music` - Audio/music content
- `image` - Image content
- `document` - Document/file content

**Response (200):**
```json
{
  "message": "Link media updated successfully",
  "link": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "mediaType": "video",
    "thumbnailUrl": "https://example.com/thumbnail.jpg",
    "previewData": {
      "duration": "5:30",
      "title": "Amazing Video",
      "description": "Check out this amazing content!"
    },
    "...": "other link fields"
  }
}
```

#### **PUT /links/:id/customize**
Customize link with short codes and domains. **[AUTH REQUIRED]**

**Request:**
```json
{
  "shortCode": "my-awesome-link",
  "customDomain": "mysite.com"
}
```

**Response (200):**
```json
{
  "message": "Link customized successfully",
  "link": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "shortCode": "my-awesome-link",
    "shareableShortUrl": "cley.me/my-awesome-link",
    "customDomain": "mysite.com",
    "...": "other link fields"
  }
}
```

#### **PUT /links/:id/archive**
Archive a link (soft delete). **[AUTH REQUIRED]**

**Response (200):**
```json
{
  "message": "Link archived successfully",
  "link": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "archived",
    "isActive": false,
    "archivedAt": "2025-10-01T02:11:43.341Z",
    "...": "other link fields"
  }
}
```

#### **PUT /links/:id/restore**
Restore an archived link. **[AUTH REQUIRED]**

**Response (200):**
```json
{
  "message": "Link restored successfully",
  "link": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "active",
    "isActive": true,
    "archivedAt": null,
    "...": "other link fields"
  }
}
```

#### **GET /links/archived**
Get user's archived links. **[AUTH REQUIRED]**

**Response (200):**
```json
{
  "message": "Archived links retrieved successfully",
  "links": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Old Link",
      "status": "archived",
      "archivedAt": "2025-10-01T02:11:43.341Z",
      "...": "other link fields"
    }
  ],
  "total": 1
}
```

#### **POST /links/:id/share**
Generate shareable short URL for social sharing. **[AUTH REQUIRED]**

**Request:**
```json
{
  "platform": "instagram",
  "message": "Check out my awesome link!"
}
```

**Response (200):**
```json
{
  "message": "Link shared successfully",
  "shareUrl": "cley.me/8736dd61",
  "platform": "instagram"
}
```

#### **GET /links/:id/share-stats**
Get sharing statistics for a link. **[AUTH REQUIRED]**

**Response (200):**
```json
{
  "message": "Share statistics retrieved successfully",
  "stats": {
    "linkId": "550e8400-e29b-41d4-a716-446655440000",
    "title": "My Awesome Link",
    "shareUrl": "cley.me/8736dd61",
    "socialShareCount": 15,
    "clickCount": 150,
    "shareToClickRatio": "10.00"
  }
}
```

---

### 📱 **Social Links Endpoints**

#### **POST /social-links**
Add a social media link. **[AUTH REQUIRED]**

**Request:**
```json
{
  "platform": "instagram",
  "username": "johndoe",
  "url": "https://www.instagram.com/johndoe",
  "iconPosition": "top",
  "displayOrder": 1
}
```

**Response (200):**
```json
{
  "message": "instagram link added successfully",
  "socialLink": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "user-id",
    "platform": "instagram",
    "username": "johndoe",
    "url": "https://www.instagram.com/johndoe",
    "iconPosition": "top",
    "isActive": true,
    "displayOrder": 1,
    "clickCount": 0,
    "createdAt": "2025-09-30T09:42:57.000Z"
  }
}
```

#### **GET /social-links**
Get user's social links. **[AUTH REQUIRED]**

**Query Parameters:**
- `includeInactive` (optional): "true" to include inactive links

**Response (200):**
```json
{
  "message": "Social links retrieved successfully",
  "socialLinks": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "platform": "instagram",
      "username": "johndoe",
      "url": "https://www.instagram.com/johndoe",
      "iconPosition": "top",
      "isActive": true,
      "clickCount": 25,
      "displayOrder": 1
    }
  ],
  "total": 1
}
```

#### **GET /social-links/platforms**
Get all supported social platforms. **[AUTH REQUIRED]**

**Response (200):**
```json
{
  "message": "Supported platforms retrieved successfully",
  "platforms": [
    {
      "value": "instagram",
      "label": "Instagram",
      "urlPattern": "https://www.instagram.com/{username}"
    },
    {
      "value": "youtube",
      "label": "YouTube",
      "urlPattern": "https://www.youtube.com/@{username}"
    },
    {
      "value": "tiktok",
      "label": "TikTok",
      "urlPattern": "https://www.tiktok.com/@{username}"
    }
    // ... 12 more platforms
  ]
}
```

#### **GET /social-links/analytics**
Get social media analytics. **[AUTH REQUIRED]**

**Response (200):**
```json
{
  "message": "Social link analytics retrieved successfully",
  "analytics": {
    "socialLinks": [
      {
        "id": "link-id",
        "platform": "instagram",
        "username": "johndoe",
        "clickCount": 45,
        "lastClickedAt": "2025-09-30T08:30:00.000Z"
      }
    ],
    "totalSocialLinks": 5,
    "totalClicks": 200,
    "avgClicksPerLink": 40,
    "topPlatforms": [
      {
        "platform": "instagram",
        "username": "johndoe",
        "clicks": 45
      }
    ]
  }
}
```

#### **GET /social-links/platform/:platform**
Get social link for specific platform. **[AUTH REQUIRED]**

**Response (200):**
```json
{
  "message": "instagram link retrieved successfully",
  "socialLink": {
    // Social link object
  }
}
```

#### **PUT /social-links/:id**
Update a social link. **[AUTH REQUIRED]**

**Request:**
```json
{
  "username": "newusername",
  "url": "https://www.instagram.com/newusername",
  "isActive": true
}
```

#### **DELETE /social-links/:id**
Delete a social link. **[AUTH REQUIRED]**

**Response (200):**
```json
{
  "message": "Social link deleted successfully"
}
```

#### **PUT /social-links/icon-settings**
Update global social icon settings. **[AUTH REQUIRED]**

**Request:**
```json
{
  "iconPosition": "bottom",
  "activePlatforms": ["social-link-id-1", "social-link-id-2"]
}
```

**Response (200):**
```json
{
  "message": "Social icon settings updated successfully",
  "socialLinks": [
    // Updated social links
  ]
}
```

#### **PUT /social-links/reorder**
Reorder social links. **[AUTH REQUIRED]**

**Request:**
```json
{
  "linkIds": ["link-id-3", "link-id-1", "link-id-2"]
}
```

#### **POST /social-links/:id/click**
Record a click on social link. **[NO AUTH REQUIRED - PUBLIC]**

**Response (200):**
```json
{
  "message": "Social link click recorded successfully"
}
```

---

### 📝 **Contact Forms System**

Based on the provided Linktree screenshots, we need to implement a comprehensive contact forms system. Here's the planned implementation:

#### **Available Form Field Types**

| Field Type | Description | Usage |
|------------|-------------|-------|
| `text` | Single line text input | Names, titles, short responses |
| `email` | Email input with validation | Contact email addresses |
| `phone` | Phone number input | Contact phone numbers |
| `message` | Multi-line text area | Brief messages |
| `short_answer` | Short text response | Quick answers |
| `paragraph` | Long text response | Detailed messages, descriptions |
| `date` | Date picker | Event dates, deadlines |
| `country` | Country selector | Location information |
| `dropdown` | Single choice dropdown | Select one from multiple options |
| `checkbox` | Multiple choice checkboxes | Select multiple options |
| `radio` | Single choice radio buttons | Choose one option |

**Important Notes:**
- Use `paragraph` instead of `textarea` for multi-line text
- Use `dropdown` instead of `multiple_choice` for single selections
- Use `radio` for single choice with visible options
- Use `dropdown` for single choice with compact display

#### **🆕 Contact Form Features (PLANNED)**

**Form Types:**
- **Blank Form** - Custom form builder
- **Email Sign Up** - Newsletter subscription
- **Contact Form** - Standard contact fields

**Form Fields:**
- **Name** - Text input (required/optional)
- **Email Address** - Email validation (required/optional)  
- **Phone Number** - Phone validation with country code
- **Message** - Textarea (optional)
- **Custom Questions** - Multiple choice, checkboxes, dropdown
- **Date Fields** - Date picker
- **Country** - Country dropdown
- **Short Answer** - Single line text
- **Paragraph** - Multi-line text

**Form Settings:**
- **Introduction** - Optional welcome message
- **Thank You Message** - Custom confirmation
- **Custom T&Cs** - Terms and conditions toggle
- **Required/Optional** - Field validation settings

#### **📋 Planned Contact Form Endpoints**

```json
// Create a contact form
POST /forms
{
  "title": "Get in Touch",
  "type": "contact_form",
  "introduction": "I'd love to hear from you!",
  "thankYouMessage": "Thanks for reaching out!",
  "fields": [
    {
      "type": "text",
      "label": "Name",
      "required": true,
      "placeholder": "Your full name"
    },
    {
      "type": "email", 
      "label": "Email",
      "required": true
    },
    {
      "type": "phone",
      "label": "Phone",
      "required": false,
      "countryCode": "+1"
    },
    {
      "type": "paragraph",
      "label": "Message",
      "required": false,
      "placeholder": "Tell me more..."
    },
    {
      "type": "dropdown",
      "label": "What brought you here?",
      "required": true,
      "options": ["Social media", "Word of mouth", "Newspaper"]
    }
  ],
  "customTCs": false,
  "tcLink": "https://example.com/terms"
}

// Get user's forms
GET /forms

// Get form submissions
GET /forms/:id/submissions

// Submit a form (public)
POST /forms/:id/submit
{
  "submissionData": {
    "name": "John Doe",
    "email": "john@example.com", 
    "phone": "+1234567890",
    "message": "Hello!",
    "custom_question_1": "Social media"
  },
  "submitterEmail": "john@example.com",
  "submitterName": "John Doe",
  "acceptTerms": true
}

// Update form
PUT /forms/:id
{
  "title": "Updated Contact Form",
  "introduction": "We'd love to hear from you!",
  "thankYouMessage": "Thanks for your message!"
}

// Delete form
DELETE /forms/:id

// Add field to form
POST /forms/:id/fields
{
  "type": "text",
  "label": "Company Name",
  "placeholder": "Your company name",
  "required": false,
  "displayOrder": 5
}

// Update form field
PUT /forms/:id/fields/:fieldId
{
  "label": "Full Name",
  "placeholder": "Enter your full name",
  "required": true,        // ✅ Both 'required' and 'isRequired' work
  "displayOrder": 1
}

// ⚠️ IMPORTANT: Get field IDs from form details
GET /forms/:id  // Returns form with fields array containing field IDs

// Delete form field
DELETE /forms/:id/fields/:fieldId

// Reorder form fields
PUT /forms/:id/fields/reorder
{
  "fieldIds": ["field-1-id", "field-2-id", "field-3-id"]
}

// Update form status
PUT /forms/:id/status
{
  "status": "active"
}

// Get form analytics
GET /forms/analytics?formId=optional
```

#### **🎫 Forms + Events Integration (FUTURE)**

The Forms system is designed to be inherited by the Events module for:

**Ticket Sales Forms:**
- Event registration forms
- Ticket purchase forms  
- Attendee information collection
- Payment processing integration

**Vendor Application Forms:**
- Vendor registration
- Booth application forms
- Equipment requirements
- Contract acceptance

**Implementation Pattern:**
```javascript
// Events will extend forms with additional context
{
  "formId": "base-form-uuid",
  "eventId": "event-uuid", 
  "formType": "ticket_purchase",
  "eventSpecificFields": {
    "ticketType": "VIP",
    "quantity": 2,
    "specialRequests": "..."
  }
}
```

This modular approach ensures:
- ✅ Consistent form behavior across modules
- ✅ Reusable form templates
- ✅ Centralized form analytics
- ✅ Easy maintenance and updates

---

### 🗂️ **Collections System**

Collections allow users to group and organize their links with different display layouts and customization options, as seen in Linktree.

#### **POST /collections**
Create a new collection. **[AUTH REQUIRED]**

**Request:**
```json
{
  "title": "My Social Media",
  "description": "All my social media links",
  "layout": "stack",              // 'stack' | 'grid' | 'carousel'
  "isActive": true,
  "backgroundColor": "#ffffff",
  "textColor": "#000000",
  "showTitle": true,
  "showCount": true,
  "allowReorder": true
}
```

**Response (200):**
```json
{
  "message": "Collection created successfully",
  "collection": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "user-id",
    "title": "My Social Media",
    "description": "All my social media links",
    "layout": "stack",
    "isActive": true,
    "displayOrder": 1,
    "linkCount": 0,
    "backgroundColor": "#ffffff",
    "textColor": "#000000",
    "showTitle": true,
    "showCount": true,
    "allowReorder": true,
    "status": "active",
    "createdAt": "2025-10-01T04:24:44.000Z",
    "updatedAt": "2025-10-01T04:24:44.000Z"
  }
}
```

#### **GET /collections**
Get user's collections. **[AUTH REQUIRED]**

**Query Parameters:**
- `includeInactive` (optional): Include inactive collections (default: false)

**Response (200):**
```json
{
  "message": "Collections retrieved successfully",
  "collections": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "My Social Media",
      "layout": "stack",
      "linkCount": 3,
      "isActive": true,
      "displayOrder": 1,
      "links": [
        {
          "id": "link-id-1",
          "title": "Instagram",
          "url": "https://instagram.com/username"
        }
      ]
    }
  ],
  "total": 1
}
```

#### **GET /collections/layouts**
Get available collection layouts. **[AUTH REQUIRED]**

**Response (200):**
```json
{
  "message": "Available layouts retrieved successfully",
  "layouts": [
    {
      "value": "stack",
      "label": "Stack",
      "description": "Display your links in the classic Cleyverse stack."
    },
    {
      "value": "grid",
      "label": "Grid", 
      "description": "Organize links in a responsive grid layout."
    },
    {
      "value": "carousel",
      "label": "Carousel",
      "description": "Showcase links in a swipeable carousel format."
    }
  ]
}
```

#### **GET /collections/:id**
Get specific collection with links. **[AUTH REQUIRED]**

**Response (200):**
```json
{
  "message": "Collection retrieved successfully",
  "collection": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "My Social Media",
    "layout": "stack",
    "linkCount": 3,
    "links": [
      {
        "id": "link-id-1",
        "title": "Instagram",
        "url": "https://instagram.com/username",
        "displayOrder": 0
      }
    ]
  }
}
```

#### **PUT /collections/:id**
Update collection details. **[AUTH REQUIRED]**

**Request:**
```json
{
  "title": "Updated Collection Title",
  "description": "Updated description",
  "layout": "grid",
  "backgroundColor": "#f0f0f0"
}
```

#### **DELETE /collections/:id**
Delete a collection (moves links out of collection). **[AUTH REQUIRED]**

**Response (200):**
```json
{
  "message": "Collection deleted successfully"
}
```

#### **PUT /collections/reorder**
Reorder collections. **[AUTH REQUIRED]**

**Request:**
```json
{
  "collectionIds": ["collection-id-2", "collection-id-1", "collection-id-3"]
}
```

---

#### **🔗 Collection Link Management**

#### **POST /collections/:id/links**
Add links to a collection. **[AUTH REQUIRED]**

**Request:**
```json
{
  "linkIds": ["link-id-1", "link-id-2", "link-id-3"]
}
```

#### **DELETE /collections/:id/links**
Remove links from a collection. **[AUTH REQUIRED]**

**Request:**
```json
{
  "linkIds": ["link-id-1", "link-id-2"]
}
```

#### **PUT /collections/:id/links/reorder**
Reorder links within a collection. **[AUTH REQUIRED]**

**Request:**
```json
{
  "linkIds": ["link-id-3", "link-id-1", "link-id-2"]
}
```

---

#### **🎨 Collection Customization**

#### **PUT /collections/:id/layout**
Update collection display layout. **[AUTH REQUIRED]**

**Request:**
```json
{
  "layout": "grid"
}
```

#### **PUT /collections/:id/style**
Update collection styling. **[AUTH REQUIRED]**

**Request:**
```json
{
  "backgroundColor": "#ffffff",
  "textColor": "#000000",
  "borderRadius": "8px"
}
```

#### **PUT /collections/:id/settings**
Update collection display settings. **[AUTH REQUIRED]**

**Request:**
```json
{
  "showTitle": true,
  "showCount": false,
  "allowReorder": true
}
```

---

#### **📊 Collection Analytics**

#### **GET /collections/analytics**
Get collection analytics. **[AUTH REQUIRED]**

**Query Parameters:**
- `collectionId` (optional): Specific collection analytics

**Response (200):**
```json
{
  "message": "Collection analytics retrieved successfully",
  "analytics": {
    "collections": [
      {
        "id": "collection-id",
        "title": "My Social Media",
        "layout": "stack",
        "linkCount": 3,
        "totalClicks": 45,
        "isActive": true
      }
    ],
    "totalCollections": 1,
    "totalLinks": 3,
    "totalClicks": 45,
    "avgLinksPerCollection": 3.0
  }
}
```

#### **PUT /collections/:id/archive**
Archive a collection. **[AUTH REQUIRED]**

#### **PUT /collections/:id/restore**
Restore an archived collection. **[AUTH REQUIRED]**

#### **GET /collections/archived**
Get archived collections. **[AUTH REQUIRED]**

---

## 6. Database Schema

### 📊 **Tables**

#### **users**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique user identifier |
| `email` | VARCHAR | UNIQUE, NOT NULL | User's email address |
| `username` | VARCHAR | UNIQUE, NOT NULL | User's username |
| `password` | VARCHAR | NOT NULL | Hashed password |
| `first_name` | VARCHAR | NULLABLE | User's first name |
| `last_name` | VARCHAR | NULLABLE | User's last name |
| `category` | ENUM | NULLABLE | User category (business, creative, etc.) |
| `goal` | ENUM | NULLABLE | User goal (creator, business, personal) |
| `profile_title` | VARCHAR | NULLABLE | Profile title |
| `bio` | TEXT | NULLABLE | User bio |
| `profile_image_url` | VARCHAR | NULLABLE | Profile image URL |
| `has_completed_onboarding` | BOOLEAN | DEFAULT false | Onboarding completion status |
| `onboarding_step` | INTEGER | DEFAULT 1 | Current onboarding step |
| `is_email_verified` | BOOLEAN | DEFAULT false | Email verification status |
| `email_verified_at` | TIMESTAMP | NULLABLE | Email verification timestamp |
| `created_at` | TIMESTAMP | DEFAULT now() | Record creation time |
| `updated_at` | TIMESTAMP | DEFAULT now() | Last update time |

#### **email_verifications**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique verification identifier |
| `user_id` | UUID | FOREIGN KEY, NOT NULL | Reference to users.id |
| `token` | VARCHAR | UNIQUE, NOT NULL | Verification token |
| `expires_at` | TIMESTAMP | DEFAULT now() + 24h | Token expiry time |
| `is_used` | BOOLEAN | DEFAULT false | Token usage status |
| `created_at` | TIMESTAMP | DEFAULT now() | Record creation time |
| `updated_at` | TIMESTAMP | DEFAULT now() | Last update time |

#### **🆕 collections**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique collection identifier |
| `user_id` | UUID | FOREIGN KEY, NOT NULL | References users(id) |
| `title` | VARCHAR(100) | NOT NULL | Collection title |
| `description` | TEXT | NULLABLE | Collection description |
| `layout` | ENUM | DEFAULT 'stack' | Display layout: stack, grid, carousel |
| `is_active` | BOOLEAN | DEFAULT true | Collection visibility |
| `display_order` | INTEGER | DEFAULT 0 | Collection ordering |
| `status` | ENUM | DEFAULT 'active' | active, archived |
| `link_count` | INTEGER | DEFAULT 0 | Cached link count |
| `background_color` | VARCHAR | NULLABLE | Background color hex |
| `text_color` | VARCHAR | NULLABLE | Text color hex |
| `border_radius` | VARCHAR | NULLABLE | Border radius value |
| `show_title` | BOOLEAN | DEFAULT true | Show collection title |
| `show_count` | BOOLEAN | DEFAULT true | Show link count |
| `allow_reorder` | BOOLEAN | DEFAULT true | Allow link reordering |
| `archived_at` | TIMESTAMP | NULLABLE | Archive timestamp |
| `created_at` | TIMESTAMP | AUTO | Creation timestamp |
| `updated_at` | TIMESTAMP | AUTO | Last update timestamp |

#### **🔄 Updated: links**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique link identifier |
| `user_id` | UUID | NOT NULL, FK | Reference to users table |
| `collection_id` | UUID | NULLABLE, FK | Reference to collections table 🆕 |
| `title` | VARCHAR | NOT NULL | Display title for the link |
| `url` | VARCHAR | NOT NULL | Target URL |
| `type` | ENUM | DEFAULT 'regular' | Link type (regular, social, email, phone) |
| `layout` | ENUM | DEFAULT 'classic' | Display layout (classic, featured) |
| `thumbnail_url` | VARCHAR | NULLABLE | Custom thumbnail image |
| `is_active` | BOOLEAN | DEFAULT true | Link visibility status |
| `is_featured` | BOOLEAN | DEFAULT false | Featured link flag |
| `click_count` | INTEGER | DEFAULT 0 | Number of clicks |
| `display_order` | INTEGER | DEFAULT 0 | Sort order |
| `open_in_new_tab` | BOOLEAN | DEFAULT true | Link behavior setting |
| `last_clicked_at` | TIMESTAMP | NULLABLE | Last click timestamp |
| **🆕 SCHEDULING FIELDS** |
| `scheduled_start_at` | TIMESTAMP | NULLABLE | Link visibility start time |
| `scheduled_end_at` | TIMESTAMP | NULLABLE | Link visibility end time |
| `timezone` | VARCHAR | NULLABLE | Timezone for scheduling |
| **🆕 LOCKING FIELDS** |
| `is_locked` | BOOLEAN | DEFAULT false | Link access control status |
| `lock_type` | ENUM | NULLABLE | Lock type (code, subscription, age, sensitive, nft) |
| `lock_code` | VARCHAR | NULLABLE | Access code for locked links |
| `lock_description` | TEXT | NULLABLE | Lock description/instructions |
| **🆕 CUSTOMIZATION FIELDS** |
| `short_code` | VARCHAR | UNIQUE, NULLABLE | Custom short code for cley.me URLs |
| `custom_domain` | VARCHAR | NULLABLE | Custom domain for link |
| `shareable_short_url` | VARCHAR | NULLABLE | Generated short URL for sharing |
| `social_share_count` | INTEGER | DEFAULT 0 | Number of social shares |
| **🆕 MEDIA FIELDS** |
| `media_type` | ENUM | NULLABLE | Media type (video, music, image, document) |
| `preview_data` | JSONB | NULLABLE | Rich media preview data |
| **🆕 LIFECYCLE FIELDS** |
| `status` | ENUM | DEFAULT 'active' | Link status (active, archived, deleted) |
| `archived_at` | TIMESTAMP | NULLABLE | Archive timestamp |
| `created_at` | TIMESTAMP | DEFAULT now() | Record creation time |
| `updated_at` | TIMESTAMP | DEFAULT now() | Last update time |

#### **social_links**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique social link identifier |
| `user_id` | UUID | NOT NULL, FK | Reference to users table |
| `platform` | ENUM | NOT NULL | Social platform type |
| `username` | VARCHAR | NOT NULL | Platform username |
| `url` | VARCHAR | NOT NULL | Full profile URL |
| `is_active` | BOOLEAN | DEFAULT true | Link visibility status |
| `display_order` | INTEGER | DEFAULT 0 | Sort order |
| `icon_position` | ENUM | DEFAULT 'top' | Icon display position (top, bottom) |
| `click_count` | INTEGER | DEFAULT 0 | Number of clicks |
| `last_clicked_at` | TIMESTAMP | NULLABLE | Last click timestamp |
| **🆕 SCHEDULING FIELDS** (same as links) |
| `scheduled_start_at` | TIMESTAMP | NULLABLE | Link visibility start time |
| `scheduled_end_at` | TIMESTAMP | NULLABLE | Link visibility end time |
| `timezone` | VARCHAR | NULLABLE | Timezone for scheduling |
| **🆕 LOCKING FIELDS** (same as links) |
| `is_locked` | BOOLEAN | DEFAULT false | Link access control status |
| `lock_type` | ENUM | NULLABLE | Lock type (code, subscription, age, sensitive, nft) |
| `lock_code` | VARCHAR | NULLABLE | Access code for locked links |
| `lock_description` | TEXT | NULLABLE | Lock description/instructions |
| **🆕 CUSTOMIZATION FIELDS** (same as links) |
| `short_code` | VARCHAR | UNIQUE, NULLABLE | Custom short code for cley.me URLs |
| `custom_domain` | VARCHAR | NULLABLE | Custom domain for link |
| `shareable_short_url` | VARCHAR | NULLABLE | Generated short URL for sharing |
| `social_share_count` | INTEGER | DEFAULT 0 | Number of social shares |
| **🆕 MEDIA FIELDS** (same as links) |
| `media_type` | ENUM | NULLABLE | Media type (video, music, image, document) |
| `preview_data` | JSONB | NULLABLE | Rich media preview data |
| **🆕 LIFECYCLE FIELDS** (same as links) |
| `status` | ENUM | DEFAULT 'active' | Link status (active, archived, deleted) |
| `archived_at` | TIMESTAMP | NULLABLE | Archive timestamp |
| `created_at` | TIMESTAMP | DEFAULT now() | Record creation time |
| `updated_at` | TIMESTAMP | DEFAULT now() | Last update time |

### 🔗 **Relationships**
- `email_verifications.user_id` → `users.id` (Many-to-One)
- `links.user_id` → `users.id` (Many-to-One)
- `links.collection_id` → `collections.id` (Many-to-One) 🆕
- `social_links.user_id` → `users.id` (Many-to-One)
- `collections.user_id` → `users.id` (Many-to-One) 🆕

### 📝 **Enums**

#### **🆕 CollectionLayout**
```sql
'stack' | 'grid' | 'carousel'
```

#### **🆕 CollectionStatus**
```sql
'active' | 'archived'
```

#### **LinkType**
```sql
'regular' | 'social' | 'email' | 'phone'
```

#### **LinkLayout**
```sql
'classic' | 'featured'
```

#### **SocialPlatform**
```sql
'instagram' | 'youtube' | 'tiktok' | 'twitter' | 'facebook' | 
'linkedin' | 'pinterest' | 'snapchat' | 'spotify' | 'apple_music' | 
'soundcloud' | 'twitch' | 'threads' | 'whatsapp' | 'email'
```

#### **SocialIconPosition**
```sql
'top' | 'bottom'
```

#### **🆕 LinkStatus**
```sql
'active' | 'archived' | 'deleted'
```

#### **🆕 LinkLockType**
```sql
'subscription' | 'code' | 'age' | 'sensitive' | 'nft'
```

#### **🆕 MediaType**
```sql
'video' | 'music' | 'image' | 'document'
```

---

## 7. Error Handling

### 📋 **Standard Error Format**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 🚨 **Common HTTP Status Codes**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

### 🛡️ **Validation Errors**
```json
{
  "statusCode": 400,
  "message": [
    "email must be a valid email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

---

## 8. Development Workflow

### 🔧 **Available Scripts**
```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debugging

# Production
npm run build              # Build for production
npm run start:prod         # Start production server

# Database
npm run migration:generate # Generate new migration
npm run migration:run      # Run pending migrations
npm run migration:revert   # Revert last migration

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format with Prettier
npm run test               # Run unit tests
npm run test:e2e           # Run end-to-end tests
```

### 📝 **Adding New Features**
1. Follow the module structure in `/src/modules/`
2. Extend `BaseEntity` for entities
3. Extend `BaseService` for services
4. Use proper DTOs with validation
5. Add JWT guards for protected endpoints
6. Write tests for new functionality

### 🏗️ **Architecture Guidelines**
- **Modules** - Group related functionality
- **Services** - Business logic layer
- **Controllers** - HTTP request handling
- **DTOs** - Data validation and transformation
- **Entities** - Database models
- **Guards** - Authentication and authorization

---

## 🎯 **Next Steps**

### Planned Features
1. **Link Management** - Core Linktree functionality
2. **Platform Integration** - Social media connections
3. **AI Bio Generation** - Smart bio suggestions
4. **Analytics** - User engagement tracking
5. **Payment Integration** - Monetization features

### Development Priorities
1. Complete onboarding flow implementation
2. Add comprehensive testing
3. Implement proper logging
4. Add API rate limiting
5. Set up CI/CD pipeline

---

## 📞 **Support**

For questions or issues:
- Check the [Developer Workflow](./DEVELOPER_WORKFLOW.md)
- Review error logs in the console
- Ensure database is running: `docker-compose ps`
- Verify environment variables are set correctly

---

**Built with ❤️ by the Cleyverse Team**

---

## 📋 **Recent Updates & Changelog**

### **🎉 v2.2.0 - Collections System (Latest)**

#### **✅ IMPLEMENTED:**
- **🗂️ Collections System** - Group and organize links with custom layouts
- **📱 Display Layouts** - Stack, Grid, Carousel display options
- **🎨 Collection Styling** - Custom colors, borders, and visual settings
- **🔗 Drag & Drop** - Add/remove links to/from collections
- **📊 Collection Analytics** - Track clicks and performance per collection
- **🎯 Collection Settings** - Show/hide titles, counts, reorder permissions
- **📦 Archive/Restore** - Archive collections without losing data
- **🔄 Smart Reordering** - Organize collections and links within collections

#### **🎯 KEY FEATURES:**
```json
// Collection with links
{
  "id": "collection-id",
  "title": "My Social Media",
  "layout": "stack",
  "linkCount": 3,
  "isActive": true,
  "backgroundColor": "#ffffff",
  "showTitle": true,
  "allowReorder": true,
  "links": [
    {
      "id": "link-id",
      "title": "Instagram", 
      "url": "https://instagram.com/username",
      "collectionId": "collection-id"
    }
  ]
}
```

### **🎉 v2.1.0 - Smart Media Detection**

#### **✅ IMPLEMENTED:**
- **🎵 Smart Music Detection** - Auto-detect Spotify, Apple Music, YouTube Music, SoundCloud
- **📹 Video URL Processing** - YouTube, Vimeo, TikTok, Instagram video support
- **🔍 URL Preview API** - `POST /links/preview` for frontend metadata
- **🎨 Rich Metadata Storage** - JSONB storage for flexible media data
- **🚀 Auto-Enhancement** - Links automatically get thumbnails, titles, duration
- **🔄 Streaming Service Cross-Reference** - Find same content across platforms
- **📊 Enhanced Link Analytics** - Media-specific tracking and insights

#### **🎯 KEY FEATURES:**
```json
// Smart detection results
{
  "type": "music",
  "platform": "spotify", 
  "title": "Track Name - Artist",
  "thumbnailUrl": "https://...",
  "streamingServices": [
    {"platform": "spotify", "available": true},
    {"platform": "apple_music", "available": false}
  ]
}
```

#### **📋 PLANNED NEXT:**
- **📝 Contact Forms** - Custom form builder with submissions
- **🎬 Video Embed Controls** - Autoplay, mute, playback options
- **🎵 Music Player Integration** - In-app streaming previews
- **📊 Advanced Analytics** - Platform-specific insights

---

**🚀 Ready for Production** - The API now supports world-class media detection and processing!
