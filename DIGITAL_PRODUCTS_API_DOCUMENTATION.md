# Digital Products API Documentation

## Overview

Digital Products are integrated into the existing Shop/Product system as a product type. When you create a product with `type: "digital"`, you can then upload digital files and configure access controls. This provides a seamless experience where digital products are just another product type alongside physical products and services.

## Key Features

- **Integrated with Existing Products**: Digital products are a type of product, not a separate system
- **Secure File Storage**: Encrypted file storage with integrity verification
- **Access Control**: Multiple access control methods (email, password, time-limited, etc.)
- **Anti-Piracy Protection**: Watermarking, device fingerprinting, concurrent user limits
- **Automated Delivery**: Email delivery with customizable templates
- **Secure Viewer**: Built-in PDF/ebook viewer with copy protection
- **Analytics**: Track downloads, views, and user engagement
- **Multi-format Support**: PDF, EPUB, MOBI, audio, video, software, courses

## Base URLs

```
Creator Dashboard: /stores/:storeId/products/:productId/digital/*
Customer Access: /digital-access/*
```

## Authentication

Creator endpoints require JWT authentication:
```
Authorization: Bearer <your-jwt-token>
```

Customer access endpoints are public but require valid access tokens.

## Digital Product Types

### Supported File Types

| Type | Extensions | Max Size | Description |
|------|------------|----------|-------------|
| **Ebook** | `.pdf`, `.epub`, `.mobi` | 100MB | Digital books and documents |
| **Audio** | `.mp3`, `.wav`, `.m4a` | 100MB | Music, podcasts, audiobooks |
| **Video** | `.mp4`, `.avi`, `.mov` | 100MB | Video courses, tutorials |
| **Software** | `.zip`, `.exe`, `.dmg` | 100MB | Software applications |
| **Course** | `.zip`, `.pdf` | 100MB | Course materials, bundles |
| **Template** | `.zip`, `.psd`, `.ai` | 100MB | Design templates, resources |

### Access Control Types

| Type | Description | Use Case |
|------|-------------|----------|
| `email_only` | Access via email verification | Simple digital downloads |
| `password_protected` | Password required for access | Premium content |
| `time_limited` | Access expires after time | Limited-time offers |
| `download_limited` | Limited number of downloads | One-time purchases |
| `single_use` | One-time access only | Exclusive content |
| `subscription` | Ongoing access | Membership content |

## Creating Digital Products

### Step 1: Create a Digital Product

First, create a product with `type: "digital"`:

**Endpoint:** `POST /stores/:storeId/products`

**Request Body:**
```json
{
  "title": "My Amazing Ebook",
  "description": "A comprehensive guide to digital marketing",
  "type": "digital",
  "price": 29.99,
  "productCategory": "Books",
  "tags": ["ebook", "marketing", "digital"]
}
```

### Step 2: Upload Digital File

Once you have a digital product, upload the file:

## Creator Dashboard API

### Upload Digital File

Upload a digital file for a digital product.

**Endpoint:** `POST /stores/:storeId/products/:productId/digital/upload`

**Content-Type:** `multipart/form-data`

**Form Data:**
```javascript
{
  "file": File, // The digital file to upload
  "digitalType": "ebook", // Product type
  "accessControlType": "email_only", // Access control method
  "accessPassword": "optional_password", // Password if password_protected
  "accessDurationHours": 24, // Hours until access expires (optional)
  "maxDownloads": 3, // Maximum download attempts
  "maxConcurrentUsers": 1, // Max simultaneous users
  "watermarkEnabled": true, // Enable watermarking
  "watermarkText": "Customer: john@example.com", // Watermark text
  "autoDeliver": true, // Auto-send delivery email
  "deliveryEmailTemplate": "ebook_delivery", // Email template
  "deliverySubject": "Your ebook is ready!", // Email subject
  "ipRestriction": false, // Restrict by IP
  "allowedIps": ["192.168.1.1"], // Allowed IP addresses
  "deviceFingerprinting": true, // Track device fingerprint
  "preventScreenshots": false, // Prevent screenshots
  "preventPrinting": true, // Prevent printing
  "preventCopying": true, // Prevent copying
  "viewerType": "pdf", // Viewer type
  "viewerConfig": { // Viewer configuration
    "allowZoom": true,
    "allowFullscreen": true
  }
}
```

