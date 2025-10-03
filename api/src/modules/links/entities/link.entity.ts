import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base/base.entity';
import { User } from '../../users/entities/user.entity';
import { Collection } from '../../collections/entities/collection.entity';

export enum LinkType {
  REGULAR = 'regular',
  SOCIAL = 'social',
  EMAIL = 'email',
  PHONE = 'phone'
}

export enum LinkLayout {
  CLASSIC = 'classic',
  FEATURED = 'featured'
}

export enum LinkStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DELETED = 'deleted'
}

export enum LinkLockType {
  SUBSCRIPTION = 'subscription',
  CODE = 'code',
  AGE = 'age',
  SENSITIVE = 'sensitive',
  NFT = 'nft'
}

export enum MediaType {
  VIDEO = 'video',
  MUSIC = 'music',
  IMAGE = 'image',
  DOCUMENT = 'document'
}

@Entity('links')
export class Link extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // 🆕 Collection relationship
  @Column({ name: 'collection_id', type: 'uuid', nullable: true })
  collectionId: string | null;

  // Relationship disabled to prevent cascade issues
  // @ManyToOne(() => Collection, collection => collection.links, { onDelete: 'SET NULL' })
  // @JoinColumn({ name: 'collection_id' })
  // collection: Collection;

  @Column()
  title: string;

  @Column()
  url: string;

  @Column({ 
    type: 'enum', 
    enum: LinkType, 
    default: LinkType.REGULAR 
  })
  type: LinkType;

  @Column({ 
    type: 'enum', 
    enum: LinkLayout, 
    default: LinkLayout.CLASSIC 
  })
  layout: LinkLayout;

  @Column({ name: 'thumbnail_url', nullable: true })
  thumbnailUrl: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'click_count', default: 0 })
  clickCount: number;

  @Column({ name: 'display_order', default: 0 })
  displayOrder: number;

  // Link behavior settings
  @Column({ name: 'open_in_new_tab', default: true })
  openInNewTab: boolean;

  @Column({ name: 'is_featured', default: false })
  isFeatured: boolean;

  // Analytics
  @Column({ name: 'last_clicked_at', nullable: true })
  lastClickedAt: Date;

  // 🆕 SCHEDULING FEATURES
  @Column({ name: 'scheduled_start_at', type: 'timestamp', nullable: true })
  scheduledStartAt: Date;

  @Column({ name: 'scheduled_end_at', type: 'timestamp', nullable: true })
  scheduledEndAt: Date;

  @Column({ nullable: true })
  timezone: string;

  // 🆕 LOCKING & ACCESS CONTROL
  @Column({ name: 'is_locked', default: false })
  isLocked: boolean;

  @Column({ 
    name: 'lock_type', 
    type: 'enum', 
    enum: LinkLockType, 
    nullable: true 
  })
  lockType: LinkLockType;

  @Column({ name: 'lock_code', nullable: true })
  lockCode: string;

  @Column({ name: 'lock_description', type: 'text', nullable: true })
  lockDescription: string;

  // 🆕 CUSTOMIZATION & SHARING
  @Column({ name: 'short_code', unique: true, nullable: true })
  shortCode: string;

  @Column({ name: 'custom_domain', nullable: true })
  customDomain: string;

  @Column({ name: 'shareable_short_url', nullable: true })
  shareableShortUrl: string;

  @Column({ name: 'social_share_count', default: 0 })
  socialShareCount: number;

  // 🆕 MEDIA & RICH CONTENT
  @Column({ 
    name: 'media_type', 
    type: 'enum', 
    enum: MediaType, 
    nullable: true 
  })
  mediaType: MediaType;

  @Column({ name: 'preview_data', type: 'jsonb', nullable: true })
  previewData: any;

  // 🆕 ARCHIVING & LIFECYCLE
  @Column({ 
    type: 'enum', 
    enum: LinkStatus, 
    default: LinkStatus.ACTIVE 
  })
  status: LinkStatus;

  @Column({ name: 'archived_at', type: 'timestamp', nullable: true })
  archivedAt: Date;
}
