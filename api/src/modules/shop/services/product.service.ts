import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In, Between } from 'typeorm';
import { Product, ProductStatus } from '../entities/product.entity';
import { ProductImage } from '../entities/product-image.entity';
import { ProductVariant } from '../entities/product-variant.entity';
import { Store } from '../entities/store.entity';
import { DigitalProduct } from '../entities/digital-product.entity';
import { DigitalAccess } from '../entities/digital-access.entity';
import { CreateProductDto, UpdateProductDto, UpdateProductStatusDto, PublishProductDto } from '../dto/product.dto';
import { SearchProductsDto, ProductAvailability, BulkUpdateTagsDto, BulkUpdatePriceDto } from '../dto/search.dto';
import { CreateDigitalProductDto, UpdateDigitalProductDto } from '../dto/digital-product.dto';
import { TrackClickDto } from '../../links/dto/link.dto';
import { DigitalDeliveryService } from './digital-delivery.service';
import * as crypto from 'crypto';
import * as path from 'path';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(DigitalProduct)
    private readonly digitalProductRepository: Repository<DigitalProduct>,
    @InjectRepository(DigitalAccess)
    private readonly digitalAccessRepository: Repository<DigitalAccess>,
    private readonly digitalDeliveryService: DigitalDeliveryService,
  ) {}

  async createProduct(userId: string, storeId: string, createProductDto: CreateProductDto): Promise<Product> {
    // Verify store belongs to user
    const store = await this.storeRepository.findOne({
      where: { id: storeId, userId }
    });

    if (!store) {
      throw new NotFoundException('Store not found or does not belong to user');
    }

    // Generate unique handle from title
    const handle = await this.generateUniqueHandle(createProductDto.title, storeId);

    // Extract variantOptions to avoid storing it in the product entity
    const { variantOptions, ...productData } = createProductDto;
    
    // Create product
    const product = this.productRepository.create({
      ...productData,
      storeId,
      handle,
      status: createProductDto.status === 'active' ? ProductStatus.ACTIVE : ProductStatus.DRAFT,
    });

    const savedProduct = await this.productRepository.save(product);

    // Create images if provided
    if (createProductDto.images && createProductDto.images.length > 0) {
      const images = createProductDto.images.map((imageDto, index) => 
        this.productImageRepository.create({
          ...imageDto,
          productId: savedProduct.id,
          displayOrder: imageDto.displayOrder ?? index,
          isPrimary: index === 0 || imageDto.isPrimary || false,
        })
      );
      await this.productImageRepository.save(images);
    }

    // Create variants if provided
    if (createProductDto.variants && createProductDto.variants.length > 0) {
      const variants = createProductDto.variants.map((variantDto, index) => {
        // Frontend should not send id field - backend generates UUIDs automatically
        const { isActive, displayOrder, ...variantData } = variantDto;
        return this.productVariantRepository.create({
          ...variantData,
          productId: savedProduct.id,
          displayOrder: index,
          isActive: isActive !== undefined ? isActive : true,
        });
      });
      await this.productVariantRepository.save(variants);
    }

    // Update store product count
    await this.storeRepository.increment({ id: storeId }, 'totalProducts', 1);

    return this.getProductById(userId, storeId, savedProduct.id);
  }

  async getStoreProducts(userId: string, storeId: string, includeInactive: boolean = false): Promise<Product[]> {
    // Verify store belongs to user
    const store = await this.storeRepository.findOne({
      where: { id: storeId, userId }
    });

    if (!store) {
      throw new NotFoundException('Store not found or does not belong to user');
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
      queryBuilder.andWhere('product.status != :archivedStatus', { archivedStatus: ProductStatus.ARCHIVED });
    }

    return queryBuilder.getMany();
  }

  async getProductById(userId: string, storeId: string, productId: string): Promise<Product> {
    // Verify store belongs to user
    const store = await this.storeRepository.findOne({
      where: { id: storeId, userId }
    });

    if (!store) {
      throw new NotFoundException('Store not found or does not belong to user');
    }

    const product = await this.productRepository.findOne({
      where: { id: productId, storeId },
      relations: ['images', 'variants']
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }


  async updateProduct(userId: string, storeId: string, productId: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.getProductById(userId, storeId, productId);
    
    // If title is being updated, regenerate handle
    if (updateProductDto.title && updateProductDto.title !== product.title) {
      const newHandle = this.generateHandle(updateProductDto.title);
      const existingProduct = await this.productRepository.findOne({
        where: { handle: newHandle }
      });

      if (existingProduct && existingProduct.id !== productId) {
        throw new BadRequestException('A product with this title already exists');
      }

      (updateProductDto as any).handle = newHandle;
    }
    
    Object.assign(product, updateProductDto);
    
    return this.productRepository.save(product);
  }

  async updateProductStatus(userId: string, storeId: string, productId: string, updateStatusDto: UpdateProductStatusDto): Promise<Product> {
    const product = await this.getProductById(userId, storeId, productId);
    
    product.status = updateStatusDto.status;
    
    // Set archived timestamp if archiving
    if (updateStatusDto.status === ProductStatus.ARCHIVED) {
      product.archivedAt = new Date();
      product.isPublished = false;
    } else if (product.archivedAt) {
      product.archivedAt = null;
    }
    
    return this.productRepository.save(product);
  }

  async publishProduct(userId: string, storeId: string, productId: string, publishDto: PublishProductDto): Promise<Product> {
    const product = await this.getProductById(userId, storeId, productId);
    
    product.isPublished = publishDto.isPublished;
    product.publishedAt = publishDto.isPublished ? new Date() : null;
    
    // Can only publish active products
    if (publishDto.isPublished && product.status !== ProductStatus.ACTIVE) {
      product.status = ProductStatus.ACTIVE;
    }
    
    return this.productRepository.save(product);
  }

  async deleteProduct(userId: string, storeId: string, productId: string): Promise<void> {
    const product = await this.getProductById(userId, storeId, productId);
    
    // Check if product has orders (in a real system)
    if (product.orderCount > 0) {
      throw new BadRequestException('Cannot delete product with existing orders. Archive it instead.');
    }
    
    await this.productRepository.remove(product);
    
    // Update store product count
    await this.storeRepository.decrement({ id: storeId }, 'totalProducts', 1);
  }

  async duplicateProduct(userId: string, storeId: string, productId: string): Promise<Product> {
    const originalProduct = await this.getProductById(userId, storeId, productId);
    
    // Create new product with "Copy of" prefix
    const copyTitle = `Copy of ${originalProduct.title}`;
    const copyHandle = this.generateHandle(copyTitle);
    
    // Remove ID and relations
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
      status: ProductStatus.DRAFT,
      isPublished: false,
      publishedAt: null,
      viewCount: 0,
      orderCount: 0,
    } as any;
    
    const newProduct = this.productRepository.create(productData);
    const savedProduct = await this.productRepository.save(newProduct) as unknown as Product;
    
    // Copy images
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
    
    // Copy variants
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
    
    // Update store product count
    await this.storeRepository.increment({ id: storeId }, 'totalProducts', 1);
    
    return this.getProductById(userId, storeId, savedProduct.id);
  }

  async searchProducts(userId: string, storeId: string, searchDto: SearchProductsDto): Promise<{ products: Product[]; total: number; page: number; limit: number; totalPages: number }> {
    // Verify store belongs to user
    const store = await this.storeRepository.findOne({
      where: { id: storeId, userId }
    });

    if (!store) {
      throw new NotFoundException('Store not found or does not belong to user');
    }

    const page = searchDto.page || 1;
    const limit = searchDto.limit || 20;
    const skip = (page - 1) * limit;

    let queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.variants', 'variants')
      .where('product.storeId = :storeId', { storeId })
      .andWhere('product.status != :archivedStatus', { archivedStatus: ProductStatus.ARCHIVED });

    // Text search
    if (searchDto.search) {
      queryBuilder = queryBuilder.andWhere(
        '(product.title ILIKE :search OR product.description ILIKE :search OR product.tags::text ILIKE :search OR variants.sku ILIKE :search)',
        { search: `%${searchDto.search}%` }
      );
    }

    // Category filter
    if (searchDto.category) {
      queryBuilder = queryBuilder.andWhere('product.productCategory = :category', { category: searchDto.category });
    }

    // Vendor filter
    if (searchDto.vendor) {
      queryBuilder = queryBuilder.andWhere('product.vendor = :vendor', { vendor: searchDto.vendor });
    }

    // Tags filter
    if (searchDto.tags && searchDto.tags.length > 0) {
      queryBuilder = queryBuilder.andWhere('product.tags && :tags::text[]', { tags: searchDto.tags });
    }

    // Price range filter
    if (searchDto.minPrice !== undefined) {
      queryBuilder = queryBuilder.andWhere('product.price >= :minPrice', { minPrice: searchDto.minPrice });
    }
    if (searchDto.maxPrice !== undefined) {
      queryBuilder = queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice: searchDto.maxPrice });
    }

    // Availability filter
    if (searchDto.availability) {
      const lowStockThreshold = store.lowStockThreshold;
      
      switch (searchDto.availability) {
        case ProductAvailability.IN_STOCK:
          queryBuilder = queryBuilder.andWhere('product.inventoryQuantity > :threshold', { threshold: lowStockThreshold });
          break;
        case ProductAvailability.LOW_STOCK:
          queryBuilder = queryBuilder.andWhere('product.inventoryQuantity > 0 AND product.inventoryQuantity <= :threshold', { threshold: lowStockThreshold });
          break;
        case ProductAvailability.OUT_OF_STOCK:
          queryBuilder = queryBuilder.andWhere('product.inventoryQuantity = 0');
          break;
      }
    }

    // Sorting
    const sortBy = searchDto.sortBy || 'createdAt';
    const sortOrder = searchDto.sortOrder || 'DESC';
    
    queryBuilder = queryBuilder
      .orderBy(`product.${sortBy}`, sortOrder)
      .addOrderBy('images.displayOrder', 'ASC')
      .addOrderBy('variants.displayOrder', 'ASC');

    // Get total count
    const total = await queryBuilder.getCount();

    // Get paginated results
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

  async getProductsByTag(userId: string, storeId: string, tag: string): Promise<Product[]> {
    // Verify store belongs to user
    const store = await this.storeRepository.findOne({
      where: { id: storeId, userId }
    });

    if (!store) {
      throw new NotFoundException('Store not found or does not belong to user');
    }

    return this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.variants', 'variants')
      .where('product.storeId = :storeId', { storeId })
      .andWhere('product.status = :status', { status: ProductStatus.ACTIVE })
      .andWhere(':tag = ANY(product.tags)', { tag })
      .orderBy('product.createdAt', 'DESC')
      .addOrderBy('images.displayOrder', 'ASC')
      .getMany();
  }

  async getAllTags(userId: string, storeId: string): Promise<{ tag: string; count: number }[]> {
    // Verify store belongs to user
    const store = await this.storeRepository.findOne({
      where: { id: storeId, userId }
    });

    if (!store) {
      throw new NotFoundException('Store not found or does not belong to user');
    }

    // Use raw SQL to properly handle PostgreSQL arrays
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
    `, [storeId, ProductStatus.ARCHIVED]);

    return result.map(row => ({
      tag: row.tag,
      count: parseInt(row.count)
    }));
  }

  async bulkUpdateTags(userId: string, storeId: string, bulkUpdateDto: BulkUpdateTagsDto): Promise<{ updated: number }> {
    // Verify store belongs to user
    const store = await this.storeRepository.findOne({
      where: { id: storeId, userId }
    });

    if (!store) {
      throw new NotFoundException('Store not found or does not belong to user');
    }

    // Verify all products belong to the store and user
    const products = await this.productRepository.find({
      where: { 
        id: In(bulkUpdateDto.productIds),
        storeId 
      }
    });

    if (products.length !== bulkUpdateDto.productIds.length) {
      throw new BadRequestException('Some products not found or do not belong to this store');
    }

    // Update tags for all products
    const result = await this.productRepository.update(
      { id: In(bulkUpdateDto.productIds) },
      { tags: bulkUpdateDto.tags }
    );

    return { updated: result.affected || 0 };
  }

  async bulkUpdatePrice(userId: string, storeId: string, bulkUpdateDto: BulkUpdatePriceDto): Promise<{ updated: number }> {
    // Verify store belongs to user
    const store = await this.storeRepository.findOne({
      where: { id: storeId, userId }
    });

    if (!store) {
      throw new NotFoundException('Store not found or does not belong to user');
    }

    // Verify all products belong to the store and user
    const products = await this.productRepository.find({
      where: { 
        id: In(bulkUpdateDto.productIds),
        storeId 
      }
    });

    if (products.length !== bulkUpdateDto.productIds.length) {
      throw new BadRequestException('Some products not found or do not belong to this store');
    }

    // Update price for all products
    const result = await this.productRepository.update(
      { id: In(bulkUpdateDto.productIds) },
      { price: bulkUpdateDto.price }
    );

    return { updated: result.affected || 0 };
  }

  private generateHandle(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  }

  private async generateUniqueHandle(title: string, storeId: string): Promise<string> {
    let baseHandle = this.generateHandle(title);
    let handle = baseHandle;
    let counter = 1;

    // Keep checking until we find a unique handle
    while (true) {
      const existingProduct = await this.productRepository.findOne({
        where: { handle, storeId }
      });

      if (!existingProduct) {
        return handle;
      }

      // If handle exists, try with a number suffix
      handle = `${baseHandle}-${counter}`;
      counter++;
    }
  }

  // ==================== PUBLIC METHODS ====================

  async getPublicStoreProducts(storeId: string, options: {
    page: number;
    limit: number;
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy: string;
    sortOrder: string;
  }) {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.variants', 'variants')
      .where('product.storeId = :storeId', { storeId })
      .andWhere('product.status = :status', { status: ProductStatus.ACTIVE })
      .andWhere('product.isPublished = :isPublished', { isPublished: true });

    // Apply search filter
    if (options.search) {
      queryBuilder.andWhere(
        '(product.title ILIKE :search OR product.description ILIKE :search)',
        { search: `%${options.search}%` }
      );
    }

    // Apply category filter
    if (options.category) {
      queryBuilder.andWhere('product.productCategory = :category', { category: options.category });
    }

    // Apply price filters
    if (options.minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice: options.minPrice });
    }
    if (options.maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice: options.maxPrice });
    }

    // Apply sorting
    const sortField = options.sortBy === 'price' ? 'product.price' : 
                     options.sortBy === 'title' ? 'product.title' : 
                     'product.createdAt';
    queryBuilder.orderBy(sortField, options.sortOrder.toUpperCase() as 'ASC' | 'DESC');

    // Apply pagination
    const offset = (options.page - 1) * options.limit;
    queryBuilder.skip(offset).take(options.limit);

    const [products, total] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(total / options.limit);

    return {
      message: 'Products retrieved successfully',
      products: products.map(product => ({
        id: product.id,
        title: product.title,
        description: product.description,
        handle: product.handle,
        type: product.type,
        status: product.status,
        price: product.price?.toString(),
        compareAtPrice: product.compareAtPrice?.toString(),
        trackQuantity: product.trackQuantity,
        inventoryQuantity: product.inventoryQuantity,
        requiresShipping: product.requiresShipping,
        weight: product.weight,
        weightUnit: product.weightUnit,
        tags: product.tags,
        isPublished: product.isPublished,
        publishedAt: product.publishedAt,
        isFeatured: product.isFeatured,
        viewCount: product.viewCount,
        orderCount: product.orderCount,
        images: product.images?.map(image => ({
          id: image.id,
          imageUrl: image.imageUrl,
          altText: image.altText,
          displayOrder: image.displayOrder,
          isPrimary: image.isPrimary
        })) || [],
        variants: product.variants?.map(variant => ({
          id: variant.id,
          title: variant.title,
          sku: variant.sku,
          price: variant.price?.toString(),
          compareAtPrice: variant.compareAtPrice?.toString(),
          inventoryQuantity: variant.inventoryQuantity,
          isActive: variant.isActive,
          displayOrder: variant.displayOrder
        })) || [],
        createdAt: product.createdAt
      })),
      pagination: {
        total,
        page: options.page,
        limit: options.limit,
        totalPages,
        hasNext: options.page < totalPages,
        hasPrev: options.page > 1
      }
    };
  }

  async getPublicProduct(storeId: string, productHandle: string) {
    const product = await this.productRepository.findOne({
      where: { 
        storeId, 
        handle: productHandle,
        status: ProductStatus.ACTIVE,
        isPublished: true
      },
      relations: ['images', 'variants', 'store', 'store.user']
    });

    if (!product) {
      // Return null product for SSR compatibility instead of 404
      return {
        message: 'Product not found',
        product: null,
        store: null
      };
    }

    return {
      message: 'Product retrieved successfully',
      product: {
        id: product.id,
        title: product.title,
        description: product.description,
        handle: product.handle,
        type: product.type,
        status: product.status,
        price: product.price?.toString(),
        compareAtPrice: product.compareAtPrice?.toString(),
        costPerItem: product.costPerItem?.toString(),
        trackQuantity: product.trackQuantity,
        inventoryQuantity: product.inventoryQuantity,
        continueSelling: product.continueSelling,
        requiresShipping: product.requiresShipping,
        weight: product.weight,
        weightUnit: product.weightUnit,
        seoTitle: product.seoTitle,
        seoDescription: product.seoDescription,
        productCategory: product.productCategory,
        productType: product.productType,
        vendor: product.vendor,
        tags: product.tags,
        isPublished: product.isPublished,
        publishedAt: product.publishedAt,
        isFeatured: product.isFeatured,
        viewCount: product.viewCount,
        orderCount: product.orderCount,
        images: product.images?.map(image => ({
          id: image.id,
          imageUrl: image.imageUrl,
          altText: image.altText,
          displayOrder: image.displayOrder,
          isPrimary: image.isPrimary,
          fileSize: image.fileSize,
          fileType: image.fileType
        })) || [],
        variants: product.variants?.map(variant => ({
          id: variant.id,
          title: variant.title,
          sku: variant.sku,
          barcode: variant.barcode,
          price: variant.price?.toString(),
          compareAtPrice: variant.compareAtPrice?.toString(),
          costPerItem: variant.costPerItem?.toString(),
          inventoryQuantity: variant.inventoryQuantity,
          inventoryPolicy: variant.inventoryPolicy,
          option1Name: variant.option1Name,
          option1Value: variant.option1Value,
          option2Name: variant.option2Name,
          option2Value: variant.option2Value,
          weight: variant.weight,
          weightUnit: variant.weightUnit,
          isActive: variant.isActive,
          displayOrder: variant.displayOrder
        })) || [],
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      },
      store: {
        id: product.store.id,
        name: product.store.name,
        storeUrl: product.store.storeUrl,
        logoUrl: product.store.logoUrl
      }
    };
  }

  async searchPublicProducts(options: {
    q: string;
    page: number;
    limit: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy: string;
    sortOrder: string;
  }) {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.store', 'store')
      .leftJoinAndSelect('store.user', 'user')
      .where('product.status = :status', { status: ProductStatus.ACTIVE })
      .andWhere('product.isPublished = :isPublished', { isPublished: true })
      .andWhere('store.status = :storeStatus', { storeStatus: 'active' })
      .andWhere('store.isActive = :storeActive', { storeActive: true });

    // Apply search filter
    if (options.q) {
      queryBuilder.andWhere(
        '(product.title ILIKE :search OR product.description ILIKE :search)',
        { search: `%${options.q}%` }
      );
    }

    // Apply category filter
    if (options.category) {
      queryBuilder.andWhere('product.productCategory = :category', { category: options.category });
    }

    // Apply price filters
    if (options.minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice: options.minPrice });
    }
    if (options.maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice: options.maxPrice });
    }

    // Apply sorting
    let sortField = 'product.createdAt';
    if (options.sortBy === 'price') {
      sortField = 'product.price';
    } else if (options.sortBy === 'title') {
      sortField = 'product.title';
    } else if (options.sortBy === 'relevance' && options.q) {
      // For relevance, we'll sort by title match first, then by created date
      sortField = 'product.title';
    }
    
    queryBuilder.orderBy(sortField, options.sortOrder.toUpperCase() as 'ASC' | 'DESC');

    // Apply pagination
    const offset = (options.page - 1) * options.limit;
    queryBuilder.skip(offset).take(options.limit);

    const [products, total] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(total / options.limit);

    return {
      message: 'Search completed successfully',
      products: products.map(product => ({
        id: product.id,
        title: product.title,
        description: product.description,
        handle: product.handle,
        price: product.price?.toString(),
        compareAtPrice: product.compareAtPrice?.toString(),
        images: product.images?.map(image => ({
          imageUrl: image.imageUrl,
          altText: image.altText,
          isPrimary: image.isPrimary
        })) || [],
        store: {
          id: product.store.id,
          name: product.store.name,
          storeUrl: product.store.storeUrl,
          logoUrl: product.store.logoUrl
        },
        owner: {
          username: product.store.user.username,
          profileImageUrl: product.store.user.profileImageUrl
        }
      })),
      pagination: {
        total,
        page: options.page,
        limit: options.limit,
        totalPages,
        hasNext: options.page < totalPages,
        hasPrev: options.page > 1
      },
      filters: {
        categories: await this.getAvailableCategories(),
        priceRange: await this.getPriceRange()
      }
    };
  }

  async getFeaturedProducts(options: {
    page: number;
    limit: number;
  }) {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.store', 'store')
      .leftJoinAndSelect('store.user', 'user')
      .where('product.status = :status', { status: ProductStatus.ACTIVE })
      .andWhere('product.isPublished = :isPublished', { isPublished: true })
      .andWhere('product.isFeatured = :isFeatured', { isFeatured: true })
      .andWhere('store.status = :storeStatus', { storeStatus: 'active' })
      .andWhere('store.isActive = :storeActive', { storeActive: true })
      .orderBy('product.createdAt', 'DESC');

    // Apply pagination
    const offset = (options.page - 1) * options.limit;
    queryBuilder.skip(offset).take(options.limit);

    const [products, total] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(total / options.limit);

    return {
      message: 'Featured products retrieved successfully',
      products: products.map(product => ({
        id: product.id,
        title: product.title,
        description: product.description,
        handle: product.handle,
        price: product.price?.toString(),
        compareAtPrice: product.compareAtPrice?.toString(),
        images: product.images?.map(image => ({
          imageUrl: image.imageUrl,
          altText: image.altText,
          isPrimary: image.isPrimary
        })) || [],
        store: {
          name: product.store.name,
          storeUrl: product.store.storeUrl,
          logoUrl: product.store.logoUrl
        },
        owner: {
          username: product.store.user.username,
          profileImageUrl: product.store.user.profileImageUrl
        }
      })),
      pagination: {
        total,
        page: options.page,
        limit: options.limit,
        totalPages,
        hasNext: options.page < totalPages,
        hasPrev: options.page > 1
      }
    };
  }

  private async getAvailableCategories(): Promise<string[]> {
    const result = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.store', 'store')
      .select('DISTINCT product.productCategory', 'category')
      .where('product.status = :status', { status: ProductStatus.ACTIVE })
      .andWhere('product.isPublished = :isPublished', { isPublished: true })
      .andWhere('store.status = :storeStatus', { storeStatus: 'active' })
      .andWhere('store.isActive = :storeActive', { storeActive: true })
      .andWhere('product.productCategory IS NOT NULL')
      .getRawMany();

    return result.map(row => row.category).filter(Boolean);
  }

  private async getPriceRange(): Promise<{ min: number; max: number }> {
    const result = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.store', 'store')
      .select('MIN(product.price)', 'min')
      .addSelect('MAX(product.price)', 'max')
      .where('product.status = :status', { status: ProductStatus.ACTIVE })
      .andWhere('product.isPublished = :isPublished', { isPublished: true })
      .andWhere('store.status = :storeStatus', { storeStatus: 'active' })
      .andWhere('store.isActive = :storeActive', { storeActive: true })
      .andWhere('product.price IS NOT NULL')
      .getRawOne();

    return {
      min: parseFloat(result.min) || 0,
      max: parseFloat(result.max) || 0
    };
  }

  async trackProductView(storeId: string, productHandle: string, trackClickDto: TrackClickDto): Promise<string> {
    const product = await this.productRepository.findOne({
      where: {
        storeId,
        handle: productHandle,
        status: ProductStatus.ACTIVE,
        isPublished: true
      }
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Increment view count
    await this.productRepository.increment({ id: product.id }, 'viewCount', 1);
    
    // Generate a view ID for tracking
    const viewId = require('crypto').randomUUID();
    
    // TODO: Store detailed view analytics in a separate table
    // For now, we just return the view ID
    
    return viewId;
  }

  async updateProductVariant(userId: string, storeId: string, productId: string, variantId: string, updateVariantDto: any): Promise<ProductVariant> {
    // Verify store belongs to user
    const store = await this.storeRepository.findOne({
      where: { id: storeId, userId }
    });

    if (!store) {
      throw new NotFoundException('Store not found or does not belong to user');
    }

    // Verify product belongs to the store
    const product = await this.productRepository.findOne({
      where: { id: productId, storeId }
    });

    if (!product) {
      throw new NotFoundException('Product not found or does not belong to this store');
    }

    // Find and update the variant
    const variant = await this.productVariantRepository.findOne({
      where: { id: variantId, productId }
    });

    if (!variant) {
      throw new NotFoundException('Product variant not found');
    }

    // Update the variant with the provided data
    Object.assign(variant, updateVariantDto);
    
    return await this.productVariantRepository.save(variant);
  }

  // Digital Product Methods
  async uploadDigitalFile(
    userId: string, 
    storeId: string, 
    productId: string, 
    file: any, 
    createDto: CreateDigitalProductDto
  ): Promise<{ digitalProduct: DigitalProduct }> {
    // Verify product belongs to user and is digital type
    const product = await this.productRepository.findOne({
      where: { id: productId, storeId, store: { userId } },
      relations: ['store']
    });

    if (!product) {
      throw new NotFoundException('Product not found or does not belong to user');
    }

    if (product.type !== 'digital') {
      throw new BadRequestException('Product must be of type digital');
    }

    // Check if digital product already exists
    const existingDigitalProduct = await this.digitalProductRepository.findOne({
      where: { productId }
    });

    if (existingDigitalProduct) {
      throw new BadRequestException('Digital product already exists for this product');
    }

    // Calculate file hash
    const fileHash = crypto.createHash('sha256').update(file.buffer).digest('hex');

    // Create digital product record
    const digitalProduct = new DigitalProduct();
    digitalProduct.productId = productId;
    digitalProduct.digitalType = createDto.digitalType as any;
    digitalProduct.accessControlType = createDto.accessControlType as any;
    digitalProduct.fileName = file.originalname;
    digitalProduct.filePath = file.filename;
    digitalProduct.fileSize = file.size;
    digitalProduct.fileType = path.extname(file.originalname);
    digitalProduct.mimeType = file.mimetype;
    digitalProduct.fileHash = fileHash;
    digitalProduct.accessPassword = createDto.accessPassword || null;
    digitalProduct.accessDurationHours = createDto.accessDurationHours || null;
    digitalProduct.maxDownloads = createDto.maxDownloads;
    digitalProduct.maxConcurrentUsers = createDto.maxConcurrentUsers;
    digitalProduct.watermarkEnabled = createDto.watermarkEnabled;
    digitalProduct.watermarkText = createDto.watermarkText || null;
    digitalProduct.autoDeliver = createDto.autoDeliver;
    digitalProduct.deliveryEmailTemplate = createDto.deliveryEmailTemplate || null;
    digitalProduct.deliverySubject = createDto.deliverySubject || null;
    digitalProduct.ipRestriction = createDto.ipRestriction;
    digitalProduct.allowedIps = createDto.allowedIps || null;
    digitalProduct.deviceFingerprinting = createDto.deviceFingerprinting;
    digitalProduct.preventScreenshots = createDto.preventScreenshots;
    digitalProduct.preventPrinting = createDto.preventPrinting;
    digitalProduct.preventCopying = createDto.preventCopying;
    digitalProduct.viewerType = createDto.viewerType;
    digitalProduct.viewerConfig = createDto.viewerConfig || null;

    const savedDigitalProduct = await this.digitalProductRepository.save(digitalProduct);

    return { digitalProduct: savedDigitalProduct };
  }

  async getDigitalProduct(userId: string, storeId: string, productId: string): Promise<DigitalProduct> {
    const digitalProduct = await this.digitalProductRepository.findOne({
      where: { 
        productId, 
        product: { 
          storeId, 
          store: { userId } 
        } 
      },
      relations: ['product', 'product.store']
    });

    if (!digitalProduct) {
      throw new NotFoundException('Digital product not found');
    }

    return digitalProduct;
  }

  async updateDigitalProduct(
    userId: string, 
    storeId: string, 
    productId: string, 
    updateDto: UpdateDigitalProductDto
  ): Promise<DigitalProduct> {
    const digitalProduct = await this.getDigitalProduct(userId, storeId, productId);

    Object.assign(digitalProduct, updateDto);
    const updatedDigitalProduct = await this.digitalProductRepository.save(digitalProduct);

    return updatedDigitalProduct;
  }

  async getDigitalProductAnalytics(userId: string, storeId: string, productId: string): Promise<any> {
    const digitalProduct = await this.getDigitalProduct(userId, storeId, productId);
    return await this.digitalDeliveryService.getAccessAnalytics(digitalProduct.id);
  }

  async getDigitalProductAccess(
    userId: string, 
    storeId: string, 
    productId: string, 
    page: number = 1, 
    limit: number = 20
  ): Promise<{ accessRecords: any[]; pagination: any }> {
    const digitalProduct = await this.getDigitalProduct(userId, storeId, productId);

    const [accessRecords, total] = await this.digitalAccessRepository.findAndCount({
      where: { digitalProductId: digitalProduct.id },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user', 'order']
    });

    return {
      accessRecords: accessRecords.map(access => ({
        id: access.id,
        customerEmail: access.customerEmail,
        customerName: access.customerName,
        accessType: access.accessType,
        status: access.status,
        accessCount: access.accessCount,
        downloadCount: access.downloadCount,
        lastAccessedAt: access.lastAccessedAt,
        expiresAt: access.expiresAt,
        createdAt: access.createdAt
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}
