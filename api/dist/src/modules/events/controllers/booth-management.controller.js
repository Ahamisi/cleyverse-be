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
exports.BoothManagementController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const booth_management_service_1 = require("../services/booth-management.service");
let BoothManagementController = class BoothManagementController {
    boothService;
    constructor(boothService) {
        this.boothService = boothService;
    }
    async createBooth(req, eventId, createBoothDto) {
        const booth = await this.boothService.createBooth(req.user.userId, eventId, createBoothDto);
        return { message: 'Booth created successfully', booth };
    }
    async bulkCreateBooths(req, eventId, bulkCreateDto) {
        const booths = await this.boothService.bulkCreateBooths(req.user.userId, eventId, bulkCreateDto);
        return {
            message: 'Booths created successfully',
            booths,
            total: booths.length,
            boothNumbers: booths.map(b => b.boothNumber)
        };
    }
    async getEventBooths(req, eventId) {
        const booths = await this.boothService.getEventBooths(req.user.userId, eventId);
        return { message: 'Event booths retrieved successfully', booths, total: booths.length };
    }
    async getAvailableBooths(req, eventId) {
        const booths = await this.boothService.getAvailableBooths(req.user.userId, eventId);
        return { message: 'Available booths retrieved successfully', booths, total: booths.length };
    }
    async getBoothSuggestions(req, eventId, preferredSection, needsPower, needsWifi, needsStorage, needsSink, maxPrice) {
        const requirements = {
            preferredSection,
            needsPower: needsPower === 'true',
            needsWifi: needsWifi === 'true',
            needsStorage: needsStorage === 'true',
            needsSink: needsSink === 'true',
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined
        };
        const booths = await this.boothService.generateBoothSuggestion(eventId, requirements);
        return {
            message: 'Booth suggestions retrieved successfully',
            suggestions: booths,
            total: booths.length,
            criteria: requirements
        };
    }
    async assignBoothToVendor(req, eventId, boothId, vendorId) {
        const booth = await this.boothService.assignBoothToVendor(req.user.userId, eventId, boothId, vendorId);
        return { message: 'Booth assigned to vendor successfully', booth };
    }
    async getBoothAnalytics(req, eventId) {
        const analytics = await this.boothService.getBoothAnalytics(req.user.userId, eventId);
        return { message: 'Booth analytics retrieved successfully', analytics };
    }
};
exports.BoothManagementController = BoothManagementController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, booth_management_service_1.CreateBoothDto]),
    __metadata("design:returntype", Promise)
], BoothManagementController.prototype, "createBooth", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, booth_management_service_1.BulkCreateBoothsDto]),
    __metadata("design:returntype", Promise)
], BoothManagementController.prototype, "bulkCreateBooths", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BoothManagementController.prototype, "getEventBooths", null);
__decorate([
    (0, common_1.Get)('available'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BoothManagementController.prototype, "getAvailableBooths", null);
__decorate([
    (0, common_1.Get)('suggestions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Query)('preferredSection')),
    __param(3, (0, common_1.Query)('needsPower')),
    __param(4, (0, common_1.Query)('needsWifi')),
    __param(5, (0, common_1.Query)('needsStorage')),
    __param(6, (0, common_1.Query)('needsSink')),
    __param(7, (0, common_1.Query)('maxPrice')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], BoothManagementController.prototype, "getBoothSuggestions", null);
__decorate([
    (0, common_1.Put)(':boothId/assign/:vendorId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Param)('boothId')),
    __param(3, (0, common_1.Param)('vendorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], BoothManagementController.prototype, "assignBoothToVendor", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BoothManagementController.prototype, "getBoothAnalytics", null);
exports.BoothManagementController = BoothManagementController = __decorate([
    (0, common_1.Controller)('events/:eventId/booths'),
    __metadata("design:paramtypes", [booth_management_service_1.BoothManagementService])
], BoothManagementController);
//# sourceMappingURL=booth-management.controller.js.map