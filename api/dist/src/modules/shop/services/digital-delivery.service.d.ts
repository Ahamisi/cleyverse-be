import { Repository } from 'typeorm';
import { DigitalProduct } from '../entities/digital-product.entity';
import { DigitalAccess } from '../entities/digital-access.entity';
import { Order } from '../entities/order.entity';
import { EmailService } from '../../../shared/services/email.service';
export declare class DigitalDeliveryService {
    private readonly digitalProductRepository;
    private readonly digitalAccessRepository;
    private readonly orderRepository;
    private readonly emailService;
    constructor(digitalProductRepository: Repository<DigitalProduct>, digitalAccessRepository: Repository<DigitalAccess>, orderRepository: Repository<Order>, emailService: EmailService);
    createDigitalAccess(digitalProductId: string, orderId: string, customerEmail: string, customerName?: string, userId?: string): Promise<DigitalAccess>;
    sendDeliveryEmail(digitalAccess: DigitalAccess): Promise<void>;
    verifyAccess(accessToken: string, password?: string, deviceFingerprint?: string, ipAddress?: string, userAgent?: string): Promise<{
        access: DigitalAccess;
        digitalProduct: DigitalProduct;
        fileStream: any;
    }>;
    private getSecureFileStream;
    private applyWatermark;
    private generateAccessToken;
    private generateAccessPassword;
    private getDownloadInstructions;
    revokeAccess(accessId: string, reason?: string): Promise<void>;
    getAccessAnalytics(digitalProductId: string): Promise<{
        totalAccess: number;
        activeAccess: number;
        totalDownloads: number;
        totalViews: number;
        uniqueUsers: number;
        recentAccess: DigitalAccess[];
    }>;
}