**Response:**
```json
{
  "message": "Digital file uploaded successfully",
  "digitalProduct": {
    "id": "uuid",
    "digitalType": "ebook",
    "fileName": "my-ebook.pdf",
    "fileSize": 5242880,
    "accessControlType": "email_only",
    "maxDownloads": 3,
    "watermarkEnabled": true,
    "autoDeliver": true
  }
}
```

### Get Digital Product Details

Retrieve digital product configuration and statistics.

**Endpoint:** `GET /stores/:storeId/products/:productId/digital`

**Response:**
```json
{
  "message": "Digital product retrieved successfully",
  "digitalProduct": {
    "id": "uuid",
    "digitalType": "ebook",
    "fileName": "my-ebook.pdf",
    "fileSize": 5242880,
    "fileType": ".pdf",
    "accessControlType": "email_only",
    "maxDownloads": 3,
    "maxConcurrentUsers": 1,
    "watermarkEnabled": true,
    "watermarkText": "Customer: john@example.com",
    "autoDeliver": true,
    "deliverySubject": "Your ebook is ready!",
    "ipRestriction": false,
    "deviceFingerprinting": true,
    "preventScreenshots": false,
    "preventPrinting": true,
    "preventCopying": true,
    "viewerType": "pdf",
    "viewerConfig": {
      "allowZoom": true,
      "allowFullscreen": true
    },
    "totalDownloads": 15,
    "totalViews": 45,
    "uniqueAccessors": 12,
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### Update Digital Product Settings

Update digital product configuration.

**Endpoint:** `PUT /stores/:storeId/products/:productId/digital`

**Request Body:**
```json
{
  "accessControlType": "password_protected",
  "accessPassword": "new_password",
  "maxDownloads": 5,
  "watermarkEnabled": false,
  "autoDeliver": true,
  "deliverySubject": "Updated: Your ebook is ready!",
  "preventPrinting": false,
  "isActive": true
}
```

**Response:**
```json
{
  "message": "Digital product updated successfully",
  "digitalProduct": {
    "id": "uuid",
    "accessControlType": "password_protected",
    "maxDownloads": 5,
    "watermarkEnabled": false,
    "autoDeliver": true,
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### Get Access Analytics

Retrieve analytics for digital product access.

**Endpoint:** `GET /stores/:storeId/products/:productId/digital/analytics`

**Response:**
```json
{
  "message": "Access analytics retrieved successfully",
  "analytics": {
    "totalAccess": 25,
    "activeAccess": 20,
    "totalDownloads": 45,
    "totalViews": 120,
    "uniqueUsers": 18,
    "recentAccess": [
      {
        "id": "uuid",
        "customerEmail": "customer@example.com",
        "customerName": "John Doe",
        "accessType": "purchase",
        "status": "active",
        "accessCount": 3,
        "downloadCount": 1,
        "lastAccessedAt": "2025-01-01T12:00:00.000Z",
        "expiresAt": null,
        "createdAt": "2025-01-01T10:00:00.000Z"
      }
    ]
  }
}
```

### Get Access Records

Retrieve list of access records for a digital product.

**Endpoint:** `GET /stores/:storeId/products/:productId/digital/access`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `status` (optional): Filter by status (`active`, `expired`, `revoked`)
- `accessType` (optional): Filter by access type (`purchase`, `gift`, `promotional`)
- `customerEmail` (optional): Filter by customer email

**Response:**
```json
{
  "message": "Access records retrieved successfully",
  "accessRecords": [
    {
      "id": "uuid",
      "customerEmail": "customer@example.com",
      "customerName": "John Doe",
      "accessType": "purchase",
      "status": "active",
      "accessCount": 3,
      "downloadCount": 1,
      "lastAccessedAt": "2025-01-01T12:00:00.000Z",
      "expiresAt": null,
      "createdAt": "2025-01-01T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 25,
    "totalPages": 2
  }
}
```

### Revoke Access

Revoke access for a specific customer.

**Endpoint:** `PUT /digital-products/access/:accessId/revoke`

**Request Body:**
```json
{
  "reason": "Customer requested refund"
}
```

**Response:**
```json
{
  "message": "Access revoked successfully"
}
```

## Customer Access API

### View Digital Product

View a digital product in the secure viewer.

**Endpoint:** `GET /digital-access/:accessToken`

**Query Parameters:**
- `password` (optional): Access password if required
- `deviceFingerprint` (optional): Device fingerprint for tracking

**Response:** File stream with appropriate headers

**Headers:**
```
Content-Type: application/pdf
Content-Disposition: inline; filename="my-ebook.pdf"
Content-Length: 5242880
Cache-Control: no-cache, no-store, must-revalidate
```

### Download Digital Product

Download the digital product file.

**Endpoint:** `GET /digital-access/:accessToken/download`

**Query Parameters:**
- `password` (optional): Access password if required
- `deviceFingerprint` (optional): Device fingerprint for tracking

**Response:** File download with appropriate headers

**Headers:**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="my-ebook.pdf"
Content-Length: 5242880
```

## Integration with Order System

### Automatic Digital Access Creation

When a customer purchases a digital product, the system automatically:

1. **Creates Digital Access**: Generates access token and sets up access control
2. **Sends Delivery Email**: Emails customer with access information
3. **Tracks Purchase**: Links access to order for analytics

### Order Integration Example

```typescript
// When order is completed
const order = await orderService.completeOrder(orderId);

// For each digital product in the order
for (const item of order.items) {
  if (item.product.type === 'digital' && item.product.digitalProduct) {
    await digitalDeliveryService.createDigitalAccess(
      item.product.digitalProduct.id,
      order.id,
      order.customer.email,
      order.customer.name,
      order.userId
    );
  }
}
```

## Email Templates

### Default Delivery Email Template

```html
<!DOCTYPE html>
<html>
<head>
    <title>Your Digital Product is Ready!</title>
</head>
<body>
    <h1>Hello {{customerName}}!</h1>
    
    <p>Thank you for your purchase of <strong>{{productTitle}}</strong> from {{storeName}}.</p>
    
    <p>Your digital product is now ready for download:</p>
    
    <div style="background: #f5f5f5; padding: 20px; margin: 20px 0;">
        <h3>Access Your Product</h3>
        <p><a href="{{accessUrl}}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View/Download Now</a></p>
        
        {{#if accessPassword}}
        <p><strong>Access Password:</strong> {{accessPassword}}</p>
        {{/if}}
        
        {{#if expiresAt}}
        <p><strong>Access Expires:</strong> {{expiresAt}}</p>
        {{/if}}
        
        <p><strong>Downloads Remaining:</strong> {{maxDownloads}}</p>
    </div>
    
    <h3>Download Instructions</h3>
    <p>{{downloadInstructions}}</p>
    
    <h3>Need Help?</h3>
    <p>If you have any questions, please contact us at {{supportEmail}}.</p>
    
    <p>Thank you for your business!</p>
    <p>{{storeName}} Team</p>
</body>
</html>
```

## Security Features

### Anti-Piracy Protection

1. **Watermarking**: Adds customer information to files
2. **Device Fingerprinting**: Tracks and limits device access
3. **Concurrent User Limits**: Prevents sharing of access tokens
4. **IP Restrictions**: Optional IP-based access control
5. **Download Limits**: Limits number of download attempts
6. **Time-based Access**: Optional expiration of access

### File Security

1. **Encrypted Storage**: Files stored with encryption
2. **Integrity Verification**: SHA-256 hash verification
3. **Secure Delivery**: HTTPS-only file delivery
4. **Access Logging**: Complete audit trail of access

## Frontend Implementation Examples

### React/Next.js Upload Component

```typescript
import { useState } from 'react';

const DigitalProductUpload = ({ productId }) => {
  const [file, setFile] = useState(null);
  const [config, setConfig] = useState({
    digitalType: 'ebook',
    accessControlType: 'email_only',
    maxDownloads: 3,
    watermarkEnabled: true,
    autoDeliver: true
  });

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    Object.keys(config).forEach(key => {
      formData.append(key, config[key]);
    });

    const response = await fetch(`/api/digital-products/upload/${productId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const result = await response.json();
    console.log('Upload successful:', result);
  };

  return (
    <div>
      <input 
        type="file" 
        onChange={(e) => setFile(e.target.files[0])}
        accept=".pdf,.epub,.mobi,.mp3,.wav,.mp4,.zip"
      />
      
      <select 
        value={config.digitalType} 
        onChange={(e) => setConfig({...config, digitalType: e.target.value})}
      >
        <option value="ebook">Ebook</option>
        <option value="audio">Audio</option>
        <option value="video">Video</option>
        <option value="software">Software</option>
        <option value="course">Course</option>
      </select>
      
      <select 
        value={config.accessControlType} 
        onChange={(e) => setConfig({...config, accessControlType: e.target.value})}
      >
        <option value="email_only">Email Only</option>
        <option value="password_protected">Password Protected</option>
        <option value="time_limited">Time Limited</option>
        <option value="download_limited">Download Limited</option>
      </select>
      
      <button onClick={handleUpload}>Upload Digital Product</button>
    </div>
  );
};
```

### Customer Access Component

```typescript
import { useState, useEffect } from 'react';

const DigitalProductViewer = ({ accessToken }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAccess = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/digital-access/${accessToken}?password=${password}`);
      
      if (!response.ok) {
        throw new Error('Access denied or invalid credentials');
      }

      // Handle file display based on content type
      const contentType = response.headers.get('content-type');
      
      if (contentType === 'application/pdf') {
        // Display PDF in iframe or PDF viewer
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        // Show PDF viewer
      } else {
        // Trigger download
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'digital-product';
        a.click();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Access Your Digital Product</h2>
      
      {error && <div style={{color: 'red'}}>{error}</div>}
      
      <input 
        type="password" 
        placeholder="Enter access password (if required)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      <button onClick={handleAccess} disabled={loading}>
        {loading ? 'Loading...' : 'Access Product'}
      </button>
    </div>
  );
};
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "File type not allowed",
  "error": "Bad Request",
  "statusCode": 400
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid access token",
  "error": "Unauthorized",
  "statusCode": 401
}
```

### 403 Forbidden
```json
{
  "message": "Access has expired",
  "error": "Forbidden",
  "statusCode": 403
}
```

### 404 Not Found
```json
{
  "message": "Digital product not found",
  "error": "Not Found",
  "statusCode": 404
}
```

### 413 Payload Too Large
```json
{
  "message": "File size exceeds 100MB limit",
  "error": "Payload Too Large",
  "statusCode": 413
}
```

## Environment Variables

Add these to your `.env` file:

```env
# Digital Files Storage
DIGITAL_FILES_PATH=./uploads/digital

# Email Configuration (for delivery emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL (for access links)
FRONTEND_URL=https://your-frontend.com
```

## Best Practices

### For Creators

1. **File Preparation**: Optimize file sizes for faster delivery
2. **Access Control**: Choose appropriate access control for your content
3. **Watermarking**: Enable watermarking for premium content
4. **Email Templates**: Customize delivery email templates
5. **Analytics**: Monitor access patterns and user engagement

### For Customers

1. **Secure Access**: Keep access tokens private
2. **Device Management**: Use trusted devices for access
3. **Download Limits**: Be mindful of download limits
4. **Expiration**: Note access expiration dates

### For Developers

1. **File Validation**: Always validate file types and sizes
2. **Error Handling**: Implement comprehensive error handling
3. **Security**: Use HTTPS for all file delivery
4. **Monitoring**: Monitor access patterns for security
5. **Backup**: Implement file backup and recovery

This comprehensive digital products system provides creators with powerful tools to sell and distribute digital content securely while protecting their intellectual property.
