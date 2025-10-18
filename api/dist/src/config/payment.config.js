"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformType = exports.PaymentStatus = exports.PaymentMethod = exports.PaymentType = exports.SECURITY_CONFIG = exports.PAYMENT_PROCESSORS_CONFIG = exports.PAYSTACK_FEES_CONFIG = exports.PLATFORM_FEES_CONFIG = void 0;
exports.PLATFORM_FEES_CONFIG = {
    cley_me: {
        tips: {
            percentage: 0.05,
            fixed: 0,
            minimum: 0.01,
            maximum: 0.50,
            currency: 'USD'
        },
        donations: {
            percentage: 0.03,
            fixed: 0,
            minimum: 0.01,
            maximum: 1.00,
            currency: 'USD'
        },
        affiliate: {
            percentage: 0.10,
            fixed: 0,
            minimum: 0.01,
            maximum: 5.00,
            currency: 'USD'
        },
        invoice_payments: {
            percentage: 0.04,
            fixed: 0,
            minimum: 0.01,
            maximum: 2.00,
            currency: 'USD'
        }
    },
    cley_biz: {
        products: {
            percentage: 0.08,
            fixed: 0,
            minimum: 0.01,
            maximum: 10.00,
            currency: 'USD'
        },
        services: {
            percentage: 0.06,
            fixed: 0,
            minimum: 0.01,
            maximum: 5.00,
            currency: 'USD'
        },
        courses: {
            percentage: 0.05,
            fixed: 0,
            minimum: 0.01,
            maximum: 3.00,
            currency: 'USD'
        },
        invoice_payments: {
            percentage: 0.04,
            fixed: 0,
            minimum: 0.01,
            maximum: 2.00,
            currency: 'USD'
        }
    },
    cley_live: {
        tickets: {
            percentage: 0.07,
            fixed: 0,
            minimum: 0.01,
            maximum: 5.00,
            currency: 'USD'
        },
        vendor_sales: {
            percentage: 0.05,
            fixed: 0,
            minimum: 0.01,
            maximum: 3.00,
            currency: 'USD'
        },
        offline_payments: {
            percentage: 0.04,
            fixed: 0,
            minimum: 0.01,
            maximum: 2.00,
            currency: 'USD'
        },
        invoice_payments: {
            percentage: 0.04,
            fixed: 0,
            minimum: 0.01,
            maximum: 2.00,
            currency: 'USD'
        }
    },
    cley_work: {
        ai_services: {
            percentage: 0.12,
            fixed: 0,
            minimum: 0.01,
            maximum: 15.00,
            currency: 'USD'
        },
        video_calls: {
            percentage: 0.08,
            fixed: 0,
            minimum: 0.01,
            maximum: 8.00,
            currency: 'USD'
        },
        subscriptions: {
            percentage: 0.06,
            fixed: 0,
            minimum: 0.01,
            maximum: 5.00,
            currency: 'USD'
        },
        invoice_payments: {
            percentage: 0.04,
            fixed: 0,
            minimum: 0.01,
            maximum: 2.00,
            currency: 'USD'
        }
    }
};
exports.PAYSTACK_FEES_CONFIG = {
    ngn: {
        percentage: 0.015,
        fixed: 0,
        minimum: 0.01,
        maximum: 1.00,
        currency: 'NGN'
    },
    ghs: {
        percentage: 0.02,
        fixed: 0,
        minimum: 0.01,
        maximum: 1.00,
        currency: 'GHS'
    },
    kes: {
        percentage: 0.02,
        fixed: 0,
        minimum: 0.01,
        maximum: 1.00,
        currency: 'KES'
    },
    zar: {
        percentage: 0.025,
        fixed: 0,
        minimum: 0.01,
        maximum: 1.00,
        currency: 'ZAR'
    },
    other: {
        percentage: 0.03,
        fixed: 0,
        minimum: 0.01,
        maximum: 1.00,
        currency: 'USD'
    }
};
exports.PAYMENT_PROCESSORS_CONFIG = {
    paystack: {
        enabled: true,
        priority: 1,
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
        priority: 2,
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
        priority: 3,
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
exports.SECURITY_CONFIG = {
    rateLimit: {
        windowMs: 15 * 60 * 1000,
        max: 1000,
        standardHeaders: true,
        legacyHeaders: false
    },
    fraudDetection: {
        enabled: true,
        riskThresholds: {
            low: 20,
            medium: 40,
            high: 70
        },
        holdPeriods: {
            low: 0,
            medium: 24,
            high: 48
        }
    }
};
var PaymentType;
(function (PaymentType) {
    PaymentType["ONLINE"] = "online";
    PaymentType["OFFLINE"] = "offline";
    PaymentType["HYBRID"] = "hybrid";
    PaymentType["SUBSCRIPTION"] = "subscription";
    PaymentType["RECURRING"] = "recurring";
    PaymentType["ONE_TIME"] = "one_time";
})(PaymentType || (exports.PaymentType = PaymentType = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CREDIT_CARD"] = "credit_card";
    PaymentMethod["DEBIT_CARD"] = "debit_card";
    PaymentMethod["BANK_TRANSFER"] = "bank_transfer";
    PaymentMethod["DIGITAL_WALLET"] = "digital_wallet";
    PaymentMethod["CRYPTO"] = "crypto";
    PaymentMethod["NFC"] = "nfc";
    PaymentMethod["RFID"] = "rfid";
    PaymentMethod["QR_CODE"] = "qr_code";
    PaymentMethod["CASH"] = "cash";
    PaymentMethod["INVOICE_LINK"] = "invoice_link";
    PaymentMethod["MOBILE_MONEY"] = "mobile_money";
    PaymentMethod["USSD"] = "ussd";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["PROCESSING"] = "processing";
    PaymentStatus["COMPLETED"] = "completed";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["CANCELLED"] = "cancelled";
    PaymentStatus["REFUNDED"] = "refunded";
    PaymentStatus["DISPUTED"] = "disputed";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var PlatformType;
(function (PlatformType) {
    PlatformType["CLEY_ME"] = "cley_me";
    PlatformType["CLEY_BIZ"] = "cley_biz";
    PlatformType["CLEY_LIVE"] = "cley_live";
    PlatformType["CLEY_WORK"] = "cley_work";
})(PlatformType || (exports.PlatformType = PlatformType = {}));
//# sourceMappingURL=payment.config.js.map