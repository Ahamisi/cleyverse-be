# 🏪 Store Onboarding API Documentation

## Overview

The Store Onboarding system provides an **optional** guided, step-by-step process for users to set up their stores on Cleyverse. This system helps users understand what they're getting into and properly configure their store, but users can skip onboarding and create stores directly.

## 🎯 Onboarding Flow

The onboarding process consists of 5 main steps:

1. **Welcome** - Initial onboarding start
2. **Business Type** - Determine if user is new or experienced
3. **Sales Channels** - Choose where to sell (online, social, in-person, etc.)
4. **Product Types** - Select what type of products to sell
5. **Store Setup** - Configure store details (optional store creation)

## 📋 Base URL

```
http://localhost:3000/stores/onboarding
```

## 🔐 Authentication

All endpoints require JWT authentication via the `Authorization` header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🚀 API Endpoints

### **1. Start Onboarding**

**Endpoint:** `POST /stores/onboarding/start`  
**Auth:** Required  
**Description:** Initialize a new store onboarding session

**Request Body:**
```json
{}
```

**Response:**
```json
{
  "message": "Store onboarding started successfully",
  "onboarding": {
    "id": "uuid",
    "currentStep": "welcome",
    "isCompleted": false,
    "createdAt": "2025-01-13T04:00:00.000Z"
  }
}
```

---

### **2. Get Onboarding Status**

**Endpoint:** `GET /stores/onboarding/status`  
**Auth:** Required  
**Description:** Get current onboarding progress and data

**Response:**
```json
{
  "id": "uuid",
  "currentStep": "business_type",
  "businessType": "just_starting",
  "salesChannels": ["online_store", "social_media"],
  "productTypes": ["physical_products"],
  "storeName": "My Awesome Store",
  "storeUrl": "my-awesome-store",
  "storeDescription": "The best store ever",
  "currency": "USD",
  "logoUrl": "https://example.com/logo.png",
  "bannerUrl": "https://example.com/banner.jpg",
  "isCompleted": false,
  "nextSteps": ["sales_channels", "product_types", "store_setup"],
  "createdAt": "2025-01-13T04:00:00.000Z",
  "updatedAt": "2025-01-13T04:05:00.000Z"
}
```

---

### **3. Update Business Type**

**Endpoint:** `PUT /stores/onboarding/business-type`  
**Auth:** Required  
**Description:** Set the user's business experience level

**Request Body:**
```json
{
  "businessType": "just_starting"
}
```

**Available Options:**
- `just_starting` - "I'm just starting"
- `already_selling` - "I'm already selling online or in person"

**Response:**
```json
{
  "message": "Business type updated successfully",
  "onboarding": {
    "id": "uuid",
    "currentStep": "sales_channels",
    "businessType": "just_starting"
  }
}
```

---

### **4. Update Sales Channels**

**Endpoint:** `PUT /stores/onboarding/sales-channels`  
**Auth:** Required  
**Description:** Select where the user wants to sell

**Request Body:**
```json
{
  "salesChannels": ["online_store", "social_media", "in_person"]
}
```

**Available Options:**
- `online_store` - "An online store"
- `social_media` - "Social media"
- `in_person` - "In person"
- `marketplaces` - "Online marketplaces"
- `existing_website` - "An existing website or blog"
- `not_sure` - "I'm not sure"

**Response:**
```json
{
  "message": "Sales channels updated successfully",
  "onboarding": {
    "id": "uuid",
    "currentStep": "product_type",
    "salesChannels": ["online_store", "social_media", "in_person"]
  }
}
```

---

### **5. Update Product Types**

**Endpoint:** `PUT /stores/onboarding/product-types`  
**Auth:** Required  
**Description:** Select what type of products to sell

**Request Body:**
```json
{
  "productTypes": ["physical_products", "digital_products"]
}
```

