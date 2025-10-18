import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/base/base.entity';
import { DigitalProduct } from './digital-product.entity';
import { User } from '../../users/entities/user.entity';
import { Order } from './order.entity';

export enum AccessStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
  SUSPENDED = 'suspended'
}

export enum AccessType {
  PURCHASE = 'purchase',
  GIFT = 'gift',
  PROMOTIONAL = 'promotional',
  ADMIN = 'admin'
}

@Entity('digital_access')
@Index(['digitalProductId', 'userId'])
@Index(['digitalProductId', 'orderId'])
@Index(['accessToken'])
@Index(['expiresAt'])
export class DigitalAccess extends BaseEntity {
  @Column({ name: 'digital_product_id', type: 'uuid' })
  digitalProductId: string;

  @ManyToOne(() => DigitalProduct, digitalProduct => digitalProduct.accessRecords, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'digital_product_id' })
  digitalProduct: DigitalProduct;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @Column({ name: 'order_id', type: 'uuid', nullable: true })
  orderId: string | null;

  @ManyToOne(() => Order, { nullable: true })
  @JoinColumn({ name: 'order_id' })
  order: Order | null;

  @Column({ name: 'customer_email', type: 'varchar', length: 255 })
  customerEmail: string;

  @Column({ name: 'customer_name', type: 'varchar', length: 255, nullable: true })
  customerName: string | null;

  @Column({ type: 'enum', enum: AccessType, default: AccessType.PURCHASE })
  accessType: AccessType;

  @Column({ type: 'enum', enum: AccessStatus, default: AccessStatus.ACTIVE })
  status: AccessStatus;

  // Access Control
  @Column({ name: 'access_token', type: 'varchar', length: 255, unique: true })
  accessToken: string;

  @Column({ name: 'access_password', type: 'varchar', length: 255, nullable: true })
  accessPassword: string | null;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt: Date | null;

  @Column({ name: 'last_accessed_at', type: 'timestamp', nullable: true })
  lastAccessedAt: Date | null;

  @Column({ name: 'access_count', type: 'int', default: 0 })
  accessCount: number;

  @Column({ name: 'download_count', type: 'int', default: 0 })
  downloadCount: number;

  @Column({ name: 'max_downloads', type: 'int', default: 1 })
  maxDownloads: number;

  // Device & Security Tracking
  @Column({ name: 'device_fingerprint', type: 'varchar', length: 255, nullable: true })
  deviceFingerprint: string | null;

  @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true })
  ipAddress: string | null;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string | null;

  @Column({ name: 'allowed_ips', type: 'text', array: true, nullable: true })
  allowedIps: string[] | null;

  // Delivery Information
  @Column({ name: 'delivery_email_sent', type: 'boolean', default: false })
  deliveryEmailSent: boolean;

  @Column({ name: 'delivery_email_sent_at', type: 'timestamp', nullable: true })
  deliveryEmailSentAt: Date | null;

  @Column({ name: 'delivery_email_template', type: 'varchar', length: 100, nullable: true })
  deliveryEmailTemplate: string | null;

  // Watermarking
  @Column({ name: 'watermark_text', type: 'varchar', length: 255, nullable: true })
  watermarkText: string | null;

  @Column({ name: 'watermark_position', type: 'varchar', length: 50, default: 'bottom-right' })
  watermarkPosition: string;

  // Session Management
  @Column({ name: 'current_session_id', type: 'varchar', length: 255, nullable: true })
  currentSessionId: string | null;

  @Column({ name: 'session_expires_at', type: 'timestamp', nullable: true })
  sessionExpiresAt: Date | null;

  @Column({ name: 'concurrent_sessions', type: 'int', default: 0 })
  concurrentSessions: number;

  // Metadata
  @Column({ name: 'metadata', type: 'json', nullable: true })
  metadata: Record<string, any> | null;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;
}
