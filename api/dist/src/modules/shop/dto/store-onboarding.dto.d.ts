import { BusinessType, SalesChannel, ProductType, OnboardingStep } from '../entities/store-onboarding.entity';
export declare class StartOnboardingDto {
}
export declare class UpdateBusinessTypeDto {
    businessType: BusinessType;
}
export declare class UpdateSalesChannelsDto {
    salesChannels: SalesChannel[];
}
export declare class UpdateProductTypesDto {
    productTypes: ProductType[];
}
export declare class UpdateStoreSetupDto {
    storeName: string;
    storeUrl: string;
    storeDescription?: string;
    currency?: string;
    logoUrl?: string;
    bannerUrl?: string;
}
export declare class CompleteOnboardingDto {
    storeName: string;
    storeUrl: string;
    storeDescription?: string;
    currency?: string;
    logoUrl?: string;
    bannerUrl?: string;
}
export declare class OnboardingStatusResponse {
    id: string;
    currentStep: OnboardingStep;
    businessType?: BusinessType | null;
    salesChannels?: SalesChannel[] | null;
    productTypes?: ProductType[] | null;
    storeName?: string | null;
    storeUrl?: string | null;
    storeDescription?: string | null;
    currency?: string | null;
    logoUrl?: string | null;
    bannerUrl?: string | null;
    isCompleted: boolean;
    nextSteps: string[];
    createdAt: Date;
    updatedAt: Date;
}
