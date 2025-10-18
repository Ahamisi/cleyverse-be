export declare const PLATFORM_FEES_CONFIG: {
    cley_me: {
        tips: {
            percentage: number;
            fixed: number;
            minimum: number;
            maximum: number;
            currency: string;
        };
        donations: {
            percentage: number;
            fixed: number;
            minimum: number;
            maximum: number;
            currency: string;
        };
        affiliate: {
            percentage: number;
            fixed: number;
            minimum: number;
            maximum: number;
            currency: string;
        };
        invoice_payments: {
            percentage: number;
            fixed: number;
            minimum: number;
            maximum: number;
            currency: string;
        };
    };
    cley_biz: {
        products: {
            percentage: number;
            fixed: number;
            minimum: number;
            maximum: number;
            currency: string;
        };
        services: {
            percentage: number;
            fixed: number;
            minimum: number;
            maximum: number;
            currency: string;
        };
        courses: {
            percentage: number;
            fixed: number;
            minimum: number;
            maximum: number;
            currency: string;
        };
        invoice_payments: {
            percentage: number;
            fixed: number;
            minimum: number;
            maximum: number;
            currency: string;
        };
    };
    cley_live: {
        tickets: {
            percentage: number;
            fixed: number;
            minimum: number;
            maximum: number;
            currency: string;
        };
        vendor_sales: {
            percentage: number;
            fixed: number;
            minimum: number;
            maximum: number;
            currency: string;
        };
        offline_payments: {
            percentage: number;
            fixed: number;
            minimum: number;
            maximum: number;
            currency: string;
        };
        invoice_payments: {
            percentage: number;
            fixed: number;
            minimum: number;
            maximum: number;
            currency: string;
        };
    };
    cley_work: {
        ai_services: {
            percentage: number;
            fixed: number;
            minimum: number;
            maximum: number;
            currency: string;
        };
        video_calls: {
            percentage: number;
            fixed: number;
            minimum: number;
            maximum: number;
            currency: string;
        };
        subscriptions: {
            percentage: number;
            fixed: number;
            minimum: number;
            maximum: number;
            currency: string;
        };
        invoice_payments: {
            percentage: number;
            fixed: number;
            minimum: number;
            maximum: number;
            currency: string;
        };
    };
};
export declare const PAYSTACK_FEES_CONFIG: {
    ngn: {
        percentage: number;
        fixed: number;
        minimum: number;
        maximum: number;
        currency: string;
    };
    ghs: {
        percentage: number;
        fixed: number;
        minimum: number;
        maximum: number;
        currency: string;
    };
    kes: {
        percentage: number;
        fixed: number;
        minimum: number;
        maximum: number;
        currency: string;
    };
    zar: {
        percentage: number;
        fixed: number;
        minimum: number;
        maximum: number;
        currency: string;
    };
    other: {
        percentage: number;
        fixed: number;
        minimum: number;
        maximum: number;
        currency: string;
    };
};
export declare const PAYMENT_PROCESSORS_CONFIG: {
    paystack: {
        enabled: boolean;
        priority: number;
        regions: string[];
        currencies: string[];
        methods: string[];
        features: string[];
        apiKey: string | undefined;
        publicKey: string | undefined;
        webhookSecret: string | undefined;
        baseUrl: string;
    };
    stripe: {
        enabled: boolean;
        priority: number;
        regions: string[];
        currencies: string[];
        methods: string[];
        features: string[];
        apiKey: string | undefined;
        publicKey: string | undefined;
        webhookSecret: string | undefined;
        baseUrl: string;
    };
    paypal: {
        enabled: boolean;
        priority: number;
        regions: string[];
        currencies: string[];
        methods: string[];
        features: string[];
        clientId: string | undefined;
        clientSecret: string | undefined;
        webhookId: string | undefined;
        baseUrl: string;
    };
};
export declare const SECURITY_CONFIG: {
    rateLimit: {
        windowMs: number;
        max: number;
        standardHeaders: boolean;
        legacyHeaders: boolean;
    };
    fraudDetection: {
        enabled: boolean;
        riskThresholds: {
            low: number;
            medium: number;
            high: number;
        };
        holdPeriods: {
            low: number;
            medium: number;
            high: number;
        };
    };
};
export declare enum PaymentType {
    ONLINE = "online",
    OFFLINE = "offline",
    HYBRID = "hybrid",
    SUBSCRIPTION = "subscription",
    RECURRING = "recurring",
    ONE_TIME = "one_time"
}
export declare enum PaymentMethod {
    CREDIT_CARD = "credit_card",
    DEBIT_CARD = "debit_card",
    BANK_TRANSFER = "bank_transfer",
    DIGITAL_WALLET = "digital_wallet",
    CRYPTO = "crypto",
    NFC = "nfc",
    RFID = "rfid",
    QR_CODE = "qr_code",
    CASH = "cash",
    INVOICE_LINK = "invoice_link",
    MOBILE_MONEY = "mobile_money",
    USSD = "ussd"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled",
    REFUNDED = "refunded",
    DISPUTED = "disputed"
}
export declare enum PlatformType {
    CLEY_ME = "cley_me",
    CLEY_BIZ = "cley_biz",
    CLEY_LIVE = "cley_live",
    CLEY_WORK = "cley_work"
}
