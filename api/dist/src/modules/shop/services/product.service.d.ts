import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { ProductImage } from '../entities/product-image.entity';
import { ProductVariant } from '../entities/product-variant.entity';
import { Store } from '../entities/store.entity';
import { CreateProductDto, UpdateProductDto, UpdateProductStatusDto, PublishProductDto } from '../dto/product.dto';
import { SearchProductsDto, BulkUpdateTagsDto, BulkUpdatePriceDto } from '../dto/search.dto';
export declare class ProductService {
    private readonly productRepository;
    private readonly productImageRepository;
    private readonly productVariantRepository;
    private readonly storeRepository;
    constructor(productRepository: Repository<Product>, productImageRepository: Repository<ProductImage>, productVariantRepository: Repository<ProductVariant>, storeRepository: Repository<Store>);
    createProduct(userId: string, storeId: string, createProductDto: CreateProductDto): Promise<Product>;
    getStoreProducts(userId: string, storeId: string, includeInactive?: boolean): Promise<Product[]>;
    getProductById(userId: string, storeId: string, productId: string): Promise<Product>;
    getPublicProduct(storeUrl: string, productHandle: string): Promise<Product>;
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
}
