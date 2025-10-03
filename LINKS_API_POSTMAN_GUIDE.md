# 🔗 Cleyverse Links API - Postman Collection Guide

## 📋 **Overview**
Complete guide for testing the **Link Management System** in Postman. This covers both regular links and social media links with all CRUD operations, analytics, and click tracking.

---

## 🔐 **Authentication Setup**

### **Environment Variables**
Create these variables in your Postman environment:

```bash
BASE_URL = http://localhost:3000
AUTH_TOKEN = {{your_jwt_token}}  # Get from /auth/login
USER_ID = {{user_id}}           # Your user ID
LINK_ID = {{link_id}}           # Sample link ID
SOCIAL_LINK_ID = {{social_link_id}}  # Sample social link ID
```

### **Get JWT Token First**
```bash
POST {{BASE_URL}}/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

---

## 🔗 **REGULAR LINKS API**

### **1. Create Link**
```bash
POST {{BASE_URL}}/links
Authorization: Bearer {{AUTH_TOKEN}}
Content-Type: application/json

{
  "title": "Meet with me!",
  "url": "https://calendly.com/username",
  "layout": "featured",
  "isFeatured": true,
  "openInNewTab": true,
  "displayOrder": 1
}
```

**Expected Response:**
```json
{
  "message": "Link created successfully",
  "link": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "user-id",
    "title": "Meet with me!",
    "url": "https://calendly.com/username",
    "type": "regular",
    "layout": "featured",
    "isActive": true,
    "isFeatured": true,
    "clickCount": 0,
    "displayOrder": 1
  }
}
```

### **2. Get All Links**
```bash
GET {{BASE_URL}}/links
Authorization: Bearer {{AUTH_TOKEN}}

# Optional Query Parameters:
# ?includeInactive=true
# ?type=regular
```

### **3. Get Featured Links Only**
```bash
GET {{BASE_URL}}/links/featured
Authorization: Bearer {{AUTH_TOKEN}}
```

### **4. Get Link Analytics**
```bash
GET {{BASE_URL}}/links/analytics
Authorization: Bearer {{AUTH_TOKEN}}

# For specific link:
# ?linkId=550e8400-e29b-41d4-a716-446655440000
```

### **5. Update Link**
```bash
PUT {{BASE_URL}}/links/{{LINK_ID}}
Authorization: Bearer {{AUTH_TOKEN}}
Content-Type: application/json

{
  "title": "Updated Title",
  "layout": "classic",
  "isFeatured": false,
  "isActive": true
}
```

### **6. Delete Link**
```bash
DELETE {{BASE_URL}}/links/{{LINK_ID}}
Authorization: Bearer {{AUTH_TOKEN}}
```

### **7. Reorder Links**
```bash
PUT {{BASE_URL}}/links/reorder
Authorization: Bearer {{AUTH_TOKEN}}
Content-Type: application/json

{
  "linkIds": [
    "link-id-3",
    "link-id-1",
    "link-id-2"
  ]
}
```

### **8. Record Click (Public Endpoint)**
```bash
POST {{BASE_URL}}/links/{{LINK_ID}}/click
# No Authorization Required
```

---

## 📱 **SOCIAL LINKS API**

### **1. Get Supported Platforms**
```bash
GET {{BASE_URL}}/social-links/platforms
Authorization: Bearer {{AUTH_TOKEN}}
```

**Response:**
```json
{
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
    }
    // ... 13 more platforms
  ]
}
```

### **2. Add Instagram Link**
```bash
POST {{BASE_URL}}/social-links
Authorization: Bearer {{AUTH_TOKEN}}
Content-Type: application/json

{
  "platform": "instagram",
  "username": "johndoe",
  "url": "https://www.instagram.com/johndoe",
  "iconPosition": "top"
}
```

### **3. Add YouTube Link**
```bash
POST {{BASE_URL}}/social-links
Authorization: Bearer {{AUTH_TOKEN}}
Content-Type: application/json

{
  "platform": "youtube",
  "username": "johndoe",
  "url": "https://www.youtube.com/@johndoe"
}
```

### **4. Add TikTok Link**
```bash
POST {{BASE_URL}}/social-links
Authorization: Bearer {{AUTH_TOKEN}}
Content-Type: application/json

{
  "platform": "tiktok",
  "username": "johndoe",
  "url": "https://www.tiktok.com/@johndoe"
}
```

### **5. Get All Social Links**
```bash
GET {{BASE_URL}}/social-links
Authorization: Bearer {{AUTH_TOKEN}}

# Optional: ?includeInactive=true
```

### **6. Get Social Link by Platform**
```bash
GET {{BASE_URL}}/social-links/platform/instagram
Authorization: Bearer {{AUTH_TOKEN}}
```

### **7. Update Social Link**
```bash
PUT {{BASE_URL}}/social-links/{{SOCIAL_LINK_ID}}
Authorization: Bearer {{AUTH_TOKEN}}
Content-Type: application/json

