import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum EmailStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  BOUNCED = 'bounced',
  FAILED = 'failed',
}

@Entity('email_logs')
@Index(['to', 'sentAt'])
@Index(['template', 'sentAt'])
@Index(['status', 'sentAt'])
@Index(['messageId'], { unique: true })
export class EmailLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  to: string;

  @Column({ type: 'varchar', length: 500 })
  subject: string;

  @Column({ type: 'varchar', length: 100 })
  template: string;

  @Column({ type: 'enum', enum: EmailStatus, default: EmailStatus.SENT })
  status: EmailStatus;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  messageId: string | null;

  @Column({ type: 'text', nullable: true })
  error: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @Column({ type: 'timestamp' })
  sentAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
