import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';

export enum HostRole {
  OWNER = 'owner',
  CO_HOST = 'co_host',
  MODERATOR = 'moderator',
  ADMIN = 'admin'
}

export enum HostPermissions {
  MANAGE_EVENT = 'manage_event',
  MANAGE_GUESTS = 'manage_guests',
  MANAGE_VENDORS = 'manage_vendors',
  CHECK_IN_GUESTS = 'check_in_guests',
  SEND_MESSAGES = 'send_messages',
  VIEW_ANALYTICS = 'view_analytics',
  MANAGE_HOSTS = 'manage_hosts'
}

@Entity('event_hosts')
export class EventHost {
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

  @ManyToOne('Event', 'hosts')
  @JoinColumn({ name: 'event_id' })
  event: any;

  @ManyToOne('User', 'eventHosts')
  @JoinColumn({ name: 'user_id' })
  user: any;

  // Host Details
  @Column({ type: 'enum', enum: HostRole, default: HostRole.CO_HOST })
  role: HostRole;

  @Column({ type: 'text', array: true, default: [] })
  permissions: HostPermissions[];

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ name: 'profile_image_url', type: 'varchar', length: 500, nullable: true })
  profileImageUrl: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  title: string | null; // e.g., "Lead Speaker", "Event Coordinator"

  @Column({ type: 'varchar', length: 100, nullable: true })
  company: string | null;

  @Column({ name: 'linkedin_url', type: 'varchar', length: 500, nullable: true })
  linkedinUrl: string | null;

  @Column({ name: 'twitter_url', type: 'varchar', length: 500, nullable: true })
  twitterUrl: string | null;

  // Status
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'is_featured', type: 'boolean', default: false })
  isFeatured: boolean; // Show prominently on event page

  @Column({ name: 'display_order', type: 'int', default: 0 })
  displayOrder: number;

  // Invitation
  @Column({ name: 'invited_by', type: 'uuid', nullable: true })
  invitedBy: string | null;

  @Column({ name: 'invited_at', type: 'timestamp', nullable: true })
  invitedAt: Date | null;

  @Column({ name: 'accepted_at', type: 'timestamp', nullable: true })
  acceptedAt: Date | null;

  @Column({ name: 'invitation_token', type: 'varchar', length: 100, unique: true, nullable: true })
  invitationToken: string | null;
}
