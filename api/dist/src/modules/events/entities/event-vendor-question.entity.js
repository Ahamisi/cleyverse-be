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
exports.EventVendorAnswer = exports.EventVendorQuestion = exports.VendorQuestionType = void 0;
const typeorm_1 = require("typeorm");
var VendorQuestionType;
(function (VendorQuestionType) {
    VendorQuestionType["SHORT_TEXT"] = "short_text";
    VendorQuestionType["LONG_TEXT"] = "long_text";
    VendorQuestionType["SINGLE_CHOICE"] = "single_choice";
    VendorQuestionType["MULTIPLE_CHOICE"] = "multiple_choice";
    VendorQuestionType["YES_NO"] = "yes_no";
    VendorQuestionType["NUMBER"] = "number";
    VendorQuestionType["EMAIL"] = "email";
    VendorQuestionType["PHONE"] = "phone";
    VendorQuestionType["URL"] = "url";
    VendorQuestionType["DATE"] = "date";
    VendorQuestionType["FILE_UPLOAD"] = "file_upload";
})(VendorQuestionType || (exports.VendorQuestionType = VendorQuestionType = {}));
let EventVendorQuestion = class EventVendorQuestion {
    id;
    createdAt;
    updatedAt;
    eventId;
    question;
    description;
    type;
    isRequired;
    displayOrder;
    options;
    minLength;
    maxLength;
    minValue;
    maxValue;
    validationPattern;
    validationMessage;
    allowedFileTypes;
    maxFileSize;
    placeholderText;
    helpText;
    isActive;
    event;
};
exports.EventVendorQuestion = EventVendorQuestion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EventVendorQuestion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], EventVendorQuestion.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], EventVendorQuestion.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_id', type: 'uuid' }),
    __metadata("design:type", String)
], EventVendorQuestion.prototype, "eventId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], EventVendorQuestion.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], EventVendorQuestion.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: VendorQuestionType }),
    __metadata("design:type", String)
], EventVendorQuestion.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_required', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], EventVendorQuestion.prototype, "isRequired", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'display_order', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], EventVendorQuestion.prototype, "displayOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', array: true, nullable: true }),
    __metadata("design:type", Object)
], EventVendorQuestion.prototype, "options", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'min_length', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], EventVendorQuestion.prototype, "minLength", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_length', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], EventVendorQuestion.prototype, "maxLength", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'min_value', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], EventVendorQuestion.prototype, "minValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_value', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], EventVendorQuestion.prototype, "maxValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'validation_pattern', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", Object)
], EventVendorQuestion.prototype, "validationPattern", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'validation_message', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", Object)
], EventVendorQuestion.prototype, "validationMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'allowed_file_types', type: 'text', array: true, nullable: true }),
    __metadata("design:type", Object)
], EventVendorQuestion.prototype, "allowedFileTypes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_file_size', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], EventVendorQuestion.prototype, "maxFileSize", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'placeholder_text', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", Object)
], EventVendorQuestion.prototype, "placeholderText", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'help_text', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], EventVendorQuestion.prototype, "helpText", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], EventVendorQuestion.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Event', 'vendorQuestions'),
    (0, typeorm_1.JoinColumn)({ name: 'event_id' }),
    __metadata("design:type", Object)
], EventVendorQuestion.prototype, "event", void 0);
exports.EventVendorQuestion = EventVendorQuestion = __decorate([
    (0, typeorm_1.Entity)('event_vendor_questions')
], EventVendorQuestion);
let EventVendorAnswer = class EventVendorAnswer {
    id;
    createdAt;
    updatedAt;
    vendorId;
    questionId;
    answer;
    fileUrl;
    fileName;
    vendor;
    question;
};
exports.EventVendorAnswer = EventVendorAnswer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EventVendorAnswer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], EventVendorAnswer.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], EventVendorAnswer.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vendor_id', type: 'uuid' }),
    __metadata("design:type", String)
], EventVendorAnswer.prototype, "vendorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'question_id', type: 'uuid' }),
    __metadata("design:type", String)
], EventVendorAnswer.prototype, "questionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], EventVendorAnswer.prototype, "answer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_url', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], EventVendorAnswer.prototype, "fileUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_name', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", Object)
], EventVendorAnswer.prototype, "fileName", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('EventVendor', 'answers'),
    (0, typeorm_1.JoinColumn)({ name: 'vendor_id' }),
    __metadata("design:type", Object)
], EventVendorAnswer.prototype, "vendor", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('EventVendorQuestion', 'answers'),
    (0, typeorm_1.JoinColumn)({ name: 'question_id' }),
    __metadata("design:type", EventVendorQuestion)
], EventVendorAnswer.prototype, "question", void 0);
exports.EventVendorAnswer = EventVendorAnswer = __decorate([
    (0, typeorm_1.Entity)('event_vendor_answers')
], EventVendorAnswer);
//# sourceMappingURL=event-vendor-question.entity.js.map