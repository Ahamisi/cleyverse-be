import { CreatorSettingsService } from '../services/creator-settings.service';
import { UpdateCreatorSettingsDto } from '../dto/creator-settings.dto';
import { CreatePayoutSettingsDto, UpdatePayoutSettingsDto, PayoutSettingsQueryDto } from '../dto/creator-payout-settings.dto';
export declare class CreatorSettingsController {
    private readonly creatorSettingsService;
    constructor(creatorSettingsService: CreatorSettingsService);
    getCreatorSettings(req: any): Promise<{
        message: string;
        settings: {
            id: string;
            theme: import("../entities/creator-settings.entity").ThemePreference;
            language: import("../entities/creator-settings.entity").LanguagePreference;
            emailNotifications: boolean;
            smsNotifications: boolean;
            pushNotifications: boolean;
            marketingEmails: boolean;
            publicProfile: boolean;
            showEmail: boolean;
            showPhone: boolean;
            allowMessages: boolean;
            allowComments: boolean;
            payoutFrequency: import("../entities/creator-settings.entity").PayoutFrequency;
            minimumPayoutThreshold: number;
            autoPayout: boolean;
            preferredCurrency: string;
            taxCountry: string;
            taxId: string;
            businessName: string;
            businessAddress: string;
            businessCity: string;
            businessState: string;
            businessZipCode: string;
            customSettings: Record<string, any>;
            bio: string;
            website: string;
            socialLinks: any;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    updateCreatorSettings(req: any, updateDto: UpdateCreatorSettingsDto): Promise<{
        message: string;
        settings: {
            id: string;
            theme: import("../entities/creator-settings.entity").ThemePreference;
            language: import("../entities/creator-settings.entity").LanguagePreference;
            emailNotifications: boolean;
            smsNotifications: boolean;
            pushNotifications: boolean;
            marketingEmails: boolean;
            publicProfile: boolean;
            showEmail: boolean;
            showPhone: boolean;
            allowMessages: boolean;
            allowComments: boolean;
            payoutFrequency: import("../entities/creator-settings.entity").PayoutFrequency;
            minimumPayoutThreshold: number;
            autoPayout: boolean;
            preferredCurrency: string;
            taxCountry: string;
            taxId: string;
            businessName: string;
            businessAddress: string;
            businessCity: string;
            businessState: string;
            businessZipCode: string;
            customSettings: Record<string, any>;
            bio: string;
            website: string;
            socialLinks: any;
            updatedAt: Date;
        };
    }>;
    getPayoutSettings(req: any, query: PayoutSettingsQueryDto): Promise<{
        message: string;
        settings: {
            id: string;
            method: import("../entities/creator-payout-settings.entity").PayoutMethod;
            isDefault: boolean;
            status: import("../entities/creator-payout-settings.entity").PayoutStatus;
            bankName: string;
            accountHolderName: string;
            paypalEmail: string;
            cryptoCurrency: string;
            country: string;
            verifiedAt: Date;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getPayoutSettingById(req: any, payoutId: string): Promise<{
        message: string;
        setting: {
            id: string;
            method: import("../entities/creator-payout-settings.entity").PayoutMethod;
            isDefault: boolean;
            status: import("../entities/creator-payout-settings.entity").PayoutStatus;
            bankName: string;
            accountNumber: string;
            routingNumber: string;
            swiftCode: string;
            iban: string;
            accountType: import("../entities/creator-payout-settings.entity").BankAccountType;
            accountHolderName: string;
            country: string;
            address: string;
            city: string;
            state: string;
            zipCode: string;
            paypalEmail: string;
            paypalMerchantId: string;
            stripeAccountId: string;
            stripeConnectId: string;
            wiseAccountId: string;
            wiseEmail: string;
            cryptoCurrency: string;
            cryptoAddress: string;
            cryptoNetwork: string;
            verificationDocument: string;
            verifiedAt: Date;
            verificationNotes: string;
            verifiedBy: string;
            metadata: Record<string, any>;
            externalId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    createPayoutSetting(req: any, createDto: CreatePayoutSettingsDto): Promise<{
        message: string;
        setting: {
            id: string;
            method: import("../entities/creator-payout-settings.entity").PayoutMethod;
            isDefault: boolean;
            status: import("../entities/creator-payout-settings.entity").PayoutStatus;
            bankName: string;
            accountHolderName: string;
            paypalEmail: string;
            cryptoCurrency: string;
            country: string;
            isActive: boolean;
            createdAt: Date;
        };
    }>;
    updatePayoutSetting(req: any, payoutId: string, updateDto: UpdatePayoutSettingsDto): Promise<{
        message: string;
        setting: {
            id: string;
            method: import("../entities/creator-payout-settings.entity").PayoutMethod;
            isDefault: boolean;
            status: import("../entities/creator-payout-settings.entity").PayoutStatus;
            bankName: string;
            accountHolderName: string;
            paypalEmail: string;
            cryptoCurrency: string;
            country: string;
            isActive: boolean;
            updatedAt: Date;
        };
    }>;
    deletePayoutSetting(req: any, payoutId: string): Promise<{
        message: string;
    }>;
    setDefaultPayoutSetting(req: any, payoutId: string): Promise<{
        message: string;
        setting: {
            id: string;
            method: import("../entities/creator-payout-settings.entity").PayoutMethod;
            isDefault: boolean;
            status: import("../entities/creator-payout-settings.entity").PayoutStatus;
            updatedAt: Date;
        };
    }>;
    getDefaultPayoutSetting(req: any): Promise<{
        message: string;
        setting: null;
    } | {
        message: string;
        setting: {
            id: string;
            method: import("../entities/creator-payout-settings.entity").PayoutMethod;
            isDefault: boolean;
            status: import("../entities/creator-payout-settings.entity").PayoutStatus;
            bankName: string;
            accountHolderName: string;
            paypalEmail: string;
            cryptoCurrency: string;
            country: string;
            isActive: boolean;
        };
    }>;
    getVerifiedPayoutSettings(req: any): Promise<{
        message: string;
        settings: {
            id: string;
            method: import("../entities/creator-payout-settings.entity").PayoutMethod;
            isDefault: boolean;
            status: import("../entities/creator-payout-settings.entity").PayoutStatus;
            bankName: string;
            accountHolderName: string;
            paypalEmail: string;
            cryptoCurrency: string;
            country: string;
            verifiedAt: Date;
            isActive: boolean;
        }[];
    }>;
}
