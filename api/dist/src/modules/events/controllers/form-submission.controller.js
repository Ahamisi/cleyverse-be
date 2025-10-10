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
exports.FormsWebhookController = exports.FormSubmissionController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const form_submission_handler_service_1 = require("../services/form-submission-handler.service");
let FormSubmissionController = class FormSubmissionController {
    formSubmissionHandler;
    constructor(formSubmissionHandler) {
        this.formSubmissionHandler = formSubmissionHandler;
    }
    async getVendorApplicationsFromForms(req, eventId) {
        const applications = await this.formSubmissionHandler.getVendorApplicationsFromForms(req.user.userId, eventId);
        return {
            message: 'Vendor applications retrieved successfully',
            applications,
            total: applications.length
        };
    }
    async getGuestRegistrationsFromForms(req, eventId) {
        const registrations = await this.formSubmissionHandler.getGuestRegistrationsFromForms(req.user.userId, eventId);
        return {
            message: 'Guest registrations retrieved successfully',
            registrations,
            total: registrations.length
        };
    }
    async approveVendorFromForm(req, eventId, submissionId, approvalData) {
        const vendor = await this.formSubmissionHandler.approveVendorFromForm(req.user.userId, eventId, submissionId, approvalData);
        return {
            message: 'Vendor approved successfully',
            vendor
        };
    }
    async rejectVendorFromForm(req, eventId, submissionId, rejectionData) {
        return {
            message: 'Vendor rejected successfully'
        };
    }
};
exports.FormSubmissionController = FormSubmissionController;
__decorate([
    (0, common_1.Get)('vendors'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FormSubmissionController.prototype, "getVendorApplicationsFromForms", null);
__decorate([
    (0, common_1.Get)('guests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FormSubmissionController.prototype, "getGuestRegistrationsFromForms", null);
__decorate([
    (0, common_1.Post)('vendors/:submissionId/approve'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Param)('submissionId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], FormSubmissionController.prototype, "approveVendorFromForm", null);
__decorate([
    (0, common_1.Post)('vendors/:submissionId/reject'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Param)('submissionId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], FormSubmissionController.prototype, "rejectVendorFromForm", null);
exports.FormSubmissionController = FormSubmissionController = __decorate([
    (0, common_1.Controller)('events/:eventId/form-submissions'),
    __metadata("design:paramtypes", [form_submission_handler_service_1.FormSubmissionHandlerService])
], FormSubmissionController);
let FormsWebhookController = class FormsWebhookController {
    formSubmissionHandler;
    constructor(formSubmissionHandler) {
        this.formSubmissionHandler = formSubmissionHandler;
    }
    async handleFormSubmission(payload) {
        try {
            return { message: 'Form submission processed successfully' };
        }
        catch (error) {
            console.error('Error processing form submission:', error);
            return { message: 'Error processing form submission', error: error.message };
        }
    }
};
exports.FormsWebhookController = FormsWebhookController;
__decorate([
    (0, common_1.Post)('submission-created'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FormsWebhookController.prototype, "handleFormSubmission", null);
exports.FormsWebhookController = FormsWebhookController = __decorate([
    (0, common_1.Controller)('webhooks/forms'),
    __metadata("design:paramtypes", [form_submission_handler_service_1.FormSubmissionHandlerService])
], FormsWebhookController);
//# sourceMappingURL=form-submission.controller.js.map