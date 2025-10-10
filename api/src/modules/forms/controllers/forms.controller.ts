import { Controller, Post, Body, Get, Put, Delete, Param, UseGuards, Request, Query, Req, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { FormService } from '../services/form.service';
import {
  CreateFormDto,
  UpdateFormDto,
  UpdateFormStatusDto,
  SubmitFormDto,
  AddFormFieldDto,
  UpdateFormFieldDto,
  ReorderFormFieldsDto
} from '../dto/form.dto';
import { FormStatus, FormType } from '../entities/form.entity';
import { FieldType } from '../entities/form-field.entity';

@Controller('forms')
export class FormsController {
  constructor(private readonly formService: FormService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Body() createFormDto: CreateFormDto) {
    const form = await this.formService.createForm(req.user.userId, createFormDto);
    return { message: 'Form created successfully', form };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req, @Query('includeInactive') includeInactive: string = 'false') {
    const forms = await this.formService.getUserForms(req.user.userId, includeInactive === 'true');
    return { message: 'Forms retrieved successfully', forms, total: forms.length };
  }

  @Get('types')
  async getFormTypes() {
    const types = Object.values(FormType).map(type => ({
      value: type,
      label: this.formatTypeLabel(type),
      description: this.getTypeDescription(type)
    }));
    
    return {
      message: 'Form types retrieved successfully',
      types
    };
  }

  @Get('field-types')
  async getFieldTypes() {
    return {
      message: 'Field types retrieved successfully',
      fieldTypes: [
        { value: 'text', label: 'Name', icon: '✏️', description: 'Single line text input' },
        { value: 'email', label: 'Email Address', icon: '✉️', description: 'Email input with validation' },
        { value: 'phone', label: 'Phone Number', icon: '📞', description: 'Phone number input' },
        { value: 'country', label: 'Country', icon: '🏳️', description: 'Country selector' },
        { value: 'date', label: 'Date of Birth', icon: '🎂', description: 'Date picker for birth dates' },
        { value: 'short_answer', label: 'Short Answer', icon: '═', description: 'Short text response' },
        { value: 'paragraph', label: 'Paragraph', icon: '≡', description: 'Long text response' },
        { value: 'radio', label: 'Multiple Choice', icon: '⊙', description: 'Single choice radio buttons' },
        { value: 'checkbox', label: 'Checkboxes', icon: '☑', description: 'Multiple choice checkboxes' },
        { value: 'dropdown', label: 'Dropdown', icon: '⌄', description: 'Single choice dropdown' },
        { value: 'date', label: 'Date', icon: '📅', description: 'General date picker' }
      ]
    };
  }

  @Get('analytics')
  @UseGuards(JwtAuthGuard)
  async getAnalytics(@Request() req, @Query('formId') formId?: string) {
    const analytics = await this.formService.getFormAnalytics(req.user.userId, formId);
    return { message: 'Form analytics retrieved successfully', analytics };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Request() req, @Param('id') id: string) {
    const form = await this.formService.getFormById(req.user.userId, id);
    return { message: 'Form retrieved successfully', form };
  }

  @Get(':id/public')
  async getPublicForm(@Param('id') id: string) {
    const form = await this.formService.getPublicForm(id);
    return { message: 'Public form retrieved successfully', form };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Request() req, @Param('id') id: string, @Body() updateFormDto: UpdateFormDto) {
    const form = await this.formService.updateForm(req.user.userId, id, updateFormDto);
    return { message: 'Form updated successfully', form };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Request() req, @Param('id') id: string) {
    await this.formService.deleteForm(req.user.userId, id);
    return { message: 'Form deleted successfully' };
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(@Request() req, @Param('id') id: string, @Body() updateStatusDto: UpdateFormStatusDto) {
    const form = await this.formService.updateFormStatus(req.user.userId, id, updateStatusDto);
    return { message: 'Form status updated successfully', form };
  }

  // Form Fields Management
  @Post(':id/fields')
  @UseGuards(JwtAuthGuard)
  async addField(@Request() req, @Param('id') id: string, @Body() addFieldDto: AddFormFieldDto) {
    const field = await this.formService.addFormField(req.user.userId, id, addFieldDto);
    return { message: 'Form field added successfully', field };
  }

  @Put(':id/fields/:fieldId')
  @UseGuards(JwtAuthGuard)
  async updateField(
    @Request() req, 
    @Param('id') id: string, 
    @Param('fieldId') fieldId: string, 
    @Body() updateFieldDto: UpdateFormFieldDto
  ) {
    this.validateUUID(fieldId, 'Field ID');
    
    const field = await this.formService.updateFormField(req.user.userId, id, fieldId, updateFieldDto);
    return { message: 'Form field updated successfully', field };
  }

  @Delete(':id/fields/:fieldId')
  @UseGuards(JwtAuthGuard)
  async removeField(@Request() req, @Param('id') id: string, @Param('fieldId') fieldId: string) {
    this.validateUUID(fieldId, 'Field ID');
    
    await this.formService.deleteFormField(req.user.userId, id, fieldId);
    return { message: 'Form field deleted successfully' };
  }

  @Put(':id/fields/reorder')
  @UseGuards(JwtAuthGuard)
  async reorderFields(@Request() req, @Param('id') id: string, @Body() reorderDto: ReorderFormFieldsDto) {
    const form = await this.formService.reorderFormFields(req.user.userId, id, reorderDto);
    return { message: 'Form fields reordered successfully', form };
  }

  // Form Submissions (PUBLIC - No Auth Required)
  @Post(':id/submit')
  async submitForm(@Param('id') id: string, @Body() submitDto: SubmitFormDto, @Req() req) {
    const metadata = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      referrer: req.get('Referer'),
    };

    const submission = await this.formService.submitForm(id, submitDto, metadata);
    return { 
      message: 'Form submitted successfully', 
      submissionId: submission.id,
      thankYou: true
    };
  }

  // Form Submissions Management (AUTH REQUIRED)
  @Get(':id/submissions')
  @UseGuards(JwtAuthGuard)
  async getSubmissions(@Request() req, @Param('id') id: string) {
    const submissions = await this.formService.getFormSubmissions(req.user.userId, id);
    return { message: 'Form submissions retrieved successfully', submissions, total: submissions.length };
  }

  // Event Integration Endpoints
  @Post(':id/link-to-event/:eventId')
  @UseGuards(JwtAuthGuard)
  async linkToEvent(
    @Request() req, 
    @Param('id') formId: string, 
    @Param('eventId') eventId: string,
    @Body() body: { formPurpose: 'registration' | 'vendor' | 'guest'; eventTitle?: string; eventSlug?: string }
  ) {
    const form = await this.formService.linkToEvent(req.user.userId, formId, eventId, body.formPurpose, body.eventTitle, body.eventSlug);
    return { message: 'Form linked to event successfully', form };
  }

  @Delete(':id/unlink-from-event')
  @UseGuards(JwtAuthGuard)
  async unlinkFromEvent(@Request() req, @Param('id') formId: string) {
    const form = await this.formService.unlinkFromEvent(req.user.userId, formId);
    return { message: 'Form unlinked from event successfully', form };
  }

  @Get('by-purpose/:purpose')
  @UseGuards(JwtAuthGuard)
  async getFormsByPurpose(@Request() req, @Param('purpose') purpose: 'registration' | 'vendor' | 'guest') {
    const forms = await this.formService.getFormsByPurpose(req.user.userId, purpose);
    return { message: `${purpose} forms retrieved successfully`, forms, total: forms.length };
  }

  // Helper methods for formatting
  private validateUUID(id: string, fieldName: string = 'ID'): void {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new BadRequestException(`Invalid ${fieldName} format: ${id}. Expected UUID format.`);
    }
  }

  private formatTypeLabel(type: FormType): string {
    switch (type) {
      case FormType.BLANK: return 'Blank Form';
      case FormType.EMAIL_SIGNUP: return 'Email Sign Up';
      case FormType.CONTACT_FORM: return 'Contact Form';
      default: return type;
    }
  }

  private getTypeDescription(type: FormType): string {
    switch (type) {
      case FormType.BLANK: return 'Start with a blank form and add your own fields';
      case FormType.EMAIL_SIGNUP: return 'Collect email addresses for your mailing list';
      case FormType.CONTACT_FORM: return 'Let visitors get in touch with you';
      default: return '';
    }
  }

  private formatFieldTypeLabel(type: FieldType): string {
    switch (type) {
      case FieldType.TEXT: return 'Text';
      case FieldType.EMAIL: return 'Email';
      case FieldType.PHONE: return 'Phone';
      case FieldType.MESSAGE: return 'Message';
      case FieldType.SHORT_ANSWER: return 'Short Answer';
      case FieldType.PARAGRAPH: return 'Paragraph';
      case FieldType.DATE: return 'Date';
      case FieldType.COUNTRY: return 'Country';
      case FieldType.DROPDOWN: return 'Dropdown';
      case FieldType.CHECKBOX: return 'Checkbox';
      case FieldType.RADIO: return 'Radio Button';
      default: return type;
    }
  }

  private getFieldTypeDescription(type: FieldType): string {
    switch (type) {
      case FieldType.TEXT: return 'Single line text input';
      case FieldType.EMAIL: return 'Email address with validation';
      case FieldType.PHONE: return 'Phone number input';
      case FieldType.MESSAGE: return 'Multi-line text area';
      case FieldType.SHORT_ANSWER: return 'Brief text response';
      case FieldType.PARAGRAPH: return 'Long text response';
      case FieldType.DATE: return 'Date picker';
      case FieldType.COUNTRY: return 'Country selection dropdown';
      case FieldType.DROPDOWN: return 'Select from predefined options';
      case FieldType.CHECKBOX: return 'Multiple choice checkboxes';
      case FieldType.RADIO: return 'Single choice radio buttons';
      default: return '';
    }
  }
}
