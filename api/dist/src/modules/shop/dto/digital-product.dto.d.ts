import { DigitalProductType, AccessControlType } from '../entities/digital-product.entity';
export declare class CreateDigitalProductDto {
    productId: string;
    digitalType: DigitalProductType;
    accessControlType: AccessControlType;
    accessPassword?: string;
    accessDurationHours?: number;
    maxDownloads: number;
    maxConcurrentUsers: number;
    watermarkEnabled: boolean;
    watermarkText?: string;
    autoDeliver: boolean;
    deliveryEmailTemplate?: string;
    deliverySubject?: string;
    ipRestriction: boolean;
    allowedIps?: string[];
    deviceFingerprinting: boolean;
    preventScreenshots: boolean;
    preventPrinting: boolean;
    preventCopying: boolean;
    viewerType: string;
    viewerConfig?: Record<string, any>;
}
export declare class UpdateDigitalProductDto {
    accessControlType?: AccessControlType;
    accessPassword?: string;
    accessDurationHours?: number;
    maxDownloads?: number;
    maxConcurrentUsers?: number;
    watermarkEnabled?: boolean;
    watermarkText?: string;
    autoDeliver?: boolean;
    deliveryEmailTemplate?: string;
    deliverySubject?: string;
    ipRestriction?: boolean;
    allowedIps?: string[];
    deviceFingerprinting?: boolean;
    preventScreenshots?: boolean;
    preventPrinting?: boolean;
    preventCopying?: boolean;
    viewerType?: string;
    viewerConfig?: Record<string, any>;
    isActive?: boolean;
}
export declare class AccessVerificationDto {
    password?: string;
    deviceFingerprint?: string;
}
export declare class DigitalProductQueryDto {
    page?: number;
    limit?: number;
    digitalType?: DigitalProductType;
    accessControlType?: AccessControlType;
    isActive?: boolean;
}
export declare class AccessRecordQueryDto {
    page?: number;
    limit?: number;
    status?: string;
    accessType?: string;
    customerEmail?: string;
}
