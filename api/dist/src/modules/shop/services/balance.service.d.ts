import { Repository } from 'typeorm';
import { StoreBalance } from '../entities/store-balance.entity';
import { PaymentStatus } from '../../payments/entities/payment.entity';
export declare class BalanceService {
    private readonly balanceRepository;
    constructor(balanceRepository: Repository<StoreBalance>);
    getStoreBalance(storeId: string): Promise<{
        available: number;
        pending: number;
        held: number;
        processing: number;
        total: number;
        currency: string;
    }>;
    addEarning(storeId: string, amount: number, currency: string, paymentId: string, orderId: string, metadata?: any): Promise<StoreBalance>;
    processPayment(paymentId: string, status: PaymentStatus): Promise<void>;
    addRefund(storeId: string, amount: number, currency: string, paymentId: string, orderId: string): Promise<StoreBalance>;
    initiatePayout(storeId: string, amount: number, currency: string, payoutMethod: string): Promise<StoreBalance>;
    completePayout(balanceId: string): Promise<void>;
    getBalanceHistory(storeId: string, limit?: number, offset?: number): Promise<{
        transactions: StoreBalance[];
        total: number;
    }>;
    private updateBalanceType;
    private calculateFees;
}
