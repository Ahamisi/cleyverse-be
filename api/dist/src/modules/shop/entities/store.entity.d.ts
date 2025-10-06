import { BaseEntity } from '../../../common/base/base.entity';
import { User } from '../../users/entities/user.entity';
import { Product } from './product.entity';
export declare enum StoreStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    PAUSED = "paused",
    SUSPENDED = "suspended",
    ARCHIVED = "archived"
}
export declare enum StoreCurrency {
    USD = "USD",
    EUR = "EUR",
    GBP = "GBP",
    CAD = "CAD",
    AUD = "AUD",
    NGN = "NGN"
}
export declare class Store extends BaseEntity {
    userId: string;
    user: User;
    products: Product[];
    name: string;
    description: string | null;
    storeUrl: string;
    logoUrl: string | null;
    bannerUrl: string | null;
    status: StoreStatus;
    currency: StoreCurrency;
    isActive: boolean;
    allowReviews: boolean;
    autoApproveReviews: boolean;
    enableInventoryTracking: boolean;
    lowStockThreshold: number;
    returnPolicy: string | null;
    shippingPolicy: string | null;
    privacyPolicy: string | null;
    termsOfService: string | null;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    archivedAt: Date | null;
    deletedAt: Date | null;
    suspendedAt: Date | null;
    suspendedReason: string | null;
}
