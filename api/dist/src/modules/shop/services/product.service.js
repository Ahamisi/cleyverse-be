"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../entities/product.entity");
const product_image_entity_1 = require("../entities/product-image.entity");
const product_variant_entity_1 = require("../entities/product-variant.entity");
const store_entity_1 = require("../entities/store.entity");
const search_dto_1 = require("../dto/search.dto");
let ProductService = class ProductService {
    productRepository;
    productImageRepository;
    productVariantRepository;
    storeRepository;
    constructor(productRepository, productImageRepository, productVariantRepository, storeRepository) {
        this.productRepository = productRepository;
        this.productImageRepository = productImageRepository;
        this.productVariantRepository = productVariantRepository;
        this.storeRepository = storeRepository;
    }
    async createProduct(userId, storeId, createProductDto) {
        const store = await this.storeRepository.findOne({
            where: { id: storeId, userId }
        });
        if (!store) {
            throw new common_1.NotFoundException('Store not found or does not belong to user');
        }
        const handle = this.generateHandle(createProductDto.title);
        const existingProduct = await this.productRepository.findOne({
            where: { handle }
        });
        if (existingProduct) {
            throw new common_1.BadRequestException('A product with this title already exists');
        }
        const product = this.productRepository.create({
            ...createProductDto,
            storeId,
            handle,
            status: product_entity_1.ProductStatus.DRAFT,
        });
        const savedProduct = await this.productRepository.save(product);
        if (createProductDto.images && createProductDto.images.length > 0) {
            const images = createProductDto.images.map((imageDto, index) => this.productImageRepository.create({
                ...imageDto,
                productId: savedProduct.id,
                displayOrder: imageDto.displayOrder ?? index,
                isPrimary: index === 0 || imageDto.isPrimary || false,
            }));
            await this.productImageRepository.save(images);
        }
        if (createProductDto.variants && createProductDto.variants.length > 0) {
            const variants = createProductDto.variants.map((variantDto, index) => this.productVariantRepository.create({
                ...variantDto,
                productId: savedProduct.id,
                displayOrder: index,
            }));
            await this.productVariantRepository.save(variants);
        }
        await this.storeRepository.increment({ id: storeId }, 'totalProducts', 1);
        return this.getProductById(userId, storeId, savedProduct.id);
    }
    async getStoreProducts(userId, storeId, includeInactive = false) {
        const store = await this.storeRepository.findOne({
            where: { id: storeId, userId }
        });
        if (!store) {
            throw new common_1.NotFoundException('Store not found or does not belong to user');
        }
        const queryBuilder = this.productRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.images', 'images')
            .leftJoinAndSelect('product.variants', 'variants')
            .where('product.storeId = :storeId', { storeId })
            .orderBy('product.createdAt', 'DESC')
            .addOrderBy('images.displayOrder', 'ASC')
            .addOrderBy('variants.displayOrder', 'ASC');
        if (!includeInactive) {
            queryBuilder.andWhere('product.status != :archivedStatus', { archivedStatus: product_entity_1.ProductStatus.ARCHIVED });
        }
        return queryBuilder.getMany();
    }
    async getProductById(userId, storeId, productId) {
        const store = await this.storeRepository.findOne({
            where: { id: storeId, userId }
        });
        if (!store) {
            throw new common_1.NotFoundException('Store not found or does not belong to user');
        }
        const product = await this.productRepository.findOne({
            where: { id: productId, storeId },
            relations: ['images', 'variants']
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async getPublicProduct(storeUrl, productHandle) {
        const product = await this.productRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.images', 'images')
            .leftJoinAndSelect('product.variants', 'variants')
            .leftJoinAndSelect('product.store', 'store')
            .where('product.handle = :productHandle', { productHandle })
            .andWhere('store.storeUrl = :storeUrl', { storeUrl })
            .andWhere('product.isPublished = true')
            .andWhere('product.status = :status', { status: product_entity_1.ProductStatus.ACTIVE })
            .andWhere('store.status = :storeStatus', { storeStatus: 'active' })
            .getOne();
        if (!product) {
            throw new common_1.NotFoundException('Product not found or not available');
        }
        await this.productRepository.increment({ id: product.id }, 'viewCount', 1);
        return product;
    }
    async updateProduct(userId, storeId, productId, updateProductDto) {
        const product = await this.getProductById(userId, storeId, productId);
        if (updateProductDto.title && updateProductDto.title !== product.title) {
            const newHandle = this.generateHandle(updateProductDto.title);
            const existingProduct = await this.productRepository.findOne({
                where: { handle: newHandle }
            });
            if (existingProduct && existingProduct.id !== productId) {
                throw new common_1.BadRequestException('A product with this title already exists');
            }
            updateProductDto.handle = newHandle;
        }
        Object.assign(product, updateProductDto);
        return this.productRepository.save(product);
    }
    async updateProductStatus(userId, storeId, productId, updateStatusDto) {
        const product = await this.getProductById(userId, storeId, productId);
        product.status = updateStatusDto.status;
        if (updateStatusDto.status === product_entity_1.ProductStatus.ARCHIVED) {
            product.archivedAt = new Date();
            product.isPublished = false;
        }
        else if (product.archivedAt) {
            product.archivedAt = null;
        }
        return this.productRepository.save(product);
    }
    async publishProduct(userId, storeId, productId, publishDto) {
        const product = await this.getProductById(userId, storeId, productId);
        product.isPublished = publishDto.isPublished;
        product.publishedAt = publishDto.isPublished ? new Date() : null;
        if (publishDto.isPublished && product.status !== product_entity_1.ProductStatus.ACTIVE) {
            product.status = product_entity_1.ProductStatus.ACTIVE;
        }
        return this.productRepository.save(product);
    }
    async deleteProduct(userId, storeId, productId) {
        const product = await this.getProductById(userId, storeId, productId);
        if (product.orderCount > 0) {
            throw new common_1.BadRequestException('Cannot delete product with existing orders. Archive it instead.');
        }
        await this.productRepository.remove(product);
        await this.storeRepository.decrement({ id: storeId }, 'totalProducts', 1);
    }
    async duplicateProduct(userId, storeId, productId) {
        const originalProduct = await this.getProductById(userId, storeId, productId);
        const copyTitle = `Copy of ${originalProduct.title}`;
        const copyHandle = this.generateHandle(copyTitle);
        const productData = {
            ...originalProduct,
            id: undefined,
            createdAt: undefined,
            updatedAt: undefined,
            images: undefined,
            variants: undefined,
            store: undefined,
            title: copyTitle,
            handle: copyHandle,
            status: product_entity_1.ProductStatus.DRAFT,
            isPublished: false,
            publishedAt: null,
            viewCount: 0,
            orderCount: 0,
        };
        const newProduct = this.productRepository.create(productData);
        const savedProduct = await this.productRepository.save(newProduct);
        for (const image of originalProduct.images) {
            const newImage = this.productImageRepository.create({
                ...image,
                id: undefined,
                productId: savedProduct.id,
                createdAt: undefined,
                updatedAt: undefined,
            });
            await this.productImageRepository.save(newImage);
        }
        for (const variant of originalProduct.variants) {
            const newVariant = this.productVariantRepository.create({
                ...variant,
                id: undefined,
                productId: savedProduct.id,
                createdAt: undefined,
                updatedAt: undefined,
            });
            await this.productVariantRepository.save(newVariant);
        }
        await this.storeRepository.increment({ id: storeId }, 'totalProducts', 1);
        return this.getProductById(userId, storeId, savedProduct.id);
    }
    async searchProducts(userId, storeId, searchDto) {
        const store = await this.storeRepository.findOne({
            where: { id: storeId, userId }
        });
        if (!store) {
            throw new common_1.NotFoundException('Store not found or does not belong to user');
        }
        const page = searchDto.page || 1;
        const limit = searchDto.limit || 20;
        const skip = (page - 1) * limit;
        let queryBuilder = this.productRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.images', 'images')
            .leftJoinAndSelect('product.variants', 'variants')
            .where('product.storeId = :storeId', { storeId })
            .andWhere('product.status != :archivedStatus', { archivedStatus: product_entity_1.ProductStatus.ARCHIVED });
        if (searchDto.search) {
            queryBuilder = queryBuilder.andWhere('(product.title ILIKE :search OR product.description ILIKE :search OR product.tags::text ILIKE :search OR variants.sku ILIKE :search)', { search: `%${searchDto.search}%` });
        }
        if (searchDto.category) {
            queryBuilder = queryBuilder.andWhere('product.productCategory = :category', { category: searchDto.category });
        }
        if (searchDto.vendor) {
            queryBuilder = queryBuilder.andWhere('product.vendor = :vendor', { vendor: searchDto.vendor });
        }
        if (searchDto.tags && searchDto.tags.length > 0) {
            queryBuilder = queryBuilder.andWhere('product.tags && :tags::text[]', { tags: searchDto.tags });
        }
        if (searchDto.minPrice !== undefined) {
            queryBuilder = queryBuilder.andWhere('product.price >= :minPrice', { minPrice: searchDto.minPrice });
        }
        if (searchDto.maxPrice !== undefined) {
            queryBuilder = queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice: searchDto.maxPrice });
        }
        if (searchDto.availability) {
            const lowStockThreshold = store.lowStockThreshold;
            switch (searchDto.availability) {
                case search_dto_1.ProductAvailability.IN_STOCK:
                    queryBuilder = queryBuilder.andWhere('product.inventoryQuantity > :threshold', { threshold: lowStockThreshold });
                    break;
                case search_dto_1.ProductAvailability.LOW_STOCK:
                    queryBuilder = queryBuilder.andWhere('product.inventoryQuantity > 0 AND product.inventoryQuantity <= :threshold', { threshold: lowStockThreshold });
                    break;
                case search_dto_1.ProductAvailability.OUT_OF_STOCK:
                    queryBuilder = queryBuilder.andWhere('product.inventoryQuantity = 0');
                    break;
            }
        }
        const sortBy = searchDto.sortBy || 'createdAt';
        const sortOrder = searchDto.sortOrder || 'DESC';
        queryBuilder = queryBuilder
            .orderBy(`product.${sortBy}`, sortOrder)
            .addOrderBy('images.displayOrder', 'ASC')
            .addOrderBy('variants.displayOrder', 'ASC');
        const total = await queryBuilder.getCount();
        const products = await queryBuilder
            .skip(skip)
            .take(limit)
            .getMany();
        const totalPages = Math.ceil(total / limit);
        return {
            products,
            total,
            page,
            limit,
            totalPages
        };
    }
    async getProductsByTag(userId, storeId, tag) {
        const store = await this.storeRepository.findOne({
            where: { id: storeId, userId }
        });
        if (!store) {
            throw new common_1.NotFoundException('Store not found or does not belong to user');
        }
        return this.productRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.images', 'images')
            .leftJoinAndSelect('product.variants', 'variants')
            .where('product.storeId = :storeId', { storeId })
            .andWhere('product.status = :status', { status: product_entity_1.ProductStatus.ACTIVE })
            .andWhere(':tag = ANY(product.tags)', { tag })
            .orderBy('product.createdAt', 'DESC')
            .addOrderBy('images.displayOrder', 'ASC')
            .getMany();
    }
    async getAllTags(userId, storeId) {
        const store = await this.storeRepository.findOne({
            where: { id: storeId, userId }
        });
        if (!store) {
            throw new common_1.NotFoundException('Store not found or does not belong to user');
        }
        const result = await this.productRepository.query(`
      SELECT tag, COUNT(*) as count
      FROM (
        SELECT unnest(tags) as tag
        FROM products
        WHERE store_id = $1 
        AND status != $2 
        AND tags IS NOT NULL
      ) as tag_list
      GROUP BY tag
      ORDER BY count DESC, tag ASC
    `, [storeId, product_entity_1.ProductStatus.ARCHIVED]);
        return result.map(row => ({
            tag: row.tag,
            count: parseInt(row.count)
        }));
    }
    async bulkUpdateTags(userId, storeId, bulkUpdateDto) {
        const store = await this.storeRepository.findOne({
            where: { id: storeId, userId }
        });
        if (!store) {
            throw new common_1.NotFoundException('Store not found or does not belong to user');
        }
        const products = await this.productRepository.find({
            where: {
                id: (0, typeorm_2.In)(bulkUpdateDto.productIds),
                storeId
            }
        });
        if (products.length !== bulkUpdateDto.productIds.length) {
            throw new common_1.BadRequestException('Some products not found or do not belong to this store');
        }
        const result = await this.productRepository.update({ id: (0, typeorm_2.In)(bulkUpdateDto.productIds) }, { tags: bulkUpdateDto.tags });
        return { updated: result.affected || 0 };
    }
    async bulkUpdatePrice(userId, storeId, bulkUpdateDto) {
        const store = await this.storeRepository.findOne({
            where: { id: storeId, userId }
        });
        if (!store) {
            throw new common_1.NotFoundException('Store not found or does not belong to user');
        }
        const products = await this.productRepository.find({
            where: {
                id: (0, typeorm_2.In)(bulkUpdateDto.productIds),
                storeId
            }
        });
        if (products.length !== bulkUpdateDto.productIds.length) {
            throw new common_1.BadRequestException('Some products not found or do not belong to this store');
        }
        const result = await this.productRepository.update({ id: (0, typeorm_2.In)(bulkUpdateDto.productIds) }, { price: bulkUpdateDto.price });
        return { updated: result.affected || 0 };
    }
    generateHandle(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(product_image_entity_1.ProductImage)),
    __param(2, (0, typeorm_1.InjectRepository)(product_variant_entity_1.ProductVariant)),
    __param(3, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProductService);
//# sourceMappingURL=product.service.js.map