**Available Options:**
- `physical_products` - "Products I buy or make myself"
- `digital_products` - "Digital products"
- `services` - "Services"
- `dropshipping` - "Dropshipping products"
- `print_on_demand` - "Print-on-demand products"
- `decide_later` - "I'll decide later"

**Response:**
```json
{
  "message": "Product types updated successfully",
  "onboarding": {
    "id": "uuid",
    "currentStep": "store_setup",
    "productTypes": ["physical_products", "digital_products"]
  }
}
```

---

### **6. Update Store Setup**

**Endpoint:** `PUT /stores/onboarding/store-setup`  
**Auth:** Required  
**Description:** Configure store details (without creating the store yet)

**Request Body:**
```json
{
  "storeName": "TheAceman Merch Store",
  "storeUrl": "theaceman-merch",
  "storeDescription": "Official merchandise and cool stuff from TheAceman",
  "currency": "USD",
  "logoUrl": "https://example.com/logo.png",
  "bannerUrl": "https://example.com/banner.jpg"
}
```

**Validation Rules:**
- `storeName`: 2-100 characters
- `storeUrl`: 3-50 characters, lowercase letters, numbers, and hyphens only
- `storeDescription`: Max 500 characters (optional)
- `currency`: Must be valid currency code (optional, defaults to USD)
- `logoUrl`: Valid URL (optional)
- `bannerUrl`: Valid URL (optional)

**Response:**
```json
{
  "message": "Store setup updated successfully",
  "onboarding": {
    "id": "uuid",
    "currentStep": "store_setup",
    "storeName": "TheAceman Merch Store",
    "storeUrl": "theaceman-merch",
    "storeDescription": "Official merchandise and cool stuff from TheAceman",
    "currency": "USD",
    "logoUrl": "https://example.com/logo.png",
    "bannerUrl": "https://example.com/banner.jpg"
  }
}
```

---

### **7. Complete Onboarding**

**Endpoint:** `POST /stores/onboarding/complete`  
**Auth:** Required  
**Description:** Complete onboarding and create the actual store

**Request Body:**
```json
{
  "storeName": "TheAceman Merch Store",
  "storeUrl": "theaceman-merch",
  "storeDescription": "Official merchandise and cool stuff from TheAceman",
  "currency": "USD",
  "logoUrl": "https://example.com/logo.png",
  "bannerUrl": "https://example.com/banner.jpg"
}
```

**Response:**
```json
{
  "message": "Store onboarding completed successfully! Your store has been created.",
  "onboarding": {
    "id": "uuid",
    "currentStep": "completed",
    "isCompleted": true
  },
  "store": {
    "id": "uuid",
    "name": "TheAceman Merch Store",
    "storeUrl": "theaceman-merch",
    "status": "draft",
    "createdAt": "2025-01-13T04:10:00.000Z"
  }
}
```

---

### **8. Complete Onboarding Without Store**

**Endpoint:** `POST /stores/onboarding/complete-without-store`  
**Auth:** Required  
**Description:** Complete onboarding without creating a store (save preferences for later)

**Request Body:**
```json
{
  "storeName": "TheAceman Merch Store",
  "storeUrl": "theaceman-merch",
  "storeDescription": "Official merchandise and cool stuff from TheAceman",
  "currency": "USD",
  "logoUrl": "https://example.com/logo.png",
  "bannerUrl": "https://example.com/banner.jpg"
}
```

**Response:**
```json
{
  "message": "Store onboarding completed successfully! You can now create your store when ready.",
  "onboarding": {
    "id": "uuid",
    "currentStep": "completed",
    "isCompleted": true
  }
}
```

---

### **9. Reset Onboarding**

**Endpoint:** `PUT /stores/onboarding/reset`  
**Auth:** Required  
**Description:** Reset onboarding progress and start over

**Response:**
```json
{
  "message": "Store onboarding reset successfully",
  "onboarding": {
    "id": "uuid",
    "currentStep": "welcome",
    "isCompleted": false
  }
}
```

---

### **10. Delete Onboarding**

