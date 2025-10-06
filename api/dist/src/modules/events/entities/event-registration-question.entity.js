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
exports.EventGuestAnswer = exports.EventRegistrationQuestion = exports.QuestionType = void 0;
const typeorm_1 = require("typeorm");
var QuestionType;
(function (QuestionType) {
    QuestionType["SHORT_TEXT"] = "short_text";
    QuestionType["LONG_TEXT"] = "long_text";
    QuestionType["SINGLE_CHOICE"] = "single_choice";
    QuestionType["MULTIPLE_CHOICE"] = "multiple_choice";
    QuestionType["DROPDOWN"] = "dropdown";
    QuestionType["EMAIL"] = "email";
    QuestionType["PHONE"] = "phone";
    QuestionType["NUMBER"] = "number";
    QuestionType["DATE"] = "date";
    QuestionType["CHECKBOX"] = "checkbox";
    QuestionType["FILE_UPLOAD"] = "file_upload";
})(QuestionType || (exports.QuestionType = QuestionType = {}));
let EventRegistrationQuestion = class EventRegistrationQuestion {
    id;
    createdAt;
    updatedAt;
    eventId;
    event;
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
    isActive;
    placeholderText;
    helpText;
    answers;
};
exports.EventRegistrationQuestion = EventRegistrationQuestion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EventRegistrationQuestion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], EventRegistrationQuestion.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], EventRegistrationQuestion.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_id', type: 'uuid' }),
    __metadata("design:type", String)
], EventRegistrationQuestion.prototype, "eventId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Event', 'registrationQuestions'),
    (0, typeorm_1.JoinColumn)({ name: 'event_id' }),
    __metadata("design:type", Object)
], EventRegistrationQuestion.prototype, "event", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], EventRegistrationQuestion.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], EventRegistrationQuestion.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: QuestionType, default: QuestionType.SHORT_TEXT }),
    __metadata("design:type", String)
], EventRegistrationQuestion.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_required', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], EventRegistrationQuestion.prototype, "isRequired", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'display_order', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], EventRegistrationQuestion.prototype, "displayOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], EventRegistrationQuestion.prototype, "options", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'min_length', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], EventRegistrationQuestion.prototype, "minLength", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_length', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], EventRegistrationQuestion.prototype, "maxLength", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'min_value', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], EventRegistrationQuestion.prototype, "minValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_value', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], EventRegistrationQuestion.prototype, "maxValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'validation_pattern', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], EventRegistrationQuestion.prototype, "validationPattern", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'validation_message', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], EventRegistrationQuestion.prototype, "validationMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'allowed_file_types', type: 'text', array: true, nullable: true }),
    __metadata("design:type", Object)
], EventRegistrationQuestion.prototype, "allowedFileTypes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_file_size', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], EventRegistrationQuestion.prototype, "maxFileSize", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], EventRegistrationQuestion.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'placeholder_text', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", Object)
], EventRegistrationQuestion.prototype, "placeholderText", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'help_text', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], EventRegistrationQuestion.prototype, "helpText", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('EventGuestAnswer', 'question'),
    __metadata("design:type", Array)
], EventRegistrationQuestion.prototype, "answers", void 0);
exports.EventRegistrationQuestion = EventRegistrationQuestion = __decorate([
    (0, typeorm_1.Entity)('event_registration_questions')
], EventRegistrationQuestion);
let EventGuestAnswer = class EventGuestAnswer {
    id;
    createdAt;
    updatedAt;
    guestId;
    questionId;
    guest;
    question;
    answerText;
    answerNumber;
    answerDate;
    answerBoolean;
    answerChoices;
    fileUrl;
    fileName;
    fileSize;
};
exports.EventGuestAnswer = EventGuestAnswer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EventGuestAnswer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], EventGuestAnswer.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], EventGuestAnswer.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'guest_id', type: 'uuid' }),
    __metadata("design:type", String)
], EventGuestAnswer.prototype, "guestId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'question_id', type: 'uuid' }),
    __metadata("design:type", String)
], EventGuestAnswer.prototype, "questionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('EventGuest', 'answers'),
    (0, typeorm_1.JoinColumn)({ name: 'guest_id' }),
    __metadata("design:type", Object)
], EventGuestAnswer.prototype, "guest", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('EventRegistrationQuestion', 'answers'),
    (0, typeorm_1.JoinColumn)({ name: 'question_id' }),
    __metadata("design:type", Object)
], EventGuestAnswer.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'answer_text', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], EventGuestAnswer.prototype, "answerText", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'answer_number', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], EventGuestAnswer.prototype, "answerNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'answer_date', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], EventGuestAnswer.prototype, "answerDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'answer_boolean', type: 'boolean', nullable: true }),
    __metadata("design:type", Object)
], EventGuestAnswer.prototype, "answerBoolean", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'answer_choices', type: 'text', array: true, nullable: true }),
    __metadata("design:type", Object)
], EventGuestAnswer.prototype, "answerChoices", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_url', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], EventGuestAnswer.prototype, "fileUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_name', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], EventGuestAnswer.prototype, "fileName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_size', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], EventGuestAnswer.prototype, "fileSize", void 0);
exports.EventGuestAnswer = EventGuestAnswer = __decorate([
    (0, typeorm_1.Entity)('event_guest_answers')
], EventGuestAnswer);
//# sourceMappingURL=event-registration-question.entity.js.map