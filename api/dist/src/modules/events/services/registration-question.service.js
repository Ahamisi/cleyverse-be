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
exports.RegistrationQuestionService = exports.UpdateRegistrationQuestionDto = exports.CreateRegistrationQuestionDto = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_registration_question_entity_1 = require("../entities/event-registration-question.entity");
const event_entity_1 = require("../entities/event.entity");
class CreateRegistrationQuestionDto {
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
}
exports.CreateRegistrationQuestionDto = CreateRegistrationQuestionDto;
class UpdateRegistrationQuestionDto {
    question;
    description;
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
}
exports.UpdateRegistrationQuestionDto = UpdateRegistrationQuestionDto;
let RegistrationQuestionService = class RegistrationQuestionService {
    questionRepository;
    eventRepository;
    constructor(questionRepository, eventRepository) {
        this.questionRepository = questionRepository;
        this.eventRepository = eventRepository;
    }
    async addQuestion(userId, eventId, createDto) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        const lastQuestion = await this.questionRepository.findOne({
            where: { eventId },
            order: { displayOrder: 'DESC' }
        });
        const displayOrder = createDto.displayOrder || ((lastQuestion?.displayOrder || 0) + 1);
        const question = this.questionRepository.create({
            ...createDto,
            eventId,
            displayOrder
        });
        return this.questionRepository.save(question);
    }
    async getEventQuestions(userId, eventId) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        return this.questionRepository.find({
            where: { eventId },
            order: { displayOrder: 'ASC' }
        });
    }
    async updateQuestion(userId, eventId, questionId, updateDto) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        const question = await this.questionRepository.findOne({
            where: { id: questionId, eventId }
        });
        if (!question) {
            throw new common_1.NotFoundException('Registration question not found');
        }
        Object.assign(question, updateDto);
        return this.questionRepository.save(question);
    }
    async deleteQuestion(userId, eventId, questionId) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        const question = await this.questionRepository.findOne({
            where: { id: questionId, eventId }
        });
        if (!question) {
            throw new common_1.NotFoundException('Registration question not found');
        }
        await this.questionRepository.remove(question);
    }
    async reorderQuestions(userId, eventId, questionOrders) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        for (const order of questionOrders) {
            await this.questionRepository.update({ id: order.id, eventId }, { displayOrder: order.displayOrder });
        }
    }
};
exports.RegistrationQuestionService = RegistrationQuestionService;
exports.RegistrationQuestionService = RegistrationQuestionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(event_registration_question_entity_1.EventRegistrationQuestion)),
    __param(1, (0, typeorm_1.InjectRepository)(event_entity_1.Event)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RegistrationQuestionService);
//# sourceMappingURL=registration-question.service.js.map