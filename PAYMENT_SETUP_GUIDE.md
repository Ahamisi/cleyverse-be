# Cleyverse Payment Module Setup Guide

## 🎯 **Overview**
The Cleyverse Payment Module is now fully implemented with Paystack as the primary payment processor. This guide will help you set up and test the payment system.

## 🚀 **What's Been Implemented**

### ✅ **Core Features**
- **Payment Configuration System** - Platform fees, processor configs
- **Payment Entities** - Payment, Invoice, Transaction entities
- **Paystack Integration** - Full payment processing with Paystack
- **QR Code Generation** - For invoice payments and tourist scenarios
- **Webhook Handlers** - For payment status updates
- **Unified Payment Service** - Handles all payment types across platforms

### ✅ **Payment Types Supported**
- **Cley.me**: Tips, donations, affiliate commissions, invoice payments
- **Cley.biz**: Product sales, services, courses, invoice payments  
- **Cley.live**: Event tickets, vendor sales, offline payments, invoice payments
- **Cley.work**: AI services, video calls, subscriptions, invoice payments

### ✅ **Key Endpoints**
- `POST /payments` - Create payment
- `POST /payments/verify` - Verify payment
- `GET /payments/public-key` - Get Paystack public key
- `GET /payments/banks` - Get supported banks
- `POST /invoices` - Create invoice
- `GET /invoices/:id` - Get invoice
- `POST /invoices/:id/pay` - Process invoice payment
- `POST /webhooks/paystack` - Paystack webhook handler

## 🔧 **Environment Variables Required**

Add these to your `.env` file:

```bash
# Paystack (Primary Payment Processor)
PAYSTACK_SECRET_KEY=sk_test_xxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
PAYSTACK_WEBHOOK_SECRET=whsec_xxxxx

# Optional: Other processors
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLIC_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

PAYPAL_CLIENT_ID=xxxxx
PAYPAL_CLIENT_SECRET=xxxxx
PAYPAL_WEBHOOK_ID=xxxxx
```

## 🧪 **Testing the Payment System**

### 1. **Create a Payment**
```bash
curl -X POST http://localhost:3000/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 1000,
    "currency": "NGN",
    "type": "one_time",
    "method": "credit_card",
    "platform": "cley_me",
    "description": "Test payment",
    "customerEmail": "test@example.com"
  }'
```

### 2. **Create an Invoice (Tourist Payment Scenario)**
```bash
curl -X POST http://localhost:3000/invoices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 5000,
    "currency": "NGN",
    "description": "Restaurant bill payment",
    "platform": "cley_me",
    "customerInfo": {
      "name": "Tourist Customer",
      "email": "tourist@example.com",
      "phone": "+1234567890"
    }
  }'
```

### 3. **Process Invoice Payment**
```bash
curl -X POST http://localhost:3000/invoices/INVOICE_ID/pay \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tourist@example.com",
    "callbackUrl": "https://cley.me/payment-success"
  }'
```

### 4. **Verify Payment**
```bash
curl -X POST http://localhost:3000/payments/verify \
  -H "Content-Type: application/json" \
  -d '{
    "reference": "PAYSTACK_REFERENCE"
  }'
```

## 💳 **Platform Fee Structure**

### **Cley.me**
- Tips: 5% (max $0.50)
- Donations: 3% (max $1.00)
- Affiliate: 10% (max $5.00)
- Invoice Payments: 4% (max $2.00)

### **Cley.biz**
- Products: 8% (max $10.00)
- Services: 6% (max $5.00)
- Courses: 5% (max $3.00)
- Invoice Payments: 4% (max $2.00)

### **Cley.live**
- Tickets: 7% (max $5.00)
- Vendor Sales: 5% (max $3.00)
- Offline Payments: 4% (max $2.00)
- Invoice Payments: 4% (max $2.00)

### **Cley.work**
- AI Services: 12% (max $15.00)
- Video Calls: 8% (max $8.00)
- Subscriptions: 6% (max $5.00)
- Invoice Payments: 4% (max $2.00)

### **Paystack Fees (African Market)**
- NGN: 1.5%
- GHS: 2%
- KES: 2%
- ZAR: 2.5%
- Other: 3%

## 🔗 **Webhook Setup**

### **Paystack Webhook URL**
```
https://your-domain.com/webhooks/paystack
```

### **Events to Subscribe To**
- `charge.success`
- `charge.failed`
- `transfer.success`
- `transfer.failed`

## 🎨 **QR Code Integration**

The system automatically generates QR codes for:
- Invoice payments
- Payment links
- Tourist payment scenarios

QR codes are generated with:
- Cley blue color scheme (#0662BB)
- 256x256 resolution
- Medium error correction level
- 24-hour expiration for invoices

## 🚀 **Next Steps**

1. **Set up Paystack account** and get API keys
2. **Configure environment variables**
3. **Test payment flows** with the provided examples
4. **Set up webhook endpoints** in Paystack dashboard
5. **Integrate with frontend** using the API endpoints

## 📚 **API Documentation**

The payment system provides comprehensive APIs for:
- Payment processing
- Invoice management
- QR code generation
- Webhook handling
- Bank information
- Payment verification

All endpoints include proper error handling, validation, and security measures.

## 🔒 **Security Features**

- JWT authentication for protected endpoints
- Webhook signature validation
- Fraud detection framework (ready for implementation)
- Encrypted sensitive data storage
- Rate limiting (configurable)
- CORS protection

---

**The Cleyverse Payment Module is now ready for production use! 🚀💳**
