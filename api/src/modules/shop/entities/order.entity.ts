import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Store } from './store.entity';
import { OrderItem } from './order-item.entity';
import { Payment } from '../../payments/entities/payment.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export enum OrderType {
  GUEST = 'guest',
  REGISTERED = 'registered'
}

@Entity('orders')
@Index(['storeId', 'status'])
@Index(['customerEmail'])
@Index(['createdAt'])
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  storeId: string;

  @ManyToOne(() => Store)
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @Column({ type: 'varchar', length: 50, unique: true })
  orderNumber: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'enum', enum: OrderType })
  type: OrderType;

  // Customer Information
  @Column({ type: 'varchar', length: 100 })
  customerEmail: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  customerFirstName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  customerLastName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  customerPhone: string;

  // Shipping Information
  @Column({ type: 'varchar', length: 200, nullable: true })
  shippingAddress: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  shippingCity: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  shippingState: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  shippingPostalCode: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  shippingCountry: string;

  // Billing Information
  @Column({ type: 'varchar', length: 200, nullable: true })
  billingAddress: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  billingCity: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  billingState: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  billingPostalCode: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  billingCountry: string;

  // Order Totals
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  shippingCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ length: 3 })
  currency: string;

  // Payment Information
  @Column({ type: 'uuid', nullable: true })
  paymentId: string;

  @ManyToOne(() => Payment, { nullable: true })
  @JoinColumn({ name: 'paymentId' })
  payment: Payment;

  @Column({ type: 'varchar', length: 50, nullable: true })
  paymentStatus: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  paymentMethod: string;

  // Order Items
  @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
  items: OrderItem[];

  // Tracking Information
  @Column({ type: 'varchar', length: 100, nullable: true })
  trackingNumber: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  carrier: string;

  @Column({ type: 'timestamp', nullable: true })
  shippedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string;

  // Notes and Comments
  @Column({ type: 'text', nullable: true })
  customerNotes: string;

  @Column({ type: 'text', nullable: true })
  internalNotes: string;

  // Metadata
  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
