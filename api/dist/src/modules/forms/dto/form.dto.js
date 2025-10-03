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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReorderFormFieldsDto = exports.UpdateFormFieldDto = exports.AddFormFieldDto = exports.SubmitFormDto = exports.UpdateFormStatusDto = exports.UpdateFormDto = exports.CreateFormDto = exports.CreateFormFieldDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const form_entity_1 = require("../entities/form.entity");
const form_field_entity_1 = require("../entities/form-field.entity");
class CreateFormFieldDto {
    label;
    type;
    placeholder;
    isRequired;
    required;
    displayOrder;
    fieldOptions;
    validationRules;
}
exports.CreateFormFieldDto = CreateFormFieldDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateFormFieldDto.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(form_field_entity_1.FieldType),
    __metadata("design:type", String)
], CreateFormFieldDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateFormFieldDto.prototype, "placeholder", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateFormFieldDto.prototype, "isRequired", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateFormFieldDto.prototype, "required", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateFormFieldDto.prototype, "displayOrder", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateFormFieldDto.prototype, "fieldOptions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateFormFieldDto.prototype, "validationRules", void 0);
class CreateFormDto {
    title;
    type;
    introduction;
    thankYouMessage;
    customTerms;
    requireTermsAcceptance;
    collectEmailAddresses;
    sendEmailNotifications;
    notificationEmail;
    fields;
}
exports.CreateFormDto = CreateFormDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateFormDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(form_entity_1.FormType),
    __metadata("design:type", String)
], CreateFormDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFormDto.prototype, "introduction", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFormDto.prototype, "thankYouMessage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFormDto.prototype, "customTerms", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateFormDto.prototype, "requireTermsAcceptance", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateFormDto.prototype, "collectEmailAddresses", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateFormDto.prototype, "sendEmailNotifications", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateFormDto.prototype, "notificationEmail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateFormFieldDto),
    __metadata("design:type", Array)
], CreateFormDto.prototype, "fields", void 0);
class UpdateFormDto {
    title;
    introduction;
    thankYouMessage;
    customTerms;
    requireTermsAcceptance;
    collectEmailAddresses;
    sendEmailNotifications;
    notificationEmail;
    isActive;
}
exports.UpdateFormDto = UpdateFormDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateFormDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateFormDto.prototype, "introduction", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateFormDto.prototype, "thankYouMessage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateFormDto.prototype, "customTerms", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateFormDto.prototype, "requireTermsAcceptance", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateFormDto.prototype, "collectEmailAddresses", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateFormDto.prototype, "sendEmailNotifications", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateFormDto.prototype, "notificationEmail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateFormDto.prototype, "isActive", void 0);
class UpdateFormStatusDto {
    status;
}
exports.UpdateFormStatusDto = UpdateFormStatusDto;
__decorate([
    (0, class_validator_1.IsEnum)(form_entity_1.FormStatus),
    __metadata("design:type", String)
], UpdateFormStatusDto.prototype, "status", void 0);
class SubmitFormDto {
    submitterEmail;
    submitterName;
    submissionData;
    acceptTerms;
}
exports.SubmitFormDto = SubmitFormDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], SubmitFormDto.prototype, "submitterEmail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitFormDto.prototype, "submitterName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], SubmitFormDto.prototype, "submissionData", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SubmitFormDto.prototype, "acceptTerms", void 0);
class AddFormFieldDto {
    label;
    type;
    placeholder;
    isRequired;
    displayOrder;
    fieldOptions;
    validationRules;
}
exports.AddFormFieldDto = AddFormFieldDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], AddFormFieldDto.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(form_field_entity_1.FieldType),
    __metadata("design:type", String)
], AddFormFieldDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], AddFormFieldDto.prototype, "placeholder", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AddFormFieldDto.prototype, "isRequired", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], AddFormFieldDto.prototype, "displayOrder", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], AddFormFieldDto.prototype, "fieldOptions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], AddFormFieldDto.prototype, "validationRules", void 0);
class UpdateFormFieldDto {
    label;
    placeholder;
    isRequired;
    required;
    displayOrder;
    fieldOptions;
    validationRules;
    isActive;
}
exports.UpdateFormFieldDto = UpdateFormFieldDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateFormFieldDto.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], UpdateFormFieldDto.prototype, "placeholder", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateFormFieldDto.prototype, "isRequired", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateFormFieldDto.prototype, "required", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateFormFieldDto.prototype, "displayOrder", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateFormFieldDto.prototype, "fieldOptions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateFormFieldDto.prototype, "validationRules", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateFormFieldDto.prototype, "isActive", void 0);
class ReorderFormFieldsDto {
    fieldIds;
}
exports.ReorderFormFieldsDto = ReorderFormFieldsDto;
__decorate([
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ReorderFormFieldsDto.prototype, "fieldIds", void 0);
//# sourceMappingURL=form.dto.js.map