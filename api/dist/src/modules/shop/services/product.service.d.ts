import { Repository } from 'typeorm';
import { Product, ProductStatus } from '../entities/product.entity';
import { ProductImage } from '../entities/product-image.entity';
import { ProductVariant } from '../entities/product-variant.entity';
import { Store } from '../entities/store.entity';
import { DigitalProduct } from '../entities/digital-product.entity';
import { DigitalAccess } from '../entities/digital-access.entity';
import { CreateProductDto, UpdateProductDto, UpdateProductStatusDto, PublishProductDto } from '../dto/product.dto';
import { SearchProductsDto, BulkUpdateTagsDto, BulkUpdatePriceDto } from '../dto/search.dto';
import { CreateDigitalProductDto, UpdateDigitalProductDto } from '../dto/digital-product.dto';
import { TrackClickDto } from '../../links/dto/link.dto';
import { DigitalDeliveryService } from './digital-delivery.service';
export declare class ProductService {
    private readonly productRepository;
    private readonly productImageRepository;
    private readonly productVariantRepository;
    private readonly storeRepository;
    private readonly digitalProductRepository;
    private readonly digitalAccessRepository;
    private readonly digitalDeliveryService;
    constructor(productRepository: Repository<Product>, productImageRepository: Repository<ProductImage>, productVariantRepository: Repository<ProductVariant>, storeRepository: Repository<Store>, digitalProductRepository: Repository<DigitalProduct>, digitalAccessRepository: Repository<DigitalAccess>, digitalDeliveryService: DigitalDeliveryService);
    createProduct(userId: string, storeId: string, createProductDto: CreateProductDto): Promise<Product>;
    getStoreProducts(userId: string, storeId: string, includeInactive?: boolean): Promise<Product[]>;
    getProductById(userId: string, storeId: string, productId: string): Promise<Product>;
    updateProduct(userId: string, storeId: string, productId: string, updateProductDto: UpdateProductDto): Promise<Product>;
    updateProductStatus(userId: string, storeId: string, productId: string, updateStatusDto: UpdateProductStatusDto): Promise<Product>;
    publishProduct(userId: string, storeId: string, productId: string, publishDto: PublishProductDto): Promise<Product>;
    deleteProduct(userId: string, storeId: string, productId: string): Promise<void>;
    duplicateProduct(userId: string, storeId: string, productId: string): Promise<Product>;
    searchProducts(userId: string, storeId: string, searchDto: SearchProductsDto): Promise<{
        products: Product[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getProductsByTag(userId: string, storeId: string, tag: string): Promise<Product[]>;
    getAllTags(userId: string, storeId: string): Promise<{
        tag: string;
        count: number;
    }[]>;
    bulkUpdateTags(userId: string, storeId: string, bulkUpdateDto: BulkUpdateTagsDto): Promise<{
        updated: number;
    }>;
    bulkUpdatePrice(userId: string, storeId: string, bulkUpdateDto: BulkUpdatePriceDto): Promise<{
        updated: number;
    }>;
    private generateHandle;
    private generateUniqueHandle;
    getPublicStoreProducts(storeId: string, options: {
        page: number;
        limit: number;
        search?: string;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        sortBy: string;
        sortOrder: string;
    }): Promise<{
        message: string;
        products: {
            id: string;
            title: string;
            description: string | null;
            handle: string;
            type: import("../entities/product.entity").ProductType;
            status: ProductStatus;
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
    getPublicProduct(storeId: string, productHandle: string): Promise<{
        message: string;
        product: null;
        store: null;
    } | {
        message: string;
        product: {
            id: string;
            title: string;
            description: string | null;
            handle: string;
            type: import("../entities/product.entity").ProductType;
            status: ProductStatus;
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
    searchPublicProducts(options: {
        q: string;
        page: number;
        limit: number;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        sortBy: string;
        sortOrder: string;
    }): Promise<{
        message: string;
        products: {
            id: string;
            title: string;
            description: string | null;
            handle: string;
            price: string | undefined;
            compareAtPrice: string | undefined;
            images: {
                imageUrl: string;
                altText: string | null;
                isPrimary: boolean;
            }[];
            store: {
                id: string;
                name: string;
                storeUrl: string;
                logoUrl: string | null;
            };
            owner: {
                username: string;
                profileImageUrl: string;
            };
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
        filters: {
            categories: string[];
            priceRange: {
                min: number;
                max: number;
            };
        };
    }>;
    getFeaturedProducts(options: {
        page: number;
        limit: number;
    }): Promise<{
        message: string;
        products: {
            id: string;
            title: string;
            description: string | null;
            handle: string;
            price: string | undefined;
            compareAtPrice: string | undefined;
            images: {
                imageUrl: string;
                altText: string | null;
                isPrimary: boolean;
            }[];
            store: {
                name: string;
                storeUrl: string;
                logoUrl: string | null;
            };
            owner: {
                username: string;
                profileImageUrl: string;
            };
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
    private getAvailableCategories;
    private getPriceRange;
    trackProductView(storeId: string, productHandle: string, trackClickDto: TrackClickDto): Promise<string>;
    updateProductVariant(userId: string, storeId: string, productId: string, variantId: string, updateVariantDto: any): Promise<ProductVariant>;
    uploadDigitalFile(userId: string, storeId: string, productId: string, file: any, createDto: CreateDigitalProductDto): Promise<{
        digitalProduct: DigitalProduct;
    }>;
    getDigitalProduct(userId: string, storeId: string, productId: string): Promise<DigitalProduct>;
    updateDigitalProduct(userId: string, storeId: string, productId: string, updateDto: UpdateDigitalProductDto): Promise<DigitalProduct>;
    getDigitalProductAnalytics(userId: string, storeId: string, productId: string): Promise<any>;
    getDigitalProductAccess(userId: string, storeId: string, productId: string, page?: number, limit?: number): Promise<{
        accessRecords: any[];
        pagination: any;
    }>;
}
