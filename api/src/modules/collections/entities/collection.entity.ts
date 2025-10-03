import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/base/base.entity';
import { User } from '../../users/entities/user.entity';
import { Link } from '../../links/entities/link.entity';

export enum CollectionLayout {
  STACK = 'stack',
  GRID = 'grid',
  CAROUSEL = 'carousel'
}

export enum CollectionStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived'
}

@Entity('collections')
@Index(['userId', 'displayOrder'])
export class Collection extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, user => user.collections, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ 
    type: 'enum', 
    enum: CollectionLayout, 
    default: CollectionLayout.STACK 
  })
  layout: CollectionLayout;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'display_order', default: 0 })
  displayOrder: number;

  @Column({ 
    type: 'enum', 
    enum: CollectionStatus, 
    default: CollectionStatus.ACTIVE 
  })
  status: CollectionStatus;

  @Column({ name: 'link_count', default: 0 })
  linkCount: number;

  // Theme and styling
  @Column({ name: 'background_color', nullable: true })
  backgroundColor: string;

  @Column({ name: 'text_color', nullable: true })
  textColor: string;

  @Column({ name: 'border_radius', nullable: true })
  borderRadius: string;

  // Settings
  @Column({ name: 'show_title', default: true })
  showTitle: boolean;

  @Column({ name: 'show_count', default: true })
  showCount: boolean;

  @Column({ name: 'allow_reorder', default: true })
  allowReorder: boolean;

  // Relationships - manually loaded to prevent cascade issues
  links?: any[];

  @Column({ name: 'archived_at', type: 'timestamp', nullable: true })
  archivedAt: Date | null;
}
