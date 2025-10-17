import { StoreService } from '../services/store.service';
import { StoreOnboardingService } from '../services/store-onboarding.service';
import { CreateStoreDto, UpdateStoreDto, UpdateStoreStatusDto } from '../dto/store.dto';
import { TrackClickDto } from '../../links/dto/link.dto';
export declare class StoreController {
    private readonly storeService;
    private readonly onboardingService;
    constructor(storeService: StoreService, onboardingService: StoreOnboardingService);
    create(req: any, createStoreDto: CreateStoreDto): Promise<{
        message: string;
        store: import("../entities/store.entity").Store;
        onboardingData: any;
    }>;
    findAll(req: any, includeInactive?: string): Promise<{
        message: string;
        stores: import("../entities/store.entity").Store[];
        total: number;
        hasStores: boolean;
        canCreateMore: boolean;
    }>;
    checkUserStores(req: any): Promise<{
        message: string;
        hasStores: boolean;
        storeCount: number;
        canCreateMore: boolean;
        maxStores: number;
        stores: {
            id: string;
            name: string;
            storeUrl: string;
            status: import("../entities/store.entity").StoreStatus;
            totalProducts: number;
        }[];
    }>;
    getAnalytics(req: any, storeId?: string): Promise<{
        message: string;
        analytics: any;
    }>;
    getOnboardingStatus(req: any): Promise<{
        message: string;
        onboarding: import("../dto/store-onboarding.dto").OnboardingStatusResponse;
        hasOnboarding: boolean;
        canStartOnboarding?: undefined;
    } | {
        message: string;
        onboarding: null;
        hasOnboarding: boolean;
        canStartOnboarding: boolean;
    }>;
    checkUrlAvailability(storeUrl: string): Promise<{
        message: string;
        storeUrl: string;
        isAvailable: boolean;
        suggestion: string | null;
    }>;
    findOne(req: any, id: string): Promise<{
        message: string;
        store: import("../entities/store.entity").Store;
    }>;
    update(req: any, id: string, updateStoreDto: UpdateStoreDto): Promise<{
        message: string;
        store: import("../entities/store.entity").Store;
    }>;
    updateStatus(req: any, id: string, updateStatusDto: UpdateStoreStatusDto): Promise<{
        message: string;
        store: import("../entities/store.entity").Store;
    }>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
    restoreStore(req: any, id: string): Promise<{
        message: string;
        store: import("../entities/store.entity").Store;
    }>;
    getDeletedStores(req: any): Promise<{
        message: string;
        stores: import("../entities/store.entity").Store[];
        total: number;
    }>;
    suspendStore(id: string, reason: string): Promise<{
        message: string;
        store: import("../entities/store.entity").Store;
    }>;
    unsuspendStore(id: string): Promise<{
        message: string;
        store: import("../entities/store.entity").Store;
    }>;
    getPublicStore(storeUrl: string): Promise<{
        message: string;
        store: null;
        owner: null;
        exists: boolean;
    } | {
        message: string;
        store: {
            id: string;
            name: string;
            description: string | null;
            storeUrl: string;
            logoUrl: string | null;
            bannerUrl: string | null;
            currency: import("../entities/store.entity").StoreCurrency;
            isActive: boolean;
            totalProducts: number;
            createdAt: Date;
        };
        owner: {
            id: string;
            username: string;
            firstName: string;
            lastName: string;
            profileImageUrl: string;
        };
        exists: boolean;
    }>;
    getPublicStoreProducts(storeUrl: string, page?: number, limit?: number, search?: string, category?: string, minPrice?: number, maxPrice?: number, sortBy?: string, sortOrder?: string): Promise<{
        exists: boolean;
        message: string;
        products: {
            id: string;
            title: string;
            description: string | null;
            handle: string;
            type: import("../entities/product.entity").ProductType;
            status: import("../entities/product.entity").ProductStatus;
            price: string | undefined;
            compareAtPrice: string | undefined;
            trackQuantity: boolean;
            inventoryQuantity: number;
            requiresShipping: boolean;
            weight: number | null;
            weightUnit: string;
            tags: string[] | null;
            isPublished: boolean;
            publishedAt: Date | null;
            isFeatured: boolean;
            viewCount: number;
            orderCount: number;
            images: {
                id: string;
                imageUrl: string;
                altText: string | null;
                displayOrder: number;
                isPrimary: boolean;
            }[];
            variants: {
                id: string;
                title: string;
                sku: string | null;
                price: string;
                compareAtPrice: string | undefined;
                inventoryQuantity: number;
                isActive: boolean;
                displayOrder: number;
            }[];
            createdAt: Date;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    getPublicProduct(storeUrl: string, productHandle: string): Promise<{
        message: string;
        product: null;
        store: null;
        exists: boolean;
    } | {
        exists: boolean;
        message: string;
        product: {
            id: string;
            title: string;
            description: string | null;
            handle: string;
            type: import("../entities/product.entity").ProductType;
            status: import("../entities/product.entity").ProductStatus;
            price: string | undefined;
            compareAtPrice: string | undefined;
            costPerItem: string | undefined;
            trackQuantity: boolean;
            inventoryQuantity: number;
            continueSelling: boolean;
            requiresShipping: boolean;
            weight: number | null;
            weightUnit: string;
            seoTitle: string | null;
            seoDescription: string | null;
            productCategory: string | null;
            productType: string | null;
            vendor: string | null;
            tags: string[] | null;
            isPublished: boolean;
            publishedAt: Date | null;
            isFeatured: boolean;
            viewCount: number;
            orderCount: number;
            images: {
                id: string;
                imageUrl: string;
                altText: string | null;
                displayOrder: number;
                isPrimary: boolean;
                fileSize: number | null;
                fileType: string | null;
            }[];
            variants: {
                id: string;
                title: string;
                sku: string | null;
                barcode: string | null;
                price: string;
                compareAtPrice: string | undefined;
                costPerItem: string | undefined;
                inventoryQuantity: number;
                inventoryPolicy: string;
                option1Name: string | null;
                option1Value: string | null;
                option2Name: string | null;
                option2Value: string | null;
                weight: number | null;
                weightUnit: string;
                isActive: boolean;
                displayOrder: number;
            }[];
            createdAt: Date;
            updatedAt: Date;
        };
        store: {
            id: string;
            name: string;
            storeUrl: string;
            logoUrl: string | null;
        };
    }>;
    trackProductView(storeUrl: string, productHandle: string, trackClickDto: TrackClickDto): Promise<{
        message: string;
        viewId: string;
    }>;
}
