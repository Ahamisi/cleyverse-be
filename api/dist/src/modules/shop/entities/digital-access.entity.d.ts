import { BaseEntity } from '../../../common/base/base.entity';
import { DigitalProduct } from './digital-product.entity';
import { User } from '../../users/entities/user.entity';
import { Order } from './order.entity';
export declare enum AccessStatus {
    ACTIVE = "active",
    EXPIRED = "expired",
    REVOKED = "revoked",
    SUSPENDED = "suspended"
}
export declare enum AccessType {
    PURCHASE = "purchase",
    GIFT = "gift",
    PROMOTIONAL = "promotional",
    ADMIN = "admin"
}
export declare class DigitalAccess extends BaseEntity {
    digitalProductId: string;
    digitalProduct: DigitalProduct;
    userId: string | null;
    user: User | null;
    orderId: string | null;
    order: Order | null;
    customerEmail: string;
    customerName: string | null;
    accessType: AccessType;
    status: AccessStatus;
    accessToken: string;
    accessPassword: string | null;
    expiresAt: Date | null;
    lastAccessedAt: Date | null;
    accessCount: number;
    downloadCount: number;
    maxDownloads: number;
    deviceFingerprint: string | null;
    ipAddress: string | null;
    userAgent: string | null;
    allowedIps: string[] | null;
    deliveryEmailSent: boolean;
    deliveryEmailSentAt: Date | null;
    deliveryEmailTemplate: string | null;
    watermarkText: string | null;
    watermarkPosition: string;
    currentSessionId: string | null;
    sessionExpiresAt: Date | null;
    concurrentSessions: number;
    metadata: Record<string, any> | null;
    notes: string | null;
}
