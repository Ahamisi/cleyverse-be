import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/base/base.entity';
import { User } from '../../users/entities/user.entity';
import { Product } from './product.entity';

export enum StoreStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  SUSPENDED = 'suspended', // Admin suspended
  ARCHIVED = 'archived'
}

export enum StoreCurrency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  CAD = 'CAD',
  AUD = 'AUD',
  NGN = 'NGN'
}

@Entity('stores')
@Index(['userId', 'status'])
@Index(['userId', 'createdAt'])
export class Store extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, user => user.stores, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Product, product => product.store)
  products: Product[];

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'store_url', type: 'varchar', length: 100, unique: true })
  storeUrl: string; // e.g., "johns-merch" for cley.shop/johns-merch

  @Column({ name: 'logo_url', type: 'varchar', nullable: true })
  logoUrl: string | null;

  @Column({ name: 'banner_url', type: 'varchar', nullable: true })
  bannerUrl: string | null;

  @Column({ type: 'enum', enum: StoreStatus, default: StoreStatus.DRAFT })
  status: StoreStatus;

  @Column({ type: 'enum', enum: StoreCurrency, default: StoreCurrency.USD })
  currency: StoreCurrency;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // Store Settings
  @Column({ name: 'allow_reviews', type: 'boolean', default: true })
  allowReviews: boolean;

  @Column({ name: 'auto_approve_reviews', type: 'boolean', default: false })
  autoApproveReviews: boolean;

  @Column({ name: 'enable_inventory_tracking', type: 'boolean', default: true })
  enableInventoryTracking: boolean;

  @Column({ name: 'low_stock_threshold', type: 'int', default: 5 })
  lowStockThreshold: number;

  // Policies
  @Column({ name: 'return_policy', type: 'text', nullable: true })
  returnPolicy: string | null;

  @Column({ name: 'shipping_policy', type: 'text', nullable: true })
  shippingPolicy: string | null;

  @Column({ name: 'privacy_policy', type: 'text', nullable: true })
  privacyPolicy: string | null;

  @Column({ name: 'terms_of_service', type: 'text', nullable: true })
  termsOfService: string | null;

  // Analytics
  @Column({ name: 'total_products', type: 'int', default: 0 })
  totalProducts: number;

  @Column({ name: 'total_orders', type: 'int', default: 0 })
  totalOrders: number;

  @Column({ name: 'total_revenue', type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  totalRevenue: number;

  @Column({ name: 'archived_at', type: 'timestamp', nullable: true })
  archivedAt: Date | null;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null; // Soft delete - can restore within 60 days

  @Column({ name: 'suspended_at', type: 'timestamp', nullable: true })
  suspendedAt: Date | null; // When admin suspended the store

  @Column({ name: 'suspended_reason', type: 'text', nullable: true })
  suspendedReason: string | null; // Admin reason for suspension
}
