import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum VendorQuestionType {
  SHORT_TEXT = 'short_text',
  LONG_TEXT = 'long_text',
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  YES_NO = 'yes_no',
  NUMBER = 'number',
  EMAIL = 'email',
  PHONE = 'phone',
  URL = 'url',
  DATE = 'date',
  FILE_UPLOAD = 'file_upload'
}

@Entity('event_vendor_questions')
export class EventVendorQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({ name: 'event_id', type: 'uuid' })
  eventId: string;

  @Column({ type: 'varchar', length: 500 })
  question: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'enum', enum: VendorQuestionType })
  type: VendorQuestionType;

  @Column({ name: 'is_required', type: 'boolean', default: false })
  isRequired: boolean;

  @Column({ name: 'display_order', type: 'int', default: 0 })
  displayOrder: number;

  // For choice questions
  @Column({ type: 'text', array: true, nullable: true })
  options: string[] | null;

  // Validation rules
  @Column({ name: 'min_length', type: 'int', nullable: true })
  minLength: number | null;

  @Column({ name: 'max_length', type: 'int', nullable: true })
  maxLength: number | null;

  @Column({ name: 'min_value', type: 'decimal', precision: 10, scale: 2, nullable: true })
  minValue: number | null;

  @Column({ name: 'max_value', type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxValue: number | null;

  @Column({ name: 'validation_pattern', type: 'varchar', length: 200, nullable: true })
  validationPattern: string | null;

  @Column({ name: 'validation_message', type: 'varchar', length: 200, nullable: true })
  validationMessage: string | null;

  // File upload settings
  @Column({ name: 'allowed_file_types', type: 'text', array: true, nullable: true })
  allowedFileTypes: string[] | null; // ['pdf', 'jpg', 'png']

  @Column({ name: 'max_file_size', type: 'int', nullable: true })
  maxFileSize: number | null; // in MB

  // UI settings
  @Column({ name: 'placeholder_text', type: 'varchar', length: 200, nullable: true })
  placeholderText: string | null;

  @Column({ name: 'help_text', type: 'varchar', length: 500, nullable: true })
  helpText: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // Relations
  @ManyToOne('Event', 'vendorQuestions')
  @JoinColumn({ name: 'event_id' })
  event: any;
}

@Entity('event_vendor_answers')
export class EventVendorAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({ name: 'vendor_id', type: 'uuid' })
  vendorId: string;

  @Column({ name: 'question_id', type: 'uuid' })
  questionId: string;

  @Column({ type: 'text', nullable: true })
  answer: string | null;

  @Column({ name: 'file_url', type: 'varchar', length: 500, nullable: true })
  fileUrl: string | null;

  @Column({ name: 'file_name', type: 'varchar', length: 200, nullable: true })
  fileName: string | null;

  // Relations
  @ManyToOne('EventVendor', 'answers')
  @JoinColumn({ name: 'vendor_id' })
  vendor: any;

  @ManyToOne('EventVendorQuestion', 'answers')
  @JoinColumn({ name: 'question_id' })
  question: EventVendorQuestion;
}
