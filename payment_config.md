# Cleyverse Backend Configuration System

## 🎯 **Overview**
A comprehensive configuration system for Cleyverse backend to manage platform fees, payment processors, and system settings without requiring an admin dashboard.

---

## ⚙️ **Configuration Structure**

### **1. Platform Fees Configuration**
```typescript
// config/platform-fees.ts
export const PLATFORM_FEES_CONFIG = {
  // Cley.me fees
  cley_me: {
    tips: {
      percentage: 0.05, // 5%
      fixed: 0, // No fixed fee
      minimum: 0.01, // $0.01 minimum
      maximum: 0.50, // $0.50 maximum
      currency: 'USD'
    },
    donations: {
      percentage: 0.03, // 3%
      fixed: 0,
      minimum: 0.01,
      maximum: 1.00,
      currency: 'USD'
    },
    affiliate: {
      percentage: 0.10, // 10%
      fixed: 0,
      minimum: 0.01,
      maximum: 5.00,
      currency: 'USD'
    },
    invoice_payments: {
      percentage: 0.04, // 4%
      fixed: 0,
      minimum: 0.01,
      maximum: 2.00,
      currency: 'USD'
    }
  },
  
  // Cley.biz fees
  cley_biz: {
    products: {
      percentage: 0.08, // 8%
      fixed: 0,
      minimum: 0.01,
      maximum: 10.00,
      currency: 'USD'
    },
    services: {
      percentage: 0.06, // 6%
      fixed: 0,
      minimum: 0.01,
      maximum: 5.00,
      currency: 'USD'
    },
    courses: {
      percentage: 0.05, // 5%
      fixed: 0,
      minimum: 0.01,
      maximum: 3.00,
      currency: 'USD'
    },
    invoice_payments: {
      percentage: 0.04, // 4%
      fixed: 0,
      minimum: 0.01,
      maximum: 2.00,
      currency: 'USD'
    }
  },
  
  // Cley.live fees
  cley_live: {
    tickets: {
      percentage: 0.07, // 7%
      fixed: 0,
      minimum: 0.01,
      maximum: 5.00,
      currency: 'USD'
    },
    vendor_sales: {
      percentage: 0.05, // 5%
      fixed: 0,
      minimum: 0.01,
      maximum: 3.00,
      currency: 'USD'
    },
    offline_payments: {
      percentage: 0.04, // 4%
      fixed: 0,
      minimum: 0.01,
      maximum: 2.00,
      currency: 'USD'
    },
    invoice_payments: {
      percentage: 0.04, // 4%
      fixed: 0,
      minimum: 0.01,
      maximum: 2.00,
      currency: 'USD'
    }
  },
  
  // Cley.work fees
  cley_work: {
    ai_services: {
      percentage: 0.12, // 12%
      fixed: 0,
      minimum: 0.01,
      maximum: 15.00,
      currency: 'USD'
    },
    video_calls: {
      percentage: 0.08, // 8%
      fixed: 0,
      minimum: 0.01,
      maximum: 8.00,
      currency: 'USD'
    },
    subscriptions: {
      percentage: 0.06, // 6%
      fixed: 0,
      minimum: 0.01,
      maximum: 5.00,
      currency: 'USD'
    },
    invoice_payments: {
      percentage: 0.04, // 4%
      fixed: 0,
      minimum: 0.01,
      maximum: 2.00,
      currency: 'USD'
    }
  }
}

// Paystack-specific rates (lower fees for African market)
export const PAYSTACK_FEES_CONFIG = {
  ngn: {
    percentage: 0.015, // 1.5%
    fixed: 0,
    minimum: 0.01,
    maximum: 1.00,
    currency: 'NGN'
  },
  ghs: {
    percentage: 0.02, // 2%
    fixed: 0,
    minimum: 0.01,
    maximum: 1.00,
    currency: 'GHS'
  },
  kes: {
    percentage: 0.02, // 2%
    fixed: 0,
    minimum: 0.01,
    maximum: 1.00,
    currency: 'KES'
  },
  zar: {
    percentage: 0.025, // 2.5%
    fixed: 0,
    minimum: 0.01,
    maximum: 1.00,
    currency: 'ZAR'
  },
  other: {
    percentage: 0.03, // 3%
    fixed: 0,
    minimum: 0.01,
    maximum: 1.00,
    currency: 'USD'
  }
}
```

