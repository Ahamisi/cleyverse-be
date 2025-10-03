# 🚀 Cleyverse API Quick Reference

## 🌐 Base URL: `http://localhost:3000`

---

## 🔓 **Public Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | Login and get JWT token |
| `POST` | `/users/register` | Register new user |
| `GET` | `/users/verify-email?token=xxx` | Verify email address |
| `POST` | `/users/resend-verification` | Resend verification email |
| `POST` | `/users/check-username` | Check username availability |
| `GET` | `/users/categories` | Get all categories |
| `GET` | `/users/goals` | Get all goals |

---

## 🔒 **Protected Endpoints** 
*Require: `Authorization: Bearer JWT_TOKEN`*

| Method | Endpoint | Description | Onboarding Step |
|--------|----------|-------------|-----------------|
| `PUT` | `/users/personal-info` | Update name & category | Step 1 |
| `PUT` | `/users/username` | Update username | Step 2 |
| `PUT` | `/users/goal` | Set user goal | Step 3 |
| `PUT` | `/users/profile` | Update profile details | Step 4 |
| `POST` | `/users/complete-onboarding` | Complete onboarding | Step 5 |
| `GET` | `/users/onboarding-status` | Get current status | - |
| `GET` | `/users/profile` | Get user profile | - |

---

## 📋 **Complete Onboarding Flow**

### 1. **Registration**
```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "username": "username", "password": "password123"}'
```

### 2. **Email Verification**
```bash
# Check email for verification link, then:
curl "http://localhost:3000/users/verify-email?token=VERIFICATION_TOKEN"
```

### 3. **Login**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```
**Save the `access_token` from response!**

### 4. **Personal Info (Step 1)**
```bash
curl -X PUT http://localhost:3000/users/personal-info \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"firstName": "John", "lastName": "Doe", "category": "tech"}'
```

### 5. **Username (Step 2)**
```bash
curl -X PUT http://localhost:3000/users/username \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"username": "john_doe_tech"}'
```

### 6. **Goal (Step 3)**
```bash
curl -X PUT http://localhost:3000/users/goal \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"goal": "creator"}'
```

### 7. **Profile (Step 4)**
```bash
curl -X PUT http://localhost:3000/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"profileTitle": "Tech Creator", "bio": "Building amazing apps", "profileImageUrl": "https://example.com/avatar.jpg"}'
```

### 8. **Complete Onboarding**
```bash
curl -X POST http://localhost:3000/users/complete-onboarding \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{}'
```

---

## 📊 **User Categories**
- `business` - Business
- `creative` - Creative  
- `education` - Education
- `entertainment` - Entertainment
- `fashion_beauty` - Fashion & Beauty
- `food_beverage` - Food & Beverage
- `government_politics` - Government & Politics
- `health_wellness` - Health & Wellness
- `non_profit` - Non-Profit
- `other` - Other
- `tech` - Tech
- `travel_tourism` - Travel & Tourism

## 🎯 **User Goals**
- `creator` - Build following and monetize audience
- `business` - Grow business and reach customers
- `personal` - Share links with friends

---

## 🚨 **Common Errors**

| Status | Error | Solution |
|--------|-------|----------|
| `400` | Email/username exists | Use different email/username |
| `400` | Invalid credentials | Check email/password |
| `400` | Username taken | Choose different username |
| `400` | Email not verified | Verify email first |
| `401` | Unauthorized | Include valid JWT token |
| `404` | User not found | Check user exists |

---

## 🛠️ **Development Setup**

```bash
# 1. Start database
docker-compose up -d

# 2. Install dependencies
cd api && npm install

# 3. Start server
npm run start:dev

# 4. Test
curl http://localhost:3000
# Expected: "Hello World!"
```

---

## 📁 **Project Structure**
```
api/src/
├── modules/
│   ├── auth/          # Authentication
│   └── users/         # User management
├── common/            # Shared utilities
├── shared/            # Cross-module services
└── app.module.ts      # Root module
```

## 🔗 **LINKS API ENDPOINTS**

### **Regular Links**
```bash
POST   /links                 # Create link (AUTH)
GET    /links                 # Get user links (AUTH)
GET    /links/featured        # Get featured links (AUTH) 
GET    /links/analytics       # Get analytics (AUTH)
PUT    /links/:id             # Update link (AUTH)
DELETE /links/:id             # Delete link (AUTH)
PUT    /links/reorder         # Reorder links (AUTH)
POST   /links/:id/click       # Record click (PUBLIC)
```

### **Social Links**
```bash
POST   /social-links                    # Add social link (AUTH)
GET    /social-links                    # Get social links (AUTH)
GET    /social-links/platforms          # Get platforms (AUTH)
GET    /social-links/analytics          # Get analytics (AUTH)
GET    /social-links/platform/:platform # Get by platform (AUTH)
PUT    /social-links/:id                # Update social link (AUTH)
DELETE /social-links/:id                # Delete social link (AUTH)
PUT    /social-links/icon-settings      # Update icon settings (AUTH)
PUT    /social-links/reorder            # Reorder social links (AUTH)
POST   /social-links/:id/click          # Record click (PUBLIC)
```

### **Quick Examples**

**Create Link:**
```bash
POST /links
{
  "title": "Meet with me!",
  "url": "https://calendly.com/username",
  "layout": "featured"
}
```

**Add Instagram:**
```bash
POST /social-links
{
  "platform": "instagram",
  "username": "johndoe", 
  "url": "https://www.instagram.com/johndoe"
}
```

**Supported Platforms:** Instagram, YouTube, TikTok, Twitter, Facebook, LinkedIn, Pinterest, Snapchat, Spotify, Apple Music, SoundCloud, Twitch, Threads, WhatsApp, Email

---

## 🚀 **Advanced Link Features**

### **🔒 Link Locking**
```bash
# Lock with code
PUT /links/:id/lock
{
  "isLocked": true,
  "lockType": "code",
  "lockCode": "1234",
  "lockDescription": "Requires 4-digit code"
}

# Unlock (PUBLIC - no auth!)
POST /links/:id/unlock
{ "code": "1234" }
```

### **⏰ Link Scheduling**
```bash
# Schedule visibility
PUT /links/:id/schedule
{
  "scheduledStartAt": "2025-10-01T10:00:00Z",
  "scheduledEndAt": "2025-10-01T18:00:00Z",
  "timezone": "America/New_York"
}
```

### **📁 Archive & Restore**
```bash
# Archive (soft delete)
PUT /links/:id/archive

# Restore
PUT /links/:id/restore

# Get archived
GET /links/archived
```

### **🔗 Custom Sharing**
```bash
# Generate short URL
POST /links/:id/share
{ "platform": "instagram" }
# Returns: { "shareUrl": "cley.me/abc123" }

# Custom short codes
PUT /links/:id/customize
{ "shortCode": "my-link" }
```

### **🎵 Media Support**
```bash
# Add media metadata
PUT /links/:id/media
{
  "mediaType": "video",
  "thumbnailUrl": "https://example.com/thumb.jpg",
  "previewData": {
    "duration": "5:30",
    "title": "Amazing Video"
  }
}
```

**Lock Types:** `code`, `subscription`, `age`, `sensitive`, `nft`  
**Media Types:** `video`, `music`, `image`, `document`  
**Link Status:** `active`, `archived`, `deleted`

---

**🎯 World-class creator economy platform - Ready to scale!**
