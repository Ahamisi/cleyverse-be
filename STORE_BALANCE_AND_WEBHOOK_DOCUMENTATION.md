# Store Balance & Webhook System Documentation

## Overview
This documentation covers the Store Balance system and Paystack Webhook integration that handles fee calculation, balance tracking, and automatic payment processing for store owners.

## 🏦 Store Balance System

### Features
- **Real-time Balance Tracking**: Available, pending, held, and processing balances
- **Automatic Fee Calculation**: Platform fees (8%) + processor fees (1.5-3% based on currency)
- **Net Amount Calculation**: Store owners receive amount minus all fees
- **Payout Management**: Store owners can request payouts from available balance
- **Transaction History**: Complete audit trail of all balance changes

### Balance Types
- **Available**: Ready for payout
- **Pending**: Awaiting payment confirmation
- **Held**: Temporarily held (disputes, etc.)
- **Processing**: Currently being processed for payout

## 📊 API Endpoints

### 1. Get Store Balance
**GET** `/stores/{storeId}/balance`

Retrieve current balance information for a store.

#### Example Request
```bash
curl -X GET "http://localhost:3000/stores/ace-merch/balance" \
  -H "Authorization: Bearer <your-jwt-token>"
```

#### Example Response
```json
{
  "message": "Store balance retrieved successfully",
  "store": {
    "id": "df395b04-9bfa-432c-bb2f-f7f20df8cefe",
    "name": "Ace Merch",
    "storeUrl": "ace-merch"
  },
  "balance": {
    "available": 1250.75,
    "pending": 45.20,
    "held": 0.00,
    "processing": 100.00,
    "total": 1395.95,
    "currency": "NGN",
    "breakdown": {
      "availableFormatted": "NGN 1,250.75",
      "pendingFormatted": "NGN 45.20",
      "heldFormatted": "NGN 0.00",
      "processingFormatted": "NGN 100.00",
      "totalFormatted": "NGN 1,395.95"
    }
  }
}
```

### 2. Get Balance History
**GET** `/stores/{storeId}/balance/history`

Retrieve transaction history for store balance.

#### Parameters
- `page` (query, optional): Page number (default: 1)
- `limit` (query, optional): Items per page (default: 50)

#### Example Request
```bash
curl -X GET "http://localhost:3000/stores/ace-merch/balance/history?page=1&limit=20" \
  -H "Authorization: Bearer <your-jwt-token>"
```

#### Example Response
```json
{
  "message": "Balance history retrieved successfully",
  "store": {
    "id": "df395b04-9bfa-432c-bb2f-f7f20df8cefe",
    "name": "Ace Merch",
    "storeUrl": "ace-merch"
  },
  "history": [
    {
      "id": "balance-uuid",
      "type": "available",
      "amount": 125.50,
      "currency": "NGN",
      "transactionType": "earning",
      "description": "Earning from order ORD-ABC123",
      "paymentId": "payment-uuid",
      "orderId": "order-uuid",
      "metadata": {
        "grossAmount": 150.00,
        "platformFee": 12.00,
        "processorFee": 2.25,
        "totalFees": 14.25,
        "netAmount": 135.75
      },
      "processedAt": "2025-10-18T08:43:44.604Z",
      "createdAt": "2025-10-18T08:43:44.592Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### 3. Initiate Payout
**POST** `/stores/{storeId}/balance/payout`

Request a payout from available balance.

#### Request Body
```json
{
  "amount": 1000.00,
  "currency": "NGN",
  "payoutMethod": "bank_transfer"
}
```

#### Example Request
```bash
curl -X POST "http://localhost:3000/stores/ace-merch/balance/payout" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000.00,
    "currency": "NGN",
    "payoutMethod": "bank_transfer"
  }'
