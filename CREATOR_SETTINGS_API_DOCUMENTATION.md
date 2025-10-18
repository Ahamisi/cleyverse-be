# Creator Settings API Documentation

## Overview

The Creator Settings API provides comprehensive management of creator preferences, payout settings, and bank details. This system allows creators to configure their profile settings, notification preferences, and most importantly, their payout methods for receiving earnings from sales.

## Base URL

```
/creator-settings
```

## Authentication

All endpoints require JWT authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## General Creator Settings

### Get Creator Settings

Retrieve all creator settings including preferences, notifications, and payout configuration.

**Endpoint:** `GET /creator-settings`

**Response:**
```json
{
  "message": "Creator settings retrieved successfully",
  "settings": {
    "id": "uuid",
    "theme": "light|dark|auto",
    "language": "en|es|fr|de|it|pt|zh|ja|ko|ar",
    "emailNotifications": true,
    "smsNotifications": true,
    "pushNotifications": true,
    "marketingEmails": false,
    "publicProfile": true,
    "showEmail": false,
    "showPhone": true,
    "allowMessages": true,
    "allowComments": true,
    "payoutFrequency": "daily|weekly|monthly|manual",
    "minimumPayoutThreshold": 50.00,
    "autoPayout": true,
    "preferredCurrency": "USD",
    "taxCountry": "US",
    "taxId": "123456789",
    "businessName": "My Business",
    "businessAddress": "123 Main St",
    "businessCity": "New York",
    "businessState": "NY",
    "businessZipCode": "10001",
    "customSettings": {},
    "bio": "Creator bio text",
    "website": "https://example.com",
    "socialLinks": {
      "twitter": "https://twitter.com/username",
      "instagram": "https://instagram.com/username"
    },
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### Update Creator Settings

Update creator settings with new preferences and configuration.

**Endpoint:** `PUT /creator-settings`

**Request Body:**
```json
{
  "theme": "dark",
  "language": "en",
  "emailNotifications": true,
  "smsNotifications": false,
  "pushNotifications": true,
  "marketingEmails": false,
  "publicProfile": true,
  "showEmail": false,
  "showPhone": true,
  "allowMessages": true,
  "allowComments": true,
  "payoutFrequency": "weekly",
  "minimumPayoutThreshold": 100.00,
  "autoPayout": true,
  "preferredCurrency": "USD",
  "taxCountry": "US",
  "taxId": "123456789",
  "businessName": "My Business LLC",
  "businessAddress": "123 Main St",
  "businessCity": "New York",
  "businessState": "NY",
  "businessZipCode": "10001",
  "customSettings": {
    "customField": "customValue"
  },
  "bio": "Updated creator bio",
  "website": "https://mywebsite.com",
  "socialLinks": "{\"twitter\":\"https://twitter.com/username\",\"instagram\":\"https://instagram.com/username\"}"
}
```

**Response:**
```json
{
  "message": "Creator settings updated successfully",
  "settings": {
    "id": "uuid",
    "theme": "dark",
    "language": "en",
    "emailNotifications": true,
    "smsNotifications": false,
    "pushNotifications": true,
    "marketingEmails": false,
    "publicProfile": true,
    "showEmail": false,
    "showPhone": true,
    "allowMessages": true,
    "allowComments": true,
    "payoutFrequency": "weekly",
    "minimumPayoutThreshold": 100.00,
    "autoPayout": true,
    "preferredCurrency": "USD",
    "taxCountry": "US",
    "taxId": "123456789",
    "businessName": "My Business LLC",
    "businessAddress": "123 Main St",
    "businessCity": "New York",
    "businessState": "NY",
    "businessZipCode": "10001",
    "customSettings": {
      "customField": "customValue"
    },
    "bio": "Updated creator bio",
    "website": "https://mywebsite.com",
    "socialLinks": {
      "twitter": "https://twitter.com/username",
      "instagram": "https://instagram.com/username"
    },
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

## Payout Settings Management

### Get Payout Settings

Retrieve all payout settings for the creator with optional filtering.

**Endpoint:** `GET /creator-settings/payouts`

**Query Parameters:**
- `method` (optional): Filter by payout method (`bank_transfer`, `paypal`, `stripe_connect`, `wise`, `crypto`)
- `status` (optional): Filter by status (`active`, `pending`, `verified`, `rejected`, `suspended`)
- `isActive` (optional): Filter by active status (`true`/`false`)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Example:** `GET /creator-settings/payouts?method=bank_transfer&status=verified&page=1&limit=10`

**Response:**
```json
{
  "message": "Payout settings retrieved successfully",
  "settings": [
    {
      "id": "uuid",
      "method": "bank_transfer",
      "isDefault": true,
      "status": "verified",
      "bankName": "Chase Bank",
      "accountHolderName": "John Doe",
      "paypalEmail": null,
      "cryptoCurrency": null,
      "country": "US",
      "verifiedAt": "2025-01-01T00:00:00.000Z",
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### Get Payout Setting by ID

Retrieve detailed information about a specific payout setting.

**Endpoint:** `GET /creator-settings/payouts/:payoutId`

**Response:**
```json
{
  "message": "Payout setting retrieved successfully",
  "setting": {
    "id": "uuid",
    "method": "bank_transfer",
    "isDefault": true,
    "status": "verified",
    "bankName": "Chase Bank",
    "accountNumber": "****1234",
    "routingNumber": "021000021",
    "swiftCode": "CHASUS33",
    "iban": null,
    "accountType": "checking",
    "accountHolderName": "John Doe",
    "country": "US",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "paypalEmail": null,
    "paypalMerchantId": null,
    "stripeAccountId": null,
    "stripeConnectId": null,
    "wiseAccountId": null,
    "wiseEmail": null,
    "cryptoCurrency": null,
    "cryptoAddress": null,
    "cryptoNetwork": null,
    "verificationDocument": "document_url",
    "verifiedAt": "2025-01-01T00:00:00.000Z",
    "verificationNotes": "Verified successfully",
    "verifiedBy": "admin_user_id",
    "metadata": {},
    "externalId": "external_payment_processor_id",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### Create Payout Setting

Add a new payout method for the creator.

**Endpoint:** `POST /creator-settings/payouts`

**Request Body Examples:**

#### Bank Transfer
```json
{
  "method": "bank_transfer",
  "isDefault": true,
  "bankName": "Chase Bank",
  "accountNumber": "1234567890",
  "routingNumber": "021000021",
  "swiftCode": "CHASUS33",
  "accountType": "checking",
  "accountHolderName": "John Doe",
  "country": "US",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001"
}
```

#### PayPal
```json
{
  "method": "paypal",
  "isDefault": false,
  "paypalEmail": "john.doe@example.com"
}
```

#### Stripe Connect
```json
{
  "method": "stripe_connect",
  "isDefault": false,
  "stripeAccountId": "acct_1234567890",
  "stripeConnectId": "ac_1234567890"
}
```

#### Wise (TransferWise)
```json
{
  "method": "wise",
  "isDefault": false,
  "wiseEmail": "john.doe@example.com",
  "wiseAccountId": "wise_account_id"
}
```

#### Cryptocurrency
```json
{
  "method": "crypto",
  "isDefault": false,
  "cryptoCurrency": "BTC",
  "cryptoAddress": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  "cryptoNetwork": "bitcoin"
}
```

**Response:**
```json
{
  "message": "Payout setting created successfully",
  "setting": {
    "id": "uuid",
    "method": "bank_transfer",
    "isDefault": true,
    "status": "pending",
    "bankName": "Chase Bank",
    "accountHolderName": "John Doe",
    "paypalEmail": null,
    "cryptoCurrency": null,
    "country": "US",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### Update Payout Setting

Update an existing payout setting.

**Endpoint:** `PUT /creator-settings/payouts/:payoutId`

**Request Body:**
```json
{
  "isDefault": false,
  "status": "verified",
  "bankName": "Updated Bank Name",
  "accountHolderName": "Updated Name",
  "verificationNotes": "Updated verification notes",
  "isActive": true
}
```

**Response:**
```json
{
  "message": "Payout setting updated successfully",
  "setting": {
    "id": "uuid",
    "method": "bank_transfer",
    "isDefault": false,
    "status": "verified",
    "bankName": "Updated Bank Name",
    "accountHolderName": "Updated Name",
    "paypalEmail": null,
    "cryptoCurrency": null,
    "country": "US",
    "isActive": true,
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### Delete Payout Setting

Remove a payout setting (cannot delete default setting).

**Endpoint:** `DELETE /creator-settings/payouts/:payoutId`

**Response:**
```json
{
  "message": "Payout setting deleted successfully"
}
```

### Set Default Payout Setting

Set a payout setting as the default (must be verified).

**Endpoint:** `PUT /creator-settings/payouts/:payoutId/default`

**Response:**
```json
{
  "message": "Default payout setting updated successfully",
  "setting": {
    "id": "uuid",
    "method": "bank_transfer",
    "isDefault": true,
    "status": "verified",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

## Utility Endpoints

### Get Default Payout Setting

Get the current default payout setting.

**Endpoint:** `GET /creator-settings/payouts/default`

**Response:**
```json
{
  "message": "Default payout setting retrieved successfully",
  "setting": {
    "id": "uuid",
    "method": "bank_transfer",
    "isDefault": true,
    "status": "verified",
    "bankName": "Chase Bank",
    "accountHolderName": "John Doe",
    "paypalEmail": null,
    "cryptoCurrency": null,
    "country": "US",
    "isActive": true
  }
}
```

### Get Verified Payout Settings

Get all verified payout settings.

**Endpoint:** `GET /creator-settings/payouts/verified`

**Response:**
```json
{
  "message": "Verified payout settings retrieved successfully",
  "settings": [
    {
      "id": "uuid",
      "method": "bank_transfer",
      "isDefault": true,
      "status": "verified",
      "bankName": "Chase Bank",
      "accountHolderName": "John Doe",
      "paypalEmail": null,
      "cryptoCurrency": null,
      "country": "US",
      "verifiedAt": "2025-01-01T00:00:00.000Z",
      "isActive": true
    }
  ]
}
```

## Payout Methods

### Supported Payout Methods

1. **Bank Transfer** (`bank_transfer`)
   - Traditional bank account transfers
   - Requires: bank name, account number, routing number, account holder name
   - Optional: SWIFT code, IBAN, account type, address details

2. **PayPal** (`paypal`)
   - PayPal account transfers
   - Requires: PayPal email address
   - Optional: PayPal merchant ID

3. **Stripe Connect** (`stripe_connect`)
   - Stripe Connect account transfers
   - Requires: Stripe account ID
   - Optional: Stripe Connect ID

4. **Wise** (`wise`)
   - Wise (formerly TransferWise) transfers
   - Requires: Wise email address
   - Optional: Wise account ID

5. **Cryptocurrency** (`crypto`)
   - Cryptocurrency wallet transfers
   - Requires: cryptocurrency type, wallet address
   - Optional: network specification

## Payout Statuses

- **`pending`**: Newly created, awaiting verification
- **`verified`**: Successfully verified and ready for payouts
- **`rejected`**: Verification failed or rejected
- **`suspended`**: Temporarily suspended
- **`active`**: Currently active (legacy status)

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation failed",
  "error": "Bad Request",
  "statusCode": 400
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

### 404 Not Found
```json
{
  "message": "Payout setting not found",
  "error": "Not Found",
  "statusCode": 404
}
```

### 409 Conflict
```json
{
  "message": "Cannot delete default payout setting",
  "error": "Conflict",
  "statusCode": 409
}
```

## Security Notes

1. **Sensitive Data**: Account numbers and routing numbers are stored securely and masked in responses
2. **Verification**: Payout settings require verification before they can be used as default
3. **Access Control**: Users can only access and modify their own settings
4. **Audit Trail**: All changes are logged with timestamps and user information

## Integration with Payment System

The Creator Settings system integrates with the payment system to:

1. **Automatic Payouts**: Use verified payout settings for automatic earnings distribution
2. **Payment Processing**: Route payments to the appropriate payout method
3. **Fee Calculation**: Apply platform fees and calculate net amounts
4. **Compliance**: Ensure tax information and business details are collected

## Frontend Implementation Examples

### React/Next.js Example

```typescript
// Get creator settings
const getCreatorSettings = async () => {
  const response = await fetch('/api/creator-settings', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};

// Update payout setting
const updatePayoutSetting = async (payoutId: string, data: any) => {
  const response = await fetch(`/api/creator-settings/payouts/${payoutId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return response.json();
};
```

This comprehensive Creator Settings system provides creators with full control over their preferences and payout methods, ensuring secure and efficient earnings distribution.
