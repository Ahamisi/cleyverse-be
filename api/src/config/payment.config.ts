// Payment Configuration System for Cleyverse
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
};

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
};

// Payment Processor Configuration
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
  }
};

// Security Configuration
export const SECURITY_CONFIG = {
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false
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
};

// Payment Types and Methods
export enum PaymentType {
  ONLINE = 'online',
  OFFLINE = 'offline',
  HYBRID = 'hybrid',
  SUBSCRIPTION = 'subscription',
  RECURRING = 'recurring',
  ONE_TIME = 'one_time'
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  DIGITAL_WALLET = 'digital_wallet',
  CRYPTO = 'crypto',
  NFC = 'nfc',
  RFID = 'rfid',
  QR_CODE = 'qr_code',
  CASH = 'cash',
  INVOICE_LINK = 'invoice_link',
  MOBILE_MONEY = 'mobile_money',
  USSD = 'ussd'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  DISPUTED = 'disputed'
}

export enum PlatformType {
  CLEY_ME = 'cley_me',
  CLEY_BIZ = 'cley_biz',
  CLEY_LIVE = 'cley_live',
  CLEY_WORK = 'cley_work'
}
