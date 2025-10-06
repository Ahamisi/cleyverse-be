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
exports.EventProductController = exports.VendorController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const vendor_service_1 = require("../services/vendor.service");
const vendor_dto_1 = require("../dto/vendor.dto");
let VendorController = class VendorController {
    vendorService;
    constructor(vendorService) {
        this.vendorService = vendorService;
    }
    async apply(req, eventId, applyDto) {
        const vendor = await this.vendorService.applyAsVendor(req.user.userId, eventId, applyDto);
        return { message: 'Vendor application submitted successfully', vendor };
    }
    async getMyApplication(req, eventId) {
        const vendor = await this.vendorService.getVendorApplication(req.user.userId, eventId);
        return { message: 'Vendor application retrieved successfully', vendor };
    }
    async updateMyApplication(req, eventId, updateDto) {
        const vendor = await this.vendorService.updateVendorApplication(req.user.userId, eventId, updateDto);
        return { message: 'Vendor application updated successfully', vendor };
    }
    async cancelMyApplication(req, eventId) {
        await this.vendorService.cancelVendorApplication(req.user.userId, eventId);
        return { message: 'Vendor application cancelled successfully' };
    }
    async findAll(req, eventId, searchDto) {
        const vendors = await this.vendorService.getEventVendors(req.user.userId, eventId, searchDto);
        return { message: 'Vendors retrieved successfully', vendors, total: vendors.length };
    }
    async getPublicVendors(eventId) {
        const vendors = await this.vendorService.getPublicEventVendors(eventId);
        return { message: 'Public vendors retrieved successfully', vendors, total: vendors.length };
    }
    async reviewApplication(req, eventId, vendorId, reviewDto) {
        const vendor = await this.vendorService.reviewVendorApplication(req.user.userId, eventId, vendorId, reviewDto);
        return { message: 'Vendor application reviewed successfully', vendor };
    }
    async updateBooth(req, eventId, vendorId, updateBoothDto) {
        const vendor = await this.vendorService.updateVendorBooth(req.user.userId, eventId, vendorId, updateBoothDto);
        return { message: 'Vendor booth updated successfully', vendor };
    }
    async getAnalytics(req, eventId, vendorId) {
        const analytics = await this.vendorService.getVendorAnalytics(req.user.userId, eventId, vendorId);
        return { message: 'Vendor analytics retrieved successfully', analytics };
    }
};
exports.VendorController = VendorController;
__decorate([
    (0, common_1.Post)('apply'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, vendor_dto_1.ApplyAsVendorDto]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "apply", null);
__decorate([
    (0, common_1.Get)('my-application'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "getMyApplication", null);
__decorate([
    (0, common_1.Put)('my-application'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, vendor_dto_1.UpdateVendorApplicationDto]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "updateMyApplication", null);
__decorate([
    (0, common_1.Delete)('my-application'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "cancelMyApplication", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, vendor_dto_1.SearchVendorsDto]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('public'),
    __param(0, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "getPublicVendors", null);
__decorate([
    (0, common_1.Put)(':vendorId/review'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Param)('vendorId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, vendor_dto_1.ReviewVendorApplicationDto]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "reviewApplication", null);
__decorate([
    (0, common_1.Put)(':vendorId/booth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Param)('vendorId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, vendor_dto_1.UpdateVendorBoothDto]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "updateBooth", null);
__decorate([
    (0, common_1.Get)(':vendorId/analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Param)('vendorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "getAnalytics", null);
exports.VendorController = VendorController = __decorate([
    (0, common_1.Controller)('events/:eventId/vendors'),
    __metadata("design:paramtypes", [vendor_service_1.VendorService])
], VendorController);
let EventProductController = class EventProductController {
    vendorService;
    constructor(vendorService) {
        this.vendorService = vendorService;
    }
    async linkProduct(req, eventId, linkDto) {
        const eventProduct = await this.vendorService.linkProductToEvent(req.user.userId, eventId, linkDto);
        return { message: 'Product linked to event successfully', eventProduct };
    }
    async getEventProducts(eventId, vendorId) {
        const products = await this.vendorService.getEventProducts(eventId, vendorId);
        return { message: 'Event products retrieved successfully', products, total: products.length };
    }
    async approveProduct(req, eventId, productId) {
        const eventProduct = await this.vendorService.approveEventProduct(req.user.userId, eventId, productId);
        return { message: 'Product approved successfully', eventProduct };
    }
    async rejectProduct(req, eventId, productId, reason) {
        const eventProduct = await this.vendorService.rejectEventProduct(req.user.userId, eventId, productId, reason);
        return { message: 'Product rejected successfully', eventProduct };
    }
};
exports.EventProductController = EventProductController;
__decorate([
    (0, common_1.Post)('link'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, vendor_dto_1.LinkProductToEventDto]),
    __metadata("design:returntype", Promise)
], EventProductController.prototype, "linkProduct", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, common_1.Query)('vendorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EventProductController.prototype, "getEventProducts", null);
__decorate([
    (0, common_1.Put)(':productId/approve'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], EventProductController.prototype, "approveProduct", null);
__decorate([
    (0, common_1.Put)(':productId/reject'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Param)('productId')),
    __param(3, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], EventProductController.prototype, "rejectProduct", null);
exports.EventProductController = EventProductController = __decorate([
    (0, common_1.Controller)('events/:eventId/products'),
    __metadata("design:paramtypes", [vendor_service_1.VendorService])
], EventProductController);
//# sourceMappingURL=vendor.controller.js.map