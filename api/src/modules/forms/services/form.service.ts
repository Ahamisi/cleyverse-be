import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../../common/base/base.service';
import { Form, FormType, FormStatus } from '../entities/form.entity';
import { FormField, FieldType } from '../entities/form-field.entity';
import { FormSubmission } from '../entities/form-submission.entity';
import { User } from '../../users/entities/user.entity';
import {
  CreateFormDto,
  UpdateFormDto,
  UpdateFormStatusDto,
  SubmitFormDto,
  AddFormFieldDto,
  UpdateFormFieldDto,
  ReorderFormFieldsDto
} from '../dto/form.dto';

@Injectable()
export class FormService extends BaseService<Form> {
  constructor(
    @InjectRepository(Form)
    private readonly formRepository: Repository<Form>,
    @InjectRepository(FormField)
    private readonly formFieldRepository: Repository<FormField>,
    @InjectRepository(FormSubmission)
    private readonly formSubmissionRepository: Repository<FormSubmission>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(formRepository);
  }

  protected getEntityName(): string {
    return 'Form';
  }

  async createForm(userId: string, createFormDto: CreateFormDto): Promise<Form> {
    // Verify user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create form
    const form = await this.create({
      ...createFormDto,
      userId,
      status: FormStatus.ACTIVE,
    });

    // Create default fields if provided
    if (createFormDto.fields && createFormDto.fields.length > 0) {
      const fields = createFormDto.fields.map((fieldDto, index) => ({
        ...fieldDto,
        formId: form.id,
        displayOrder: fieldDto.displayOrder ?? index,
      }));

      await this.formFieldRepository.save(fields);
    } else {
      // Create default fields based on form type
      await this.createDefaultFields(form.id, createFormDto.type || FormType.BLANK);
    }

    return this.getFormById(userId, form.id);
  }

  async getUserForms(userId: string, includeInactive: boolean = false): Promise<Form[]> {
    const query = this.formRepository
      .createQueryBuilder('form')
      .leftJoinAndSelect('form.fields', 'fields')
      .where('form.userId = :userId', { userId })
      .orderBy('form.createdAt', 'DESC')
      .addOrderBy('fields.displayOrder', 'ASC');

    if (!includeInactive) {
      query.andWhere('form.isActive = :isActive', { isActive: true });
    }

    return query.getMany();
  }

  async getFormById(userId: string, formId: string): Promise<Form> {
    const form = await this.formRepository.findOne({
      where: { id: formId, userId },
      relations: ['fields', 'submissions'],
      order: {
        fields: {
          displayOrder: 'ASC'
        },
        submissions: {
          createdAt: 'DESC'
        }
      }
    });

    if (!form) {
      throw new NotFoundException('Form not found or does not belong to user');
    }

    return form;
  }

  async getPublicForm(formId: string): Promise<Form> {
    const form = await this.formRepository.findOne({
      where: { id: formId, isActive: true, status: FormStatus.ACTIVE },
      relations: ['fields'],
      order: {
        fields: {
          displayOrder: 'ASC'
        }
      }
    });

    if (!form) {
      throw new NotFoundException('Form not found or is not active');
    }

    return form;
  }

  async updateForm(userId: string, formId: string, updateFormDto: UpdateFormDto): Promise<Form> {
    const form = await this.getFormById(userId, formId);
    
    await this.formRepository.update(formId, updateFormDto);
    return this.getFormById(userId, formId);
  }

  async deleteForm(userId: string, formId: string): Promise<void> {
    const form = await this.getFormById(userId, formId);
    await this.formRepository.remove(form);
  }

  async updateFormStatus(userId: string, formId: string, updateStatusDto: UpdateFormStatusDto): Promise<Form> {
    const form = await this.getFormById(userId, formId);
    
    const updateData: any = { status: updateStatusDto.status };
    
    if (updateStatusDto.status === FormStatus.ARCHIVED) {
      updateData.archivedAt = new Date();
      updateData.isActive = false;
    } else if (updateStatusDto.status === FormStatus.ACTIVE) {
      updateData.archivedAt = null;
      updateData.isActive = true;
    }

    await this.formRepository.update(formId, updateData);
    return this.getFormById(userId, formId);
  }

  // Form Fields Management
  async addFormField(userId: string, formId: string, addFieldDto: AddFormFieldDto): Promise<FormField> {
    const form = await this.getFormById(userId, formId);
    
    // Get next display order
    const maxOrder = await this.formFieldRepository
      .createQueryBuilder('field')
      .select('MAX(field.displayOrder)', 'max')
      .where('field.formId = :formId', { formId })
      .getRawOne();

    const displayOrder = addFieldDto.displayOrder ?? (maxOrder?.max || 0) + 1;

    // Transform 'required' to 'isRequired' if provided
    const fieldData = { ...addFieldDto } as any;
    if (fieldData.required !== undefined) {
      fieldData.isRequired = fieldData.required;
      delete fieldData.required;
    }

    const field = this.formFieldRepository.create({
      ...fieldData,
      formId,
      displayOrder,
    });

    return this.formFieldRepository.save(field) as unknown as FormField;
  }

