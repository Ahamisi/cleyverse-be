import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentType, PaymentMethod, PlatformType } from '../entities/payment.entity';
import { Invoice } from '../entities/invoice.entity';
import { Transaction } from '../entities/transaction.entity';
import { PaystackService } from './paystack.service';
import { QRCodeService } from './qr-code.service';
export interface CreatePaymentRequest {
    userId: string | null;
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
export interface CreateInvoiceRequest {
    creatorId: string;
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
export declare class PaymentService {
    private readonly paymentRepository;
    private readonly invoiceRepository;
    private readonly transactionRepository;
    private readonly paystackService;
    private readonly qrCodeService;
    constructor(paymentRepository: Repository<Payment>, invoiceRepository: Repository<Invoice>, transactionRepository: Repository<Transaction>, paystackService: PaystackService, qrCodeService: QRCodeService);
    createPayment(paymentRequest: CreatePaymentRequest): Promise<{
        payment: Payment;
        authorizationUrl?: string;
        accessCode?: string;
        reference?: string;
    }>;
    verifyPayment(reference: string): Promise<Payment>;
    updatePaymentStatus(paymentId: string, status: PaymentStatus, updateData?: any): Promise<Payment>;
    createInvoice(invoiceRequest: CreateInvoiceRequest): Promise<{
        invoice: Invoice;
        paymentLink: string;
        qrCode: string;
    }>;
    processInvoicePayment(invoiceId: string, paymentData: {
        email: string;
        callbackUrl?: string;
    }): Promise<{
        payment: Payment;
        authorizationUrl: string;
        accessCode: string;
        reference: string;
    }>;
    getPaymentById(paymentId: string): Promise<Payment>;
    getInvoiceById(invoiceId: string): Promise<Invoice>;
    getUserPayments(userId: string, limit?: number, offset?: number): Promise<{
        payments: Payment[];
        total: number;
    }>;
    getUserInvoices(userId: string, limit?: number, offset?: number): Promise<{
        invoices: Invoice[];
        total: number;
    }>;
    private calculatePlatformFee;
    private calculateProcessorFee;
    private createTransaction;
    private selectPaymentProcessor;
    getStoreTransactions(storeId: string, filters: {
        status?: PaymentStatus;
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
        orderId?: string;
    }): Promise<{
        transactions: Payment[];
        total: number;
    }>;
    getStoreTransactionSummary(storeId: string, filters: {
        startDate?: string;
        endDate?: string;
    }): Promise<{
        totalTransactions: number;
        successfulTransactions: number;
        failedTransactions: number;
        pendingTransactions: number;
        totalAmount: number;
        successfulAmount: number;
        totalFees: number;
        netAmount: number;
    }>;
    getStoreTransactionAnalytics(storeId: string, filters: {
        startDate?: string;
        endDate?: string;
        groupBy: 'day' | 'week' | 'month';
    }): Promise<{
        dailyStats: Array<{
            date: string;
            transactions: number;
            amount: number;
            successfulTransactions: number;
            successfulAmount: number;
        }>;
        currencyBreakdown: Array<{
            currency: string;
            transactions: number;
            amount: number;
        }>;
        processorBreakdown: Array<{
            processor: string;
            transactions: number;
            amount: number;
        }>;
    }>;
}
