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
exports.FormField = exports.FieldType = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../common/base/base.entity");
const form_entity_1 = require("./form.entity");
var FieldType;
(function (FieldType) {
    FieldType["TEXT"] = "text";
    FieldType["EMAIL"] = "email";
    FieldType["PHONE"] = "phone";
    FieldType["MESSAGE"] = "message";
    FieldType["SHORT_ANSWER"] = "short_answer";
    FieldType["PARAGRAPH"] = "paragraph";
    FieldType["TEXTAREA"] = "textarea";
    FieldType["DATE"] = "date";
    FieldType["COUNTRY"] = "country";
    FieldType["DROPDOWN"] = "dropdown";
    FieldType["CHECKBOX"] = "checkbox";
    FieldType["RADIO"] = "radio";
    FieldType["MULTIPLE_CHOICE"] = "multiple_choice";
})(FieldType || (exports.FieldType = FieldType = {}));
let FormField = class FormField extends base_entity_1.BaseEntity {
    formId;
    form;
    label;
    type;
    placeholder;
    isRequired;
    displayOrder;
    fieldOptions;
    validationRules;
    isActive;
};
exports.FormField = FormField;
__decorate([
    (0, typeorm_1.Column)({ name: 'form_id', type: 'uuid' }),
    __metadata("design:type", String)
], FormField.prototype, "formId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => form_entity_1.Form, form => form.fields, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'form_id' }),
    __metadata("design:type", form_entity_1.Form)
], FormField.prototype, "form", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FormField.prototype, "label", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: FieldType }),
    __metadata("design:type", String)
], FormField.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], FormField.prototype, "placeholder", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_required', default: false }),
    __metadata("design:type", Boolean)
], FormField.prototype, "isRequired", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'display_order', default: 0 }),
    __metadata("design:type", Number)
], FormField.prototype, "displayOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'field_options', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], FormField.prototype, "fieldOptions", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'validation_rules', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], FormField.prototype, "validationRules", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], FormField.prototype, "isActive", void 0);
exports.FormField = FormField = __decorate([
    (0, typeorm_1.Entity)('form_fields'),
    (0, typeorm_1.Index)(['formId', 'displayOrder'])
], FormField);
//# sourceMappingURL=form-field.entity.js.map