```

#### Example Response
```json
{
  "message": "Payout initiated successfully",
  "payout": {
    "id": "payout-uuid",
    "amount": 1000.00,
    "currency": "NGN",
    "method": "bank_transfer",
    "status": "processing",
    "createdAt": "2025-10-18T08:43:44.592Z"
  },
  "note": "Payout is being processed. You will receive a notification when it's completed."
}
```

## 🔗 Paystack Webhook Integration

### Webhook Endpoint
**POST** `/webhooks/paystack`

Handles real-time payment notifications from Paystack.

### Supported Events
- `charge.success`: Payment completed successfully
- `charge.failed`: Payment failed
- `transfer.success`: Payout completed successfully
- `transfer.failed`: Payout failed

### Webhook Security
- **Signature Verification**: All webhooks are verified using HMAC SHA-512
- **Secret Key**: Uses `PAYSTACK_WEBHOOK_SECRET` environment variable

### Webhook Processing Flow

#### 1. Payment Success (`charge.success`)
```json
{
  "event": "charge.success",
  "data": {
    "reference": "paystack-reference",
    "amount": 10000,
    "currency": "NGN",
    "customer": {
      "email": "customer@example.com"
    },
    "metadata": {
      "storeId": "store-uuid",
      "orderId": "order-uuid"
    }
  }
}
```

**Processing Steps:**
1. Verify webhook signature
2. Update payment status to `completed`
3. Calculate fees (platform + processor)
4. Add net amount to store balance
5. Move balance from `pending` to `available`

#### 2. Payment Failure (`charge.failed`)
```json
{
  "event": "charge.failed",
  "data": {
    "reference": "paystack-reference",
    "gateway_response": "Insufficient funds"
  }
}
```

**Processing Steps:**
1. Verify webhook signature
2. Update payment status to `failed`
3. Remove pending balance entry
4. Log failure reason

### Fee Calculation

#### Platform Fees (Cley.biz)
- **Products**: 8% of transaction amount
- **Services**: 6% of transaction amount
- **Courses**: 5% of transaction amount

#### Processor Fees (Paystack)
- **NGN**: 1.5% of transaction amount
- **GHS, KES**: 2% of transaction amount
- **ZAR**: 2.5% of transaction amount
- **Other currencies**: 3% of transaction amount

#### Example Fee Calculation
```
Transaction Amount: NGN 1,000.00
Platform Fee (8%): NGN 80.00
Processor Fee (1.5%): NGN 15.00
Total Fees: NGN 95.00
Net Amount to Store: NGN 905.00
```

## 🔧 Environment Variables

Add these to your `.env` file:

```env
# Paystack Configuration
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
PAYSTACK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Base URL for webhook callbacks
BASE_URL=https://your-domain.com
```

## 🚀 Paystack Webhook Setup

### 1. Configure Webhook URL in Paystack Dashboard
1. Login to your Paystack Dashboard
2. Go to Settings → Webhooks
3. Add webhook URL: `https://your-domain.com/webhooks/paystack`
4. Select events: `charge.success`, `charge.failed`, `transfer.success`, `transfer.failed`
5. Copy the webhook secret and add to your environment variables

### 2. Test Webhook
```bash
# Test webhook endpoint
curl -X POST "http://localhost:3000/webhooks/paystack" \
  -H "Content-Type: application/json" \
  -H "x-paystack-signature: <signature>" \
  -d '{
    "event": "charge.success",
    "data": {
      "reference": "test-reference",
      "amount": 10000,
      "currency": "NGN"
    }
  }'
```

## 📱 Frontend Integration Examples

