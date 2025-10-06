# 🛍️ **CLEYVERSE SHOP API DOCUMENTATION**

## **Overview**
Complete API documentation for the Cleyverse Shop Module - enabling creators to build and manage e-commerce stores with advanced product management, inventory tracking, and variant support.

---

## **🎯 BASE URLS**
- **Development:** `http://localhost:3000`  
- **Production:** `https://api.cleyverse.com`

## **🔐 Authentication**
All authenticated endpoints require JWT token in Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## **🏪 STORE MANAGEMENT API**

### **Create Store**
**Endpoint:** `POST /stores`  
**Auth:** Required  
**Description:** Create a new store for the authenticated user

**Request Body:**
```json
{
  "name": "TheAceman Merch Store",
  "storeUrl": "theaceman-merch",
  "description": "Official merchandise and cool stuff from TheAceman",
  "currency": "USD",
  "logoUrl": "https://example.com/logo.png",
  "bannerUrl": "https://example.com/banner.jpg"
}
```

**Response:**
```json
{
  "message": "Store created successfully",
  "store": {
    "id": "uuid-here",
    "name": "TheAceman Merch Store",
    "storeUrl": "theaceman-merch",
    "description": "Official merchandise and cool stuff from TheAceman",
    "currency": "USD",
    "status": "draft",
    "isActive": true,
    "logoUrl": "https://example.com/logo.png",
    "bannerUrl": "https://example.com/banner.jpg",
    "allowReviews": true,
    "autoApproveReviews": false,
    "enableInventoryTracking": true,
    "lowStockThreshold": 5,
    "totalProducts": 0,
    "totalOrders": 0,
    "totalRevenue": 0.00,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### **Get User Stores**
**Endpoint:** `GET /stores`  
**Auth:** Required  
**Query Parameters:**
- `includeInactive` (optional): `true` | `false` (default: `false`)

**Response:**
```json
{
  "message": "Stores retrieved successfully",
  "stores": [
    {
      "id": "uuid-here",
      "name": "TheAceman Merch Store",
      "storeUrl": "theaceman-merch",
      "status": "active",
      "currency": "USD",
      "totalProducts": 15,
      "totalOrders": 127,
      "totalRevenue": 2450.00,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 1,
  "hasStores": true,
  "canCreateMore": true
}
```

### **Check User Store Status** ⭐ **NEW**
**Endpoint:** `GET /stores/check`  
**Auth:** Required  
**Description:** Check if user has stores and can create more (perfect for onboarding flow)

**Response - User with stores:**
```json
{
  "message": "User store status checked",
  "hasStores": true,
  "storeCount": 2,
  "canCreateMore": true,
  "maxStores": 10,
  "stores": [
    {
      "id": "uuid-1",
      "name": "TheAceman Merch Store",
      "storeUrl": "theaceman-merch",
      "status": "active",
      "totalProducts": 15
    },
    {
      "id": "uuid-2",
      "name": "TheAceman Art Gallery",
      "storeUrl": "theaceman-art",
      "status": "draft",
      "totalProducts": 3
    }
  ]
}
```

**Response - New user (no stores):**
```json
{
  "message": "User store status checked",
  "hasStores": false,
  "storeCount": 0,
  "canCreateMore": true,
  "maxStores": 10,
  "stores": []
}
```

### **Get Store Details**
**Endpoint:** `GET /stores/:id`  
**Auth:** Required

**Response:**
```json
{
  "message": "Store retrieved successfully",
  "store": {
    "id": "uuid-here",
    "name": "TheAceman Merch Store",
    "storeUrl": "theaceman-merch",
    "description": "Official merchandise and cool stuff",
    "currency": "USD",
    "status": "active",
    "logoUrl": "https://example.com/logo.png",
    "bannerUrl": "https://example.com/banner.jpg",
    "allowReviews": true,
    "enableInventoryTracking": true,
    "lowStockThreshold": 5,
    "returnPolicy": "30-day return policy",
    "shippingPolicy": "Free shipping over $50",
    "totalProducts": 15,
    "totalOrders": 127,
    "totalRevenue": 2450.00,
    "products": [
      {
        "id": "product-uuid",
        "title": "Cool T-Shirt",
        "handle": "cool-t-shirt",
        "status": "active",
        "isPublished": true,
        "price": 25.00
      }
    ]
  }
}
```

### **Update Store**
**Endpoint:** `PUT /stores/:id`  
**Auth:** Required

**Request Body:**
```json
{
  "name": "Updated Store Name",
  "description": "Updated description",
  "currency": "EUR",
  "allowReviews": false,
  "enableInventoryTracking": true,
  "lowStockThreshold": 10,
  "returnPolicy": "14-day return policy",
  "shippingPolicy": "Free shipping over $75"
}
```

### **Update Store Status**
**Endpoint:** `PUT /stores/:id/status`  
**Auth:** Required

**Request Body:**
```json
{
  "status": "active"
}
```

**Available Statuses:**
- `draft` - Store is being set up
- `active` - Store is live and accepting orders
- `paused` - Store is temporarily closed
- `suspended` - Store is suspended by admin ⭐ **NEW**
- `archived` - Store is permanently closed

### **Check Store URL Availability**
**Endpoint:** `GET /stores/check-url/:storeUrl`  
**Auth:** Not Required

**Response:**
```json
{
  "message": "Store URL availability checked",
  "storeUrl": "my-store",
  "isAvailable": false,
  "suggestion": "my-store-2024"
}
```

### **Get Store Analytics**
**Endpoint:** `GET /stores/analytics`  
**Auth:** Required  
**Query Parameters:**
- `storeId` (optional): Get analytics for specific store

**Response:**
```json
{
  "message": "Store analytics retrieved successfully",
  "analytics": {
    "stores": [
      {
        "id": "uuid-here",
        "name": "TheAceman Merch Store",
        "storeUrl": "theaceman-merch",
        "status": "active",
        "currency": "USD",
        "totalProducts": 15,
        "totalOrders": 127,
        "totalRevenue": 2450.00,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "summary": {
      "totalStores": 1,
      "activeStores": 1,
      "totalProducts": 15,
      "totalOrders": 127,
      "totalRevenue": 2450.00,
      "averageRevenuePerStore": 2450.00
    }
  }
}
```

### **Get Public Store**
**Endpoint:** `GET /stores/public/:storeUrl`  
**Auth:** Not Required  
**Description:** Public storefront view

**Response:**
```json
{
  "message": "Public store retrieved successfully",
  "store": {
    "id": "uuid-here",
    "name": "TheAceman Merch Store",
    "storeUrl": "theaceman-merch",
    "description": "Official merchandise",
    "logoUrl": "https://example.com/logo.png",
    "bannerUrl": "https://example.com/banner.jpg",
    "currency": "USD",
    "products": [
      {
        "id": "product-uuid",
        "title": "Cool T-Shirt",
        "handle": "cool-t-shirt",
        "price": 25.00,
        "images": [
          {
            "imageUrl": "https://example.com/tshirt.jpg",
            "altText": "Cool T-Shirt",
            "isPrimary": true
          }
        ]
      }
    ]
  }
}
```

### **Delete Store**
**Endpoint:** `DELETE /stores/:id`  
**Auth:** Required  
**Description:** Soft delete store (can be restored within 60 days)

**Response:**
```json
{
  "message": "Store deleted successfully (can be restored within 60 days)"
}
```

### **Restore Store** ⭐ **NEW**
**Endpoint:** `PUT /stores/:id/restore`  
**Auth:** Required  
**Description:** Restore a deleted store within 60 days

**Response:**
```json
{
  "message": "Store restored successfully",
  "store": {
    "id": "uuid-here",
    "name": "TheAceman Merch Store",
    "status": "draft",
    "deletedAt": null
  }
}
```

### **Get Deleted Stores** ⭐ **NEW**
**Endpoint:** `GET /stores/deleted`  
**Auth:** Required  
**Description:** Get user's deleted stores (within 60-day restoration window)

**Response:**
```json
{
  "message": "Deleted stores retrieved successfully",
  "stores": [
    {
      "id": "uuid-here",
      "name": "Old Store",
      "deletedAt": "2024-01-01T10:00:00.000Z",
      "daysUntilPermanentDeletion": 45
    }
  ],
  "total": 1
}
```

### **Suspend Store (Admin)** ⭐ **NEW**
**Endpoint:** `PUT /stores/:id/suspend`  
**Auth:** Required (Admin)  
**Description:** Admin suspend a store

**Request Body:**
```json
{
  "reason": "Violation of terms of service"
}
```

**Response:**
```json
{
  "message": "Store suspended successfully",
  "store": {
    "id": "uuid-here",
    "status": "suspended",
    "suspendedAt": "2024-01-01T10:00:00.000Z",
    "suspendedReason": "Violation of terms of service"
  }
}
```

### **Unsuspend Store (Admin)** ⭐ **NEW**
**Endpoint:** `PUT /stores/:id/unsuspend`  
**Auth:** Required (Admin)  
**Description:** Admin unsuspend a store

**Response:**
```json
{
  "message": "Store unsuspended successfully",
  "store": {
    "id": "uuid-here",
    "status": "active",
    "suspendedAt": null,
    "suspendedReason": null
  }
}
```

---

## **📦 PRODUCT MANAGEMENT API**

### **Create Product**
**Endpoint:** `POST /stores/:storeId/products`  
**Auth:** Required

### **Search Products** ⭐ **NEW**
**Endpoint:** `GET /stores/:storeId/products/search`  
**Auth:** Required  
**Description:** Advanced product search with filtering, sorting, and pagination

**Query Parameters:**
```
search=notebook                    // Text search in title, description, tags, SKU
availability=in_stock             // Filter by stock status
category=Notebooks & Notepads     // Filter by category
vendor=TheAceman Store           // Filter by vendor
tags[]=premium&tags[]=custom     // Filter by tags (array)
minPrice=10.00                   // Minimum price filter
maxPrice=50.00                   // Maximum price filter
sortBy=createdAt                 // Sort field
sortOrder=DESC                   // Sort direction (ASC/DESC)
page=1                          // Page number
limit=20                        // Items per page (max 100)
```

**Available Sort Fields:**
- `createdAt` - Creation date
- `updatedAt` - Last modified date
- `title` - Product title (A-Z)
- `price` - Product price
- `inventoryQuantity` - Stock quantity
- `orderCount` - Total orders
- `viewCount` - Page views

**Available Availability Filters:**
- `in_stock` - Above low stock threshold
- `low_stock` - Between 1 and low stock threshold
- `out_of_stock` - Zero inventory

**Response:**
```json
{
  "message": "Products searched successfully",
  "products": [
    {
      "id": "product-uuid",
      "title": "Premium Notebook Collection",
      "handle": "premium-notebook-collection",
      "status": "active",
      "price": 25.00,
      "inventoryQuantity": 100,
      "tags": ["notebook", "premium", "custom"],
      "images": [
        {
          "imageUrl": "https://example.com/notebook.jpg",
          "altText": "Premium Notebook",
          "isPrimary": true
        }
      ]
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

### **Get All Tags** ⭐ **NEW**
**Endpoint:** `GET /stores/:storeId/products/tags`  
**Auth:** Required  
**Description:** Get all tags used in store products with usage count

**Response:**
```json
{
  "message": "Tags retrieved successfully",
  "tags": [
    {
      "tag": "notebook",
      "count": 15
    },
    {
      "tag": "premium",
      "count": 8
    },
    {
      "tag": "custom",
      "count": 5
    }
  ]
}
```

### **Get Products by Tag** ⭐ **NEW**
**Endpoint:** `GET /stores/:storeId/products/tags/:tag`  
**Auth:** Required  
**Description:** Get all products that have a specific tag

**Response:**
```json
{
  "message": "Products by tag retrieved successfully",
  "products": [
    {
      "id": "product-uuid",
      "title": "Premium Notebook Collection",
      "tags": ["notebook", "premium", "custom"],
      "price": 25.00
    }
  ],
  "total": 1
}
```

### **Bulk Update Tags** ⭐ **NEW**
**Endpoint:** `PUT /stores/:storeId/products/bulk/tags`  
**Auth:** Required  
**Description:** Update tags for multiple products at once

**Request Body:**
```json
{
  "productIds": [
    "product-uuid-1",
    "product-uuid-2",
    "product-uuid-3"
  ],
  "tags": [
    "notebook",
    "premium",
    "handcrafted",
    "updated"
  ]
}
```

**Response:**
```json
{
  "message": "Products tags updated successfully",
  "updated": 3
}
```

### **Bulk Update Price** ⭐ **NEW**
**Endpoint:** `PUT /stores/:storeId/products/bulk/price`  
**Auth:** Required  
**Description:** Update price for multiple products at once

**Request Body:**
```json
{
  "productIds": [
    "product-uuid-1",
    "product-uuid-2"
  ],
  "price": 29.99
}
```

**Response:**
```json
{
  "message": "Products price updated successfully",
  "updated": 2
}
```

### **Create Product**
**Endpoint:** `POST /stores/:storeId/products`  
**Auth:** Required

**Request Body:**
```json
{
  "title": "Premium Notebook Collection",
  "description": "High-quality notebooks with custom designs",
  "type": "physical",
  "price": 25.00,
  "compareAtPrice": 35.00,
  "costPerItem": 10.00,
  "trackQuantity": true,
  "inventoryQuantity": 100,
  "continueSelling": false,
  "requiresShipping": true,
  "weight": 0.5,
  "weightUnit": "kg",
  "seoTitle": "Premium Notebook Collection - Custom Designs",
  "seoDescription": "Discover our premium notebook collection with custom designs perfect for professionals and students.",
  "productCategory": "Notebooks & Notepads",
  "productType": "Stationery",
  "vendor": "TheAceman Store",
  "tags": ["notebook", "premium", "custom", "stationery"],
  "images": [
    {
      "imageUrl": "https://example.com/notebook-main.jpg",
      "altText": "Premium Notebook Collection",
      "displayOrder": 0,
      "isPrimary": true
    },
    {
      "imageUrl": "https://example.com/notebook-detail.jpg",
      "altText": "Notebook Detail View",
      "displayOrder": 1,
      "isPrimary": false
    }
  ],
  "variants": [
    {
      "title": "Brown / A5 / Grid",
      "sku": "NB-BROWN-A5-GRID",
      "price": 25.00,
      "compareAtPrice": 35.00,
      "costPerItem": 10.00,
      "inventoryQuantity": 25,
      "option1Name": "Color",
      "option1Value": "Brown",
      "option2Name": "Size",
      "option2Value": "A5",
      "option3Name": "Style",
      "option3Value": "Grid",
      "weight": 0.5
    },
    {
      "title": "Black / A5 / Lined",
      "sku": "NB-BLACK-A5-LINED",
      "price": 25.00,
      "costPerItem": 10.00,
      "inventoryQuantity": 30,
      "option1Name": "Color",
      "option1Value": "Black",
      "option2Name": "Size",
      "option2Value": "A5",
      "option3Name": "Style",
      "option3Value": "Lined"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Product created successfully",
  "product": {
    "id": "product-uuid",
    "storeId": "store-uuid",
    "title": "Premium Notebook Collection",
    "handle": "premium-notebook-collection",
    "description": "High-quality notebooks with custom designs",
    "type": "physical",
    "status": "draft",
    "price": 25.00,
    "compareAtPrice": 35.00,
    "costPerItem": 10.00,
    "trackQuantity": true,
    "inventoryQuantity": 100,
    "continueSelling": false,
    "requiresShipping": true,
    "weight": 0.5,
    "weightUnit": "kg",
    "seoTitle": "Premium Notebook Collection - Custom Designs",
    "seoDescription": "Discover our premium notebook collection...",
    "productCategory": "Notebooks & Notepads",
    "productType": "Stationery",
    "vendor": "TheAceman Store",
    "tags": ["notebook", "premium", "custom", "stationery"],
    "isPublished": false,
    "isFeatured": false,
    "viewCount": 0,
    "orderCount": 0,
    "images": [
      {
        "id": "image-uuid",
        "imageUrl": "https://example.com/notebook-main.jpg",
        "altText": "Premium Notebook Collection",
        "displayOrder": 0,
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "id": "variant-uuid",
        "title": "Brown / A5 / Grid",
        "sku": "NB-BROWN-A5-GRID",
        "price": 25.00,
        "inventoryQuantity": 25,
        "option1Name": "Color",
        "option1Value": "Brown",
        "option2Name": "Size",
        "option2Value": "A5",
        "option3Name": "Style",
        "option3Value": "Grid"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### **Get Store Products**
**Endpoint:** `GET /stores/:storeId/products`  
**Auth:** Required  
**Query Parameters:**
- `includeInactive` (optional): `true` | `false` (default: `false`)

**Response:**
```json
{
  "message": "Products retrieved successfully",
  "products": [
    {
      "id": "product-uuid",
      "title": "Premium Notebook Collection",
      "handle": "premium-notebook-collection",
      "status": "active",
      "price": 25.00,
      "inventoryQuantity": 100,
      "isPublished": true,
      "isFeatured": false,
      "viewCount": 45,
      "orderCount": 12,
      "images": [
        {
          "imageUrl": "https://example.com/notebook-main.jpg",
          "altText": "Premium Notebook Collection",
          "isPrimary": true
        }
      ],
      "variants": [
        {
          "title": "Brown / A5 / Grid",
          "price": 25.00,
          "inventoryQuantity": 25
        }
      ]
    }
  ],
  "total": 1
}
```

### **Get Product Details**
**Endpoint:** `GET /stores/:storeId/products/:id`  
**Auth:** Required

**Response:**
```json
{
  "message": "Product retrieved successfully",
  "product": {
    "id": "product-uuid",
    "storeId": "store-uuid",
    "title": "Premium Notebook Collection",
    "handle": "premium-notebook-collection",
    "description": "High-quality notebooks with custom designs",
    "type": "physical",
    "status": "active",
    "price": 25.00,
    "compareAtPrice": 35.00,
    "costPerItem": 10.00,
    "trackQuantity": true,
    "inventoryQuantity": 100,
    "continueSelling": false,
    "requiresShipping": true,
    "weight": 0.5,
    "weightUnit": "kg",
    "seoTitle": "Premium Notebook Collection - Custom Designs",
    "seoDescription": "Discover our premium notebook collection...",
    "productCategory": "Notebooks & Notepads",
    "productType": "Stationery",
    "vendor": "TheAceman Store",
    "tags": ["notebook", "premium", "custom", "stationery"],
    "isPublished": true,
    "publishedAt": "2024-01-01T10:00:00.000Z",
    "isFeatured": false,
    "viewCount": 45,
    "orderCount": 12,
    "images": [
      {
        "id": "image-uuid",
        "imageUrl": "https://example.com/notebook-main.jpg",
        "altText": "Premium Notebook Collection",
        "displayOrder": 0,
        "isPrimary": true,
        "fileSize": 256000,
        "fileType": "image/jpeg"
      }
    ],
    "variants": [
      {
        "id": "variant-uuid",
        "title": "Brown / A5 / Grid",
        "sku": "NB-BROWN-A5-GRID",
        "barcode": "1234567890123",
        "price": 25.00,
        "compareAtPrice": 35.00,
        "costPerItem": 10.00,
        "inventoryQuantity": 25,
        "inventoryPolicy": "deny",
        "option1Name": "Color",
        "option1Value": "Brown",
        "option2Name": "Size",
        "option2Value": "A5",
        "option3Name": "Style",
        "option3Value": "Grid",
        "weight": 0.5,
        "weightUnit": "kg",
        "isActive": true,
        "displayOrder": 0
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### **Update Product**
**Endpoint:** `PUT /stores/:storeId/products/:id`  
**Auth:** Required

**Request Body:**
```json
{
  "title": "Updated Premium Notebook Collection",
  "description": "Updated description with new features",
  "price": 30.00,
  "compareAtPrice": 40.00,
  "inventoryQuantity": 150,
  "tags": ["notebook", "premium", "custom", "stationery", "updated"],
  "isFeatured": true,
  "seoTitle": "Updated Premium Notebook Collection"
}
```

### **Update Product Status**
**Endpoint:** `PUT /stores/:storeId/products/:id/status`  
**Auth:** Required

**Request Body:**
```json
{
  "status": "active"
}
```

**Available Statuses:**
- `draft` - Product is being created/edited
- `active` - Product is ready for sale
- `archived` - Product is no longer available

### **Publish/Unpublish Product**
**Endpoint:** `PUT /stores/:storeId/products/:id/publish`  
**Auth:** Required

**Request Body:**
```json
{
  "isPublished": true
}
```

### **Duplicate Product**
**Endpoint:** `POST /stores/:storeId/products/:id/duplicate`  
**Auth:** Required

**Response:**
```json
{
  "message": "Product duplicated successfully",
  "product": {
    "id": "new-product-uuid",
    "title": "Copy of Premium Notebook Collection",
    "handle": "copy-of-premium-notebook-collection",
    "status": "draft",
    "isPublished": false,
    "viewCount": 0,
    "orderCount": 0
  }
}
```

### **Delete Product**
**Endpoint:** `DELETE /stores/:storeId/products/:id`  
**Auth:** Required

**Response:**
```json
{
  "message": "Product deleted successfully"
}
```

---

## **🌐 PUBLIC STOREFRONT API**

### **Get Public Product**
**Endpoint:** `GET /public/:storeUrl/products/:productHandle`  
**Auth:** Not Required  
**Description:** Public product view (increments view count)

**Response:**
```json
{
  "message": "Product retrieved successfully",
  "product": {
    "id": "product-uuid",
    "title": "Premium Notebook Collection",
    "handle": "premium-notebook-collection",
    "description": "High-quality notebooks with custom designs",
    "price": 25.00,
    "compareAtPrice": 35.00,
    "weight": 0.5,
    "requiresShipping": true,
    "tags": ["notebook", "premium", "custom"],
    "viewCount": 46,
    "images": [
      {
        "imageUrl": "https://example.com/notebook-main.jpg",
        "altText": "Premium Notebook Collection",
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "title": "Brown / A5 / Grid",
        "price": 25.00,
        "inventoryQuantity": 25,
        "option1Name": "Color",
        "option1Value": "Brown",
        "option2Name": "Size",
        "option2Value": "A5",
        "option3Name": "Style",
        "option3Value": "Grid"
      }
    ],
    "store": {
      "name": "TheAceman Merch Store",
      "storeUrl": "theaceman-merch",
      "logoUrl": "https://example.com/logo.png"
    }
  }
}
```

---

## **🏷️ PRODUCT TAGGING SYSTEM**

### **Tag Structure**
Tags are stored as a simple array of strings in the `tags` field. This design supports:

#### **AI-Powered Features:**
- **Auto-tagging** based on product title/description
- **Smart product recommendations** 
- **Content-based search**
- **Category suggestions**

#### **Showcase Features:**
- **Tag-based filtering** on storefront
- **Related products** by similar tags
- **Tag clouds** for navigation
- **Search by tags**

#### **Example Tag Usage:**
```json
{
  "tags": [
    "notebook",
    "premium",
    "handcrafted",
    "leather-bound",
    "a5-size",
    "grid-paper",
    "business",
    "professional",
    "gift",
    "stationery"
  ]
}
```

#### **AI Integration Points:**
1. **Auto-generate tags** from product images (vision API)
2. **Extract tags** from product descriptions (NLP)
3. **Suggest related tags** based on existing products
4. **Categorize products** automatically using tag patterns

---

## **📊 INVENTORY MANAGEMENT**

### **Inventory Tracking Features:**

#### **Product Level:**
- `trackQuantity`: Enable/disable inventory tracking
- `inventoryQuantity`: Total stock quantity
- `continueSelling`: Allow sales when out of stock

#### **Variant Level:**
- `inventoryQuantity`: Stock per variant
- `inventoryPolicy`: `deny` (stop selling) or `continue` (oversell)

#### **Store Level:**
- `enableInventoryTracking`: Master inventory toggle
- `lowStockThreshold`: Alert threshold for low stock

#### **Inventory States:**
- **In Stock**: `inventoryQuantity > 0`
- **Low Stock**: `inventoryQuantity <= lowStockThreshold`
- **Out of Stock**: `inventoryQuantity = 0`
- **Overselling**: `inventoryQuantity < 0` (if `continueSelling: true`)

---

## **🔍 PRODUCT SEARCH & FILTERING**

### **Search Capabilities:**

#### **Text Search:**
- Product title
- Description
- Tags
- SKU
- Vendor

#### **Filter Options:**
- **Status**: `draft`, `active`, `archived`
- **Availability**: `in_stock`, `low_stock`, `out_of_stock`
- **Category**: Product categories
- **Tags**: Tag-based filtering
- **Price Range**: Min/max price
- **Vendor**: Filter by vendor
- **Featured**: Show only featured products

#### **Sort Options:**
- **Created Date**: Newest/oldest first
- **Updated Date**: Recently modified
- **Title**: Alphabetical A-Z/Z-A
- **Price**: Low to high/high to low
- **Inventory**: Stock quantity
- **Sales**: Best selling first

---

## **📈 ANALYTICS & REPORTING**

### **Product Analytics:**
- `viewCount`: Total product page views
- `orderCount`: Total orders containing this product
- Click-through rates
- Conversion rates

### **Store Analytics:**
- `totalProducts`: Total product count
- `totalOrders`: Total order count  
- `totalRevenue`: Total revenue generated
- Product performance metrics
- Inventory turnover rates

### **Inventory Analytics:**
- Stock levels across all products
- Low stock alerts
- Out of stock products
- Inventory value calculations

---

## **⚙️ SYSTEM FEATURES**

### **SEO Optimization:**
- Custom product handles (URLs)
- Meta titles and descriptions
- Structured data support
- Image alt text

### **Performance Features:**
- Automatic handle generation from titles
- Optimized database queries
- Image optimization support
- Caching-ready structure

### **Business Logic:**
- Multi-currency support
- Tax calculation ready
- Shipping integration ready
- Return policy management

---

## **🚨 ERROR HANDLING**

### **Common Error Responses:**

#### **400 Bad Request:**
```json
{
  "message": "Validation failed",
  "statusCode": 400,
  "errors": [
    "title must be shorter than or equal to 200 characters",
    "price must be a positive number"
  ]
}
```

#### **401 Unauthorized:**
```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

#### **404 Not Found:**
```json
{
  "message": "Store not found or does not belong to user",
  "statusCode": 404
}
```

#### **409 Conflict:**
```json
{
  "message": "Store URL is already taken",
  "statusCode": 409
}
```

---

## **🔧 TESTING ENDPOINTS**

### **Health Check:**
```bash
GET /
# Response: "Hello World!"
```

### **Store URL Validation:**
```bash
GET /stores/check-url/my-awesome-store
# Check if store URL is available
```

### **Public Access Test:**
```bash
GET /stores/public/theaceman-merch
# Test public store access
```

---

**Total Endpoints:** 32  
**Authentication Required:** 27  
**Public Endpoints:** 5  
**Search & Filter Endpoints:** 5  
**Bulk Operations:** 2  
**Admin Endpoints:** 2  
**Store Restoration:** 3

This documentation provides complete coverage of the Shop API with detailed examples for QA testing and integration work. The system supports advanced e-commerce features including AI-ready tagging, comprehensive search, bulk operations, and detailed inventory management.