  async updateFormField(userId: string, formId: string, fieldId: string, updateFieldDto: UpdateFormFieldDto): Promise<FormField> {
    // Verify form belongs to user
    await this.getFormById(userId, formId);
    
    const field = await this.formFieldRepository.findOne({
      where: { id: fieldId, formId }
    });

    if (!field) {
      throw new NotFoundException('Form field not found');
    }

    // Transform 'required' to 'isRequired' if provided
    const updateData = { ...updateFieldDto } as any;
    if (updateData.required !== undefined) {
      updateData.isRequired = updateData.required;
      delete updateData.required;
    }
    
    await this.formFieldRepository.update(fieldId, updateData);
    const updatedField = await this.formFieldRepository.findOne({ where: { id: fieldId } });
    if (!updatedField) {
      throw new NotFoundException('Form field not found after update');
    }
    return updatedField;
  }

  async deleteFormField(userId: string, formId: string, fieldId: string): Promise<void> {
    // Verify form belongs to user
    await this.getFormById(userId, formId);
    
    const field = await this.formFieldRepository.findOne({
      where: { id: fieldId, formId }
    });

    if (!field) {
      throw new NotFoundException('Form field not found');
    }

    await this.formFieldRepository.remove(field);
  }

  async reorderFormFields(userId: string, formId: string, reorderDto: ReorderFormFieldsDto): Promise<Form> {
    // Verify form belongs to user
    await this.getFormById(userId, formId);

    // Update display orders
    for (let i = 0; i < reorderDto.fieldIds.length; i++) {
      await this.formFieldRepository.update(
        { id: reorderDto.fieldIds[i], formId },
        { displayOrder: i }
      );
    }

    return this.getFormById(userId, formId);
  }

  // Form Submissions
  async submitForm(formId: string, submitDto: SubmitFormDto, metadata: any = {}): Promise<FormSubmission> {
    const form = await this.getPublicForm(formId);

    // Validate required fields
    const requiredFields = form.fields.filter(field => field.isRequired && field.isActive);
    for (const field of requiredFields) {
      if (!submitDto.submissionData[field.id] || submitDto.submissionData[field.id].trim() === '') {
        throw new BadRequestException(`Field "${field.label}" is required`);
      }
    }

    // Check terms acceptance if required
    if (form.requireTermsAcceptance && !submitDto.acceptTerms) {
      throw new BadRequestException('You must accept the terms and conditions');
    }

    // Create submission
    const submission = this.formSubmissionRepository.create({
      formId,
      submitterEmail: submitDto.submitterEmail,
      submitterName: submitDto.submitterName,
      submissionData: submitDto.submissionData || {}, // Ensure not null
      submitterIp: metadata.ip,
      userAgent: metadata.userAgent,
      referrerUrl: metadata.referrer,
    });

    const savedSubmission = await this.formSubmissionRepository.save(submission);

    // Update form submission count
    await this.formRepository.increment({ id: formId }, 'submissionCount', 1);

    return savedSubmission;
  }

  async getFormSubmissions(userId: string, formId: string): Promise<FormSubmission[]> {
    // Verify form belongs to user
    await this.getFormById(userId, formId);

    return this.formSubmissionRepository.find({
      where: { formId },
      order: { createdAt: 'DESC' }
    });
  }

  async getFormAnalytics(userId: string, formId?: string): Promise<any> {
    let query = this.formRepository
      .createQueryBuilder('form')
      .where('form.userId = :userId', { userId });

    if (formId) {
      query = query.andWhere('form.id = :formId', { formId });
    }

    const forms = await query.getMany();

    const analytics = {
      totalForms: forms.length,
      totalSubmissions: forms.reduce((sum, form) => sum + form.submissionCount, 0),
      activeForms: forms.filter(form => form.isActive).length,
      archivedForms: forms.filter(form => form.status === FormStatus.ARCHIVED).length,
      forms: forms.map(form => ({
        id: form.id,
        title: form.title,
        type: form.type,
        submissionCount: form.submissionCount,
        isActive: form.isActive,
        status: form.status,
        createdAt: form.createdAt,
      }))
    };

    return analytics;
  }

  private async createDefaultFields(formId: string, formType: FormType): Promise<void> {
    let defaultFields: Partial<FormField>[] = [];

    switch (formType) {
      case FormType.EMAIL_SIGNUP:
        defaultFields = [
          { label: 'Name', type: FieldType.TEXT, isRequired: true, displayOrder: 0 },
          { label: 'Email', type: FieldType.EMAIL, isRequired: true, displayOrder: 1 },
        ];
        break;
      case FormType.CONTACT_FORM:
        defaultFields = [
          { label: 'Name', type: FieldType.TEXT, isRequired: true, displayOrder: 0 },
          { label: 'Email', type: FieldType.EMAIL, isRequired: true, displayOrder: 1 },
          { label: 'Message', type: FieldType.MESSAGE, isRequired: true, displayOrder: 2 },
        ];
        break;
      case FormType.BLANK:
      default:
        defaultFields = [
          { label: 'Name', type: FieldType.TEXT, isRequired: false, displayOrder: 0 },
          { label: 'Email', type: FieldType.EMAIL, isRequired: false, displayOrder: 1 },
        ];
        break;
    }

    const fields = defaultFields.map(field => ({
      ...field,
      formId,
    }));

    await this.formFieldRepository.save(fields);
  }
}
