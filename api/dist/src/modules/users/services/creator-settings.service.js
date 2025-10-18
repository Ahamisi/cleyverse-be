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
exports.CreatorSettingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const creator_settings_entity_1 = require("../entities/creator-settings.entity");
const creator_payout_settings_entity_1 = require("../entities/creator-payout-settings.entity");
let CreatorSettingsService = class CreatorSettingsService {
    creatorSettingsRepository;
    payoutSettingsRepository;
    constructor(creatorSettingsRepository, payoutSettingsRepository) {
        this.creatorSettingsRepository = creatorSettingsRepository;
        this.payoutSettingsRepository = payoutSettingsRepository;
    }
    async getCreatorSettings(userId) {
        let settings = await this.creatorSettingsRepository.findOne({
            where: { userId },
            relations: ['user']
        });
        if (!settings) {
            settings = await this.createDefaultSettings(userId);
        }
        return settings;
    }
    async updateCreatorSettings(userId, updateDto) {
        let settings = await this.creatorSettingsRepository.findOne({
            where: { userId }
        });
        if (!settings) {
            settings = await this.createDefaultSettings(userId);
        }
        Object.assign(settings, updateDto);
        return await this.creatorSettingsRepository.save(settings);
    }
    async createDefaultSettings(userId) {
        const defaultSettings = this.creatorSettingsRepository.create({
            userId,
        });
        return await this.creatorSettingsRepository.save(defaultSettings);
    }
    async getPayoutSettings(userId, query) {
        const queryBuilder = this.payoutSettingsRepository
            .createQueryBuilder('payout')
            .where('payout.userId = :userId', { userId });
        if (query.method) {
            queryBuilder.andWhere('payout.method = :method', { method: query.method });
        }
        if (query.status) {
            queryBuilder.andWhere('payout.status = :status', { status: query.status });
        }
        if (query.isActive !== undefined) {
            queryBuilder.andWhere('payout.isActive = :isActive', { isActive: query.isActive });
        }
        const page = query.page || 1;
        const limit = query.limit || 20;
        const offset = (page - 1) * limit;
        queryBuilder
            .orderBy('payout.isDefault', 'DESC')
            .addOrderBy('payout.createdAt', 'DESC')
            .skip(offset)
            .take(limit);
        const [settings, total] = await queryBuilder.getManyAndCount();
        return { settings, total };
    }
    async getPayoutSettingById(userId, payoutId) {
        const setting = await this.payoutSettingsRepository.findOne({
            where: { id: payoutId, userId }
        });
        if (!setting) {
            throw new common_1.NotFoundException('Payout setting not found');
        }
        return setting;
    }
    async createPayoutSetting(userId, createDto) {
        this.validatePayoutMethodFields(createDto.method, createDto);
        if (createDto.isDefault) {
            await this.unsetDefaultPayoutSettings(userId);
        }
        const payoutSetting = this.payoutSettingsRepository.create({
            userId,
            ...createDto
        });
        return await this.payoutSettingsRepository.save(payoutSetting);
    }
    async updatePayoutSetting(userId, payoutId, updateDto) {
        const setting = await this.getPayoutSettingById(userId, payoutId);
        if (updateDto.isDefault && !setting.isDefault) {
            await this.unsetDefaultPayoutSettings(userId);
        }
        Object.assign(setting, updateDto);
        return await this.payoutSettingsRepository.save(setting);
    }
    async deletePayoutSetting(userId, payoutId) {
        const setting = await this.getPayoutSettingById(userId, payoutId);
        if (setting.isDefault) {
            throw new common_1.BadRequestException('Cannot delete default payout setting');
        }
        await this.payoutSettingsRepository.remove(setting);
    }
    async setDefaultPayoutSetting(userId, payoutId) {
        const setting = await this.getPayoutSettingById(userId, payoutId);
        if (setting.status !== creator_payout_settings_entity_1.PayoutStatus.VERIFIED) {
            throw new common_1.BadRequestException('Only verified payout settings can be set as default');
        }
        await this.unsetDefaultPayoutSettings(userId);
        setting.isDefault = true;
        return await this.payoutSettingsRepository.save(setting);
    }
    async verifyPayoutSetting(userId, payoutId, verifiedBy, notes) {
        const setting = await this.getPayoutSettingById(userId, payoutId);
        setting.status = creator_payout_settings_entity_1.PayoutStatus.VERIFIED;
        setting.verifiedAt = new Date();
        setting.verifiedBy = verifiedBy;
        if (notes) {
            setting.verificationNotes = notes;
        }
        return await this.payoutSettingsRepository.save(setting);
    }
    async rejectPayoutSetting(userId, payoutId, rejectedBy, notes) {
        const setting = await this.getPayoutSettingById(userId, payoutId);
        setting.status = creator_payout_settings_entity_1.PayoutStatus.REJECTED;
        setting.verifiedBy = rejectedBy;
        setting.verificationNotes = notes;
        return await this.payoutSettingsRepository.save(setting);
    }
    async unsetDefaultPayoutSettings(userId) {
        await this.payoutSettingsRepository.update({ userId, isDefault: true }, { isDefault: false });
    }
    validatePayoutMethodFields(method, data) {
        switch (method) {
            case creator_payout_settings_entity_1.PayoutMethod.BANK_TRANSFER:
                if (!data.bankName || !data.accountNumber || !data.accountHolderName) {
                    throw new common_1.BadRequestException('Bank name, account number, and account holder name are required for bank transfer');
                }
                break;
            case creator_payout_settings_entity_1.PayoutMethod.PAYPAL:
                if (!data.paypalEmail) {
                    throw new common_1.BadRequestException('PayPal email is required for PayPal payouts');
                }
                break;
            case creator_payout_settings_entity_1.PayoutMethod.STRIPE_CONNECT:
                if (!data.stripeAccountId) {
                    throw new common_1.BadRequestException('Stripe account ID is required for Stripe Connect');
                }
                break;
            case creator_payout_settings_entity_1.PayoutMethod.WISE:
                if (!data.wiseEmail) {
                    throw new common_1.BadRequestException('Wise email is required for Wise payouts');
                }
                break;
            case creator_payout_settings_entity_1.PayoutMethod.CRYPTO:
                if (!data.cryptoCurrency || !data.cryptoAddress) {
                    throw new common_1.BadRequestException('Cryptocurrency and address are required for crypto payouts');
                }
                break;
            default:
                throw new common_1.BadRequestException('Invalid payout method');
        }
    }
    async getDefaultPayoutSetting(userId) {
        return await this.payoutSettingsRepository.findOne({
            where: { userId, isDefault: true, isActive: true }
        });
    }
    async getVerifiedPayoutSettings(userId) {
        return await this.payoutSettingsRepository.find({
            where: { userId, status: creator_payout_settings_entity_1.PayoutStatus.VERIFIED, isActive: true },
            order: { isDefault: 'DESC', createdAt: 'DESC' }
        });
    }
};
exports.CreatorSettingsService = CreatorSettingsService;
exports.CreatorSettingsService = CreatorSettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(creator_settings_entity_1.CreatorSettings)),
    __param(1, (0, typeorm_1.InjectRepository)(creator_payout_settings_entity_1.CreatorPayoutSettings)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CreatorSettingsService);
//# sourceMappingURL=creator-settings.service.js.map