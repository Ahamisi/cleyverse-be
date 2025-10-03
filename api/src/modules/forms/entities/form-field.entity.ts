import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/base/base.entity';
import { Form } from './form.entity';

export enum FieldType {
  TEXT = 'text',
  EMAIL = 'email',
  PHONE = 'phone',
  MESSAGE = 'message',
  SHORT_ANSWER = 'short_answer',
  PARAGRAPH = 'paragraph',
  TEXTAREA = 'textarea', // Alias for paragraph
  DATE = 'date',
  COUNTRY = 'country',
  DROPDOWN = 'dropdown',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  MULTIPLE_CHOICE = 'multiple_choice', // Alias for radio/dropdown
}

@Entity('form_fields')
@Index(['formId', 'displayOrder'])
export class FormField extends BaseEntity {
  @Column({ name: 'form_id', type: 'uuid' })
  formId: string;

  @ManyToOne(() => Form, form => form.fields, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'form_id' })
  form: Form;

  @Column()
  label: string;

  @Column({ type: 'enum', enum: FieldType })
  type: FieldType;

  @Column({ type: 'varchar', nullable: true })
  placeholder: string | null;

  @Column({ name: 'is_required', default: false })
  isRequired: boolean;

  @Column({ name: 'display_order', default: 0 })
  displayOrder: number;

  @Column({ name: 'field_options', type: 'jsonb', nullable: true })
  fieldOptions: any; // For dropdown/radio options, validation rules, etc.

  @Column({ name: 'validation_rules', type: 'jsonb', nullable: true })
  validationRules: any; // Min/max length, regex patterns, etc.

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