### **2. Payment Processor Configuration**
```typescript
// config/payment-processors.ts
export const PAYMENT_PROCESSORS_CONFIG = {
  paystack: {
    enabled: true,
    priority: 1, // Primary for Africa
    regions: ['NG', 'GH', 'KE', 'ZA', 'UG', 'TZ', 'ZM', 'RW'],
    currencies: ['NGN', 'GHS', 'KES', 'ZAR', 'UGX', 'TZS', 'ZMW', 'RWF'],
    methods: ['card', 'bank_transfer', 'mobile_money', 'ussd', 'qr_code'],
    features: ['instant_settlement', 'low_fees', 'local_banking'],
    apiKey: process.env.PAYSTACK_SECRET_KEY,
    publicKey: process.env.PAYSTACK_PUBLIC_KEY,
    webhookSecret: process.env.PAYSTACK_WEBHOOK_SECRET,
    baseUrl: 'https://api.paystack.co'
  },
  
  stripe: {
    enabled: true,
    priority: 2, // Primary for global
    regions: ['US', 'EU', 'UK', 'CA', 'AU'],
    currencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
    methods: ['card', 'bank_transfer', 'digital_wallet'],
    features: ['instant_settlement', 'global_reach', 'advanced_fraud'],
    apiKey: process.env.STRIPE_SECRET_KEY,
    publicKey: process.env.STRIPE_PUBLIC_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    baseUrl: 'https://api.stripe.com'
  },
  
  paypal: {
    enabled: true,
    priority: 3, // Secondary global
    regions: ['Global'],
    currencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'],
    methods: ['paypal', 'credit_card', 'bank_transfer'],
    features: ['global_reach', 'buyer_protection'],
    clientId: process.env.PAYPAL_CLIENT_ID,
    clientSecret: process.env.PAYPAL_CLIENT_SECRET,
    webhookId: process.env.PAYPAL_WEBHOOK_ID,
    baseUrl: process.env.NODE_ENV === 'production' 
      ? 'https://api.paypal.com' 
      : 'https://api.sandbox.paypal.com'
  },
  
  razorpay: {
    enabled: false, // Enable when needed
    priority: 4,
    regions: ['IN', 'SG', 'MY', 'TH'],
    currencies: ['INR', 'SGD', 'MYR', 'THB'],
    methods: ['card', 'upi', 'netbanking', 'wallet'],
    features: ['local_payments', 'instant_settlement'],
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
    baseUrl: 'https://api.razorpay.com'
  },
  
  flutterwave: {
    enabled: false, // Enable when needed
    priority: 5,
    regions: ['NG', 'KE', 'GH', 'ZA', 'EG'],
    currencies: ['NGN', 'KES', 'GHS', 'ZAR', 'EGP'],
    methods: ['card', 'bank_transfer', 'mobile_money'],
    features: ['african_focus', 'mobile_money'],
    publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY,
    secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
    webhookSecret: process.env.FLUTTERWAVE_WEBHOOK_SECRET,
    baseUrl: 'https://api.flutterwave.com'
  }
}
```

### **3. System Configuration**
```typescript
// config/system.ts
export const SYSTEM_CONFIG = {
  // Application settings
  app: {
    name: 'Cleyverse',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    baseUrl: process.env.BASE_URL || 'http://localhost:3000'
  },
  
  // Database settings
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'cleyverse',
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    ssl: process.env.DB_SSL === 'true',
    pool: {
      min: 2,
      max: 10,
      idle: 10000
    }
  },
  
  // Redis settings
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || '',
    db: process.env.REDIS_DB || 0,
    ttl: 3600 // 1 hour default TTL
  },
  
  // JWT settings
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
  },
  
  // Email settings
  email: {
    provider: process.env.EMAIL_PROVIDER || 'sendgrid',
    apiKey: process.env.EMAIL_API_KEY,
    from: process.env.EMAIL_FROM || 'noreply@cleyverse.com',
    templates: {
      welcome: 'welcome-template-id',
      payment: 'payment-template-id',
      invoice: 'invoice-template-id'
    }
  },
  
  // File upload settings
  upload: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    storage: process.env.STORAGE_PROVIDER || 'aws',
    bucket: process.env.S3_BUCKET || 'cleyverse-uploads'
  }
}
```

### **4. Security Configuration**
```typescript
// config/security.ts
export const SECURITY_CONFIG = {
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false
  },
  
  // CORS settings
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  },
  
  // Encryption settings
  encryption: {
    algorithm: 'aes-256-gcm',
    key: process.env.ENCRYPTION_KEY || 'your-32-character-secret-key',
    ivLength: 16
  },
  
  // Fraud detection
  fraudDetection: {
    enabled: true,
    riskThresholds: {
      low: 20,
      medium: 40,
      high: 70
    },
    holdPeriods: {
      low: 0, // No hold
      medium: 24, // 24 hours
      high: 48 // 48 hours
    }
  }
}
```

