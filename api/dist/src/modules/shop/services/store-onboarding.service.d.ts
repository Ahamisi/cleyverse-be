import { Repository } from 'typeorm';
import { StoreOnboarding, BusinessType, SalesChannel, ProductType } from '../entities/store-onboarding.entity';
import { Store } from '../entities/store.entity';
import { StartOnboardingDto, UpdateBusinessTypeDto, UpdateSalesChannelsDto, UpdateProductTypesDto, UpdateStoreSetupDto, CompleteOnboardingDto, OnboardingStatusResponse } from '../dto/store-onboarding.dto';
export declare class StoreOnboardingService {
    private readonly onboardingRepository;
    private readonly storeRepository;
    constructor(onboardingRepository: Repository<StoreOnboarding>, storeRepository: Repository<Store>);
    startOnboarding(userId: string, startDto: StartOnboardingDto): Promise<StoreOnboarding>;
    getOnboardingStatus(userId: string): Promise<OnboardingStatusResponse>;
    updateBusinessType(userId: string, updateDto: UpdateBusinessTypeDto): Promise<StoreOnboarding>;
    updateSalesChannels(userId: string, updateDto: UpdateSalesChannelsDto): Promise<StoreOnboarding>;
    updateProductTypes(userId: string, updateDto: UpdateProductTypesDto): Promise<StoreOnboarding>;
    updateStoreSetup(userId: string, updateDto: UpdateStoreSetupDto): Promise<StoreOnboarding>;
    completeOnboarding(userId: string, completeDto: CompleteOnboardingDto, createStore?: boolean): Promise<{
        onboarding: StoreOnboarding;
        store?: Store;
    }>;
    resetOnboarding(userId: string): Promise<StoreOnboarding>;
    deleteOnboarding(userId: string): Promise<void>;
    private getOnboardingByUserId;
    private getNextSteps;
    getBusinessTypes(): {
        value: BusinessType;
        label: string;
        description: string;
    }[];
    getSalesChannels(): {
        value: SalesChannel;
        label: string;
        description: string;
        icon: string;
    }[];
    getProductTypes(): {
        value: ProductType;
        label: string;
        description: string;
        icon: string;
    }[];
    private formatBusinessTypeLabel;
    private getBusinessTypeDescription;
    private formatSalesChannelLabel;
    private getSalesChannelDescription;
    private getSalesChannelIcon;
    private formatProductTypeLabel;
    private getProductTypeDescription;
    private getProductTypeIcon;
}
