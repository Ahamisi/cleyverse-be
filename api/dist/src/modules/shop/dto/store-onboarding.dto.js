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
exports.OnboardingStatusResponse = exports.CompleteOnboardingDto = exports.UpdateStoreSetupDto = exports.UpdateProductTypesDto = exports.UpdateSalesChannelsDto = exports.UpdateBusinessTypeDto = exports.StartOnboardingDto = void 0;
const class_validator_1 = require("class-validator");
const store_onboarding_entity_1 = require("../entities/store-onboarding.entity");
class StartOnboardingDto {
}
exports.StartOnboardingDto = StartOnboardingDto;
class UpdateBusinessTypeDto {
    businessType;
}
exports.UpdateBusinessTypeDto = UpdateBusinessTypeDto;
__decorate([
    (0, class_validator_1.IsEnum)(store_onboarding_entity_1.BusinessType),
    __metadata("design:type", String)
], UpdateBusinessTypeDto.prototype, "businessType", void 0);
class UpdateSalesChannelsDto {
    salesChannels;
}
exports.UpdateSalesChannelsDto = UpdateSalesChannelsDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(store_onboarding_entity_1.SalesChannel, { each: true }),
    __metadata("design:type", Array)
], UpdateSalesChannelsDto.prototype, "salesChannels", void 0);
class UpdateProductTypesDto {
    productTypes;
}
exports.UpdateProductTypesDto = UpdateProductTypesDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(store_onboarding_entity_1.ProductType, { each: true }),
    __metadata("design:type", Array)
], UpdateProductTypesDto.prototype, "productTypes", void 0);
class UpdateStoreSetupDto {
    storeName;
    storeUrl;
    storeDescription;
    currency;
    logoUrl;
    bannerUrl;
}
exports.UpdateStoreSetupDto = UpdateStoreSetupDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateStoreSetupDto.prototype, "storeName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(50),
    (0, class_validator_1.Matches)(/^[a-z0-9-]+$/, {
        message: 'Store URL can only contain lowercase letters, numbers, and hyphens'
    }),
    __metadata("design:type", String)
], UpdateStoreSetupDto.prototype, "storeUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStoreSetupDto.prototype, "storeDescription", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStoreSetupDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStoreSetupDto.prototype, "logoUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStoreSetupDto.prototype, "bannerUrl", void 0);
class CompleteOnboardingDto {
    storeName;
    storeUrl;
    storeDescription;
    currency;
    logoUrl;
    bannerUrl;
}
exports.CompleteOnboardingDto = CompleteOnboardingDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "storeName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(50),
    (0, class_validator_1.Matches)(/^[a-z0-9-]+$/, {
        message: 'Store URL can only contain lowercase letters, numbers, and hyphens'
    }),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "storeUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "storeDescription", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "logoUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "bannerUrl", void 0);
class OnboardingStatusResponse {
    id;
    currentStep;
    businessType;
    salesChannels;
    productTypes;
    storeName;
    storeUrl;
    storeDescription;
    currency;
    logoUrl;
    bannerUrl;
    isCompleted;
    nextSteps;
    createdAt;
    updatedAt;
}
exports.OnboardingStatusResponse = OnboardingStatusResponse;
//# sourceMappingURL=store-onboarding.dto.js.map