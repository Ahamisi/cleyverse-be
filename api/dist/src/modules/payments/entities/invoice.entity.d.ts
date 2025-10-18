import { User } from '../../users/entities/user.entity';
import { PaymentStatus, PlatformType } from '../../../config/payment.config';
export { PaymentStatus, PlatformType };
export declare class Invoice {
    id: string;
    creatorId: string;
    creator: User;
    amount: number;
    currency: string;
    description: string;
    paymentLink: string;
    qrCode: string;
    status: PaymentStatus;
    platform: PlatformType;
    customerInfo: {
        name?: string;
        email?: string;
        phone?: string;
        location?: {
            lat: number;
            lng: number;
        };
    };
    expiresAt: Date;
    paidAt: Date;
    fraudScore: number;
    riskLevel: string;
    paymentData: Record<string, any>;
    paymentId: string;
    createdAt: Date;
    updatedAt: Date;
}
