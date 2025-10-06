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
exports.StoreController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const store_service_1 = require("../services/store.service");
const store_dto_1 = require("../dto/store.dto");
let StoreController = class StoreController {
    storeService;
    constructor(storeService) {
        this.storeService = storeService;
    }
    async create(req, createStoreDto) {
        const store = await this.storeService.createStore(req.user.userId, createStoreDto);
        return { message: 'Store created successfully', store };
    }
    async findAll(req, includeInactive = 'false') {
        const stores = await this.storeService.getUserStores(req.user.userId, includeInactive === 'true');
        return {
            message: 'Stores retrieved successfully',
            stores,
            total: stores.length,
            hasStores: stores.length > 0,
            canCreateMore: stores.length < 10
        };
    }
    async checkUserStores(req) {
        const stores = await this.storeService.getUserStores(req.user.userId, false);
        return {
            message: 'User store status checked',
            hasStores: stores.length > 0,
            storeCount: stores.length,
            canCreateMore: stores.length < 10,
            maxStores: 10,
            stores: stores.map(store => ({
                id: store.id,
                name: store.name,
                storeUrl: store.storeUrl,
                status: store.status,
                totalProducts: store.totalProducts
            }))
        };
    }
    async getAnalytics(req, storeId) {
        const analytics = await this.storeService.getStoreAnalytics(req.user.userId, storeId);
        return { message: 'Store analytics retrieved successfully', analytics };
    }
    async checkUrlAvailability(storeUrl) {
        const isAvailable = await this.storeService.checkStoreUrlAvailability(storeUrl);
        return {
            message: 'Store URL availability checked',
            storeUrl,
            isAvailable,
            suggestion: isAvailable ? null : `${storeUrl}-${Date.now().toString().slice(-4)}`
        };
    }
    async getPublicStore(storeUrl) {
        const store = await this.storeService.getPublicStore(storeUrl);
        return { message: 'Public store retrieved successfully', store };
    }
    async findOne(req, id) {
        const store = await this.storeService.getStoreById(req.user.userId, id);
        return { message: 'Store retrieved successfully', store };
    }
    async update(req, id, updateStoreDto) {
        const store = await this.storeService.updateStore(req.user.userId, id, updateStoreDto);
        return { message: 'Store updated successfully', store };
    }
    async updateStatus(req, id, updateStatusDto) {
        const store = await this.storeService.updateStoreStatus(req.user.userId, id, updateStatusDto);
        return { message: 'Store status updated successfully', store };
    }
    async remove(req, id) {
        await this.storeService.deleteStore(req.user.userId, id);
        return { message: 'Store deleted successfully (can be restored within 60 days)' };
    }
    async restoreStore(req, id) {
        const store = await this.storeService.restoreStore(req.user.userId, id);
        return { message: 'Store restored successfully', store };
    }
    async getDeletedStores(req) {
        const stores = await this.storeService.getDeletedStores(req.user.userId);
        return { message: 'Deleted stores retrieved successfully', stores, total: stores.length };
    }
    async suspendStore(id, reason) {
        const store = await this.storeService.suspendStore(id, reason);
        return { message: 'Store suspended successfully', store };
    }
    async unsuspendStore(id) {
        const store = await this.storeService.unsuspendStore(id);
        return { message: 'Store unsuspended successfully', store };
    }
};
exports.StoreController = StoreController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, store_dto_1.CreateStoreDto]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('check'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "checkUserStores", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('storeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Get)('check-url/:storeUrl'),
    __param(0, (0, common_1.Param)('storeUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "checkUrlAvailability", null);
__decorate([
    (0, common_1.Get)('public/:storeUrl'),
    __param(0, (0, common_1.Param)('storeUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "getPublicStore", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, store_dto_1.UpdateStoreDto]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, store_dto_1.UpdateStoreStatusDto]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)(':id/restore'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "restoreStore", null);
__decorate([
    (0, common_1.Get)('deleted'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "getDeletedStores", null);
__decorate([
    (0, common_1.Put)(':id/suspend'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "suspendStore", null);
__decorate([
    (0, common_1.Put)(':id/unsuspend'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "unsuspendStore", null);
exports.StoreController = StoreController = __decorate([
    (0, common_1.Controller)('stores'),
    __metadata("design:paramtypes", [store_service_1.StoreService])
], StoreController);
//# sourceMappingURL=store.controller.js.map