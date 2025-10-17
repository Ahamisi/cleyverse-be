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
exports.StoreOnboardingController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const store_onboarding_service_1 = require("../services/store-onboarding.service");
const store_onboarding_dto_1 = require("../dto/store-onboarding.dto");
let StoreOnboardingController = class StoreOnboardingController {
    onboardingService;
    constructor(onboardingService) {
        this.onboardingService = onboardingService;
    }
    async startOnboarding(req, startDto) {
        const onboarding = await this.onboardingService.startOnboarding(req.user.userId, startDto);
        return {
            message: 'Store onboarding started successfully',
            onboarding: {
                id: onboarding.id,
                currentStep: onboarding.currentStep,
                isCompleted: onboarding.isCompleted,
                createdAt: onboarding.createdAt
            }
        };
    }
    async getOnboardingStatus(req) {
        return await this.onboardingService.getOnboardingStatus(req.user.userId);
    }
    async updateBusinessType(req, updateDto) {
        const onboarding = await this.onboardingService.updateBusinessType(req.user.userId, updateDto);
        return {
            message: 'Business type updated successfully',
            onboarding: {
                id: onboarding.id,
                currentStep: onboarding.currentStep,
                businessType: onboarding.businessType
            }
        };
    }
    async updateSalesChannels(req, updateDto) {
        const onboarding = await this.onboardingService.updateSalesChannels(req.user.userId, updateDto);
        return {
            message: 'Sales channels updated successfully',
            onboarding: {
                id: onboarding.id,
                currentStep: onboarding.currentStep,
                salesChannels: onboarding.salesChannels
            }
        };
    }
    async updateProductTypes(req, updateDto) {
        const onboarding = await this.onboardingService.updateProductTypes(req.user.userId, updateDto);
        return {
            message: 'Product types updated successfully',
            onboarding: {
                id: onboarding.id,
                currentStep: onboarding.currentStep,
                productTypes: onboarding.productTypes
            }
        };
    }
    async updateStoreSetup(req, updateDto) {
        const onboarding = await this.onboardingService.updateStoreSetup(req.user.userId, updateDto);
        return {
            message: 'Store setup updated successfully',
            onboarding: {
                id: onboarding.id,
                currentStep: onboarding.currentStep,
                storeName: onboarding.storeName,
                storeUrl: onboarding.storeUrl,
                storeDescription: onboarding.storeDescription,
                currency: onboarding.currency,
                logoUrl: onboarding.logoUrl,
                bannerUrl: onboarding.bannerUrl
            }
        };
    }
    async completeOnboarding(req, completeDto) {
        const result = await this.onboardingService.completeOnboarding(req.user.userId, completeDto, true);
        return {
            message: 'Store onboarding completed successfully! Your store has been created.',
            onboarding: {
                id: result.onboarding.id,
                currentStep: result.onboarding.currentStep,
                isCompleted: result.onboarding.isCompleted
            },
            store: result.store ? {
                id: result.store.id,
                name: result.store.name,
                storeUrl: result.store.storeUrl,
                status: result.store.status,
                createdAt: result.store.createdAt
            } : null
        };
    }
    async completeOnboardingWithoutStore(req, completeDto) {
        const result = await this.onboardingService.completeOnboarding(req.user.userId, completeDto, false);
        return {
            message: 'Store onboarding completed successfully! You can now create your store when ready.',
            onboarding: {
                id: result.onboarding.id,
                currentStep: result.onboarding.currentStep,
                isCompleted: result.onboarding.isCompleted
            }
        };
    }
    async resetOnboarding(req) {
        const onboarding = await this.onboardingService.resetOnboarding(req.user.userId);
        return {
            message: 'Store onboarding reset successfully',
            onboarding: {
                id: onboarding.id,
                currentStep: onboarding.currentStep,
                isCompleted: onboarding.isCompleted
            }
        };
    }
    async deleteOnboarding(req) {
        await this.onboardingService.deleteOnboarding(req.user.userId);
        return {
            message: 'Store onboarding deleted successfully'
        };
    }
};
exports.StoreOnboardingController = StoreOnboardingController;
__decorate([
    (0, common_1.Post)('start'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, store_onboarding_dto_1.StartOnboardingDto]),
    __metadata("design:returntype", Promise)
], StoreOnboardingController.prototype, "startOnboarding", null);
__decorate([
    (0, common_1.Get)('status'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoreOnboardingController.prototype, "getOnboardingStatus", null);
__decorate([
    (0, common_1.Put)('business-type'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, store_onboarding_dto_1.UpdateBusinessTypeDto]),
    __metadata("design:returntype", Promise)
], StoreOnboardingController.prototype, "updateBusinessType", null);
__decorate([
    (0, common_1.Put)('sales-channels'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, store_onboarding_dto_1.UpdateSalesChannelsDto]),
    __metadata("design:returntype", Promise)
], StoreOnboardingController.prototype, "updateSalesChannels", null);
__decorate([
    (0, common_1.Put)('product-types'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, store_onboarding_dto_1.UpdateProductTypesDto]),
    __metadata("design:returntype", Promise)
], StoreOnboardingController.prototype, "updateProductTypes", null);
__decorate([
    (0, common_1.Put)('store-setup'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, store_onboarding_dto_1.UpdateStoreSetupDto]),
    __metadata("design:returntype", Promise)
], StoreOnboardingController.prototype, "updateStoreSetup", null);
__decorate([
    (0, common_1.Post)('complete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, store_onboarding_dto_1.CompleteOnboardingDto]),
    __metadata("design:returntype", Promise)
], StoreOnboardingController.prototype, "completeOnboarding", null);
__decorate([
    (0, common_1.Post)('complete-without-store'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, store_onboarding_dto_1.CompleteOnboardingDto]),
    __metadata("design:returntype", Promise)
], StoreOnboardingController.prototype, "completeOnboardingWithoutStore", null);
__decorate([
    (0, common_1.Put)('reset'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoreOnboardingController.prototype, "resetOnboarding", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoreOnboardingController.prototype, "deleteOnboarding", null);
exports.StoreOnboardingController = StoreOnboardingController = __decorate([
    (0, common_1.Controller)('stores/onboarding'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [store_onboarding_service_1.StoreOnboardingService])
], StoreOnboardingController);
//# sourceMappingURL=store-onboarding.controller.js.map