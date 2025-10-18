import { User } from '../../users/entities/user.entity';
import { Payment } from './payment.entity';
import { Invoice } from './invoice.entity';
export declare enum TransactionType {
    PAYMENT = "payment",
    REFUND = "refund",
    CHARGEBACK = "chargeback",
    DISPUTE = "dispute",
    FEE = "fee",
    PAYOUT = "payout"
}
export declare enum TransactionStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled"
}
export declare class Transaction {
    id: string;
    userId: string | null;
    user: User | null;
    paymentId: string;
    payment: Payment;
    invoiceId: string;
    invoice: Invoice;
    type: TransactionType;
    status: TransactionStatus;
    amount: number;
    currency: string;
    description: string;
    reference: string;
    metadata: Record<string, any>;
    processedAt: Date;
    failedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
