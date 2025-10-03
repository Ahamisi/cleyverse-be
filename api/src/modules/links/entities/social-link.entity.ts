import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base/base.entity';
import { User } from '../../users/entities/user.entity';
import { LinkStatus, LinkLockType, MediaType } from './link.entity';

export enum SocialPlatform {
  INSTAGRAM = 'instagram',
  YOUTUBE = 'youtube',
  TIKTOK = 'tiktok',
  TWITTER = 'twitter',
  FACEBOOK = 'facebook',
  LINKEDIN = 'linkedin',
  PINTEREST = 'pinterest',
  SNAPCHAT = 'snapchat',
  SPOTIFY = 'spotify',
  APPLE_MUSIC = 'apple_music',
  SOUNDCLOUD = 'soundcloud',
  TWITCH = 'twitch',
  THREADS = 'threads',
  WHATSAPP = 'whatsapp',
  EMAIL = 'email'
}

export enum SocialIconPosition {
  TOP = 'top',
  BOTTOM = 'bottom'
}

@Entity('social_links')
export class SocialLink extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ 
    type: 'enum', 
    enum: SocialPlatform 
  })
  platform: SocialPlatform;

  @Column()
  username: string;

  @Column()
  url: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'display_order', default: 0 })
  displayOrder: number;

  // Icon settings
  @Column({ 
    name: 'icon_position',
    type: 'enum', 
    enum: SocialIconPosition,
    default: SocialIconPosition.TOP 
  })
  iconPosition: SocialIconPosition;

  // Analytics
  @Column({ name: 'click_count', default: 0 })
  clickCount: number;

  @Column({ name: 'last_clicked_at', nullable: true })
  lastClickedAt: Date;

  // 🆕 SCHEDULING FEATURES (same as Link)
  @Column({ name: 'scheduled_start_at', type: 'timestamp', nullable: true })
  scheduledStartAt: Date;

  @Column({ name: 'scheduled_end_at', type: 'timestamp', nullable: true })
  scheduledEndAt: Date;

  @Column({ nullable: true })
  timezone: string;

  // 🆕 LOCKING & ACCESS CONTROL (same as Link)
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

  // 🆕 CUSTOMIZATION & SHARING (same as Link)
  @Column({ name: 'short_code', unique: true, nullable: true })
  shortCode: string;

  @Column({ name: 'custom_domain', nullable: true })
  customDomain: string;

  @Column({ name: 'shareable_short_url', nullable: true })
  shareableShortUrl: string;

  @Column({ name: 'social_share_count', default: 0 })
  socialShareCount: number;

  // 🆕 MEDIA & RICH CONTENT (same as Link)
  @Column({ 
    name: 'media_type', 
    type: 'enum', 
    enum: MediaType, 
    nullable: true 
  })
  mediaType: MediaType;

  @Column({ name: 'preview_data', type: 'jsonb', nullable: true })
  previewData: any;

  // 🆕 ARCHIVING & LIFECYCLE (same as Link)
  @Column({ 
    type: 'enum', 
    enum: LinkStatus, 
    default: LinkStatus.ACTIVE 
  })
  status: LinkStatus;

  @Column({ name: 'archived_at', type: 'timestamp', nullable: true })
  archivedAt: Date;
}
