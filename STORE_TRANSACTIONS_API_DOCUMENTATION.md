# Store Transactions API Documentation

## Overview
This documentation covers the Store Transactions API endpoints that allow store owners to view and analyze all payment transactions, orders, and financial data for their stores.

## Base URL
```
http://localhost:3000/stores/{storeId}/transactions
```

## Authentication
All endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Get Store Transactions
**GET** `/stores/{storeId}/transactions`

Retrieve paginated list of all transactions for a store with filtering options.

#### Parameters
- `storeId` (path): Store ID or store URL slug
- `status` (query, optional): Filter by payment status (`pending`, `completed`, `failed`, `cancelled`, `refunded`, `disputed`)
- `startDate` (query, optional): Start date filter (ISO 8601 format: `2025-01-01`)
- `endDate` (query, optional): End date filter (ISO 8601 format: `2025-12-31`)
- `page` (query, optional): Page number (default: 1)
- `limit` (query, optional): Items per page (default: 20)
- `orderId` (query, optional): Filter by specific order ID

#### Example Request
```bash
curl -X GET "http://localhost:3000/stores/ace-merch/transactions?status=completed&page=1&limit=10" \
  -H "Authorization: Bearer <your-jwt-token>"
```

#### Example Response
```json
{
  "message": "Store transactions retrieved successfully",
  "store": {
    "id": "df395b04-9bfa-432c-bb2f-f7f20df8cefe",
    "name": "Ace Merch",
    "storeUrl": "ace-merch"
  },
  "transactions": [
    {
      "id": "payment-uuid",
      "userId": null,
      "amount": 10.00,
      "currency": "NGN",
      "status": "completed",
      "type": "one_time",
      "method": "credit_card",
      "platform": "cley_biz",
      "platformTransactionId": "paystack-reference",
      "processor": "paystack",
      "description": "Order ORD-ABC123 - Ace Merch",
      "metadata": {
        "orderId": "order-uuid",
        "orderNumber": "ORD-ABC123",
        "storeId": "df395b04-9bfa-432c-bb2f-f7f20df8cefe",
        "storeName": "Ace Merch",
        "customerEmail": "customer@example.com"
      },
      "platformFee": 0.40,
      "processorFee": 0.30,
      "netAmount": 9.30,
      "processedAt": "2025-10-18T08:43:44.604Z",
      "createdAt": "2025-10-18T08:43:44.592Z",
      "updatedAt": "2025-10-18T08:43:44.604Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  },
  "filters": {
    "status": "completed",
    "startDate": null,
    "endDate": null,
    "orderId": null
  }
}
```

### 2. Get Transaction Summary
**GET** `/stores/{storeId}/transactions/summary`

Get aggregated financial summary for a store's transactions.

#### Parameters
- `storeId` (path): Store ID or store URL slug
- `startDate` (query, optional): Start date filter (ISO 8601 format)
- `endDate` (query, optional): End date filter (ISO 8601 format)

#### Example Request
```bash
curl -X GET "http://localhost:3000/stores/ace-merch/transactions/summary?startDate=2025-10-01&endDate=2025-10-31" \
  -H "Authorization: Bearer <your-jwt-token>"
```

#### Example Response
```json
{
  "message": "Transaction summary retrieved successfully",
  "store": {
    "id": "df395b04-9bfa-432c-bb2f-f7f20df8cefe",
    "name": "Ace Merch",
    "storeUrl": "ace-merch"
  },
  "summary": {
    "totalTransactions": 150,
    "successfulTransactions": 142,
    "failedTransactions": 5,
    "pendingTransactions": 3,
    "totalAmount": 15000.00,
    "successfulAmount": 14200.00,
    "totalFees": 750.00,
    "netAmount": 14250.00
  }
}
```

### 3. Get Transaction Analytics
**GET** `/stores/{storeId}/transactions/analytics`

Get detailed analytics and breakdowns of store transactions.

