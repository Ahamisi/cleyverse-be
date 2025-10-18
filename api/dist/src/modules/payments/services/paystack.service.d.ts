import { HttpService } from '@nestjs/axios';
export interface PaystackPaymentRequest {
    amount: number;
    currency: string;
    email: string;
    reference?: string;
    callback_url?: string;
    metadata?: Record<string, any>;
}
export interface PaystackPaymentResponse {
    status: boolean;
    message: string;
    data: {
        authorization_url: string;
        access_code: string;
        reference: string;
    };
}
export interface PaystackVerifyResponse {
    status: boolean;
    message: string;
    data: {
        id: number;
        domain: string;
        status: string;
        reference: string;
        amount: number;
        message: string;
        gateway_response: string;
        paid_at: string;
        created_at: string;
        channel: string;
        currency: string;
        ip_address: string;
        metadata: Record<string, any>;
        log: any;
        fees: number;
        fees_split: any;
        authorization: {
            authorization_code: string;
            bin: string;
            last4: string;
            exp_month: string;
            exp_year: string;
            channel: string;
            card_type: string;
            bank: string;
            country_code: string;
            brand: string;
            reusable: boolean;
            signature: string;
            account_name: string;
        };
        customer: {
            id: number;
            first_name: string;
            last_name: string;
            email: string;
            customer_code: string;
            phone: string;
            metadata: Record<string, any>;
            risk_action: string;
            international_format_phone: string;
        };
        plan: any;
        split: any;
        order_id: any;
        paidAt: string;
        createdAt: string;
        requested_amount: number;
        pos_transaction_data: any;
        source: any;
        fees_breakdown: any;
    };
}
export declare class PaystackService {
    private readonly httpService;
    private readonly baseUrl;
    private readonly secretKey;
    private readonly publicKey;
    constructor(httpService: HttpService);
    private getHeaders;
    initializePayment(paymentRequest: PaystackPaymentRequest): Promise<PaystackPaymentResponse>;
    verifyPayment(reference: string): Promise<PaystackVerifyResponse>;
    createTransfer(transferData: {
        source: string;
        amount: number;
        recipient: string;
        reason: string;
        reference?: string;
    }): Promise<any>;
    createRecipient(recipientData: {
        type: string;
        name: string;
        account_number: string;
        bank_code: string;
        currency: string;
    }): Promise<any>;
    getBanks(): Promise<any>;
    validateWebhook(payload: any, signature: string): Promise<boolean>;
    getPublicKey(): string;
    isConfigured(): boolean;
}
