import { StoreStatus, StoreCurrency } from '../entities/store.entity';
export declare class CreateStoreDto {
    name: string;
    storeUrl: string;
    description?: string;
    currency?: StoreCurrency;
    logoUrl?: string;
    bannerUrl?: string;
}
export declare class UpdateStoreDto {
    name?: string;
    description?: string;
    currency?: StoreCurrency;
    logoUrl?: string;
    bannerUrl?: string;
    allowReviews?: boolean;
    autoApproveReviews?: boolean;
    enableInventoryTracking?: boolean;
    lowStockThreshold?: number;
    returnPolicy?: string;
    shippingPolicy?: string;
    privacyPolicy?: string;
    termsOfService?: string;
}
export declare class UpdateStoreStatusDto {
    status: StoreStatus;
}
