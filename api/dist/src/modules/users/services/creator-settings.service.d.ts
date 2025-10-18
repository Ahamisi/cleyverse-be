import { Repository } from 'typeorm';
import { CreatorSettings } from '../entities/creator-settings.entity';
import { CreatorPayoutSettings } from '../entities/creator-payout-settings.entity';
import { UpdateCreatorSettingsDto } from '../dto/creator-settings.dto';
import { CreatePayoutSettingsDto, UpdatePayoutSettingsDto, PayoutSettingsQueryDto } from '../dto/creator-payout-settings.dto';
export declare class CreatorSettingsService {
    private readonly creatorSettingsRepository;
    private readonly payoutSettingsRepository;
    constructor(creatorSettingsRepository: Repository<CreatorSettings>, payoutSettingsRepository: Repository<CreatorPayoutSettings>);
    getCreatorSettings(userId: string): Promise<CreatorSettings>;
    updateCreatorSettings(userId: string, updateDto: UpdateCreatorSettingsDto): Promise<CreatorSettings>;
    private createDefaultSettings;
    getPayoutSettings(userId: string, query: PayoutSettingsQueryDto): Promise<{
        settings: CreatorPayoutSettings[];
        total: number;
    }>;
    getPayoutSettingById(userId: string, payoutId: string): Promise<CreatorPayoutSettings>;
    createPayoutSetting(userId: string, createDto: CreatePayoutSettingsDto): Promise<CreatorPayoutSettings>;
    updatePayoutSetting(userId: string, payoutId: string, updateDto: UpdatePayoutSettingsDto): Promise<CreatorPayoutSettings>;
    deletePayoutSetting(userId: string, payoutId: string): Promise<void>;
    setDefaultPayoutSetting(userId: string, payoutId: string): Promise<CreatorPayoutSettings>;
    verifyPayoutSetting(userId: string, payoutId: string, verifiedBy: string, notes?: string): Promise<CreatorPayoutSettings>;
    rejectPayoutSetting(userId: string, payoutId: string, rejectedBy: string, notes: string): Promise<CreatorPayoutSettings>;
    private unsetDefaultPayoutSettings;
    private validatePayoutMethodFields;
    getDefaultPayoutSetting(userId: string): Promise<CreatorPayoutSettings | null>;
    getVerifiedPayoutSettings(userId: string): Promise<CreatorPayoutSettings[]>;
}
