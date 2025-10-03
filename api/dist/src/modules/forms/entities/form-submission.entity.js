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
exports.FormSubmission = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../common/base/base.entity");
const form_entity_1 = require("./form.entity");
let FormSubmission = class FormSubmission extends base_entity_1.BaseEntity {
    formId;
    form;
    submitterEmail;
    submitterName;
    submissionData;
    submitterIp;
    userAgent;
    referrerUrl;
    isRead;
    isStarred;
    isSpam;
    responseSent;
    responseSentAt;
};
exports.FormSubmission = FormSubmission;
__decorate([
    (0, typeorm_1.Column)({ name: 'form_id', type: 'uuid' }),
    __metadata("design:type", String)
], FormSubmission.prototype, "formId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => form_entity_1.Form, form => form.submissions, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'form_id' }),
    __metadata("design:type", form_entity_1.Form)
], FormSubmission.prototype, "form", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'submitter_email', type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], FormSubmission.prototype, "submitterEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'submitter_name', type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], FormSubmission.prototype, "submitterName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'submission_data', type: 'jsonb' }),
    __metadata("design:type", Object)
], FormSubmission.prototype, "submissionData", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'submitter_ip', type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], FormSubmission.prototype, "submitterIp", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_agent', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], FormSubmission.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'referrer_url', type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], FormSubmission.prototype, "referrerUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_read', default: false }),
    __metadata("design:type", Boolean)
], FormSubmission.prototype, "isRead", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_starred', default: false }),
    __metadata("design:type", Boolean)
], FormSubmission.prototype, "isStarred", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_spam', default: false }),
    __metadata("design:type", Boolean)
], FormSubmission.prototype, "isSpam", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'response_sent', default: false }),
    __metadata("design:type", Boolean)
], FormSubmission.prototype, "responseSent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'response_sent_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], FormSubmission.prototype, "responseSentAt", void 0);
exports.FormSubmission = FormSubmission = __decorate([
    (0, typeorm_1.Entity)('form_submissions'),
    (0, typeorm_1.Index)(['formId', 'createdAt']),
    (0, typeorm_1.Index)(['submitterEmail'])
], FormSubmission);
//# sourceMappingURL=form-submission.entity.js.map