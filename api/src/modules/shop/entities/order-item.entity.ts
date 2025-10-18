import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';
import { ProductVariant } from './product-variant.entity';

@Entity('order_items')
@Index(['orderId'])
@Index(['productId'])
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  orderId: string;

  @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({ type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'uuid', nullable: true })
  variantId: string;

  @ManyToOne(() => ProductVariant, { nullable: true })
  @JoinColumn({ name: 'variantId' })
  variant: ProductVariant;

  @Column({ type: 'varchar', length: 200 })
  productTitle: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  variantTitle: string;

  @Column({ type: 'varchar', length: 100 })
  productHandle: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  productImage: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ length: 3 })
  currency: string;

  // Product snapshot at time of purchase
  @Column({ type: 'json', nullable: true })
  productSnapshot: {
    title: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    sku?: string;
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    tags: string[];
    category: string;
  };

  // Variant snapshot at time of purchase
  @Column({ type: 'json', nullable: true })
  variantSnapshot: {
    title: string;
    price: number;
    compareAtPrice?: number;
    sku?: string;
    weight?: number;
    inventory: number;
    options: Record<string, string>;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
