import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/base/base.entity';
import { Product } from './product.entity';

@Entity('product_variants')
@Index(['productId', 'isActive'])
export class ProductVariant extends BaseEntity {
  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product, product => product.variants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  sku: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  barcode: string | null;

  // Pricing
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'compare_at_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  compareAtPrice: number | null;

  @Column({ name: 'cost_per_item', type: 'decimal', precision: 10, scale: 2, nullable: true })
  costPerItem: number | null;

  // Inventory
  @Column({ name: 'inventory_quantity', type: 'int', default: 0 })
  inventoryQuantity: number;

  @Column({ name: 'inventory_policy', type: 'varchar', length: 50, default: 'deny' }) // deny, continue
  inventoryPolicy: string;

  // Variant Options (e.g., Size: Large, Color: Red)
  @Column({ name: 'option1_name', type: 'varchar', length: 50, nullable: true })
  option1Name: string | null;

  @Column({ name: 'option1_value', type: 'varchar', length: 100, nullable: true })
  option1Value: string | null;

  @Column({ name: 'option2_name', type: 'varchar', length: 50, nullable: true })
  option2Name: string | null;

  @Column({ name: 'option2_value', type: 'varchar', length: 100, nullable: true })
  option2Value: string | null;

  @Column({ name: 'option3_name', type: 'varchar', length: 50, nullable: true })
  option3Name: string | null;

  @Column({ name: 'option3_value', type: 'varchar', length: 100, nullable: true })
  option3Value: string | null;

  // Physical Properties
  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  weight: number | null;

  @Column({ name: 'weight_unit', type: 'varchar', length: 10, default: 'kg' })
  weightUnit: string;

  // Status
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'display_order', type: 'int', default: 0 })
  displayOrder: number;
}
