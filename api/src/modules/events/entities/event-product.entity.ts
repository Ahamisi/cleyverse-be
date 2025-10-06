import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';

export enum EventProductStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

@Entity('event_products')
export class EventProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  // Relations
  @Column({ name: 'event_id', type: 'uuid' })
  eventId: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ name: 'vendor_id', type: 'uuid' })
  vendorId: string; // Links to EventVendor

  @ManyToOne('Event', 'products')
  @JoinColumn({ name: 'event_id' })
  event: any;

  @ManyToOne('Product', 'eventProducts')
  @JoinColumn({ name: 'product_id' })
  product: any;

  @ManyToOne('EventVendor', 'products')
  @JoinColumn({ name: 'vendor_id' })
  vendor: any;

  // Event-Specific Settings
  @Column({ type: 'enum', enum: EventProductStatus, default: EventProductStatus.PENDING })
  status: EventProductStatus;

  @Column({ name: 'event_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  eventPrice: number | null; // Special event pricing (overrides product price)

  @Column({ name: 'event_discount', type: 'decimal', precision: 5, scale: 2, nullable: true })
  eventDiscount: number | null; // Percentage discount for event

  @Column({ name: 'available_quantity', type: 'int', nullable: true })
  availableQuantity: number | null; // Limited quantity for event

  @Column({ name: 'min_order_quantity', type: 'int', default: 1 })
  minOrderQuantity: number;

  @Column({ name: 'max_order_quantity', type: 'int', nullable: true })
  maxOrderQuantity: number | null;

  // Display Settings
  @Column({ name: 'is_featured', type: 'boolean', default: false })
  isFeatured: boolean;

  @Column({ name: 'display_order', type: 'int', default: 0 })
  displayOrder: number;

  @Column({ name: 'booth_exclusive', type: 'boolean', default: false })
  boothExclusive: boolean; // Only available at the vendor's booth

  // Event-Specific Details
  @Column({ name: 'event_description', type: 'text', nullable: true })
  eventDescription: string | null; // Special description for this event

  @Column({ name: 'event_tags', type: 'text', array: true, nullable: true })
  eventTags: string[] | null;

  @Column({ name: 'demo_available', type: 'boolean', default: false })
  demoAvailable: boolean;

  @Column({ name: 'demo_times', type: 'jsonb', nullable: true })
  demoTimes: any[] | null; // Array of demo time slots

  // Approval
  @Column({ name: 'approved_by', type: 'uuid', nullable: true })
  approvedBy: string | null;

  @Column({ name: 'approved_at', type: 'timestamp', nullable: true })
  approvedAt: Date | null;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason: string | null;

  // Analytics
  @Column({ name: 'view_count', type: 'int', default: 0 })
  viewCount: number;

  @Column({ name: 'orders_count', type: 'int', default: 0 })
  ordersCount: number;

  @Column({ name: 'total_revenue', type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalRevenue: number;

  @Column({ name: 'demo_requests', type: 'int', default: 0 })
  demoRequests: number;
}