---

## 📱 **QR Code Integration Technologies**

### **1. QR Code Generation Libraries**
```typescript
// QR Code generation options
const qrCodeLibraries = {
  // Node.js backend
  qrcode: {
    package: 'qrcode',
    install: 'npm install qrcode @types/qrcode',
    features: ['PNG', 'SVG', 'Data URL', 'Custom styling'],
    example: `
      import QRCode from 'qrcode'
      
      const generateQRCode = async (data: string) => {
        const qrCode = await QRCode.toDataURL(data, {
          width: 256,
          margin: 2,
          color: {
            dark: '#0662BB',
            light: '#FFFFFF'
          }
        })
        return qrCode
      }
    `
  },
  
  // Alternative: qr-image
  qrImage: {
    package: 'qr-image',
    install: 'npm install qr-image @types/qr-image',
    features: ['PNG', 'SVG', 'EPS', 'PDF'],
    example: `
      import qr from 'qr-image'
      
      const generateQRCode = (data: string) => {
        const qrCode = qr.image(data, { type: 'png', size: 10 })
        return qrCode
      }
    `
  }
}
```

### **2. QR Code Scanning (Frontend)**
```typescript
// Frontend QR code scanning options
const qrCodeScanners = {
  // React QR scanner
  qrCodeScanner: {
    package: 'qr-code-scanner',
    install: 'npm install qr-code-scanner',
    features: ['Camera access', 'Real-time scanning', 'Multiple formats'],
    example: `
      import QrScanner from 'qr-code-scanner'
      
      const startQRScanner = () => {
        const scanner = new QrScanner(videoElement, result => {
          console.log('QR Code detected:', result)
        })
        scanner.start()
      }
    `
  },
  
  // Alternative: react-qr-reader
  reactQrReader: {
    package: 'react-qr-reader',
    install: 'npm install react-qr-reader',
    features: ['React component', 'Camera access', 'Error handling'],
    example: `
      import QrReader from 'react-qr-reader'
      
      const QRScanner = () => (
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
        />
      )
    `
  }
}
```

