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
exports.GuestRegistrationController = exports.GuestController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const guest_service_1 = require("../services/guest.service");
const guest_dto_1 = require("../dto/guest.dto");
let GuestController = class GuestController {
    guestService;
    constructor(guestService) {
        this.guestService = guestService;
    }
    async inviteGuest(req, eventId, inviteDto) {
        const guest = await this.guestService.inviteGuest(req.user.userId, eventId, inviteDto);
        return { message: 'Guest invited successfully', guest };
    }
    async bulkInviteGuests(req, eventId, bulkInviteDto) {
        const result = await this.guestService.bulkInviteGuests(req.user.userId, eventId, bulkInviteDto);
        return {
            message: 'Bulk invitation completed',
            invited: result.invited.length,
            errors: result.errors.length,
            details: result
        };
    }
    async importGuests(req, eventId, importDto) {
        const result = await this.guestService.importGuestsFromEmails(req.user.userId, eventId, importDto);
        return {
            message: 'Email import completed',
            invited: result.invited.length,
            errors: result.errors.length,
            details: result
        };
    }
    async findAll(req, eventId, searchDto) {
        const guests = await this.guestService.getEventGuests(req.user.userId, eventId, searchDto);
        return { message: 'Guests retrieved successfully', guests, total: guests.length };
    }
    async updateStatus(req, eventId, guestId, updateStatusDto) {
        const guest = await this.guestService.updateGuestStatus(req.user.userId, eventId, guestId, updateStatusDto);
        return { message: 'Guest status updated successfully', guest };
    }
    async checkIn(req, eventId, guestId, checkInDto) {
        const guest = await this.guestService.checkInGuest(req.user.userId, eventId, guestId, checkInDto);
        return { message: 'Guest checked in successfully', guest };
    }
    async searchForCheckIn(req, eventId, search) {
        const guests = await this.guestService.searchGuestsForCheckIn(req.user.userId, eventId, search);
        return { message: 'Guests found for check-in', guests, total: guests.length };
    }
    async confirmGuest(req, eventId, guestId) {
        const guest = await this.guestService.confirmGuest(req.user.userId, eventId, guestId);
        return { message: 'Guest confirmed successfully', guest };
    }
    async bulkConfirmGuests(req, eventId, guestIds) {
        const result = await this.guestService.bulkConfirmGuests(req.user.userId, eventId, guestIds);
        return {
            message: 'Bulk confirmation completed',
            confirmed: result.confirmed,
            errors: result.errors.length,
            details: result
        };
    }
    async exportGuestList(req, eventId, format) {
        const data = await this.guestService.exportGuestList(req.user.userId, eventId, format);
        return {
            message: 'Guest list exported successfully',
            data,
            total: data.length,
            format: format || 'csv'
        };
    }
    async remove(req, eventId, guestId) {
        await this.guestService.deleteGuest(req.user.userId, eventId, guestId);
        return { message: 'Guest removed successfully' };
    }
};
exports.GuestController = GuestController;
__decorate([
    (0, common_1.Post)('invite'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, guest_dto_1.InviteGuestDto]),
    __metadata("design:returntype", Promise)
], GuestController.prototype, "inviteGuest", null);
__decorate([
    (0, common_1.Post)('bulk-invite'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, guest_dto_1.BulkInviteGuestsDto]),
    __metadata("design:returntype", Promise)
], GuestController.prototype, "bulkInviteGuests", null);
__decorate([
    (0, common_1.Post)('import-emails'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, guest_dto_1.ImportGuestsDto]),
    __metadata("design:returntype", Promise)
], GuestController.prototype, "importGuests", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, guest_dto_1.SearchGuestsDto]),
    __metadata("design:returntype", Promise)
], GuestController.prototype, "findAll", null);
__decorate([
    (0, common_1.Put)(':guestId/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Param)('guestId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, guest_dto_1.UpdateGuestStatusDto]),
    __metadata("design:returntype", Promise)
], GuestController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Put)(':guestId/check-in'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Param)('guestId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, guest_dto_1.CheckInGuestDto]),
    __metadata("design:returntype", Promise)
], GuestController.prototype, "checkIn", null);
__decorate([
    (0, common_1.Post)('search-for-checkin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Body)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], GuestController.prototype, "searchForCheckIn", null);
__decorate([
    (0, common_1.Put)(':guestId/confirm'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Param)('guestId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], GuestController.prototype, "confirmGuest", null);
__decorate([
    (0, common_1.Post)('bulk-confirm'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Body)('guestIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Array]),
    __metadata("design:returntype", Promise)
], GuestController.prototype, "bulkConfirmGuests", null);
__decorate([
    (0, common_1.Get)('export'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Query)('format')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], GuestController.prototype, "exportGuestList", null);
__decorate([
    (0, common_1.Delete)(':guestId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Param)('guestId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], GuestController.prototype, "remove", null);
exports.GuestController = GuestController = __decorate([
    (0, common_1.Controller)('events/:eventId/guests'),
    __metadata("design:paramtypes", [guest_service_1.GuestService])
], GuestController);
let GuestRegistrationController = class GuestRegistrationController {
    guestService;
    constructor(guestService) {
        this.guestService = guestService;
    }
    async getRegistrationForm(token) {
        const guest = await this.guestService.getGuestByToken(token);
        return {
            message: 'Registration form retrieved successfully',
            guest: {
                id: guest.id,
                guestName: guest.guestName,
                guestEmail: guest.guestEmail,
                status: guest.status
            },
            event: {
                id: guest.event.id,
                title: guest.event.title,
                startDate: guest.event.startDate,
                endDate: guest.event.endDate,
                locationType: guest.event.locationType,
                venueName: guest.event.venueName,
                venueAddress: guest.event.venueAddress,
                virtualLink: guest.event.virtualLink,
                registrationQuestions: guest.event.registrationQuestions
            }
        };
    }
    async register(token, registerDto) {
        const guest = await this.guestService.registerGuest({ ...registerDto, registrationToken: token });
        return { message: 'Registration completed successfully', guest };
    }
};
exports.GuestRegistrationController = GuestRegistrationController;
__decorate([
    (0, common_1.Get)(':token'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GuestRegistrationController.prototype, "getRegistrationForm", null);
__decorate([
    (0, common_1.Post)(':token/register'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, guest_dto_1.RegisterGuestDto]),
    __metadata("design:returntype", Promise)
], GuestRegistrationController.prototype, "register", null);
exports.GuestRegistrationController = GuestRegistrationController = __decorate([
    (0, common_1.Controller)('guest-registration'),
    __metadata("design:paramtypes", [guest_service_1.GuestService])
], GuestRegistrationController);
//# sourceMappingURL=guest.controller.js.map