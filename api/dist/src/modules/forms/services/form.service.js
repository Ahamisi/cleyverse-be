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
exports.FormService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const base_service_1 = require("../../../common/base/base.service");
const form_entity_1 = require("../entities/form.entity");
const form_field_entity_1 = require("../entities/form-field.entity");
const form_submission_entity_1 = require("../entities/form-submission.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let FormService = class FormService extends base_service_1.BaseService {
    formRepository;
    formFieldRepository;
    formSubmissionRepository;
    userRepository;
    constructor(formRepository, formFieldRepository, formSubmissionRepository, userRepository) {
        super(formRepository);
        this.formRepository = formRepository;
        this.formFieldRepository = formFieldRepository;
        this.formSubmissionRepository = formSubmissionRepository;
        this.userRepository = userRepository;
    }
    getEntityName() {
        return 'Form';
    }
    async createForm(userId, createFormDto) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const form = await this.create({
            ...createFormDto,
            userId,
            status: form_entity_1.FormStatus.ACTIVE,
        });
        if (createFormDto.fields && createFormDto.fields.length > 0) {
            const fields = createFormDto.fields.map((fieldDto, index) => ({
                ...fieldDto,
                formId: form.id,
                displayOrder: fieldDto.displayOrder ?? index,
            }));
            await this.formFieldRepository.save(fields);
        }
        else {
            await this.createDefaultFields(form.id, createFormDto.type || form_entity_1.FormType.BLANK);
        }
        return this.getFormById(userId, form.id);
    }
    async getUserForms(userId, includeInactive = false) {
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
    async getFormById(userId, formId) {
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
            throw new common_1.NotFoundException('Form not found or does not belong to user');
        }
        return form;
    }
    async getPublicForm(formId) {
        const form = await this.formRepository.findOne({
            where: { id: formId, isActive: true, status: form_entity_1.FormStatus.ACTIVE },
            relations: ['fields'],
            order: {
                fields: {
                    displayOrder: 'ASC'
                }
            }
        });
        if (!form) {
            throw new common_1.NotFoundException('Form not found or is not active');
        }
        return form;
    }
    async updateForm(userId, formId, updateFormDto) {
        const form = await this.getFormById(userId, formId);
        await this.formRepository.update(formId, updateFormDto);
        return this.getFormById(userId, formId);
    }
    async deleteForm(userId, formId) {
        const form = await this.getFormById(userId, formId);
        await this.formRepository.remove(form);
    }
    async updateFormStatus(userId, formId, updateStatusDto) {
        const form = await this.getFormById(userId, formId);
        const updateData = { status: updateStatusDto.status };
        if (updateStatusDto.status === form_entity_1.FormStatus.ARCHIVED) {
            updateData.archivedAt = new Date();
            updateData.isActive = false;
        }
        else if (updateStatusDto.status === form_entity_1.FormStatus.ACTIVE) {
            updateData.archivedAt = null;
            updateData.isActive = true;
        }
        await this.formRepository.update(formId, updateData);
        return this.getFormById(userId, formId);
    }
    async addFormField(userId, formId, addFieldDto) {
        const form = await this.getFormById(userId, formId);
        const maxOrder = await this.formFieldRepository
            .createQueryBuilder('field')
            .select('MAX(field.displayOrder)', 'max')
            .where('field.formId = :formId', { formId })
            .getRawOne();
        const displayOrder = addFieldDto.displayOrder ?? (maxOrder?.max || 0) + 1;
        const fieldData = { ...addFieldDto };
        if (fieldData.required !== undefined) {
            fieldData.isRequired = fieldData.required;
            delete fieldData.required;
        }
        const field = this.formFieldRepository.create({
            ...fieldData,
            formId,
            displayOrder,
        });
        return this.formFieldRepository.save(field);
    }
    async updateFormField(userId, formId, fieldId, updateFieldDto) {
        await this.getFormById(userId, formId);
        const field = await this.formFieldRepository.findOne({
            where: { id: fieldId, formId }
        });
        if (!field) {
            throw new common_1.NotFoundException('Form field not found');
        }
        const updateData = { ...updateFieldDto };
        if (updateData.required !== undefined) {
            updateData.isRequired = updateData.required;
            delete updateData.required;
        }
        await this.formFieldRepository.update(fieldId, updateData);
        const updatedField = await this.formFieldRepository.findOne({ where: { id: fieldId } });
        if (!updatedField) {
            throw new common_1.NotFoundException('Form field not found after update');
        }
        return updatedField;
    }
    async deleteFormField(userId, formId, fieldId) {
        await this.getFormById(userId, formId);
        const field = await this.formFieldRepository.findOne({
            where: { id: fieldId, formId }
        });
        if (!field) {
            throw new common_1.NotFoundException('Form field not found');
        }
        await this.formFieldRepository.remove(field);
    }
    async reorderFormFields(userId, formId, reorderDto) {
        await this.getFormById(userId, formId);
        for (let i = 0; i < reorderDto.fieldIds.length; i++) {
            await this.formFieldRepository.update({ id: reorderDto.fieldIds[i], formId }, { displayOrder: i });
        }
        return this.getFormById(userId, formId);
    }
    async submitForm(formId, submitDto, metadata = {}) {
        const form = await this.getPublicForm(formId);
        const requiredFields = form.fields.filter(field => field.isRequired && field.isActive);
        for (const field of requiredFields) {
            if (!submitDto.submissionData[field.id] || submitDto.submissionData[field.id].trim() === '') {
                throw new common_1.BadRequestException(`Field "${field.label}" is required`);
            }
        }
        if (form.requireTermsAcceptance && !submitDto.acceptTerms) {
            throw new common_1.BadRequestException('You must accept the terms and conditions');
        }
        const submission = this.formSubmissionRepository.create({
            formId,
            submitterEmail: submitDto.submitterEmail,
            submitterName: submitDto.submitterName,
            submissionData: submitDto.submissionData || {},
            submitterIp: metadata.ip,
            userAgent: metadata.userAgent,
            referrerUrl: metadata.referrer,
        });
        const savedSubmission = await this.formSubmissionRepository.save(submission);
        await this.formRepository.increment({ id: formId }, 'submissionCount', 1);
        return savedSubmission;
    }
    async getFormSubmissions(userId, formId) {
        await this.getFormById(userId, formId);
        return this.formSubmissionRepository.find({
            where: { formId },
            order: { createdAt: 'DESC' }
        });
    }
    async getFormAnalytics(userId, formId) {
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
            archivedForms: forms.filter(form => form.status === form_entity_1.FormStatus.ARCHIVED).length,
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
    async createDefaultFields(formId, formType) {
        let defaultFields = [];
        switch (formType) {
            case form_entity_1.FormType.EMAIL_SIGNUP:
                defaultFields = [
                    { label: 'Name', type: form_field_entity_1.FieldType.TEXT, isRequired: true, displayOrder: 0 },
                    { label: 'Email', type: form_field_entity_1.FieldType.EMAIL, isRequired: true, displayOrder: 1 },
                ];
                break;
            case form_entity_1.FormType.CONTACT_FORM:
                defaultFields = [
                    { label: 'Name', type: form_field_entity_1.FieldType.TEXT, isRequired: true, displayOrder: 0 },
                    { label: 'Email', type: form_field_entity_1.FieldType.EMAIL, isRequired: true, displayOrder: 1 },
                    { label: 'Message', type: form_field_entity_1.FieldType.MESSAGE, isRequired: true, displayOrder: 2 },
                ];
                break;
            case form_entity_1.FormType.BLANK:
            default:
                defaultFields = [
                    { label: 'Name', type: form_field_entity_1.FieldType.TEXT, isRequired: false, displayOrder: 0 },
                    { label: 'Email', type: form_field_entity_1.FieldType.EMAIL, isRequired: false, displayOrder: 1 },
                ];
                break;
        }
        const fields = defaultFields.map(field => ({
            ...field,
            formId,
        }));
        await this.formFieldRepository.save(fields);
    }
};
exports.FormService = FormService;
exports.FormService = FormService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(form_entity_1.Form)),
    __param(1, (0, typeorm_1.InjectRepository)(form_field_entity_1.FormField)),
    __param(2, (0, typeorm_1.InjectRepository)(form_submission_entity_1.FormSubmission)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], FormService);
//# sourceMappingURL=form.service.js.map