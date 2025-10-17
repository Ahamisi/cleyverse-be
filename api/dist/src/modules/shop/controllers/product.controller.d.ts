import { ProductService } from '../services/product.service';
import { CreateProductDto, UpdateProductDto, UpdateProductStatusDto, PublishProductDto } from '../dto/product.dto';
import { SearchProductsDto, BulkUpdateTagsDto, BulkUpdatePriceDto } from '../dto/search.dto';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create(req: any, storeId: string, createProductDto: CreateProductDto): Promise<{
        message: string;
        product: import("../entities/product.entity").Product;
    }>;
    searchProducts(req: any, storeId: string, searchDto: SearchProductsDto): Promise<{
        products: import("../entities/product.entity").Product[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        message: string;
    }>;
    getAllTags(req: any, storeId: string): Promise<{
        message: string;
        tags: {
            tag: string;
            count: number;
        }[];
    }>;
    getProductsByTag(req: any, storeId: string, tag: string): Promise<{
        message: string;
        products: import("../entities/product.entity").Product[];
        total: number;
    }>;
    bulkUpdateTags(req: any, storeId: string, bulkUpdateDto: BulkUpdateTagsDto): Promise<{
        updated: number;
        message: string;
    }>;
    bulkUpdatePrice(req: any, storeId: string, bulkUpdateDto: BulkUpdatePriceDto): Promise<{
        updated: number;
        message: string;
    }>;
    findAll(req: any, storeId: string, includeInactive?: string): Promise<{
        message: string;
        products: import("../entities/product.entity").Product[];
        total: number;
    }>;
    findOne(req: any, storeId: string, id: string): Promise<{
        message: string;
        product: import("../entities/product.entity").Product;
    }>;
    update(req: any, storeId: string, id: string, updateProductDto: UpdateProductDto): Promise<{
        message: string;
        product: import("../entities/product.entity").Product;
    }>;
    updateStatus(req: any, storeId: string, id: string, updateStatusDto: UpdateProductStatusDto): Promise<{
        message: string;
        product: import("../entities/product.entity").Product;
    }>;
    publish(req: any, storeId: string, id: string, publishDto: PublishProductDto): Promise<{
        message: string;
        product: import("../entities/product.entity").Product;
    }>;
    duplicate(req: any, storeId: string, id: string): Promise<{
        message: string;
        product: import("../entities/product.entity").Product;
    }>;
    remove(req: any, storeId: string, id: string): Promise<{
        message: string;
    }>;
}
export declare class PublicProductController {
    private readonly productService;
    constructor(productService: ProductService);
    getPublicProduct(storeUrl: string, productHandle: string): Promise<{
        message: string;
        product: {
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
        };
    }>;
}
