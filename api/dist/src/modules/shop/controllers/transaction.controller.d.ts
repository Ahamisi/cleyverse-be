import { PaymentService } from '../../payments/services/payment.service';
import { OrderService } from '../services/order.service';
import { PaymentStatus } from '../../payments/entities/payment.entity';
export declare class TransactionQueryDto {
    status?: PaymentStatus;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    orderId?: string;
}
export declare class TransactionController {
    private readonly paymentService;
    private readonly orderService;
    constructor(paymentService: PaymentService, orderService: OrderService);
    getStoreTransactions(req: any, storeId: string, query: TransactionQueryDto): Promise<{
        message: string;
        store: {
            id: any;
            name: any;
            storeUrl: any;
        };
        transactions: import("../../payments/entities/payment.entity").Payment[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        filters: {
            status: PaymentStatus | undefined;
            startDate: string | undefined;
            endDate: string | undefined;
            orderId: string | undefined;
        };
    }>;
    getTransactionSummary(req: any, storeId: string, query: {
        startDate?: string;
        endDate?: string;
    }): Promise<{
        message: string;
        store: {
            id: any;
            name: any;
            storeUrl: any;
        };
        summary: {
            totalTransactions: number;
            successfulTransactions: number;
            failedTransactions: number;
            pendingTransactions: number;
            totalAmount: number;
            successfulAmount: number;
            totalFees: number;
            netAmount: number;
        };
    }>;
    getTransactionAnalytics(req: any, storeId: string, query: {
        startDate?: string;
        endDate?: string;
        groupBy?: 'day' | 'week' | 'month';
    }): Promise<{
        message: string;
        store: {
            id: any;
            name: any;
            storeUrl: any;
        };
        analytics: {
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
        };
    }>;
}
