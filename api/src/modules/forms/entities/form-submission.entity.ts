import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/base/base.entity';
import { Form } from './form.entity';

@Entity('form_submissions')
@Index(['formId', 'createdAt'])
@Index(['submitterEmail'])
export class FormSubmission extends BaseEntity {
  @Column({ name: 'form_id', type: 'uuid' })
  formId: string;

  @ManyToOne(() => Form, form => form.submissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'form_id' })
  form: Form;

  @Column({ name: 'submitter_email', type: 'varchar', nullable: true })
  submitterEmail: string | null;

  @Column({ name: 'submitter_name', type: 'varchar', nullable: true })
  submitterName: string | null;

  @Column({ name: 'submission_data', type: 'jsonb' })
  submissionData: any; // All form field responses

  @Column({ name: 'submitter_ip', type: 'varchar', nullable: true })
  submitterIp: string | null;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string | null;

  @Column({ name: 'referrer_url', type: 'varchar', nullable: true })
  referrerUrl: string | null;

  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  @Column({ name: 'is_starred', default: false })
  isStarred: boolean;

  @Column({ name: 'is_spam', default: false })
  isSpam: boolean;

  @Column({ name: 'response_sent', default: false })
  responseSent: boolean;

  @Column({ name: 'response_sent_at', type: 'timestamp', nullable: true })
  responseSentAt: Date | null;
}