### React/Next.js Balance Component
```typescript
import { useState, useEffect } from 'react';

const StoreBalance = ({ storeId }: { storeId: string }) => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch(`/api/stores/${storeId}/balance`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setBalance(data.balance);
      } catch (error) {
        console.error('Error fetching balance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [storeId]);

  if (loading) return <div>Loading balance...</div>;

  return (
    <div className="balance-card">
      <h3>Store Balance</h3>
      <div className="balance-grid">
        <div className="balance-item">
          <span className="label">Available</span>
          <span className="amount">{balance.availableFormatted}</span>
        </div>
        <div className="balance-item">
          <span className="label">Pending</span>
          <span className="amount">{balance.pendingFormatted}</span>
        </div>
        <div className="balance-item">
          <span className="label">Processing</span>
          <span className="amount">{balance.processingFormatted}</span>
        </div>
        <div className="balance-item total">
          <span className="label">Total</span>
          <span className="amount">{balance.totalFormatted}</span>
        </div>
      </div>
      <button 
        className="payout-btn"
        disabled={balance.available <= 0}
        onClick={() => initiatePayout()}
      >
        Request Payout
      </button>
    </div>
  );
};
```

### Vue.js Balance Component
```vue
<template>
  <div class="balance-card">
    <h3>Store Balance</h3>
    <div class="balance-grid">
      <div class="balance-item">
        <span class="label">Available</span>
        <span class="amount">{{ balance.availableFormatted }}</span>
      </div>
      <div class="balance-item">
        <span class="label">Pending</span>
        <span class="amount">{{ balance.pendingFormatted }}</span>
      </div>
      <div class="balance-item">
        <span class="label">Processing</span>
        <span class="amount">{{ balance.processingFormatted }}</span>
      </div>
      <div class="balance-item total">
        <span class="label">Total</span>
        <span class="amount">{{ balance.totalFormatted }}</span>
      </div>
    </div>
    <button 
      class="payout-btn"
      :disabled="balance.available <= 0"
      @click="initiatePayout"
    >
      Request Payout
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      balance: null,
      loading: true
    };
  },
  async mounted() {
    await this.fetchBalance();
  },
  methods: {
    async fetchBalance() {
      try {
        const response = await this.$http.get(`/stores/${this.storeId}/balance`, {
          headers: {
            'Authorization': `Bearer ${this.$store.state.auth.token}`,
          },
        });
        this.balance = response.data.balance;
      } catch (error) {
        console.error('Error fetching balance:', error);
      } finally {
        this.loading = false;
      }
    },
    async initiatePayout() {
      // Implementation for payout request
    }
  }
};
</script>
```

## 🔍 Monitoring & Debugging

### Webhook Logs
The webhook controller logs all events for debugging:
```typescript
this.logger.log(`Received Paystack webhook: ${event}`);
this.logger.log(`Payment ${reference} processed successfully`);
this.logger.error(`Error processing successful payment: ${error.message}`);
```

### Balance Transaction Types
- `earning`: Money earned from sales
- `payout`: Money withdrawn by store owner
- `refund`: Money refunded to customer
- `adjustment`: Manual balance adjustments
- `fee`: Fee deductions

### Error Handling
- **Insufficient Balance**: Returns error when payout amount exceeds available balance
- **Invalid Webhook**: Rejects webhooks with invalid signatures
- **Payment Not Found**: Handles cases where payment reference doesn't exist

## 📋 Use Cases

### 1. Store Owner Dashboard
- Display real-time balance information
- Show pending payments awaiting confirmation
- Track payout requests and status

### 2. Financial Reporting
- Generate balance history reports
- Track fee deductions and net earnings
- Monitor payout patterns

### 3. Automated Processing
- Real-time payment confirmation via webhooks
- Automatic balance updates
- Fee calculation and deduction

### 4. Payout Management
- Store owners can request payouts
- Track payout status and history
- Support multiple payout methods

## 🚨 Important Notes

1. **Webhook Security**: Always verify webhook signatures in production
2. **Fee Transparency**: All fees are clearly documented and calculated
3. **Balance Accuracy**: Balances are updated in real-time via webhooks
4. **Payout Limits**: Consider implementing minimum payout amounts
5. **Currency Support**: System supports multiple currencies with appropriate fee structures
6. **Audit Trail**: All balance changes are logged with full transaction history

This system ensures store owners receive their correct earnings after all fees are deducted, with full transparency and real-time updates via Paystack webhooks.
