import { User } from './user.entity';
export declare enum NotificationPreference {
    EMAIL = "email",
    SMS = "sms",
    PUSH = "push",
    NONE = "none"
}
export declare enum PayoutFrequency {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    MANUAL = "manual"
}
export declare enum ThemePreference {
    LIGHT = "light",
    DARK = "dark",
    AUTO = "auto"
}
export declare enum LanguagePreference {
    EN = "en",
    ES = "es",
    FR = "fr",
    DE = "de",
    IT = "it",
    PT = "pt",
    ZH = "zh",
    JA = "ja",
    KO = "ko",
    AR = "ar"
}
export declare class CreatorSettings {
    id: string;
    userId: string;
    user: User;
    theme: ThemePreference;
    language: LanguagePreference;
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    marketingEmails: boolean;
    publicProfile: boolean;
    showEmail: boolean;
    showPhone: boolean;
    allowMessages: boolean;
    allowComments: boolean;
    payoutFrequency: PayoutFrequency;
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
    socialLinks: string;
    createdAt: Date;
    updatedAt: Date;
}
