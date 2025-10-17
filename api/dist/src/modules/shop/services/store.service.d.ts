import { Repository } from 'typeorm';
import { Store } from '../entities/store.entity';
import { CreateStoreDto, UpdateStoreDto, UpdateStoreStatusDto } from '../dto/store.dto';
import { ProductService } from './product.service';
import { TrackClickDto } from '../../links/dto/link.dto';
export declare class StoreService {
    private readonly storeRepository;
    private readonly productService;
    constructor(storeRepository: Repository<Store>, productService: ProductService);
    createStore(userId: string, createStoreDto: CreateStoreDto): Promise<Store>;
    getUserStores(userId: string, includeInactive?: boolean): Promise<Store[]>;
    getStoreById(userId: string, storeId: string): Promise<Store>;
    updateStore(userId: string, storeId: string, updateStoreDto: UpdateStoreDto): Promise<Store>;
    updateStoreStatus(userId: string, storeId: string, updateStatusDto: UpdateStoreStatusDto): Promise<Store>;
    deleteStore(userId: string, storeId: string): Promise<void>;
    restoreStore(userId: string, storeId: string): Promise<Store>;
    getDeletedStores(userId: string): Promise<Store[]>;
    suspendStore(storeId: string, reason: string): Promise<Store>;
    unsuspendStore(storeId: string): Promise<Store>;
    checkStoreUrlAvailability(storeUrl: string): Promise<boolean>;
    getStoreAnalytics(userId: string, storeId?: string): Promise<any>;
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
    getPublicStoreProducts(storeUrl: string, options: {
        page: number;
        limit: number;
        search?: string;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        sortBy: string;
        sortOrder: string;
    }): Promise<{
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
    trackProductView(storeUrl: string, productHandle: string, trackClickDto: TrackClickDto): Promise<string>;
}
