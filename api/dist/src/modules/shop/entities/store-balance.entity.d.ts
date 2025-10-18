import { Store } from './store.entity';
export declare enum BalanceType {
    AVAILABLE = "available",
    PENDING = "pending",
    HELD = "held",
    PROCESSING = "processing"
}
export declare enum TransactionType {
    EARNING = "earning",
    PAYOUT = "payout",
    REFUND = "refund",
    ADJUSTMENT = "adjustment",
    FEE = "fee"
}
export declare class StoreBalance {
    id: string;
    storeId: string;
    store: Store;
    type: BalanceType;
    amount: number;
    currency: string;
    transactionType: TransactionType;
    description: string;
    paymentId: string;
    orderId: string;
    metadata: Record<string, any> | null;
    processedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