**Endpoint:** `DELETE /stores/onboarding`  
**Auth:** Required  
**Description:** Delete the onboarding session entirely

**Response:**
```json
{
  "message": "Store onboarding deleted successfully"
}
```

---

## 📊 Public Options Endpoints

These endpoints provide available options for the frontend without requiring authentication.

### **Get Business Types**

**Endpoint:** `GET /stores/onboarding/options/business-types`  
**Auth:** Not Required  
**Description:** Get available business type options

**Response:**
```json
{
  "message": "Business types retrieved successfully",
  "businessTypes": [
    {
      "value": "just_starting",
      "label": "I'm just starting",
      "description": "I'm new to selling and need help getting started"
    },
    {
      "value": "already_selling",
      "label": "I'm already selling online or in person",
      "description": "I already have experience selling products or services"
    }
  ]
}
```

### **Get Sales Channels**

**Endpoint:** `GET /stores/onboarding/options/sales-channels`  
**Auth:** Not Required  
**Description:** Get available sales channel options

**Response:**
```json
{
  "message": "Sales channels retrieved successfully",
  "salesChannels": [
    {
      "value": "online_store",
      "label": "An online store",
      "description": "Create a fully customizable website",
      "icon": "store"
    },
    {
      "value": "social_media",
      "label": "Social media",
      "description": "Reach customers on Facebook, Instagram, TikTok, and more",
      "icon": "share"
    },
    {
      "value": "in_person",
      "label": "In person",
      "description": "Sell at retail stores, pop-ups, or other physical locations",
      "icon": "location"
    },
    {
      "value": "marketplaces",
      "label": "Online marketplaces",
      "description": "List products on Google, Amazon, and more",
      "icon": "shopping-bag"
    },
    {
      "value": "existing_website",
      "label": "An existing website or blog",
      "description": "Add a Buy Button to your website",
      "icon": "globe"
    },
    {
      "value": "not_sure",
      "label": "I'm not sure",
      "description": "We'll help you figure it out",
      "icon": "help-circle"
    }
  ]
}
```

### **Get Product Types**

**Endpoint:** `GET /stores/onboarding/options/product-types`  
**Auth:** Not Required  
**Description:** Get available product type options

**Response:**
```json
{
  "message": "Product types retrieved successfully",
  "productTypes": [
    {
      "value": "physical_products",
      "label": "Products I buy or make myself",
      "description": "Shipped by me",
      "icon": "package"
    },
    {
      "value": "digital_products",
      "label": "Digital products",
      "description": "Music, digital art, NFTs",
      "icon": "file"
    },
    {
      "value": "services",
      "label": "Services",
      "description": "Coaching, housekeeping, consulting",
      "icon": "users"
    },
    {
      "value": "dropshipping",
      "label": "Dropshipping products",
      "description": "Sourced and shipped by a third party",
      "icon": "truck"
    },
    {
      "value": "print_on_demand",
      "label": "Print-on-demand products",
      "description": "My designs, printed and shipped by a third party",
      "icon": "shirt"
    },
    {
      "value": "decide_later",
      "label": "I'll decide later",
      "description": "I'll figure it out as I go",
      "icon": "clock"
    }
  ]
}
```

---

## 🔄 Integration with Store Creation

### **Optional Onboarding**

Store onboarding is **completely optional**. Users can:

1. **Skip onboarding entirely** and create stores directly using `POST /stores`
2. **Complete onboarding** and then create stores (onboarding data will be included in the response)
3. **Complete onboarding without creating a store** and create stores later

### **Check Onboarding Status**

Use `GET /stores/onboarding/status` to check if a user has onboarding data:

**Response (with onboarding):**
```json
{
  "message": "Onboarding status retrieved successfully",
  "onboarding": {
    "id": "uuid",
    "currentStep": "completed",
    "isCompleted": true,
    "businessType": "just_starting",
    "salesChannels": ["online_store", "social_media"],
    "productTypes": ["physical_products"]
  },
  "hasOnboarding": true
}
```

