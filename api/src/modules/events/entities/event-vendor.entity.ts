import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';

export enum VendorStatus {
  APPLIED = 'applied',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  SUSPENDED = 'suspended'
}

export enum VendorType {
  PRODUCT = 'product',
  SERVICE = 'service',
  FOOD = 'food',
  SPONSOR = 'sponsor',
  EXHIBITOR = 'exhibitor'
}

@Entity('event_vendors')
export class EventVendor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  // Relations
  @Column({ name: 'event_id', type: 'uuid' })
  eventId: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string | null;

  @Column({ name: 'store_id', type: 'uuid', nullable: true })
  storeId: string | null; // Link to existing store

  @ManyToOne('Event', 'vendors')
  @JoinColumn({ name: 'event_id' })
  event: any;

  @ManyToOne('User', 'eventVendors')
  @JoinColumn({ name: 'user_id' })
  user: any;

  @ManyToOne('Store', 'eventVendors', { nullable: true })
  @JoinColumn({ name: 'store_id' })
  store: any;

  // Vendor Details
  @Column({ name: 'business_name', type: 'varchar', length: 200 })
  businessName: string;

  @Column({ name: 'business_description', type: 'text', nullable: true })
  businessDescription: string | null;

  @Column({ name: 'business_website', type: 'varchar', length: 500, nullable: true })
  businessWebsite: string | null;

  @Column({ name: 'business_logo_url', type: 'varchar', length: 500, nullable: true })
  businessLogoUrl: string | null;

  @Column({ name: 'vendor_type', type: 'enum', enum: VendorType, default: VendorType.PRODUCT })
  vendorType: VendorType;

  // Application
  @Column({ type: 'enum', enum: VendorStatus, default: VendorStatus.APPLIED })
  status: VendorStatus;

  @Column({ name: 'application_message', type: 'text', nullable: true })
  applicationMessage: string | null;

  @Column({ name: 'applied_at', type: 'timestamp' })
  appliedAt: Date;

  @Column({ name: 'reviewed_at', type: 'timestamp', nullable: true })
  reviewedAt: Date | null;

  @Column({ name: 'reviewed_by', type: 'uuid', nullable: true })
  reviewedBy: string | null;

  @Column({ name: 'review_notes', type: 'text', nullable: true })
  reviewNotes: string | null;

  // Booth/Space Details
  @Column({ name: 'booth_number', type: 'varchar', length: 50, nullable: true })
  boothNumber: string | null;

  @Column({ name: 'booth_size', type: 'varchar', length: 50, nullable: true })
  boothSize: string | null; // e.g., "10x10", "20x20"

  @Column({ name: 'booth_location', type: 'varchar', length: 200, nullable: true })
  boothLocation: string | null;

  @Column({ name: 'setup_time', type: 'timestamp', nullable: true })
  setupTime: Date | null;

  @Column({ name: 'breakdown_time', type: 'timestamp', nullable: true })
  breakdownTime: Date | null;

  // Financial
  @Column({ name: 'vendor_fee', type: 'decimal', precision: 10, scale: 2, nullable: true })
  vendorFee: number | null;

  @Column({ name: 'fee_paid', type: 'boolean', default: false })
  feePaid: boolean;

  @Column({ name: 'payment_due_date', type: 'timestamp', nullable: true })
  paymentDueDate: Date | null;

  @Column({ name: 'payment_id', type: 'varchar', length: 100, nullable: true })
  paymentId: string | null; // Link to Payment Module

  @Column({ name: 'payment_method', type: 'varchar', length: 50, nullable: true })
  paymentMethod: string | null; // 'stripe', 'paypal', 'bank_transfer'

  @Column({ name: 'paid_at', type: 'timestamp', nullable: true })
  paidAt: Date | null;

  @Column({ name: 'commission_rate', type: 'decimal', precision: 5, scale: 2, nullable: true })
  commissionRate: number | null; // Percentage

  @Column({ name: 'booth_id', type: 'uuid', nullable: true })
  boothId: string | null; // Link to assigned booth

  // Contact Information
  @Column({ name: 'contact_name', type: 'varchar', length: 100 })
  contactName: string;

  @Column({ name: 'contact_email', type: 'varchar', length: 255 })
  contactEmail: string;

  @Column({ name: 'contact_phone', type: 'varchar', length: 20, nullable: true })
  contactPhone: string | null;

  // Requirements & Needs
  @Column({ name: 'power_requirements', type: 'text', nullable: true })
  powerRequirements: string | null;

  @Column({ name: 'wifi_required', type: 'boolean', default: false })
  wifiRequired: boolean;

  @Column({ name: 'special_requirements', type: 'text', nullable: true })
  specialRequirements: string | null;

  @Column({ name: 'equipment_needed', type: 'text', array: true, nullable: true })
  equipmentNeeded: string[] | null;

  // Analytics
  @Column({ name: 'total_sales', type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalSales: number;

  @Column({ name: 'total_orders', type: 'int', default: 0 })
  totalOrders: number;

  @Column({ name: 'booth_visits', type: 'int', default: 0 })
  boothVisits: number;

  // Forms Integration
  @Column({ name: 'form_submission_id', type: 'uuid', nullable: true })
  formSubmissionId: string | null;

  // Settings
  @Column({ name: 'is_featured', type: 'boolean', default: false })
  isFeatured: boolean;

  @Column({ name: 'display_order', type: 'int', default: 0 })
  displayOrder: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}
