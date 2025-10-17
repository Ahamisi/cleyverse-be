import { User } from '../../users/entities/user.entity';
export declare enum BusinessType {
    JUST_STARTING = "just_starting",
    ALREADY_SELLING = "already_selling"
}
export declare enum SalesChannel {
    ONLINE_STORE = "online_store",
    SOCIAL_MEDIA = "social_media",
    IN_PERSON = "in_person",
    MARKETPLACES = "marketplaces",
    EXISTING_WEBSITE = "existing_website",
    NOT_SURE = "not_sure"
}
export declare enum ProductType {
    PHYSICAL_PRODUCTS = "physical_products",
    DIGITAL_PRODUCTS = "digital_products",
    SERVICES = "services",
    DROPSHIPPING = "dropshipping",
    PRINT_ON_DEMAND = "print_on_demand",
    DECIDE_LATER = "decide_later"
}
export declare enum OnboardingStep {
    WELCOME = "welcome",
    BUSINESS_TYPE = "business_type",
    SALES_CHANNELS = "sales_channels",
    PRODUCT_TYPE = "product_type",
    STORE_SETUP = "store_setup",
    COMPLETED = "completed"
}
export declare class StoreOnboarding {
    id: string;
    userId: string;
    user: User;
    currentStep: OnboardingStep;
    businessType: BusinessType | null;
    salesChannels: SalesChannel[] | null;
    productTypes: ProductType[] | null;
    storeName: string | null;
    storeUrl: string | null;
    storeDescription: string | null;
    currency: string | null;
    logoUrl: string | null;
    bannerUrl: string | null;
    isCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
