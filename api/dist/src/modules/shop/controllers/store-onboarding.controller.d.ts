import { StoreOnboardingService } from '../services/store-onboarding.service';
import { StartOnboardingDto, UpdateBusinessTypeDto, UpdateSalesChannelsDto, UpdateProductTypesDto, UpdateStoreSetupDto, CompleteOnboardingDto, OnboardingStatusResponse } from '../dto/store-onboarding.dto';
export declare class StoreOnboardingController {
    private readonly onboardingService;
    constructor(onboardingService: StoreOnboardingService);
    startOnboarding(req: any, startDto: StartOnboardingDto): Promise<{
        message: string;
        onboarding: {
            id: string;
            currentStep: import("../entities/store-onboarding.entity").OnboardingStep;
            isCompleted: boolean;
            createdAt: Date;
        };
    }>;
    getOnboardingStatus(req: any): Promise<OnboardingStatusResponse>;
    updateBusinessType(req: any, updateDto: UpdateBusinessTypeDto): Promise<{
        message: string;
        onboarding: {
            id: string;
            currentStep: import("../entities/store-onboarding.entity").OnboardingStep;
            businessType: import("../entities/store-onboarding.entity").BusinessType | null;
        };
    }>;
    updateSalesChannels(req: any, updateDto: UpdateSalesChannelsDto): Promise<{
        message: string;
        onboarding: {
            id: string;
            currentStep: import("../entities/store-onboarding.entity").OnboardingStep;
            salesChannels: import("../entities/store-onboarding.entity").SalesChannel[] | null;
        };
    }>;
    updateProductTypes(req: any, updateDto: UpdateProductTypesDto): Promise<{
        message: string;
        onboarding: {
            id: string;
            currentStep: import("../entities/store-onboarding.entity").OnboardingStep;
            productTypes: import("../entities/store-onboarding.entity").ProductType[] | null;
        };
    }>;
    updateStoreSetup(req: any, updateDto: UpdateStoreSetupDto): Promise<{
        message: string;
        onboarding: {
            id: string;
            currentStep: import("../entities/store-onboarding.entity").OnboardingStep;
            storeName: string | null;
            storeUrl: string | null;
            storeDescription: string | null;
            currency: string | null;
            logoUrl: string | null;
            bannerUrl: string | null;
        };
    }>;
    completeOnboarding(req: any, completeDto: CompleteOnboardingDto): Promise<{
        message: string;
        onboarding: {
            id: string;
            currentStep: import("../entities/store-onboarding.entity").OnboardingStep;
            isCompleted: boolean;
        };
        store: {
            id: string;
            name: string;
            storeUrl: string;
            status: import("../entities/store.entity").StoreStatus;
            createdAt: Date;
        } | null;
    }>;
    completeOnboardingWithoutStore(req: any, completeDto: CompleteOnboardingDto): Promise<{
        message: string;
        onboarding: {
            id: string;
            currentStep: import("../entities/store-onboarding.entity").OnboardingStep;
            isCompleted: boolean;
        };
    }>;
    resetOnboarding(req: any): Promise<{
        message: string;
        onboarding: {
            id: string;
            currentStep: import("../entities/store-onboarding.entity").OnboardingStep;
            isCompleted: boolean;
        };
    }>;
    deleteOnboarding(req: any): Promise<{
        message: string;
    }>;
}
