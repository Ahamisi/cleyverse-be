import { Entity, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '../../../common/base/base.entity';
import { User } from '../../users/entities/user.entity';
import { FormField } from './form-field.entity';
import { FormSubmission } from './form-submission.entity';

export enum FormType {
  BLANK = 'blank',
  EMAIL_SIGNUP = 'email_signup',
  CONTACT_FORM = 'contact_form',
  EVENT_REGISTRATION = 'event_registration',
  VENDOR_APPLICATION = 'vendor_application',
  GUEST_REGISTRATION = 'guest_registration',
}

export enum FormStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

@Entity('forms')
@Index(['userId', 'status'])
export class Form extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, user => user.forms, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: FormType, default: FormType.BLANK })
  type: FormType;

  @Column({ type: 'text', nullable: true })
  introduction: string | null;

  @Column({ name: 'thank_you_message', type: 'text', nullable: true })
  thankYouMessage: string | null;

  // Event Context for Forms Integration
  @Column({ name: 'event_context', type: 'jsonb', nullable: true })
  eventContext: {
    eventId?: string;
    formPurpose?: 'registration' | 'vendor' | 'guest';
    eventTitle?: string;
    eventSlug?: string;
  } | null;

  @Column({ name: 'custom_terms', type: 'text', nullable: true })
  customTerms: string | null;

  @Column({ name: 'require_terms_acceptance', default: false })
  requireTermsAcceptance: boolean;

  @Column({ name: 'collect_email_addresses', default: true })
  collectEmailAddresses: boolean;

  @Column({ name: 'send_email_notifications', default: true })
  sendEmailNotifications: boolean;

  @Column({ name: 'notification_email', type: 'varchar', nullable: true })
  notificationEmail: string | null;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: FormStatus, default: FormStatus.ACTIVE })
  status: FormStatus;

  @Column({ name: 'submission_count', default: 0 })
  submissionCount: number;

  @Column({ name: 'archived_at', type: 'timestamp', nullable: true })
  archivedAt: Date | null;

  // Relationships
  @OneToMany(() => FormField, field => field.form, { cascade: true })
  fields: FormField[];

  @OneToMany(() => FormSubmission, submission => submission.form)
  submissions: FormSubmission[];
}
