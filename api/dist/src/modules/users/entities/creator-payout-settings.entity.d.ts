import { User } from './user.entity';
export declare enum PayoutMethod {
    BANK_TRANSFER = "bank_transfer",
    PAYPAL = "paypal",
    STRIPE_CONNECT = "stripe_connect",
    WISE = "wise",
    CRYPTO = "crypto"
}
export declare enum BankAccountType {
    CHECKING = "checking",
    SAVINGS = "savings",
    BUSINESS = "business"
}
export declare enum PayoutStatus {
    ACTIVE = "active",
    PENDING = "pending",
    VERIFIED = "verified",
    REJECTED = "rejected",
    SUSPENDED = "suspended"
}
export declare class CreatorPayoutSettings {
    id: string;
    userId: string;
    user: User;
    method: PayoutMethod;
    isDefault: boolean;
    status: PayoutStatus;
    bankName: string;
    accountNumber: string;
    routingNumber: string;
    swiftCode: string;
    iban: string;
    accountType: BankAccountType;
    accountHolderName: string;
    country: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    paypalEmail: string;
    paypalMerchantId: string;
    stripeAccountId: string;
    stripeConnectId: string;
    wiseAccountId: string;
    wiseEmail: string;
    cryptoCurrency: string;
    cryptoAddress: string;
    cryptoNetwork: string;
    verificationDocument: string;
    verifiedAt: Date;
    verificationNotes: string;
    verifiedBy: string;
    metadata: Record<string, any>;
    externalId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
