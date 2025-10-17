import { StoreOnboardingService } from '../services/store-onboarding.service';
export declare class PublicStoreOnboardingController {
    private readonly onboardingService;
    constructor(onboardingService: StoreOnboardingService);
    getBusinessTypes(): {
        message: string;
        businessTypes: {
            value: import("../entities/store-onboarding.entity").BusinessType;
            label: string;
            description: string;
        }[];
    };
    getSalesChannels(): {
        message: string;
        salesChannels: {
            value: import("../entities/store-onboarding.entity").SalesChannel;
            label: string;
            description: string;
            icon: string;
        }[];
    };
    getProductTypes(): {
        message: string;
        productTypes: {
            value: import("../entities/store-onboarding.entity").ProductType;
            label: string;
            description: string;
            icon: string;
        }[];
    };
}