**Response (no onboarding):**
```json
{
  "message": "No onboarding session found",
  "onboarding": null,
  "hasOnboarding": false,
  "canStartOnboarding": true
}
```

### **Store Creation with Onboarding Data**

When creating a store, if the user has completed onboarding, the response will include their onboarding preferences:

```json
{
  "message": "Store created successfully",
  "store": {
    "id": "uuid",
    "name": "My Store",
    "storeUrl": "my-store",
    "status": "draft"
  },
  "onboardingData": {
    "businessType": "just_starting",
    "salesChannels": ["online_store", "social_media"],
    "productTypes": ["physical_products"]
  }
}
```

---

## 🎨 Frontend Integration Guide

### **Step-by-Step Flow**

1. **Welcome Screen**
   - Call `POST /store-onboarding/start` to initialize
   - Show welcome message and "Get Started" button

2. **Business Type Selection**
   - Call `GET /store-onboarding/options/business-types` for options
   - Call `PUT /store-onboarding/business-type` when user selects

3. **Sales Channels Selection**
   - Call `GET /store-onboarding/options/sales-channels` for options
   - Allow multiple selection
   - Call `PUT /store-onboarding/sales-channels` when user confirms

4. **Product Types Selection**
   - Call `GET /store-onboarding/options/product-types` for options
   - Allow multiple selection
   - Call `PUT /store-onboarding/product-types` when user confirms

5. **Store Setup Form**
   - Show form with store name, URL, description, etc.
   - Validate store URL availability
   - Call `PUT /store-onboarding/store-setup` to save progress

6. **Complete Onboarding**
   - Show summary of all selections
   - Call `POST /store-onboarding/complete` to create the store
   - Redirect to store dashboard

### **Progress Tracking**

Use `GET /store-onboarding/status` to:
- Check current step
- Show progress indicator
- Resume incomplete onboarding
- Display next steps

### **Error Handling**

- **400 Bad Request**: Validation errors, missing required fields
- **401 Unauthorized**: Invalid or missing JWT token
- **404 Not Found**: No onboarding session found
- **409 Conflict**: Store URL already taken

---

## 🚀 Quick Start Example

```javascript
// 1. Start onboarding
const startResponse = await fetch('/stores/onboarding/start', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({})
});

// 2. Set business type
await fetch('/stores/onboarding/business-type', {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    businessType: 'just_starting'
  })
});

// 3. Set sales channels
await fetch('/stores/onboarding/sales-channels', {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    salesChannels: ['online_store', 'social_media']
  })
});

// 4. Set product types
await fetch('/stores/onboarding/product-types', {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    productTypes: ['physical_products']
  })
});

// 5. Complete onboarding and create store
const completeResponse = await fetch('/stores/onboarding/complete', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    storeName: 'My Awesome Store',
    storeUrl: 'my-awesome-store',
    storeDescription: 'The best store ever',
    currency: 'USD'
  })
});

const result = await completeResponse.json();
console.log('Store created:', result.store);
```

---

## 📝 Notes

- Users can only have one active onboarding session at a time
- Onboarding data is automatically saved at each step
- Users can reset or delete their onboarding session at any time
- Store creation works with or without onboarding (onboarding is optional)
- All onboarding data is preserved even after store creation for future reference
- The system provides helpful descriptions and icons for all options to guide users

---

**Total Endpoints: 13**  
**Authentication Required: 10**  
**Public Endpoints: 3**

## 🎯 **Key Benefits of This Approach:**

1. **Optional & Flexible:** Users can skip onboarding entirely or complete it at their own pace
2. **Integrated:** Onboarding is part of the store module, not a separate system
3. **Progressive:** Users can complete onboarding without creating a store immediately
4. **Data Preservation:** Onboarding preferences are saved and can be used later
5. **User Choice:** Multiple completion options (with store, without store, or skip entirely)