#### Parameters
- `storeId` (path): Store ID or store URL slug
- `startDate` (query, optional): Start date filter (ISO 8601 format)
- `endDate` (query, optional): End date filter (ISO 8601 format)
- `groupBy` (query, optional): Grouping period (`day`, `week`, `month`) - default: `day`

#### Example Request
```bash
curl -X GET "http://localhost:3000/stores/ace-merch/transactions/analytics?groupBy=week&startDate=2025-10-01" \
  -H "Authorization: Bearer <your-jwt-token>"
```

#### Example Response
```json
{
  "message": "Transaction analytics retrieved successfully",
  "store": {
    "id": "df395b04-9bfa-432c-bb2f-f7f20df8cefe",
    "name": "Ace Merch",
    "storeUrl": "ace-merch"
  },
  "analytics": {
    "dailyStats": [
      {
        "date": "2025-10-18",
        "transactions": 5,
        "amount": 500.00,
        "successfulTransactions": 4,
        "successfulAmount": 400.00
      },
      {
        "date": "2025-10-19",
        "transactions": 8,
        "amount": 800.00,
        "successfulTransactions": 7,
        "successfulAmount": 700.00
      }
    ],
    "currencyBreakdown": [
      {
        "currency": "NGN",
        "transactions": 120,
        "amount": 12000.00
      },
      {
        "currency": "USD",
        "transactions": 30,
        "amount": 3000.00
      }
    ],
    "processorBreakdown": [
      {
        "processor": "paystack",
        "transactions": 120,
        "amount": 12000.00
      },
      {
        "processor": "stripe",
        "transactions": 30,
        "amount": 3000.00
      }
    ]
  }
}
```

## Payment Status Values
- `pending`: Payment is being processed
- `completed`: Payment was successful
- `failed`: Payment failed
- `cancelled`: Payment was cancelled
- `refunded`: Payment was refunded
- `disputed`: Payment is under dispute

## Error Responses

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
  "message": "Store not found or does not belong to user",
  "statusCode": 404
}
```

### 400 Bad Request
```json
{
  "message": ["status must be one of the following values: pending, completed, failed, cancelled, refunded, disputed"],
  "error": "Bad Request",
  "statusCode": 400
}
```

## Frontend Integration Examples

### React/Next.js Example
```typescript
// Get store transactions
const getStoreTransactions = async (storeId: string, filters: any) => {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());

  const response = await fetch(
    `/api/stores/${storeId}/transactions?${params}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );
  
  return response.json();
};

// Get transaction summary
const getTransactionSummary = async (storeId: string, dateRange?: any) => {
  const params = new URLSearchParams();
  if (dateRange?.startDate) params.append('startDate', dateRange.startDate);
  if (dateRange?.endDate) params.append('endDate', dateRange.endDate);

  const response = await fetch(
    `/api/stores/${storeId}/transactions/summary?${params}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );
  
  return response.json();
};
```

### Vue.js Example
```javascript
// Get store transactions
async getStoreTransactions(storeId, filters = {}) {
  try {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });

    const response = await this.$http.get(
      `/stores/${storeId}/transactions?${params}`,
      {
        headers: {
          'Authorization': `Bearer ${this.$store.state.auth.token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
}
```

## Use Cases

### 1. Transaction Dashboard
- Display recent transactions with status indicators
- Show total revenue, fees, and net amount
- Filter by date range and payment status

### 2. Financial Reporting
- Generate monthly/weekly revenue reports
- Track payment processor performance
- Monitor currency distribution

### 3. Order Management
- Link transactions to specific orders
- Track failed payments for follow-up
- Monitor refund and dispute cases

### 4. Analytics Dashboard
- Visualize transaction trends over time
- Compare performance across payment processors
- Analyze customer payment preferences by currency

## Notes
- All amounts are returned as numbers (not strings)
- Dates are in ISO 8601 format
- Store ID can be either UUID or store URL slug
- Pagination starts from page 1
- Maximum limit per page is 100 (recommended: 20-50)
- All endpoints require store ownership verification
