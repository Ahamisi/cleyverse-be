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
exports.CreatorSettingsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const creator_settings_service_1 = require("../services/creator-settings.service");
const creator_settings_dto_1 = require("../dto/creator-settings.dto");
const creator_payout_settings_dto_1 = require("../dto/creator-payout-settings.dto");
let CreatorSettingsController = class CreatorSettingsController {
    creatorSettingsService;
    constructor(creatorSettingsService) {
        this.creatorSettingsService = creatorSettingsService;
    }
    async getCreatorSettings(req) {
        const settings = await this.creatorSettingsService.getCreatorSettings(req.user.userId);
        return {
            message: 'Creator settings retrieved successfully',
            settings: {
                id: settings.id,
                theme: settings.theme,
                language: settings.language,
                emailNotifications: settings.emailNotifications,
                smsNotifications: settings.smsNotifications,
                pushNotifications: settings.pushNotifications,
                marketingEmails: settings.marketingEmails,
                publicProfile: settings.publicProfile,
                showEmail: settings.showEmail,
                showPhone: settings.showPhone,
                allowMessages: settings.allowMessages,
                allowComments: settings.allowComments,
                payoutFrequency: settings.payoutFrequency,
                minimumPayoutThreshold: settings.minimumPayoutThreshold,
                autoPayout: settings.autoPayout,
                preferredCurrency: settings.preferredCurrency,
                taxCountry: settings.taxCountry,
                taxId: settings.taxId,
                businessName: settings.businessName,
                businessAddress: settings.businessAddress,
                businessCity: settings.businessCity,
                businessState: settings.businessState,
                businessZipCode: settings.businessZipCode,
                customSettings: settings.customSettings,
                bio: settings.bio,
                website: settings.website,
                socialLinks: settings.socialLinks ? JSON.parse(settings.socialLinks) : null,
                createdAt: settings.createdAt,
                updatedAt: settings.updatedAt
            }
        };
    }
    async updateCreatorSettings(req, updateDto) {
        const settings = await this.creatorSettingsService.updateCreatorSettings(req.user.userId, updateDto);
        return {
            message: 'Creator settings updated successfully',
            settings: {
                id: settings.id,
                theme: settings.theme,
                language: settings.language,
                emailNotifications: settings.emailNotifications,
                smsNotifications: settings.smsNotifications,
                pushNotifications: settings.pushNotifications,
                marketingEmails: settings.marketingEmails,
                publicProfile: settings.publicProfile,
                showEmail: settings.showEmail,
                showPhone: settings.showPhone,
                allowMessages: settings.allowMessages,
                allowComments: settings.allowComments,
                payoutFrequency: settings.payoutFrequency,
                minimumPayoutThreshold: settings.minimumPayoutThreshold,
                autoPayout: settings.autoPayout,
                preferredCurrency: settings.preferredCurrency,
                taxCountry: settings.taxCountry,
                taxId: settings.taxId,
                businessName: settings.businessName,
                businessAddress: settings.businessAddress,
                businessCity: settings.businessCity,
                businessState: settings.businessState,
                businessZipCode: settings.businessZipCode,
                customSettings: settings.customSettings,
                bio: settings.bio,
                website: settings.website,
                socialLinks: settings.socialLinks ? JSON.parse(settings.socialLinks) : null,
                updatedAt: settings.updatedAt
            }
        };
    }
    async getPayoutSettings(req, query) {
        const result = await this.creatorSettingsService.getPayoutSettings(req.user.userId, query);
        return {
            message: 'Payout settings retrieved successfully',
            settings: result.settings.map(setting => ({
                id: setting.id,
                method: setting.method,
                isDefault: setting.isDefault,
                status: setting.status,
                bankName: setting.bankName,
                accountHolderName: setting.accountHolderName,
                paypalEmail: setting.paypalEmail,
                cryptoCurrency: setting.cryptoCurrency,
                country: setting.country,
                verifiedAt: setting.verifiedAt,
                isActive: setting.isActive,
                createdAt: setting.createdAt,
                updatedAt: setting.updatedAt
            })),
            pagination: {
                page: query.page || 1,
                limit: query.limit || 20,
                total: result.total,
                totalPages: Math.ceil(result.total / (query.limit || 20))
            }
        };
    }
    async getPayoutSettingById(req, payoutId) {
        const setting = await this.creatorSettingsService.getPayoutSettingById(req.user.userId, payoutId);
        return {
            message: 'Payout setting retrieved successfully',
            setting: {
                id: setting.id,
                method: setting.method,
                isDefault: setting.isDefault,
                status: setting.status,
                bankName: setting.bankName,
                accountNumber: setting.accountNumber,
                routingNumber: setting.routingNumber,
                swiftCode: setting.swiftCode,
                iban: setting.iban,
                accountType: setting.accountType,
                accountHolderName: setting.accountHolderName,
                country: setting.country,
                address: setting.address,
                city: setting.city,
                state: setting.state,
                zipCode: setting.zipCode,
                paypalEmail: setting.paypalEmail,
                paypalMerchantId: setting.paypalMerchantId,
                stripeAccountId: setting.stripeAccountId,
                stripeConnectId: setting.stripeConnectId,
                wiseAccountId: setting.wiseAccountId,
                wiseEmail: setting.wiseEmail,
                cryptoCurrency: setting.cryptoCurrency,
                cryptoAddress: setting.cryptoAddress,
                cryptoNetwork: setting.cryptoNetwork,
                verificationDocument: setting.verificationDocument,
                verifiedAt: setting.verifiedAt,
                verificationNotes: setting.verificationNotes,
                verifiedBy: setting.verifiedBy,
                metadata: setting.metadata,
                externalId: setting.externalId,
                isActive: setting.isActive,
                createdAt: setting.createdAt,
                updatedAt: setting.updatedAt
            }
        };
    }
    async createPayoutSetting(req, createDto) {
        const setting = await this.creatorSettingsService.createPayoutSetting(req.user.userId, createDto);
        return {
            message: 'Payout setting created successfully',
            setting: {
                id: setting.id,
                method: setting.method,
                isDefault: setting.isDefault,
                status: setting.status,
                bankName: setting.bankName,
                accountHolderName: setting.accountHolderName,
                paypalEmail: setting.paypalEmail,
                cryptoCurrency: setting.cryptoCurrency,
                country: setting.country,
                isActive: setting.isActive,
                createdAt: setting.createdAt
            }
        };
    }
    async updatePayoutSetting(req, payoutId, updateDto) {
        const setting = await this.creatorSettingsService.updatePayoutSetting(req.user.userId, payoutId, updateDto);
        return {
            message: 'Payout setting updated successfully',
            setting: {
                id: setting.id,
                method: setting.method,
                isDefault: setting.isDefault,
                status: setting.status,
                bankName: setting.bankName,
                accountHolderName: setting.accountHolderName,
                paypalEmail: setting.paypalEmail,
                cryptoCurrency: setting.cryptoCurrency,
                country: setting.country,
                isActive: setting.isActive,
                updatedAt: setting.updatedAt
            }
        };
    }
    async deletePayoutSetting(req, payoutId) {
        await this.creatorSettingsService.deletePayoutSetting(req.user.userId, payoutId);
        return {
            message: 'Payout setting deleted successfully'
        };
    }
    async setDefaultPayoutSetting(req, payoutId) {
        const setting = await this.creatorSettingsService.setDefaultPayoutSetting(req.user.userId, payoutId);
        return {
            message: 'Default payout setting updated successfully',
            setting: {
                id: setting.id,
                method: setting.method,
                isDefault: setting.isDefault,
                status: setting.status,
                updatedAt: setting.updatedAt
            }
        };
    }
    async getDefaultPayoutSetting(req) {
        const setting = await this.creatorSettingsService.getDefaultPayoutSetting(req.user.userId);
        if (!setting) {
            return {
                message: 'No default payout setting found',
                setting: null
            };
        }
        return {
            message: 'Default payout setting retrieved successfully',
            setting: {
                id: setting.id,
                method: setting.method,
                isDefault: setting.isDefault,
                status: setting.status,
                bankName: setting.bankName,
                accountHolderName: setting.accountHolderName,
                paypalEmail: setting.paypalEmail,
                cryptoCurrency: setting.cryptoCurrency,
                country: setting.country,
                isActive: setting.isActive
            }
        };
    }
    async getVerifiedPayoutSettings(req) {
        const settings = await this.creatorSettingsService.getVerifiedPayoutSettings(req.user.userId);
        return {
            message: 'Verified payout settings retrieved successfully',
            settings: settings.map(setting => ({
                id: setting.id,
                method: setting.method,
                isDefault: setting.isDefault,
                status: setting.status,
                bankName: setting.bankName,
                accountHolderName: setting.accountHolderName,
                paypalEmail: setting.paypalEmail,
                cryptoCurrency: setting.cryptoCurrency,
                country: setting.country,
                verifiedAt: setting.verifiedAt,
                isActive: setting.isActive
            }))
        };
    }
};
exports.CreatorSettingsController = CreatorSettingsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CreatorSettingsController.prototype, "getCreatorSettings", null);
__decorate([
    (0, common_1.Put)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, creator_settings_dto_1.UpdateCreatorSettingsDto]),
    __metadata("design:returntype", Promise)
], CreatorSettingsController.prototype, "updateCreatorSettings", null);
__decorate([
    (0, common_1.Get)('payouts'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, creator_payout_settings_dto_1.PayoutSettingsQueryDto]),
    __metadata("design:returntype", Promise)
], CreatorSettingsController.prototype, "getPayoutSettings", null);
__decorate([
    (0, common_1.Get)('payouts/:payoutId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('payoutId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CreatorSettingsController.prototype, "getPayoutSettingById", null);
__decorate([
    (0, common_1.Post)('payouts'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, creator_payout_settings_dto_1.CreatePayoutSettingsDto]),
    __metadata("design:returntype", Promise)
], CreatorSettingsController.prototype, "createPayoutSetting", null);
__decorate([
    (0, common_1.Put)('payouts/:payoutId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('payoutId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, creator_payout_settings_dto_1.UpdatePayoutSettingsDto]),
    __metadata("design:returntype", Promise)
], CreatorSettingsController.prototype, "updatePayoutSetting", null);
__decorate([
    (0, common_1.Delete)('payouts/:payoutId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('payoutId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CreatorSettingsController.prototype, "deletePayoutSetting", null);
__decorate([
    (0, common_1.Put)('payouts/:payoutId/default'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('payoutId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CreatorSettingsController.prototype, "setDefaultPayoutSetting", null);
__decorate([
    (0, common_1.Get)('payouts/default'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CreatorSettingsController.prototype, "getDefaultPayoutSetting", null);
__decorate([
    (0, common_1.Get)('payouts/verified'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CreatorSettingsController.prototype, "getVerifiedPayoutSettings", null);
exports.CreatorSettingsController = CreatorSettingsController = __decorate([
    (0, common_1.Controller)('creator-settings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [creator_settings_service_1.CreatorSettingsService])
], CreatorSettingsController);
//# sourceMappingURL=creator-settings.controller.js.map