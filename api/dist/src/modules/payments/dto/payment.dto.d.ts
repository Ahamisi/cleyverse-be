import { PaymentType, PaymentMethod, PlatformType } from '../../../config/payment.config';
export declare class CreatePaymentDto {
    amount: number;
    currency: string;
    type: PaymentType;
    method: PaymentMethod;
    platform: PlatformType;
    description: string;
    metadata?: Record<string, any>;
    customerEmail?: string;
    callbackUrl?: string;
}
export declare class CreateInvoiceDto {
    amount: number;
    currency: string;
    description: string;
    platform: PlatformType;
    customerInfo?: {
        name?: string;
        email?: string;
        phone?: string;
        location?: {
            lat: number;
            lng: number;
        };
    };
}
export declare class ProcessInvoicePaymentDto {
    email: string;
    callbackUrl?: string;
}
export declare class VerifyPaymentDto {
    reference: string;
}
export declare class PaymentQueryDto {
    limit?: number;
    offset?: number;
}
