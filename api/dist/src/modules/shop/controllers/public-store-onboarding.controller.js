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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicStoreOnboardingController = void 0;
const common_1 = require("@nestjs/common");
const store_onboarding_service_1 = require("../services/store-onboarding.service");
let PublicStoreOnboardingController = class PublicStoreOnboardingController {
    onboardingService;
    constructor(onboardingService) {
        this.onboardingService = onboardingService;
    }
    getBusinessTypes() {
        return {
            message: 'Business types retrieved successfully',
            businessTypes: this.onboardingService.getBusinessTypes()
        };
    }
    getSalesChannels() {
        return {
            message: 'Sales channels retrieved successfully',
            salesChannels: this.onboardingService.getSalesChannels()
        };
    }
    getProductTypes() {
        return {
            message: 'Product types retrieved successfully',
            productTypes: this.onboardingService.getProductTypes()
        };
    }
};
exports.PublicStoreOnboardingController = PublicStoreOnboardingController;
__decorate([
    (0, common_1.Get)('business-types'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublicStoreOnboardingController.prototype, "getBusinessTypes", null);
__decorate([
    (0, common_1.Get)('sales-channels'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublicStoreOnboardingController.prototype, "getSalesChannels", null);
__decorate([
    (0, common_1.Get)('product-types'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublicStoreOnboardingController.prototype, "getProductTypes", null);
exports.PublicStoreOnboardingController = PublicStoreOnboardingController = __decorate([
    (0, common_1.Controller)('stores/onboarding/options'),
    __metadata("design:paramtypes", [store_onboarding_service_1.StoreOnboardingService])
], PublicStoreOnboardingController);
//# sourceMappingURL=public-store-onboarding.controller.js.map