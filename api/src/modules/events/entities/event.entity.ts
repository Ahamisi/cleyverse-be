import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';

export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  LIVE = 'live',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ARCHIVED = 'archived'
}

export enum EventType {
  CONFERENCE = 'conference',
  WORKSHOP = 'workshop',
  MEETUP = 'meetup',
  WEBINAR = 'webinar',
  NETWORKING = 'networking',
  PARTY = 'party',
  CONCERT = 'concert',
  EXHIBITION = 'exhibition',
  SEMINAR = 'seminar',
  OTHER = 'other'
}

export enum EventVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  UNLISTED = 'unlisted'
}

export enum TicketType {
  FREE = 'free',
  PAID = 'paid',
  DONATION = 'donation'
}

export enum LocationType {
  PHYSICAL = 'physical',
  VIRTUAL = 'virtual',
  HYBRID = 'hybrid'
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  // Event Details
  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 200, unique: true })
  slug: string; // For cley.live/event-slug

  @Column({ name: 'cover_image_url', type: 'varchar', length: 500, nullable: true })
  coverImageUrl: string | null;

  @Column({ type: 'enum', enum: EventType, default: EventType.MEETUP })
  type: EventType;

  @Column({ type: 'enum', enum: EventStatus, default: EventStatus.DRAFT })
  status: EventStatus;

  @Column({ type: 'enum', enum: EventVisibility, default: EventVisibility.PUBLIC })
  visibility: EventVisibility;

  // Date & Time
  @Column({ name: 'start_date', type: 'timestamp' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'varchar', length: 50, default: 'UTC' })
  timezone: string;

  // Location
  @Column({ name: 'location_type', type: 'enum', enum: LocationType, default: LocationType.PHYSICAL })
  locationType: LocationType;

  @Column({ name: 'venue_name', type: 'varchar', length: 200, nullable: true })
  venueName: string | null;

  @Column({ name: 'venue_address', type: 'text', nullable: true })
  venueAddress: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number | null;

  // Event Categories & Tags
  @Column({ type: 'text', array: true, nullable: true })
  tags: string[] | null;

  @Column({ type: 'text', array: true, nullable: true })
  categories: string[] | null;

  // Recurring Events
  @Column({ name: 'is_recurring', type: 'boolean', default: false })
  isRecurring: boolean;

  @Column({ name: 'recurrence_pattern', type: 'varchar', length: 50, nullable: true })
  recurrencePattern: string | null; // 'daily', 'weekly', 'monthly', 'yearly'

  @Column({ name: 'recurrence_interval', type: 'int', nullable: true })
  recurrenceInterval: number | null; // every N days/weeks/months

  @Column({ name: 'recurrence_end_date', type: 'timestamp', nullable: true })
  recurrenceEndDate: Date | null;

  @Column({ name: 'parent_event_id', type: 'uuid', nullable: true })
  parentEventId: string | null; // Links to the original recurring event

  // Recommendation Engine Data
  @Column({ name: 'target_audience', type: 'text', array: true, nullable: true })
  targetAudience: string[] | null; // 'developers', 'designers', 'entrepreneurs'

  @Column({ name: 'experience_level', type: 'varchar', length: 50, nullable: true })
  experienceLevel: string | null; // 'beginner', 'intermediate', 'advanced', 'all'

  @Column({ name: 'industry', type: 'varchar', length: 100, nullable: true })
  industry: string | null; // 'technology', 'healthcare', 'finance'

  // Engagement Metrics for Recommendations
  @Column({ name: 'like_count', type: 'int', default: 0 })
  likeCount: number;

  @Column({ name: 'bookmark_count', type: 'int', default: 0 })
  bookmarkCount: number;

  @Column({ name: 'engagement_score', type: 'decimal', precision: 5, scale: 2, default: 0 })
  engagementScore: number; // Calculated score for recommendations

  @Column({ name: 'virtual_link', type: 'varchar', length: 500, nullable: true })
  virtualLink: string | null;

  @Column({ name: 'meeting_id', type: 'varchar', length: 100, nullable: true })
  meetingId: string | null;

  @Column({ name: 'meeting_password', type: 'varchar', length: 100, nullable: true })
  meetingPassword: string | null;

  // Tickets & Capacity
  @Column({ name: 'ticket_type', type: 'enum', enum: TicketType, default: TicketType.FREE })
  ticketType: TicketType;

  @Column({ name: 'ticket_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  ticketPrice: number | null;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({ type: 'int', nullable: true })
  capacity: number | null; // null = unlimited

  @Column({ name: 'require_approval', type: 'boolean', default: false })
  requireApproval: boolean;

  // Registration
  @Column({ name: 'registration_start', type: 'timestamp', nullable: true })
  registrationStart: Date | null;

  @Column({ name: 'registration_end', type: 'timestamp', nullable: true })
  registrationEnd: Date | null;

  @Column({ name: 'allow_waitlist', type: 'boolean', default: true })
  allowWaitlist: boolean;

  // Settings
  @Column({ name: 'allow_guests_invite_others', type: 'boolean', default: false })
  allowGuestsInviteOthers: boolean;

  @Column({ name: 'show_guest_list', type: 'boolean', default: true })
  showGuestList: boolean;

  @Column({ name: 'send_reminders', type: 'boolean', default: true })
  sendReminders: boolean;

  // SEO & Sharing
  @Column({ name: 'seo_title', type: 'varchar', length: 200, nullable: true })
  seoTitle: string | null;

  @Column({ name: 'seo_description', type: 'varchar', length: 500, nullable: true })
  seoDescription: string | null;

  @Column({ name: 'social_image_url', type: 'varchar', length: 500, nullable: true })
  socialImageUrl: string | null;

  // Analytics
  @Column({ name: 'view_count', type: 'int', default: 0 })
  viewCount: number;

  @Column({ name: 'share_count', type: 'int', default: 0 })
  shareCount: number;

  @Column({ name: 'total_registered', type: 'int', default: 0 })
  totalRegistered: number;

  @Column({ name: 'total_attended', type: 'int', default: 0 })
  totalAttended: number;

  // Vendor Settings
  @Column({ name: 'allow_vendors', type: 'boolean', default: false })
  allowVendors: boolean;

  @Column({ name: 'vendor_application_deadline', type: 'timestamp', nullable: true })
  vendorApplicationDeadline: Date | null;

  @Column({ name: 'vendor_fee', type: 'decimal', precision: 10, scale: 2, nullable: true })
  vendorFee: number | null;

  // Timestamps
  @Column({ name: 'published_at', type: 'timestamp', nullable: true })
  publishedAt: Date | null;

  @Column({ name: 'cancelled_at', type: 'timestamp', nullable: true })
  cancelledAt: Date | null;

  @Column({ name: 'cancellation_reason', type: 'text', nullable: true })
  cancellationReason: string | null;

  // Relations
  @Column({ name: 'creator_id', type: 'uuid' })
  creatorId: string;

  @ManyToOne('User', 'events')
  @JoinColumn({ name: 'creator_id' })
  creator: any;

  @OneToMany('EventGuest', 'event')
  guests: any[];

  @OneToMany('EventHost', 'event')
  hosts: any[];

  @OneToMany('EventVendor', 'event')
  vendors: any[];

  @OneToMany('EventProduct', 'event')
  products: any[];

  @OneToMany('EventRegistrationQuestion', 'event')
  registrationQuestions: any[];
}
