import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';

export enum QuestionType {
  SHORT_TEXT = 'short_text',
  LONG_TEXT = 'long_text',
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  DROPDOWN = 'dropdown',
  EMAIL = 'email',
  PHONE = 'phone',
  NUMBER = 'number',
  DATE = 'date',
  CHECKBOX = 'checkbox',
  FILE_UPLOAD = 'file_upload'
}

@Entity('event_registration_questions')
export class EventRegistrationQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  // Relations
  @Column({ name: 'event_id', type: 'uuid' })
  eventId: string;

  @ManyToOne('Event', 'registrationQuestions')
  @JoinColumn({ name: 'event_id' })
  event: any;

  // Question Details
  @Column({ type: 'varchar', length: 500 })
  question: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'enum', enum: QuestionType, default: QuestionType.SHORT_TEXT })
  type: QuestionType;

  @Column({ name: 'is_required', type: 'boolean', default: false })
  isRequired: boolean;

  @Column({ name: 'display_order', type: 'int', default: 0 })
  displayOrder: number;

  // Options for choice-based questions
  @Column({ type: 'jsonb', nullable: true })
  options: string[] | null;

  // Validation
  @Column({ name: 'min_length', type: 'int', nullable: true })
  minLength: number | null;

  @Column({ name: 'max_length', type: 'int', nullable: true })
  maxLength: number | null;

  @Column({ name: 'min_value', type: 'decimal', precision: 10, scale: 2, nullable: true })
  minValue: number | null;

  @Column({ name: 'max_value', type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxValue: number | null;

  @Column({ name: 'validation_pattern', type: 'varchar', length: 500, nullable: true })
  validationPattern: string | null; // Regex pattern

  @Column({ name: 'validation_message', type: 'varchar', length: 500, nullable: true })
  validationMessage: string | null;

  // File upload settings
  @Column({ name: 'allowed_file_types', type: 'text', array: true, nullable: true })
  allowedFileTypes: string[] | null; // e.g., ['pdf', 'jpg', 'png']

  @Column({ name: 'max_file_size', type: 'int', nullable: true })
  maxFileSize: number | null; // In bytes

  // Settings
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'placeholder_text', type: 'varchar', length: 200, nullable: true })
  placeholderText: string | null;

  @Column({ name: 'help_text', type: 'text', nullable: true })
  helpText: string | null;

  // Relations
  @OneToMany('EventGuestAnswer', 'question')
  answers: any[];
}

@Entity('event_guest_answers')
export class EventGuestAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  // Relations
  @Column({ name: 'guest_id', type: 'uuid' })
  guestId: string;

  @Column({ name: 'question_id', type: 'uuid' })
  questionId: string;

  @ManyToOne('EventGuest', 'answers')
  @JoinColumn({ name: 'guest_id' })
  guest: any;

  @ManyToOne('EventRegistrationQuestion', 'answers')
  @JoinColumn({ name: 'question_id' })
  question: any;

  // Answer Data
  @Column({ name: 'answer_text', type: 'text', nullable: true })
  answerText: string | null;

  @Column({ name: 'answer_number', type: 'decimal', precision: 10, scale: 2, nullable: true })
  answerNumber: number | null;

  @Column({ name: 'answer_date', type: 'timestamp', nullable: true })
  answerDate: Date | null;

  @Column({ name: 'answer_boolean', type: 'boolean', nullable: true })
  answerBoolean: boolean | null;

  @Column({ name: 'answer_choices', type: 'text', array: true, nullable: true })
  answerChoices: string[] | null;

  @Column({ name: 'file_url', type: 'varchar', length: 500, nullable: true })
  fileUrl: string | null;

  @Column({ name: 'file_name', type: 'varchar', length: 255, nullable: true })
  fileName: string | null;

  @Column({ name: 'file_size', type: 'int', nullable: true })
  fileSize: number | null;
}
