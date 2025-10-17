# Cleyverse Public API Documentation

## Overview
This documentation covers the public-facing API endpoints needed to build user profile pages (cley.me) and public shop pages where users can view and purchase products from creators.

**Base URL:** `http://localhost:3000` (Development)  
**Production URL:** `https://api.cleyverse.com` (When deployed)

---

## 🔗 Public User Profile & Links API

### Get User Profile by Username
Get a user's public profile information and their links.

```http
GET /users/public/{username}
```

**Parameters:**
- `username` (string, required) - The user's username

**Response:**
```json
{
  "message": "User profile retrieved successfully",
  "user": {
    "id": "uuid",
    "username": "john_doe",
    "firstName": "John",
    "lastName": "Doe",
    "profileTitle": "Content Creator",
    "bio": "Welcome to my profile!",
    "profileImageUrl": "https://example.com/profile.jpg",
    "profileImageGradient": "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
    "category": "content_creator",
    "goal": "build_audience",
    "createdAt": "2025-01-01T00:00:00.000Z"
  },
  "links": [
    {
      "id": "uuid",
      "title": "My Website",
      "url": "https://example.com",
      "type": "link",
      "layout": "button",
      "isActive": true,
      "displayOrder": 1,
      "clickCount": 42,
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "socialLinks": [
    {
      "id": "uuid",
      "platform": "instagram",
      "url": "https://instagram.com/johndoe",
      "username": "johndoe",
      "isActive": true,
      "displayOrder": 1,
      "clickCount": 15,
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "collections": [
    {
      "id": "uuid",
      "name": "My Links",
      "description": "All my important links",
      "layout": "grid",
      "isActive": true,
      "displayOrder": 1,
      "linkCount": 5,
      "links": [
        {
          "id": "uuid",
          "title": "Link 1",
          "url": "https://example1.com",
          "type": "link"
        }
      ]
    }
  ]
}
```

### Track Link Click
Record when a user clicks on a link (for analytics).

```http
POST /links/{linkId}/click
```

**Parameters:**
- `linkId` (string, required) - The link's UUID

**Request Body:**
```json
{
  "userAgent": "Mozilla/5.0...",
  "ipAddress": "192.168.1.1",
  "referrer": "https://google.com"
}
```

**Response:**
```json
{
  "message": "Click recorded successfully",
  "clickId": "uuid"
}
```

### Track Social Link Click
Record when a user clicks on a social link.

```http
POST /social-links/{socialLinkId}/click
```

**Parameters:**
- `socialLinkId` (string, required) - The social link's UUID

**Request Body:**
```json
{
  "userAgent": "Mozilla/5.0...",
  "ipAddress": "192.168.1.1",
  "referrer": "https://google.com"
}
```

**Response:**
```json
{
  "message": "Click recorded successfully",
  "clickId": "uuid"
}
```

---

## 🛍️ Public Shop API

### Get Store by URL
Get a store's public information and products.

```http
GET /stores/public/{storeUrl}
```

**Parameters:**
- `storeUrl` (string, required) - The store's URL slug

**Response:**
```json
{
  "message": "Store retrieved successfully",
  "store": {
    "id": "uuid",
    "name": "John's Store",
    "description": "Welcome to my store!",
    "storeUrl": "johns-store",
    "logoUrl": "https://example.com/logo.jpg",
    "bannerUrl": "https://example.com/banner.jpg",
    "currency": "USD",
    "isActive": true,
    "totalProducts": 25,
    "createdAt": "2025-01-01T00:00:00.000Z"
  },
  "owner": {
    "id": "uuid",
    "username": "john_doe",
    "firstName": "John",
    "lastName": "Doe",
    "profileImageUrl": "https://example.com/profile.jpg"
  }
}
```

### Get Store Products
Get all active products from a store with pagination.

```http
GET /stores/public/{storeUrl}/products
```

**Query Parameters:**
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 20, max: 100)
- `search` (string, optional) - Search term for product title/description
- `category` (string, optional) - Filter by product category
- `minPrice` (number, optional) - Minimum price filter
- `maxPrice` (number, optional) - Maximum price filter
- `sortBy` (string, optional) - Sort field: `createdAt`, `title`, `price` (default: `createdAt`)
- `sortOrder` (string, optional) - Sort order: `ASC`, `DESC` (default: `DESC`)

