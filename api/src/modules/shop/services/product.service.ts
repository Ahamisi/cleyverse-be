import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In, Between } from 'typeorm';
import { Product, ProductStatus } from '../entities/product.entity';
import { ProductImage } from '../entities/product-image.entity';
import { ProductVariant } from '../entities/product-variant.entity';
import { Store } from '../entities/store.entity';
import { CreateProductDto, UpdateProductDto, UpdateProductStatusDto, PublishProductDto } from '../dto/product.dto';
import { SearchProductsDto, ProductAvailability, BulkUpdateTagsDto, BulkUpdatePriceDto } from '../dto/search.dto';

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
  ) {}

  async createProduct(userId: string, storeId: string, createProductDto: CreateProductDto): Promise<Product> {
    // Verify store belongs to user
    const store = await this.storeRepository.findOne({
      where: { id: storeId, userId }
    });

    if (!store) {
      throw new NotFoundException('Store not found or does not belong to user');
    }

    // Generate handle from title
    const handle = this.generateHandle(createProductDto.title);
    
    // Check if handle is unique
    const existingProduct = await this.productRepository.findOne({
      where: { handle }
    });

    if (existingProduct) {
      throw new BadRequestException('A product with this title already exists');
    }

    // Create product
    const product = this.productRepository.create({
      ...createProductDto,
      storeId,
      handle,
      status: ProductStatus.DRAFT,
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
      const variants = createProductDto.variants.map((variantDto, index) =>
        this.productVariantRepository.create({
          ...variantDto,
          productId: savedProduct.id,
          displayOrder: index,
        })
      );
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

  async getPublicProduct(storeUrl: string, productHandle: string): Promise<Product> {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.variants', 'variants')
      .leftJoinAndSelect('product.store', 'store')
      .where('product.handle = :productHandle', { productHandle })
      .andWhere('store.storeUrl = :storeUrl', { storeUrl })
      .andWhere('product.isPublished = true')
      .andWhere('product.status = :status', { status: ProductStatus.ACTIVE })
      .andWhere('store.status = :storeStatus', { storeStatus: 'active' })
      .getOne();

    if (!product) {
      throw new NotFoundException('Product not found or not available');
    }

    // Increment view count
    await this.productRepository.increment({ id: product.id }, 'viewCount', 1);

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
}
