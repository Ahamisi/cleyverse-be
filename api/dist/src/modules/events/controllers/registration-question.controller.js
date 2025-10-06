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
exports.RegistrationQuestionController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const registration_question_service_1 = require("../services/registration-question.service");
let RegistrationQuestionController = class RegistrationQuestionController {
    questionService;
    constructor(questionService) {
        this.questionService = questionService;
    }
    async addQuestion(req, eventId, createDto) {
        const question = await this.questionService.addQuestion(req.user.userId, eventId, createDto);
        return { message: 'Registration question added successfully', question };
    }
    async getQuestions(req, eventId) {
        const questions = await this.questionService.getEventQuestions(req.user.userId, eventId);
        return { message: 'Registration questions retrieved successfully', questions, total: questions.length };
    }
    async updateQuestion(req, eventId, questionId, updateDto) {
        const question = await this.questionService.updateQuestion(req.user.userId, eventId, questionId, updateDto);
        return { message: 'Registration question updated successfully', question };
    }
    async deleteQuestion(req, eventId, questionId) {
        await this.questionService.deleteQuestion(req.user.userId, eventId, questionId);
        return { message: 'Registration question deleted successfully' };
    }
    async reorderQuestions(req, eventId, questions) {
        await this.questionService.reorderQuestions(req.user.userId, eventId, questions);
        return { message: 'Registration questions reordered successfully' };
    }
};
exports.RegistrationQuestionController = RegistrationQuestionController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, registration_question_service_1.CreateRegistrationQuestionDto]),
    __metadata("design:returntype", Promise)
], RegistrationQuestionController.prototype, "addQuestion", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RegistrationQuestionController.prototype, "getQuestions", null);
__decorate([
    (0, common_1.Put)(':questionId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Param)('questionId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, registration_question_service_1.UpdateRegistrationQuestionDto]),
    __metadata("design:returntype", Promise)
], RegistrationQuestionController.prototype, "updateQuestion", null);
__decorate([
    (0, common_1.Delete)(':questionId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Param)('questionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], RegistrationQuestionController.prototype, "deleteQuestion", null);
__decorate([
    (0, common_1.Put)('reorder'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Body)('questions')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Array]),
    __metadata("design:returntype", Promise)
], RegistrationQuestionController.prototype, "reorderQuestions", null);
exports.RegistrationQuestionController = RegistrationQuestionController = __decorate([
    (0, common_1.Controller)('events/:eventId/registration-questions'),
    __metadata("design:paramtypes", [registration_question_service_1.RegistrationQuestionService])
], RegistrationQuestionController);
//# sourceMappingURL=registration-question.controller.js.map