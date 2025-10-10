"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const form_service_1 = require("../services/form.service");
const form_dto_1 = require("../dto/form.dto");
const form_entity_1 = require("../entities/form.entity");
const form_field_entity_1 = require("../entities/form-field.entity");
let FormsController = class FormsController {
    formService;
    constructor(formService) {
        this.formService = formService;
    }
    async create(req, createFormDto) {
        const form = await this.formService.createForm(req.user.userId, createFormDto);
        return { message: 'Form created successfully', form };
    }
    async findAll(req, includeInactive = 'false') {
        const forms = await this.formService.getUserForms(req.user.userId, includeInactive === 'true');
        return { message: 'Forms retrieved successfully', forms, total: forms.length };
    }
    async getFormTypes() {
        const types = Object.values(form_entity_1.FormType).map(type => ({
            value: type,
            label: this.formatTypeLabel(type),
            description: this.getTypeDescription(type)
        }));
        return {
            message: 'Form types retrieved successfully',
            types
        };
    }
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
    async getAnalytics(req, formId) {
        const analytics = await this.formService.getFormAnalytics(req.user.userId, formId);
        return { message: 'Form analytics retrieved successfully', analytics };
    }
    async findOne(req, id) {
        const form = await this.formService.getFormById(req.user.userId, id);
        return { message: 'Form retrieved successfully', form };
    }
    async getPublicForm(id) {
        const form = await this.formService.getPublicForm(id);
        return { message: 'Public form retrieved successfully', form };
    }
    async update(req, id, updateFormDto) {
        const form = await this.formService.updateForm(req.user.userId, id, updateFormDto);
        return { message: 'Form updated successfully', form };
    }
    async remove(req, id) {
        await this.formService.deleteForm(req.user.userId, id);
        return { message: 'Form deleted successfully' };
    }
    async updateStatus(req, id, updateStatusDto) {
        const form = await this.formService.updateFormStatus(req.user.userId, id, updateStatusDto);
        return { message: 'Form status updated successfully', form };
    }
    async addField(req, id, addFieldDto) {
        const field = await this.formService.addFormField(req.user.userId, id, addFieldDto);
        return { message: 'Form field added successfully', field };
    }
    async updateField(req, id, fieldId, updateFieldDto) {
        this.validateUUID(fieldId, 'Field ID');
        const field = await this.formService.updateFormField(req.user.userId, id, fieldId, updateFieldDto);
        return { message: 'Form field updated successfully', field };
    }
    async removeField(req, id, fieldId) {
        this.validateUUID(fieldId, 'Field ID');
        await this.formService.deleteFormField(req.user.userId, id, fieldId);
        return { message: 'Form field deleted successfully' };
    }
    async reorderFields(req, id, reorderDto) {
        const form = await this.formService.reorderFormFields(req.user.userId, id, reorderDto);
        return { message: 'Form fields reordered successfully', form };
    }
    async submitForm(id, submitDto, req) {
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
    async getSubmissions(req, id) {
        const submissions = await this.formService.getFormSubmissions(req.user.userId, id);
        return { message: 'Form submissions retrieved successfully', submissions, total: submissions.length };
    }
    async linkToEvent(req, formId, eventId, body) {
        const form = await this.formService.linkToEvent(req.user.userId, formId, eventId, body.formPurpose, body.eventTitle, body.eventSlug);
        return { message: 'Form linked to event successfully', form };
    }
    async unlinkFromEvent(req, formId) {
        const form = await this.formService.unlinkFromEvent(req.user.userId, formId);
        return { message: 'Form unlinked from event successfully', form };
    }
    async getFormsByPurpose(req, purpose) {
        const forms = await this.formService.getFormsByPurpose(req.user.userId, purpose);
        return { message: `${purpose} forms retrieved successfully`, forms, total: forms.length };
    }
    validateUUID(id, fieldName = 'ID') {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            throw new common_1.BadRequestException(`Invalid ${fieldName} format: ${id}. Expected UUID format.`);
        }
    }
    formatTypeLabel(type) {
        switch (type) {
            case form_entity_1.FormType.BLANK: return 'Blank Form';
            case form_entity_1.FormType.EMAIL_SIGNUP: return 'Email Sign Up';
            case form_entity_1.FormType.CONTACT_FORM: return 'Contact Form';
            default: return type;
        }
    }
    getTypeDescription(type) {
        switch (type) {
            case form_entity_1.FormType.BLANK: return 'Start with a blank form and add your own fields';
            case form_entity_1.FormType.EMAIL_SIGNUP: return 'Collect email addresses for your mailing list';
            case form_entity_1.FormType.CONTACT_FORM: return 'Let visitors get in touch with you';
            default: return '';
        }
    }
    formatFieldTypeLabel(type) {
        switch (type) {
            case form_field_entity_1.FieldType.TEXT: return 'Text';
            case form_field_entity_1.FieldType.EMAIL: return 'Email';
            case form_field_entity_1.FieldType.PHONE: return 'Phone';
            case form_field_entity_1.FieldType.MESSAGE: return 'Message';
            case form_field_entity_1.FieldType.SHORT_ANSWER: return 'Short Answer';
            case form_field_entity_1.FieldType.PARAGRAPH: return 'Paragraph';
            case form_field_entity_1.FieldType.DATE: return 'Date';
            case form_field_entity_1.FieldType.COUNTRY: return 'Country';
            case form_field_entity_1.FieldType.DROPDOWN: return 'Dropdown';
            case form_field_entity_1.FieldType.CHECKBOX: return 'Checkbox';
            case form_field_entity_1.FieldType.RADIO: return 'Radio Button';
            default: return type;
        }
    }
    getFieldTypeDescription(type) {
        switch (type) {
            case form_field_entity_1.FieldType.TEXT: return 'Single line text input';
            case form_field_entity_1.FieldType.EMAIL: return 'Email address with validation';
            case form_field_entity_1.FieldType.PHONE: return 'Phone number input';
            case form_field_entity_1.FieldType.MESSAGE: return 'Multi-line text area';
            case form_field_entity_1.FieldType.SHORT_ANSWER: return 'Brief text response';
            case form_field_entity_1.FieldType.PARAGRAPH: return 'Long text response';
            case form_field_entity_1.FieldType.DATE: return 'Date picker';
            case form_field_entity_1.FieldType.COUNTRY: return 'Country selection dropdown';
            case form_field_entity_1.FieldType.DROPDOWN: return 'Select from predefined options';
            case form_field_entity_1.FieldType.CHECKBOX: return 'Multiple choice checkboxes';
            case form_field_entity_1.FieldType.RADIO: return 'Single choice radio buttons';
            default: return '';
        }
    }
};
exports.FormsController = FormsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, form_dto_1.CreateFormDto]),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('types'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "getFormTypes", null);
__decorate([
    (0, common_1.Get)('field-types'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "getFieldTypes", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('formId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/public'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "getPublicForm", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, form_dto_1.UpdateFormDto]),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, form_dto_1.UpdateFormStatusDto]),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/fields'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, form_dto_1.AddFormFieldDto]),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "addField", null);
__decorate([
    (0, common_1.Put)(':id/fields/:fieldId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('fieldId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, form_dto_1.UpdateFormFieldDto]),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "updateField", null);
__decorate([
    (0, common_1.Delete)(':id/fields/:fieldId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('fieldId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "removeField", null);
__decorate([
    (0, common_1.Put)(':id/fields/reorder'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, form_dto_1.ReorderFormFieldsDto]),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "reorderFields", null);
__decorate([
    (0, common_1.Post)(':id/submit'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, form_dto_1.SubmitFormDto, Object]),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "submitForm", null);
__decorate([
    (0, common_1.Get)(':id/submissions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "getSubmissions", null);
__decorate([
    (0, common_1.Post)(':id/link-to-event/:eventId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('eventId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "linkToEvent", null);
__decorate([
    (0, common_1.Delete)(':id/unlink-from-event'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "unlinkFromEvent", null);
__decorate([
    (0, common_1.Get)('by-purpose/:purpose'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('purpose')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "getFormsByPurpose", null);
exports.FormsController = FormsController = __decorate([
    (0, common_1.Controller)('forms'),
    __metadata("design:paramtypes", [form_service_1.FormService])
], FormsController);
//# sourceMappingURL=forms.controller.js.map