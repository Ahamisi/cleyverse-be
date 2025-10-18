import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatorSettings } from '../entities/creator-settings.entity';
import { CreatorPayoutSettings, PayoutMethod, PayoutStatus } from '../entities/creator-payout-settings.entity';
import { CreateCreatorSettingsDto, UpdateCreatorSettingsDto } from '../dto/creator-settings.dto';
import { CreatePayoutSettingsDto, UpdatePayoutSettingsDto, PayoutSettingsQueryDto } from '../dto/creator-payout-settings.dto';

@Injectable()
export class CreatorSettingsService {
  constructor(
    @InjectRepository(CreatorSettings)
    private readonly creatorSettingsRepository: Repository<CreatorSettings>,
    @InjectRepository(CreatorPayoutSettings)
    private readonly payoutSettingsRepository: Repository<CreatorPayoutSettings>,
  ) {}

  // Creator Settings Methods
  async getCreatorSettings(userId: string): Promise<CreatorSettings> {
    let settings = await this.creatorSettingsRepository.findOne({
      where: { userId },
      relations: ['user']
    });

    if (!settings) {
      // Create default settings if they don't exist
      settings = await this.createDefaultSettings(userId);
    }

    return settings;
  }

  async updateCreatorSettings(userId: string, updateDto: UpdateCreatorSettingsDto): Promise<CreatorSettings> {
    let settings = await this.creatorSettingsRepository.findOne({
      where: { userId }
    });

    if (!settings) {
      settings = await this.createDefaultSettings(userId);
    }

    // Update settings
    Object.assign(settings, updateDto);
    
    return await this.creatorSettingsRepository.save(settings);
  }

  private async createDefaultSettings(userId: string): Promise<CreatorSettings> {
    const defaultSettings = this.creatorSettingsRepository.create({
      userId,
      // All other fields use entity defaults
    });

    return await this.creatorSettingsRepository.save(defaultSettings);
  }

  // Payout Settings Methods
  async getPayoutSettings(userId: string, query: PayoutSettingsQueryDto): Promise<{
    settings: CreatorPayoutSettings[];
    total: number;
  }> {
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

  async getPayoutSettingById(userId: string, payoutId: string): Promise<CreatorPayoutSettings> {
    const setting = await this.payoutSettingsRepository.findOne({
      where: { id: payoutId, userId }
    });

    if (!setting) {
      throw new NotFoundException('Payout setting not found');
    }

    return setting;
  }

  async createPayoutSetting(userId: string, createDto: CreatePayoutSettingsDto): Promise<CreatorPayoutSettings> {
    // Validate method-specific fields
    this.validatePayoutMethodFields(createDto.method, createDto);

    // If this is set as default, unset other defaults
    if (createDto.isDefault) {
      await this.unsetDefaultPayoutSettings(userId);
    }

    const payoutSetting = this.payoutSettingsRepository.create({
      userId,
      ...createDto
    });

    return await this.payoutSettingsRepository.save(payoutSetting);
  }

  async updatePayoutSetting(userId: string, payoutId: string, updateDto: UpdatePayoutSettingsDto): Promise<CreatorPayoutSettings> {
    const setting = await this.getPayoutSettingById(userId, payoutId);

    // If setting as default, unset other defaults
    if (updateDto.isDefault && !setting.isDefault) {
      await this.unsetDefaultPayoutSettings(userId);
    }

    Object.assign(setting, updateDto);
    
    return await this.payoutSettingsRepository.save(setting);
  }

  async deletePayoutSetting(userId: string, payoutId: string): Promise<void> {
    const setting = await this.getPayoutSettingById(userId, payoutId);

    if (setting.isDefault) {
      throw new BadRequestException('Cannot delete default payout setting');
    }

    await this.payoutSettingsRepository.remove(setting);
  }

  async setDefaultPayoutSetting(userId: string, payoutId: string): Promise<CreatorPayoutSettings> {
    const setting = await this.getPayoutSettingById(userId, payoutId);

    if (setting.status !== PayoutStatus.VERIFIED) {
      throw new BadRequestException('Only verified payout settings can be set as default');
    }

    // Unset other defaults
    await this.unsetDefaultPayoutSettings(userId);

    // Set this as default
    setting.isDefault = true;
    
    return await this.payoutSettingsRepository.save(setting);
  }

  async verifyPayoutSetting(userId: string, payoutId: string, verifiedBy: string, notes?: string): Promise<CreatorPayoutSettings> {
    const setting = await this.getPayoutSettingById(userId, payoutId);

    setting.status = PayoutStatus.VERIFIED;
    setting.verifiedAt = new Date();
    setting.verifiedBy = verifiedBy;
    if (notes) {
      setting.verificationNotes = notes;
    }

    return await this.payoutSettingsRepository.save(setting);
  }

  async rejectPayoutSetting(userId: string, payoutId: string, rejectedBy: string, notes: string): Promise<CreatorPayoutSettings> {
    const setting = await this.getPayoutSettingById(userId, payoutId);

    setting.status = PayoutStatus.REJECTED;
    setting.verifiedBy = rejectedBy;
    setting.verificationNotes = notes;

    return await this.payoutSettingsRepository.save(setting);
  }

  private async unsetDefaultPayoutSettings(userId: string): Promise<void> {
    await this.payoutSettingsRepository.update(
      { userId, isDefault: true },
      { isDefault: false }
    );
  }

  private validatePayoutMethodFields(method: PayoutMethod, data: CreatePayoutSettingsDto): void {
    switch (method) {
      case PayoutMethod.BANK_TRANSFER:
        if (!data.bankName || !data.accountNumber || !data.accountHolderName) {
          throw new BadRequestException('Bank name, account number, and account holder name are required for bank transfer');
        }
        break;

      case PayoutMethod.PAYPAL:
        if (!data.paypalEmail) {
          throw new BadRequestException('PayPal email is required for PayPal payouts');
        }
        break;

      case PayoutMethod.STRIPE_CONNECT:
        if (!data.stripeAccountId) {
          throw new BadRequestException('Stripe account ID is required for Stripe Connect');
        }
        break;

      case PayoutMethod.WISE:
        if (!data.wiseEmail) {
          throw new BadRequestException('Wise email is required for Wise payouts');
        }
        break;

      case PayoutMethod.CRYPTO:
        if (!data.cryptoCurrency || !data.cryptoAddress) {
          throw new BadRequestException('Cryptocurrency and address are required for crypto payouts');
        }
        break;

      default:
        throw new BadRequestException('Invalid payout method');
    }
  }

  // Utility Methods
  async getDefaultPayoutSetting(userId: string): Promise<CreatorPayoutSettings | null> {
    return await this.payoutSettingsRepository.findOne({
      where: { userId, isDefault: true, isActive: true }
    });
  }

  async getVerifiedPayoutSettings(userId: string): Promise<CreatorPayoutSettings[]> {
    return await this.payoutSettingsRepository.find({
      where: { userId, status: PayoutStatus.VERIFIED, isActive: true },
      order: { isDefault: 'DESC', createdAt: 'DESC' }
    });
  }
}
