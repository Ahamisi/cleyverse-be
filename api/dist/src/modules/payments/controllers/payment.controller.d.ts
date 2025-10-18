import { PaymentService } from '../services/payment.service';
import { PaystackService } from '../services/paystack.service';
import { CreatePaymentDto, CreateInvoiceDto, ProcessInvoicePaymentDto, VerifyPaymentDto, PaymentQueryDto } from '../dto/payment.dto';
export declare class PaymentController {
    private readonly paymentService;
    private readonly paystackService;
    constructor(paymentService: PaymentService, paystackService: PaystackService);
    createPayment(req: any, createPaymentDto: CreatePaymentDto): Promise<{
        message: string;
        payment: import("../entities/payment.entity").Payment;
        authorizationUrl: string | undefined;
        accessCode: string | undefined;
        reference: string | undefined;
    }>;
    verifyPayment(verifyPaymentDto: VerifyPaymentDto): Promise<{
        message: string;
        payment: import("../entities/payment.entity").Payment;
    }>;
    getPublicKey(): Promise<{
        message: string;
        publicKey: null;
        configured: boolean;
    } | {
        message: string;
        publicKey: string;
        configured: boolean;
    }>;
    getBanks(): Promise<{
        message: string;
        banks: any;
    }>;
    getPayment(req: any, id: string): Promise<{
        message: string;
        payment: import("../entities/payment.entity").Payment;
    }>;
    getUserPayments(req: any, query: PaymentQueryDto): Promise<{
        message: string;
        payments: import("../entities/payment.entity").Payment[];
        pagination: {
            total: number;
            limit: number | undefined;
            offset: number | undefined;
            hasMore: boolean;
        };
    }>;
}
export declare class InvoiceController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createInvoice(req: any, createInvoiceDto: CreateInvoiceDto): Promise<{
        message: string;
        invoice: import("../entities/invoice.entity").Invoice;
        paymentLink: string;
        qrCode: string;
    }>;
    getInvoice(id: string): Promise<{
        message: string;
        invoice: import("../entities/invoice.entity").Invoice;
    }>;
    processInvoicePayment(id: string, processInvoicePaymentDto: ProcessInvoicePaymentDto): Promise<{
        message: string;
        payment: import("../entities/payment.entity").Payment;
        authorizationUrl: string;
        accessCode: string;
        reference: string;
    }>;
    getUserInvoices(req: any, query: PaymentQueryDto): Promise<{
        message: string;
        invoices: import("../entities/invoice.entity").Invoice[];
        pagination: {
            total: number;
            limit: number | undefined;
            offset: number | undefined;
            hasMore: boolean;
        };
    }>;
}
