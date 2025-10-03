import { BaseEntity } from '../../../common/base/base.entity';
export declare enum UserCategory {
    BUSINESS = "business",
    CREATIVE = "creative",
    EDUCATION = "education",
    ENTERTAINMENT = "entertainment",
    FASHION_BEAUTY = "fashion_beauty",
    FOOD_BEVERAGE = "food_beverage",
    GOVERNMENT_POLITICS = "government_politics",
    HEALTH_WELLNESS = "health_wellness",
    NON_PROFIT = "non_profit",
    OTHER = "other",
    TECH = "tech",
    TRAVEL_TOURISM = "travel_tourism"
}
export declare enum UserGoal {
    CREATOR = "creator",
    BUSINESS = "business",
    PERSONAL = "personal"
}
export declare class User extends BaseEntity {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    category: UserCategory;
    goal: UserGoal;
    profileTitle: string;
    bio: string;
    profileImageUrl: string;
    hasCompletedOnboarding: boolean;
    onboardingStep: number;
    isEmailVerified: boolean;
    emailVerifiedAt: Date;
    links: any[];
    socialLinks: any[];
    collections: any[];
    forms: any[];
}