### **3. QR Code Implementation**
```typescript
// Backend QR Code service
import QRCode from 'qrcode'

export class QRCodeService {
  async generatePaymentQR(invoiceId: string, amount: number, currency: string) {
    const paymentData = {
      invoiceId,
      amount,
      currency,
      timestamp: new Date().toISOString(),
      type: 'payment'
    }
    
    const qrData = JSON.stringify(paymentData)
    const qrCode = await QRCode.toDataURL(qrData, {
      width: 256,
      margin: 2,
      color: {
        dark: '#0662BB', // Cley blue
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    })
    
    return {
      qrCode,
      qrData,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    }
  }
  
  async generateInvoiceQR(invoice: Invoice) {
    const invoiceData = {
      invoiceId: invoice.id,
      creatorId: invoice.creatorId,
      amount: invoice.amount,
      currency: invoice.currency,
      description: invoice.description,
      paymentLink: `https://cley.me/pay/${invoice.id}`,
      timestamp: new Date().toISOString(),
      type: 'invoice'
    }
    
    const qrData = JSON.stringify(invoiceData)
    const qrCode = await QRCode.toDataURL(qrData, {
      width: 256,
      margin: 2,
      color: {
        dark: '#0662BB',
        light: '#FFFFFF'
      }
    })
    
    return {
      qrCode,
      qrData,
      paymentLink: invoiceData.paymentLink
    }
  }
}
```

---

## 🔧 **Missing Integrations & Technologies**

### **1. Webhook Management**
```typescript
// config/webhooks.ts
export const WEBHOOK_CONFIG = {
  paystack: {
    events: [
      'charge.success',
      'charge.failed',
      'transfer.success',
      'transfer.failed',
      'subscription.create',
      'subscription.disable'
    ],
    endpoint: '/api/webhooks/paystack',
    secret: process.env.PAYSTACK_WEBHOOK_SECRET
  },
  
  stripe: {
    events: [
      'payment_intent.succeeded',
      'payment_intent.payment_failed',
      'charge.dispute.created',
      'invoice.payment_succeeded',
      'customer.subscription.created'
    ],
    endpoint: '/api/webhooks/stripe',
    secret: process.env.STRIPE_WEBHOOK_SECRET
  },
  
  paypal: {
    events: [
      'PAYMENT.CAPTURE.COMPLETED',
      'PAYMENT.CAPTURE.DENIED',
      'BILLING.SUBSCRIPTION.CREATED',
      'BILLING.SUBSCRIPTION.CANCELLED'
    ],
    endpoint: '/api/webhooks/paypal',
    secret: process.env.PAYPAL_WEBHOOK_SECRET
  }
}
```

### **2. Notification System**
```typescript
// config/notifications.ts
export const NOTIFICATION_CONFIG = {
  // Email notifications
  email: {
    provider: 'sendgrid',
    apiKey: process.env.SENDGRID_API_KEY,
    templates: {
      payment_success: 'd-1234567890',
      payment_failed: 'd-1234567891',
      invoice_created: 'd-1234567892',
      payout_processed: 'd-1234567893'
    }
  },
  
  // SMS notifications
  sms: {
    provider: 'twilio',
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    from: process.env.TWILIO_PHONE_NUMBER
  },
  
  // Push notifications
  push: {
    provider: 'firebase',
    serverKey: process.env.FIREBASE_SERVER_KEY,
    projectId: process.env.FIREBASE_PROJECT_ID
  }
}
```

### **3. Analytics & Monitoring**
```typescript
// config/analytics.ts
export const ANALYTICS_CONFIG = {
  // Payment analytics
  payments: {
    provider: 'mixpanel',
    token: process.env.MIXPANEL_TOKEN,
    events: [
      'payment_initiated',
      'payment_completed',
      'payment_failed',
      'refund_processed',
      'chargeback_created'
    ]
  },
  
  // Error monitoring
  errors: {
    provider: 'sentry',
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    release: process.env.APP_VERSION
  },
  
  // Performance monitoring
  performance: {
    provider: 'datadog',
    apiKey: process.env.DATADOG_API_KEY,
    service: 'cleyverse-payments',
    env: process.env.NODE_ENV
  }
}
```

### **4. File Storage**
```typescript
// config/storage.ts
export const STORAGE_CONFIG = {
  // AWS S3
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
    bucket: process.env.S3_BUCKET || 'cleyverse-uploads',
    cdn: process.env.CLOUDFRONT_DOMAIN
  },
  
  // File types and limits
  upload: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf',
      'text/plain'
    ],
    paths: {
      avatars: 'avatars/',
      products: 'products/',
      invoices: 'invoices/',
      receipts: 'receipts/'
    }
  }
}
```

---

## 🚀 **Environment Variables Template**

### **.env.example**
```bash
# Application
NODE_ENV=development
PORT=3000
BASE_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cleyverse
DB_USERNAME=postgres
DB_PASSWORD=password
DB_SSL=false

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# JWT
JWT_SECRET=your-32-character-secret-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Paystack (Primary)
PAYSTACK_SECRET_KEY=sk_test_xxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
PAYSTACK_WEBHOOK_SECRET=whsec_xxxxx

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLIC_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# PayPal
PAYPAL_CLIENT_ID=xxxxx
PAYPAL_CLIENT_SECRET=xxxxx
PAYPAL_WEBHOOK_ID=xxxxx

# Email
EMAIL_PROVIDER=sendgrid
EMAIL_API_KEY=SG.xxxxx
EMAIL_FROM=noreply@cleyverse.com

# Storage
STORAGE_PROVIDER=aws
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_REGION=us-east-1
S3_BUCKET=cleyverse-uploads
CLOUDFRONT_DOMAIN=xxxxx.cloudfront.net

# Analytics
MIXPANEL_TOKEN=xxxxx
SENTRY_DSN=xxxxx
DATADOG_API_KEY=xxxxx

# Security
ENCRYPTION_KEY=your-32-character-encryption-key
CORS_ORIGIN=http://localhost:3000,https://cleyverse.com
```

---

## 📋 **Backend Team Implementation Checklist**

### **Phase 1: Core Setup**
- [ ] Set up configuration system
- [ ] Implement Paystack integration
- [ ] Set up Stripe integration (already done)
- [ ] Set up PayPal integration (already done)
- [ ] Implement QR code generation
- [ ] Set up webhook handlers
- [ ] Implement basic payment processing

### **Phase 2: Advanced Features**
- [ ] Implement invoice-based payments
- [ ] Add fraud detection system
- [ ] Set up notification system
- [ ] Implement file upload system
- [ ] Add analytics tracking
- [ ] Set up monitoring and logging

### **Phase 3: Security & Compliance**
- [ ] Implement rate limiting
- [ ] Set up CORS configuration
- [ ] Add encryption for sensitive data
- [ ] Implement audit logging
- [ ] Set up backup systems
- [ ] Add health checks

---

**This configuration system provides everything the backend team needs to implement Cleyverse payments with proper QR code integration and all missing technologies! 🚀💳**