**Response:**
```json
{
  "message": "Products retrieved successfully",
  "products": [
    {
      "id": "uuid",
      "title": "Amazing Product",
      "description": "This is an amazing product",
      "handle": "amazing-product",
      "type": "physical",
      "status": "active",
      "price": "29.99",
      "compareAtPrice": "39.99",
      "trackQuantity": true,
      "inventoryQuantity": 50,
      "requiresShipping": true,
      "weight": 1.5,
      "weightUnit": "kg",
      "tags": ["electronics", "gadgets"],
      "isPublished": true,
      "publishedAt": "2025-01-01T00:00:00.000Z",
      "isFeatured": false,
      "viewCount": 150,
      "orderCount": 12,
      "images": [
        {
          "id": "uuid",
          "imageUrl": "https://example.com/product1.jpg",
          "altText": "Product image",
          "displayOrder": 1,
          "isPrimary": true
        }
      ],
      "variants": [
        {
          "id": "uuid",
          "title": "Red / Large",
          "sku": "PROD-RED-L",
          "price": "29.99",
          "compareAtPrice": "39.99",
          "inventoryQuantity": 25,
          "isActive": true,
          "displayOrder": 1
        }
      ],
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 20,
    "totalPages": 2,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Get Single Product
Get detailed information about a specific product.

```http
GET /stores/public/{storeUrl}/products/{productHandle}
```

**Parameters:**
- `storeUrl` (string, required) - The store's URL slug
- `productHandle` (string, required) - The product's handle (URL-friendly name)

**Response:**
```json
{
  "message": "Product retrieved successfully",
  "product": {
    "id": "uuid",
    "title": "Amazing Product",
    "description": "This is an amazing product with detailed description...",
    "handle": "amazing-product",
    "type": "physical",
    "status": "active",
    "price": "29.99",
    "compareAtPrice": "39.99",
    "costPerItem": "15.00",
    "trackQuantity": true,
    "inventoryQuantity": 50,
    "continueSelling": false,
    "requiresShipping": true,
    "weight": 1.5,
    "weightUnit": "kg",
    "seoTitle": "Amazing Product - Best Quality",
    "seoDescription": "Buy the best amazing product online",
    "productCategory": "Electronics",
    "productType": "Gadgets",
    "vendor": "John's Store",
    "tags": ["electronics", "gadgets", "tech"],
    "isPublished": true,
    "publishedAt": "2025-01-01T00:00:00.000Z",
    "isFeatured": false,
    "viewCount": 150,
    "orderCount": 12,
    "images": [
      {
        "id": "uuid",
        "imageUrl": "https://example.com/product1.jpg",
        "altText": "Product main image",
        "displayOrder": 1,
        "isPrimary": true,
        "fileSize": 1024000,
        "fileType": "image/jpeg"
      }
    ],
    "variants": [
      {
        "id": "uuid",
        "title": "Red / Large",
        "sku": "PROD-RED-L",
        "barcode": "123456789012",
        "price": "29.99",
        "compareAtPrice": "39.99",
        "costPerItem": "15.00",
        "inventoryQuantity": 25,
        "inventoryPolicy": "deny",
        "option1Name": "Color",
        "option1Value": "Red",
        "option2Name": "Size",
        "option2Value": "Large",
        "weight": 1.5,
        "weightUnit": "kg",
        "isActive": true,
        "displayOrder": 1
      }
    ],
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  },
  "store": {
    "id": "uuid",
    "name": "John's Store",
    "storeUrl": "johns-store",
    "logoUrl": "https://example.com/logo.jpg"
  }
}
```

### Track Product View
Record when a user views a product (for analytics).

```http
POST /stores/public/{storeUrl}/products/{productHandle}/view
```

**Parameters:**
- `storeUrl` (string, required) - The store's URL slug
- `productHandle` (string, required) - The product's handle

**Request Body:**
```json
{
  "userAgent": "Mozilla/5.0...",
  "ipAddress": "192.168.1.1",
  "referrer": "https://google.com"
}
```

**Response:**
```json
{
  "message": "View recorded successfully",
  "viewId": "uuid"
}
```

---

## 🔍 Search & Discovery API

### Search Products Across All Stores
Search for products across all public stores.

```http
GET /products/public/search
```

**Query Parameters:**
- `q` (string, required) - Search query
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 20, max: 100)
- `category` (string, optional) - Filter by product category
- `minPrice` (number, optional) - Minimum price filter
- `maxPrice` (number, optional) - Maximum price filter
- `sortBy` (string, optional) - Sort field: `relevance`, `price`, `createdAt` (default: `relevance`)
- `sortOrder` (string, optional) - Sort order: `ASC`, `DESC` (default: `ASC` for price, `DESC` for others)

**Response:**
```json
{
  "message": "Search completed successfully",
  "products": [
    {
      "id": "uuid",
      "title": "Amazing Product",
      "description": "This is an amazing product",
      "handle": "amazing-product",
      "price": "29.99",
      "compareAtPrice": "39.99",
      "images": [
        {
          "imageUrl": "https://example.com/product1.jpg",
          "altText": "Product image",
          "isPrimary": true
        }
      ],
      "store": {
        "id": "uuid",
        "name": "John's Store",
        "storeUrl": "johns-store",
        "logoUrl": "https://example.com/logo.jpg"
      },
      "owner": {
        "username": "john_doe",
        "profileImageUrl": "https://example.com/profile.jpg"
      }
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  },
  "filters": {
    "categories": ["Electronics", "Clothing", "Books"],
    "priceRange": {
      "min": 5.99,
      "max": 299.99
    }
  }
}
```

### Get Featured Products
Get featured products from across all stores.

```http
GET /products/public/featured
```

**Query Parameters:**
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 20, max: 100)

**Response:**
```json
{
  "message": "Featured products retrieved successfully",
  "products": [
    {
      "id": "uuid",
      "title": "Featured Product",
      "description": "This is a featured product",
      "handle": "featured-product",
      "price": "49.99",
      "compareAtPrice": "69.99",
      "images": [
        {
          "imageUrl": "https://example.com/featured.jpg",
          "altText": "Featured product",
          "isPrimary": true
        }
      ],
      "store": {
        "name": "John's Store",
        "storeUrl": "johns-store",
        "logoUrl": "https://example.com/logo.jpg"
      },
      "owner": {
        "username": "john_doe",
        "profileImageUrl": "https://example.com/profile.jpg"
      }
    }
  ],
  "pagination": {
    "total": 12,
    "page": 1,
    "limit": 20,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

---

## 📊 Analytics & Tracking

### Get Link Analytics (Public)
Get public analytics for a link (basic stats only).

```http
GET /links/{linkId}/analytics/public
```

**Parameters:**
- `linkId` (string, required) - The link's UUID

**Response:**
```json
{
  "message": "Analytics retrieved successfully",
  "analytics": {
    "totalClicks": 150,
    "uniqueClicks": 120,
    "clickRate": 0.15,
    "topReferrers": [
      {
        "referrer": "https://google.com",
        "clicks": 45
      },
      {
        "referrer": "https://facebook.com",
        "clicks": 30
      }
    ],
    "topCountries": [
      {
        "country": "US",
        "clicks": 80
      },
      {
        "country": "CA",
        "clicks": 25
      }
    ],
    "clicksOverTime": [
      {
        "date": "2025-01-01",
        "clicks": 15
      },
      {
        "date": "2025-01-02",
        "clicks": 22
      }
    ]
  }
}
```

---

## 🛡️ Error Handling

All endpoints return consistent error responses:

```json
{
  "message": "Error description",
  "error": "Error Type",
  "statusCode": 400
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

**Common Error Messages:**
- `"User not found"` - Username doesn't exist
- `"Store not found"` - Store URL doesn't exist
- `"Product not found"` - Product doesn't exist or is inactive
- `"Store is not active"` - Store is disabled
- `"Product is not published"` - Product is not publicly available

---

## 🔧 Rate Limiting

Public endpoints have the following rate limits:
- **General endpoints**: 100 requests per minute per IP
- **Search endpoints**: 50 requests per minute per IP
- **Analytics endpoints**: 20 requests per minute per IP

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## 📝 Notes for Frontend Development

### URL Structure
- **User profiles**: `https://cley.me/{username}`
- **Store pages**: `https://cley.me/{username}/shop` or `https://cley.shop/{storeUrl}`
- **Product pages**: `https://cley.shop/{storeUrl}/products/{productHandle}`

### Image Handling
- All image URLs are absolute URLs
- Images are served from CDN for optimal performance
- Fallback images should be provided for missing images

### SEO Considerations
- Use the `seoTitle` and `seoDescription` fields for product pages
- Implement proper meta tags for social sharing
- Use structured data for products (JSON-LD)

### Performance
- Implement caching for frequently accessed data
- Use pagination for product lists
- Lazy load images and non-critical content
- Consider implementing infinite scroll for product lists

### Analytics
- Track all link clicks and product views
- Implement proper error tracking
- Monitor page load times and user interactions

---

## 🚀 Getting Started

1. **Base URL**: Use `http://localhost:3000` for development
2. **No Authentication Required**: All public endpoints are accessible without API keys
3. **CORS Enabled**: Frontend can make requests from any domain
4. **JSON Responses**: All responses are in JSON format
5. **UTF-8 Encoding**: All text content supports international characters

For any questions or issues, please contact the backend team or refer to the main API documentation.
