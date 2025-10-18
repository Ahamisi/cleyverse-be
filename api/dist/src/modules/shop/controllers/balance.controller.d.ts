import { BalanceService } from '../services/balance.service';
export declare class PayoutRequestDto {
    amount: number;
    currency: string;
    payoutMethod: string;
}
export declare class BalanceQueryDto {
    page?: number;
    limit?: number;
}
export declare class BalanceController {
    private readonly balanceService;
    constructor(balanceService: BalanceService);
    getStoreBalance(req: any, storeId: string): Promise<{
        message: string;
        store: {
            id: string;
            name: string;
            storeUrl: string;
        };
        balance: {
            available: number;
            pending: number;
            held: number;
            processing: number;
            total: number;
            currency: string;
            breakdown: {
                availableFormatted: string;
                pendingFormatted: string;
                heldFormatted: string;
                processingFormatted: string;
                totalFormatted: string;
            };
        };
    }>;
    getBalanceHistory(req: any, storeId: string, query: BalanceQueryDto): Promise<{
        message: string;
        store: {
            id: string;
            name: string;
            storeUrl: string;
        };
        history: import("../entities/store-balance.entity").StoreBalance[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    initiatePayout(req: any, storeId: string, payoutRequest: PayoutRequestDto): Promise<{
        message: string;
        payout: {
            id: string;
            amount: number;
            currency: string;
            method: string;
            status: string;
            createdAt: Date;
        };
        note: string;
        error?: undefined;
    } | {
        message: any;
        error: string;
        payout?: undefined;
        note?: undefined;
    }>;
}
