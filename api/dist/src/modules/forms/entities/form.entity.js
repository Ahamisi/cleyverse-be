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
exports.Form = exports.FormStatus = exports.FormType = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../common/base/base.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const form_field_entity_1 = require("./form-field.entity");
const form_submission_entity_1 = require("./form-submission.entity");
var FormType;
(function (FormType) {
    FormType["BLANK"] = "blank";
    FormType["EMAIL_SIGNUP"] = "email_signup";
    FormType["CONTACT_FORM"] = "contact_form";
})(FormType || (exports.FormType = FormType = {}));
var FormStatus;
(function (FormStatus) {
    FormStatus["ACTIVE"] = "active";
    FormStatus["INACTIVE"] = "inactive";
    FormStatus["ARCHIVED"] = "archived";
})(FormStatus || (exports.FormStatus = FormStatus = {}));
let Form = class Form extends base_entity_1.BaseEntity {
    userId;
    user;
    title;
    type;
    introduction;
    thankYouMessage;
    customTerms;
    requireTermsAcceptance;
    collectEmailAddresses;
    sendEmailNotifications;
    notificationEmail;
    isActive;
    status;
    submissionCount;
    archivedAt;
    fields;
    submissions;
};
exports.Form = Form;
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], Form.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.forms, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Form.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Form.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: FormType, default: FormType.BLANK }),
    __metadata("design:type", String)
], Form.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Form.prototype, "introduction", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'thank_you_message', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Form.prototype, "thankYouMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'custom_terms', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Form.prototype, "customTerms", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'require_terms_acceptance', default: false }),
    __metadata("design:type", Boolean)
], Form.prototype, "requireTermsAcceptance", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'collect_email_addresses', default: true }),
    __metadata("design:type", Boolean)
], Form.prototype, "collectEmailAddresses", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'send_email_notifications', default: true }),
    __metadata("design:type", Boolean)
], Form.prototype, "sendEmailNotifications", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notification_email', type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Form.prototype, "notificationEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], Form.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: FormStatus, default: FormStatus.ACTIVE }),
    __metadata("design:type", String)
], Form.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'submission_count', default: 0 }),
    __metadata("design:type", Number)
], Form.prototype, "submissionCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'archived_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Form.prototype, "archivedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => form_field_entity_1.FormField, field => field.form, { cascade: true }),
    __metadata("design:type", Array)
], Form.prototype, "fields", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => form_submission_entity_1.FormSubmission, submission => submission.form),
    __metadata("design:type", Array)
], Form.prototype, "submissions", void 0);
exports.Form = Form = __decorate([
    (0, typeorm_1.Entity)('forms'),
    (0, typeorm_1.Index)(['userId', 'status'])
], Form);
//# sourceMappingURL=form.entity.js.map