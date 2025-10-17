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
const store_onboarding_service_1 = require("../services/store-onboarding.service");
const store_dto_1 = require("../dto/store.dto");
const link_dto_1 = require("../../links/dto/link.dto");
let StoreController = class StoreController {
    storeService;
    onboardingService;
    constructor(storeService, onboardingService) {
        this.storeService = storeService;
        this.onboardingService = onboardingService;
    }
    async create(req, createStoreDto) {
        let onboardingData = null;
        try {
            const onboardingStatus = await this.onboardingService.getOnboardingStatus(req.user.userId);
            if (onboardingStatus.isCompleted) {
                onboardingData = {
                    businessType: onboardingStatus.businessType,
                    salesChannels: onboardingStatus.salesChannels,
                    productTypes: onboardingStatus.productTypes
                };
            }
        }
        catch (error) {
        }
        const store = await this.storeService.createStore(req.user.userId, createStoreDto);
        return {
            message: 'Store created successfully',
            store,
            onboardingData
        };
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
    async getOnboardingStatus(req) {
        try {
            const status = await this.onboardingService.getOnboardingStatus(req.user.userId);
            return {
                message: 'Onboarding status retrieved successfully',
                onboarding: status,
                hasOnboarding: true
            };
        }
        catch (error) {
            return {
                message: 'No onboarding session found',
                onboarding: null,
                hasOnboarding: false,
                canStartOnboarding: true
            };
        }
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
    async getPublicStore(storeUrl) {
        return this.storeService.getPublicStore(storeUrl);
    }
    async getPublicStoreProducts(storeUrl, page, limit, search, category, minPrice, maxPrice, sortBy, sortOrder) {
        return this.storeService.getPublicStoreProducts(storeUrl, {
            page: page || 1,
            limit: limit || 20,
            search,
            category,
            minPrice,
            maxPrice,
            sortBy: sortBy || 'createdAt',
            sortOrder: sortOrder || 'DESC'
        });
    }
    async getPublicProduct(storeUrl, productHandle) {
        return this.storeService.getPublicProduct(storeUrl, productHandle);
    }
    async trackProductView(storeUrl, productHandle, trackClickDto) {
        const viewId = await this.storeService.trackProductView(storeUrl, productHandle, trackClickDto);
        return {
            message: 'View recorded successfully',
            viewId
        };
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
    (0, common_1.Get)('onboarding/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "getOnboardingStatus", null);
__decorate([
    (0, common_1.Get)('check-url/:storeUrl'),
    __param(0, (0, common_1.Param)('storeUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "checkUrlAvailability", null);
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
__decorate([
    (0, common_1.Get)('public/:storeUrl'),
    __param(0, (0, common_1.Param)('storeUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "getPublicStore", null);
__decorate([
    (0, common_1.Get)('public/:storeUrl/products'),
    __param(0, (0, common_1.Param)('storeUrl')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('category')),
    __param(5, (0, common_1.Query)('minPrice')),
    __param(6, (0, common_1.Query)('maxPrice')),
    __param(7, (0, common_1.Query)('sortBy')),
    __param(8, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String, String, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "getPublicStoreProducts", null);
__decorate([
    (0, common_1.Get)('public/:storeUrl/products/:productHandle'),
    __param(0, (0, common_1.Param)('storeUrl')),
    __param(1, (0, common_1.Param)('productHandle')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "getPublicProduct", null);
__decorate([
    (0, common_1.Post)('public/:storeUrl/products/:productHandle/view'),
    __param(0, (0, common_1.Param)('storeUrl')),
    __param(1, (0, common_1.Param)('productHandle')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, link_dto_1.TrackClickDto]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "trackProductView", null);
exports.StoreController = StoreController = __decorate([
    (0, common_1.Controller)('stores'),
    __metadata("design:paramtypes", [store_service_1.StoreService,
        store_onboarding_service_1.StoreOnboardingService])
], StoreController);
//# sourceMappingURL=store.controller.js.map