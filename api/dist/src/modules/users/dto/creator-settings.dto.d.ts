import { ThemePreference, LanguagePreference, PayoutFrequency } from '../entities/creator-settings.entity';
export declare class UpdateCreatorSettingsDto {
    theme?: ThemePreference;
    language?: LanguagePreference;
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    pushNotifications?: boolean;
    marketingEmails?: boolean;
    publicProfile?: boolean;
    showEmail?: boolean;
    showPhone?: boolean;
    allowMessages?: boolean;
    allowComments?: boolean;
    payoutFrequency?: PayoutFrequency;
    minimumPayoutThreshold?: number;
    autoPayout?: boolean;
    preferredCurrency?: string;
    taxCountry?: string;
    taxId?: string;
    businessName?: string;
    businessAddress?: string;
    businessCity?: string;
    businessState?: string;
    businessZipCode?: string;
    customSettings?: Record<string, any>;
    bio?: string;
    website?: string;
    socialLinks?: string;
}
export declare class CreateCreatorSettingsDto extends UpdateCreatorSettingsDto {
}
