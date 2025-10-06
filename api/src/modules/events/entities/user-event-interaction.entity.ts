import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, Unique } from 'typeorm';

export enum InteractionType {
  VIEW = 'view',
  LIKE = 'like',
  BOOKMARK = 'bookmark',
  SHARE = 'share',
  REGISTER = 'register',
  ATTEND = 'attend'
}

@Entity('user_event_interactions')
@Unique(['userId', 'eventId', 'type'])
export class UserEventInteraction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'event_id', type: 'uuid' })
  eventId: string;

  @Column({ type: 'enum', enum: InteractionType })
  type: InteractionType;

  // Additional metadata
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  // For analytics
  @Column({ name: 'session_id', type: 'varchar', length: 100, nullable: true })
  sessionId: string | null;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string | null;

  @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true })
  ipAddress: string | null;

  // Relations
  @ManyToOne('User', 'eventInteractions')
  @JoinColumn({ name: 'user_id' })
  user: any;

  @ManyToOne('Event', 'userInteractions')
  @JoinColumn({ name: 'event_id' })
  event: any;
}

@Entity('user_event_subscriptions')
@Unique(['userId', 'eventId'])
export class UserEventSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'event_id', type: 'uuid' })
  eventId: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // Notification preferences
  @Column({ name: 'notify_updates', type: 'boolean', default: true })
  notifyUpdates: boolean;

  @Column({ name: 'notify_reminders', type: 'boolean', default: true })
  notifyReminders: boolean;

  // Relations
  @ManyToOne('User', 'eventSubscriptions')
  @JoinColumn({ name: 'user_id' })
  user: any;

  @ManyToOne('Event', 'subscriptions')
  @JoinColumn({ name: 'event_id' })
  event: any;
}
