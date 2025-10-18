import { Entity, Column, ManyToOne, OneToMany, OneToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/base/base.entity';
import { Store } from './store.entity';
import { ProductImage } from './product-image.entity';
import { ProductVariant } from './product-variant.entity';
import { DigitalProduct } from './digital-product.entity';

export enum ProductStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived'
}

export enum ProductType {
  PHYSICAL = 'physical',
  DIGITAL = 'digital',
  SERVICE = 'service'
}

@Entity('products')
@Index(['storeId', 'status'])
@Index(['storeId', 'createdAt'])
@Index(['title'])
@Index(['storeId', 'handle'], { unique: true })
export class Product extends BaseEntity {
  @Column({ name: 'store_id', type: 'uuid' })
  storeId: string;

  @ManyToOne(() => Store, store => store.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @OneToMany(() => ProductImage, image => image.product, { cascade: true })
  images: ProductImage[];

  @OneToMany(() => ProductVariant, variant => variant.product, { cascade: true })
  variants: ProductVariant[];

  @OneToOne(() => DigitalProduct, digitalProduct => digitalProduct.product, { cascade: true })
  digitalProduct: DigitalProduct;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 200 })
  handle: string; // URL-friendly version of title

  @Column({ type: 'enum', enum: ProductType, default: ProductType.PHYSICAL })
  type: ProductType;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.DRAFT })
  status: ProductStatus;

  // Basic Pricing (can be overridden by variants)
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number | null;

  @Column({ name: 'compare_at_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  compareAtPrice: number | null;

  @Column({ name: 'cost_per_item', type: 'decimal', precision: 10, scale: 2, nullable: true })
  costPerItem: number | null;

  // Inventory (for simple products without variants)
  @Column({ name: 'track_quantity', type: 'boolean', default: true })
  trackQuantity: boolean;

  @Column({ name: 'inventory_quantity', type: 'int', default: 0 })
  inventoryQuantity: number;

  @Column({ name: 'continue_selling_when_out_of_stock', type: 'boolean', default: false })
  continueSelling: boolean;

  // Physical Product Details
  @Column({ name: 'requires_shipping', type: 'boolean', default: true })
  requiresShipping: boolean;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  weight: number | null;

  @Column({ name: 'weight_unit', type: 'varchar', length: 10, default: 'kg' })
  weightUnit: string;

  // SEO
  @Column({ name: 'seo_title', type: 'varchar', length: 255, nullable: true })
  seoTitle: string | null;

  @Column({ name: 'seo_description', type: 'text', nullable: true })
  seoDescription: string | null;

  // Organization
  @Column({ name: 'product_category', type: 'varchar', length: 100, nullable: true })
  productCategory: string | null;

  @Column({ name: 'product_type', type: 'varchar', length: 100, nullable: true })
  productType: string | null;

  @Column({ name: 'vendor', type: 'varchar', length: 100, nullable: true })
  vendor: string | null;

  @Column({ type: 'text', array: true, nullable: true })
  tags: string[] | null;

  // Visibility
  @Column({ name: 'is_published', type: 'boolean', default: false })
  isPublished: boolean;

  @Column({ name: 'published_at', type: 'timestamp', nullable: true })
  publishedAt: Date | null;

  @Column({ name: 'is_featured', type: 'boolean', default: false })
  isFeatured: boolean;

  // Analytics
  @Column({ name: 'view_count', type: 'int', default: 0 })
  viewCount: number;

  @Column({ name: 'order_count', type: 'int', default: 0 })
  orderCount: number;

  @Column({ name: 'archived_at', type: 'timestamp', nullable: true })
  archivedAt: Date | null;
}