{
  "username": "newusername",
  "url": "https://www.instagram.com/newusername",
  "isActive": true
}
```

### **8. Update Icon Settings (Global)**
```bash
PUT {{BASE_URL}}/social-links/icon-settings
Authorization: Bearer {{AUTH_TOKEN}}
Content-Type: application/json

{
  "iconPosition": "bottom",
  "activePlatforms": [
    "social-link-id-1", 
    "social-link-id-2"
  ]
}
```

### **9. Get Social Analytics**
```bash
GET {{BASE_URL}}/social-links/analytics
Authorization: Bearer {{AUTH_TOKEN}}
```

**Response:**
```json
{
  "analytics": {
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

### **10. Reorder Social Links**
```bash
PUT {{BASE_URL}}/social-links/reorder
Authorization: Bearer {{AUTH_TOKEN}}
Content-Type: application/json

{
  "linkIds": [
    "social-link-id-3",
    "social-link-id-1", 
    "social-link-id-2"
  ]
}
```

### **11. Delete Social Link**
```bash
DELETE {{BASE_URL}}/social-links/{{SOCIAL_LINK_ID}}
Authorization: Bearer {{AUTH_TOKEN}}
```

### **12. Record Social Click (Public)**
```bash
POST {{BASE_URL}}/social-links/{{SOCIAL_LINK_ID}}/click
# No Authorization Required
```

---

## 🎯 **TESTING SCENARIOS**

### **Scenario 1: Complete Link Setup**
1. **Login** → Get JWT token
2. **Create regular link** → Calendly booking
3. **Create featured link** → Portfolio website
4. **Add Instagram** → Social link
5. **Add YouTube** → Social link
6. **Reorder links** → Change display order
7. **Get analytics** → Check click data

### **Scenario 2: Social Media Setup**
1. **Get platforms** → See all available options
2. **Add Instagram** → @username
3. **Add TikTok** → @username  
4. **Add YouTube** → @username
5. **Update icon position** → Move to bottom
6. **Test analytics** → View performance

### **Scenario 3: Link Management**
1. **Get all links** → View current setup
2. **Update link** → Change title/URL
3. **Toggle featured** → Make/remove featured
4. **Reorder** → Change sequence
5. **Test clicks** → Record interactions
6. **View analytics** → Performance insights

---

## 📊 **SUPPORTED SOCIAL PLATFORMS**

| Platform | Value | URL Pattern |
|----------|-------|-------------|
| Instagram | `instagram` | `https://www.instagram.com/{username}` |
| YouTube | `youtube` | `https://www.youtube.com/@{username}` |
| TikTok | `tiktok` | `https://www.tiktok.com/@{username}` |
| Twitter/X | `twitter` | `https://twitter.com/{username}` |
| Facebook | `facebook` | `https://facebook.com/{username}` |
| LinkedIn | `linkedin` | `https://linkedin.com/in/{username}` |
| Pinterest | `pinterest` | `https://pinterest.com/{username}` |
| Snapchat | `snapchat` | `https://snapchat.com/add/{username}` |
| Spotify | `spotify` | `https://open.spotify.com/user/{username}` |
| Apple Music | `apple_music` | Custom URL |
| SoundCloud | `soundcloud` | `https://soundcloud.com/{username}` |
| Twitch | `twitch` | `https://twitch.tv/{username}` |
| Threads | `threads` | `https://threads.net/@{username}` |
| WhatsApp | `whatsapp` | Custom URL |
| Email | `email` | `mailto:{email}` |

---

## ⚡ **QUICK TIPS**

### **Authentication**
- All management endpoints require JWT token
- Click tracking endpoints are public (no auth)
- Use `Authorization: Bearer {token}` header

### **Link Types**
- `regular` - Custom links (Calendly, websites, etc.)
- `social` - Handled by social-links endpoints
- `email` - Email links (mailto:)
- `phone` - Phone links (tel:)

### **Layouts**
- `classic` - Standard button style
- `featured` - Large, eye-catching display

### **Error Handling**
- `400` - Validation errors (check request format)
- `401` - Invalid/missing JWT token
- `404` - Link not found or doesn't belong to user
- `409` - Duplicate platform/URL conflict

### **Best Practices**
1. Always test with valid JWT token
2. Use UUIDs for link IDs in URLs
3. Check response messages for success confirmation
4. Handle duplicate platform errors for social links
5. Test both active and inactive link filtering

---

## 🚀 **NEXT STEPS**

After testing the API:
1. **Test Public Profile** - Build `cley.me/{username}` pages
2. **Add File Uploads** - For link thumbnails
3. **Enhanced Analytics** - Detailed click tracking
4. **Link Collections** - Organize links into groups
5. **Custom Domains** - Branded short links

---

**Ready to build the next big thing in creator tools!** 🎯
