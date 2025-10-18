import { BaseEntity } from '../../../common/base/base.entity';
import { Product } from './product.entity';
import { DigitalAccess } from './digital-access.entity';
export declare enum DigitalProductType {
    EBOOK = "ebook",
    PDF = "pdf",
    AUDIO = "audio",
    VIDEO = "video",
    SOFTWARE = "software",
    COURSE = "course",
    TEMPLATE = "template",
    OTHER = "other"
}
export declare enum AccessControlType {
    EMAIL_ONLY = "email_only",
    PASSWORD_PROTECTED = "password_protected",
    TIME_LIMITED = "time_limited",
    DOWNLOAD_LIMITED = "download_limited",
    SINGLE_USE = "single_use",
    SUBSCRIPTION = "subscription"
}
export declare class DigitalProduct extends BaseEntity {
    productId: string;
    product: Product;
    accessRecords: DigitalAccess[];
    digitalType: DigitalProductType;
    accessControlType: AccessControlType;
    fileName: string;
    filePath: string;
    fileSize: number;
    fileType: string;
    mimeType: string;
    fileHash: string;
    accessPassword: string | null;
    accessDurationHours: number | null;
    maxDownloads: number;
    maxConcurrentUsers: number;
    watermarkEnabled: boolean;
    watermarkText: string | null;
    autoDeliver: boolean;
    deliveryEmailTemplate: string | null;
    deliverySubject: string | null;
    ipRestriction: boolean;
    allowedIps: string[] | null;
    deviceFingerprinting: boolean;
    preventScreenshots: boolean;
    preventPrinting: boolean;
    preventCopying: boolean;
    viewerType: string;
    viewerConfig: Record<string, any> | null;
    totalDownloads: number;
    totalViews: number;
    uniqueAccessors: number;
    metadata: Record<string, any> | null;
    isActive: boolean;
}
