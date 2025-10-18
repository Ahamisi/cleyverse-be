import { PayoutMethod, BankAccountType, PayoutStatus } from '../entities/creator-payout-settings.entity';
export declare class CreatePayoutSettingsDto {
    method: PayoutMethod;
    isDefault?: boolean;
    bankName?: string;
    accountNumber?: string;
    routingNumber?: string;
    swiftCode?: string;
    iban?: string;
    accountType?: BankAccountType;
    accountHolderName?: string;
    country?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    paypalEmail?: string;
    paypalMerchantId?: string;
    stripeAccountId?: string;
    stripeConnectId?: string;
    wiseAccountId?: string;
    wiseEmail?: string;
    cryptoCurrency?: string;
    cryptoAddress?: string;
    cryptoNetwork?: string;
    metadata?: Record<string, any>;
    externalId?: string;
}
export declare class UpdatePayoutSettingsDto {
    isDefault?: boolean;
    status?: PayoutStatus;
    bankName?: string;
    accountNumber?: string;
    routingNumber?: string;
    swiftCode?: string;
    iban?: string;
    accountType?: BankAccountType;
    accountHolderName?: string;
    country?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    paypalEmail?: string;
    paypalMerchantId?: string;
    stripeAccountId?: string;
    stripeConnectId?: string;
    wiseAccountId?: string;
    wiseEmail?: string;
    cryptoCurrency?: string;
    cryptoAddress?: string;
    cryptoNetwork?: string;
    verificationDocument?: string;
    verificationNotes?: string;
    verifiedBy?: string;
    metadata?: Record<string, any>;
    externalId?: string;
    isActive?: boolean;
}
export declare class PayoutSettingsQueryDto {
    method?: PayoutMethod;
    status?: PayoutStatus;
    isActive?: boolean;
    page?: number;
    limit?: number;
}
