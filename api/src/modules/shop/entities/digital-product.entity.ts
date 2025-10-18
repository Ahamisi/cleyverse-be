import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/base/base.entity';
import { Product } from './product.entity';
import { DigitalAccess } from './digital-access.entity';

export enum DigitalProductType {
  EBOOK = 'ebook',
  PDF = 'pdf',
  AUDIO = 'audio',
  VIDEO = 'video',
  SOFTWARE = 'software',
  COURSE = 'course',
  TEMPLATE = 'template',
  OTHER = 'other'
}

export enum AccessControlType {
  EMAIL_ONLY = 'email_only',        // Access via email verification
  PASSWORD_PROTECTED = 'password_protected', // Password required
  TIME_LIMITED = 'time_limited',    // Access expires after time
  DOWNLOAD_LIMITED = 'download_limited', // Limited number of downloads
  SINGLE_USE = 'single_use',        // One-time access only
  SUBSCRIPTION = 'subscription'     // Ongoing access
}

@Entity('digital_products')
@Index(['productId'])
@Index(['accessControlType'])
export class DigitalProduct extends BaseEntity {
  @Column({ name: 'product_id', type: 'uuid', unique: true })
  productId: string;

  @ManyToOne(() => Product, product => product.digitalProduct, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @OneToMany(() => DigitalAccess, access => access.digitalProduct, { cascade: true })
  accessRecords: DigitalAccess[];

  @Column({ type: 'enum', enum: DigitalProductType })
  digitalType: DigitalProductType;

  @Column({ type: 'enum', enum: AccessControlType, default: AccessControlType.EMAIL_ONLY })
  accessControlType: AccessControlType;

  // File Information
  @Column({ name: 'file_name', type: 'varchar', length: 255 })
  fileName: string;

  @Column({ name: 'file_path', type: 'varchar', length: 500 })
  filePath: string;

  @Column({ name: 'file_size', type: 'bigint' })
  fileSize: number;

  @Column({ name: 'file_type', type: 'varchar', length: 100 })
  fileType: string;

  @Column({ name: 'mime_type', type: 'varchar', length: 100 })
  mimeType: string;

  @Column({ name: 'file_hash', type: 'varchar', length: 64 })
  fileHash: string; // SHA-256 hash for integrity

  // Access Control Settings
  @Column({ name: 'access_password', type: 'varchar', length: 255, nullable: true })
  accessPassword: string | null;

  @Column({ name: 'access_duration_hours', type: 'int', nullable: true })
  accessDurationHours: number | null; // How long access lasts

  @Column({ name: 'max_downloads', type: 'int', default: 1 })
  maxDownloads: number;

  @Column({ name: 'max_concurrent_users', type: 'int', default: 1 })
  maxConcurrentUsers: number;

  @Column({ name: 'watermark_enabled', type: 'boolean', default: true })
  watermarkEnabled: boolean;

  @Column({ name: 'watermark_text', type: 'varchar', length: 255, nullable: true })
  watermarkText: string | null;

  // Delivery Settings
  @Column({ name: 'auto_deliver', type: 'boolean', default: true })
  autoDeliver: boolean;

  @Column({ name: 'delivery_email_template', type: 'text', nullable: true })
  deliveryEmailTemplate: string | null;

  @Column({ name: 'delivery_subject', type: 'varchar', length: 255, nullable: true })
  deliverySubject: string | null;

  // Security Settings
  @Column({ name: 'ip_restriction', type: 'boolean', default: false })
  ipRestriction: boolean;

  @Column({ name: 'allowed_ips', type: 'text', array: true, nullable: true })
  allowedIps: string[] | null;

  @Column({ name: 'device_fingerprinting', type: 'boolean', default: true })
  deviceFingerprinting: boolean;

  @Column({ name: 'prevent_screenshots', type: 'boolean', default: false })
  preventScreenshots: boolean;

  @Column({ name: 'prevent_printing', type: 'boolean', default: true })
  preventPrinting: boolean;

  @Column({ name: 'prevent_copying', type: 'boolean', default: true })
  preventCopying: boolean;

  // Viewer Settings
  @Column({ name: 'viewer_type', type: 'varchar', length: 50, default: 'pdf' })
  viewerType: string; // pdf, epub, custom

  @Column({ name: 'viewer_config', type: 'json', nullable: true })
  viewerConfig: Record<string, any> | null;

  // Analytics
  @Column({ name: 'total_downloads', type: 'int', default: 0 })
  totalDownloads: number;

  @Column({ name: 'total_views', type: 'int', default: 0 })
  totalViews: number;

  @Column({ name: 'unique_accessors', type: 'int', default: 0 })
  uniqueAccessors: number;

  // Metadata
  @Column({ name: 'metadata', type: 'json', nullable: true })
  metadata: Record<string, any> | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}
