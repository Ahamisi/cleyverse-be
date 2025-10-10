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
exports.PublicEventFormController = exports.EventFormController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const event_form_service_1 = require("../services/event-form.service");
let EventFormController = class EventFormController {
    eventFormService;
    constructor(eventFormService) {
        this.eventFormService = eventFormService;
    }
    async setVendorForm(req, eventId, formId) {
        const event = await this.eventFormService.setVendorForm(req.user.userId, eventId, formId);
        return {
            message: 'Vendor form linked to event successfully',
            event: {
                id: event.id,
                vendorFormId: event.vendorFormId
            }
        };
    }
    async setGuestForm(req, eventId, formId) {
        const event = await this.eventFormService.setGuestForm(req.user.userId, eventId, formId);
        return {
            message: 'Guest registration form linked to event successfully',
            event: {
                id: event.id,
                guestFormId: event.guestFormId
            }
        };
    }
    async removeVendorForm(req, eventId) {
        const event = await this.eventFormService.removeVendorForm(req.user.userId, eventId);
        return {
            message: 'Vendor form removed from event successfully',
            event: {
                id: event.id,
                vendorFormId: event.vendorFormId
            }
        };
    }
    async removeGuestForm(req, eventId) {
        const event = await this.eventFormService.removeGuestForm(req.user.userId, eventId);
        return {
            message: 'Guest registration form removed from event successfully',
            event: {
                id: event.id,
                guestFormId: event.guestFormId
            }
        };
    }
    async getEventForms(req, eventId) {
        const forms = await this.eventFormService.getEventForms(req.user.userId, eventId);
        return {
            message: 'Event forms retrieved successfully',
            forms
        };
    }
};
exports.EventFormController = EventFormController;
__decorate([
    (0, common_1.Post)('vendor'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Body)('formId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], EventFormController.prototype, "setVendorForm", null);
__decorate([
    (0, common_1.Post)('guest'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Body)('formId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], EventFormController.prototype, "setGuestForm", null);
__decorate([
    (0, common_1.Delete)('vendor'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EventFormController.prototype, "removeVendorForm", null);
__decorate([
    (0, common_1.Delete)('guest'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EventFormController.prototype, "removeGuestForm", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EventFormController.prototype, "getEventForms", null);
exports.EventFormController = EventFormController = __decorate([
    (0, common_1.Controller)('events/:eventId/forms'),
    __metadata("design:paramtypes", [event_form_service_1.EventFormService])
], EventFormController);
let PublicEventFormController = class PublicEventFormController {
    eventFormService;
    constructor(eventFormService) {
        this.eventFormService = eventFormService;
    }
    async getPublicEventForms(eventId) {
        const forms = await this.eventFormService.getPublicEventForms(eventId);
        return {
            message: 'Public event forms retrieved successfully',
            forms: {
                vendorFormId: forms.vendorFormId,
                guestFormId: forms.guestFormId,
                vendorFormUrl: forms.vendorFormId ? `https://app.cleyverse.com/forms/${forms.vendorFormId}` : null,
                guestFormUrl: forms.guestFormId ? `https://app.cleyverse.com/forms/${forms.guestFormId}` : null
            }
        };
    }
};
exports.PublicEventFormController = PublicEventFormController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicEventFormController.prototype, "getPublicEventForms", null);
exports.PublicEventFormController = PublicEventFormController = __decorate([
    (0, common_1.Controller)('events/:eventId/public-forms'),
    __metadata("design:paramtypes", [event_form_service_1.EventFormService])
], PublicEventFormController);
//# sourceMappingURL=event-form.controller.js.map