import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';

export enum GuestStatus {
  INVITED = 'invited',
  REGISTERED = 'registered',
  WAITLISTED = 'waitlisted',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  NO_SHOW = 'no_show',
  CANCELLED = 'cancelled'
}

export enum GuestType {
  STANDARD = 'standard',
  VIP = 'vip',
  SPEAKER = 'speaker',
  SPONSOR = 'sponsor',
  MEDIA = 'media',
  STAFF = 'staff'
}

export enum InvitationSource {
  DIRECT = 'direct',
  EMAIL = 'email',
  SOCIAL = 'social',
  REFERRAL = 'referral',
  PUBLIC = 'public',
  IMPORT = 'import'
}

@Entity('event_guests')
export class EventGuest {
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
  userId: string | null; // null for non-registered guests

  @ManyToOne('Event', 'guests')
  @JoinColumn({ name: 'event_id' })
  event: any;

  @ManyToOne('User', 'eventGuests', { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: any;

  // Guest Information (for non-registered users)
  @Column({ name: 'guest_name', type: 'varchar', length: 100, nullable: true })
  guestName: string | null;

  @Column({ name: 'guest_email', type: 'varchar', length: 255, nullable: true })
  guestEmail: string | null;

  @Column({ name: 'guest_phone', type: 'varchar', length: 20, nullable: true })
  guestPhone: string | null;

  @Column({ name: 'guest_company', type: 'varchar', length: 100, nullable: true })
  guestCompany: string | null;

  // Status & Type
  @Column({ type: 'enum', enum: GuestStatus, default: GuestStatus.INVITED })
  status: GuestStatus;

  @Column({ name: 'guest_type', type: 'enum', enum: GuestType, default: GuestType.STANDARD })
  guestType: GuestType;

  @Column({ name: 'invitation_source', type: 'enum', enum: InvitationSource, default: InvitationSource.DIRECT })
  invitationSource: InvitationSource;

  // Registration
  @Column({ name: 'registration_token', type: 'varchar', length: 100, unique: true, nullable: true })
  registrationToken: string | null;

  @Column({ name: 'registered_at', type: 'timestamp', nullable: true })
  registeredAt: Date | null;

  @Column({ name: 'confirmed_at', type: 'timestamp', nullable: true })
  confirmedAt: Date | null;

  // Check-in
  @Column({ name: 'checked_in_at', type: 'timestamp', nullable: true })
  checkedInAt: Date | null;

  @Column({ name: 'checked_in_by', type: 'uuid', nullable: true })
  checkedInBy: string | null; // Host/Admin who checked them in

  @Column({ name: 'check_in_method', type: 'varchar', length: 50, nullable: true })
  checkInMethod: string | null; // 'qr_code', 'manual', 'self'

  // Additional Data
  @Column({ name: 'dietary_restrictions', type: 'text', nullable: true })
  dietaryRestrictions: string | null;

  @Column({ name: 'special_requests', type: 'text', nullable: true })
  specialRequests: string | null;

  @Column({ name: 'registration_answers', type: 'jsonb', nullable: true })
  registrationAnswers: Record<string, any> | null;

  // Communication
  @Column({ name: 'invitation_sent_at', type: 'timestamp', nullable: true })
  invitationSentAt: Date | null;

  @Column({ name: 'reminder_sent_at', type: 'timestamp', nullable: true })
  reminderSentAt: Date | null;

  @Column({ name: 'follow_up_sent_at', type: 'timestamp', nullable: true })
  followUpSentAt: Date | null;

  // Cancellation
  @Column({ name: 'cancelled_at', type: 'timestamp', nullable: true })
  cancelledAt: Date | null;

  @Column({ name: 'cancellation_reason', type: 'text', nullable: true })
  cancellationReason: string | null;

  // Waitlist
  @Column({ name: 'waitlist_position', type: 'int', nullable: true })
  waitlistPosition: number | null;

  @Column({ name: 'waitlisted_at', type: 'timestamp', nullable: true })
  waitlistedAt: Date | null;

  // Forms Integration
  @Column({ name: 'form_submission_id', type: 'uuid', nullable: true })
  formSubmissionId: string | null;

  // Relations
  @OneToMany('EventGuestAnswer', 'guest')
  answers: any[];
}
