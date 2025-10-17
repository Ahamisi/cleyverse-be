import { UserService, EmailVerificationService } from '../services';
import { CreateUserDto, UpdatePersonalInfoDto, UpdateGoalDto, CheckUsernameDto, UpdateUsernameDto, UpdateProfileDto, CompleteOnboardingDto, SetupPasswordDto, VerifyEmailAndSetupPasswordDto, UpdatePasswordDto } from '../dto/create-user.dto';
export declare class UsersController {
    private readonly userService;
    private readonly emailVerificationService;
    constructor(userService: UserService, emailVerificationService: EmailVerificationService);
    register(userData: CreateUserDto): Promise<Omit<import("../entities/user.entity").User, "password">>;
    verifyEmail(token: string): Promise<{
        message: string;
        verified: boolean;
    }>;
    resendVerification(body: {
        email: string;
    }): Promise<{
        message: string;
    }>;
    checkUsername(checkUsernameDto: CheckUsernameDto): Promise<{
        available: boolean;
        username: string;
        message: string;
    }>;
    getCategories(): Promise<{
        categories: {
            value: import("../entities/user.entity").UserCategory;
            label: string;
        }[];
    }>;
    getGoals(): Promise<{
        goals: {
            value: import("../entities/user.entity").UserGoal;
            label: string;
            description: string;
        }[];
    }>;
    getPublicProfile(username: string): Promise<{
        message: string;
        user: null;
        links: never[];
        socialLinks: never[];
        collections: never[];
        exists: boolean;
    } | {
        message: string;
        user: {
            category: string | null;
            goal: string | null;
            email: string;
            username: string;
            password: string;
            firstName: string;
            lastName: string;
            profileTitle: string;
            bio: string;
            profileImageUrl: string;
            profileImageGradient: string;
            hasCompletedOnboarding: boolean;
            onboardingStep: number;
            isEmailVerified: boolean;
            emailVerifiedAt: Date;
            links: any[];
            socialLinks: any[];
            collections: any[];
            forms: any[];
            stores: any[];
            events: any[];
            eventGuests: any[];
            eventHosts: any[];
            eventVendors: any[];
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
        links: import("../../links/entities/link.entity").Link[];
        socialLinks: import("../../links/entities/social-link.entity").SocialLink[];
        collections: import("../../collections/entities/collection.entity").Collection[];
        exists: boolean;
    }>;
    updatePersonalInfo(req: any, personalInfo: UpdatePersonalInfoDto): Promise<{
        message: string;
        user: Omit<import("../entities/user.entity").User, "password">;
        nextStep: string;
    }>;
    updateUsername(req: any, updateUsernameDto: UpdateUsernameDto): Promise<{
        message: string;
        user: Omit<import("../entities/user.entity").User, "password">;
        nextStep: string;
    }>;
    updateGoal(req: any, updateGoalDto: UpdateGoalDto): Promise<{
        message: string;
        user: Omit<import("../entities/user.entity").User, "password">;
        nextStep: string;
    }>;
    updateProfile(req: any, profileData: UpdateProfileDto): Promise<Omit<import("../entities/user.entity").User, "password">>;
    completeOnboarding(req: any, finalData: CompleteOnboardingDto): Promise<Omit<import("../entities/user.entity").User, "password">>;
    getOnboardingStatus(req: any): Promise<{
        user: Omit<import("../entities/user.entity").User, "password">;
        onboardingStep: number;
        hasCompletedOnboarding: boolean;
        isEmailVerified: boolean;
        nextSteps: string[];
    }>;
    getProfile(req: any): Promise<{
        user: Omit<import("../entities/user.entity").User, "password">;
        onboardingStep: number;
        hasCompletedOnboarding: boolean;
        isEmailVerified: boolean;
        nextSteps: string[];
    }>;
    setupPassword(req: any, setupPasswordDto: SetupPasswordDto): Promise<{
        message: string;
        user: {
            email: string;
            username: string;
            firstName: string;
            lastName: string;
            category: import("../entities/user.entity").UserCategory;
            goal: import("../entities/user.entity").UserGoal;
            profileTitle: string;
            bio: string;
            profileImageUrl: string;
            profileImageGradient: string;
            hasCompletedOnboarding: boolean;
            onboardingStep: number;
            isEmailVerified: boolean;
            emailVerifiedAt: Date;
            links: any[];
            socialLinks: any[];
            collections: any[];
            forms: any[];
            stores: any[];
            events: any[];
            eventGuests: any[];
            eventHosts: any[];
            eventVendors: any[];
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    verifyEmailAndSetupPassword(verifyAndSetupDto: VerifyEmailAndSetupPasswordDto): Promise<{
        message: string;
        user: {
            email: string;
            username: string;
            firstName: string;
            lastName: string;
            category: import("../entities/user.entity").UserCategory;
            goal: import("../entities/user.entity").UserGoal;
            profileTitle: string;
            bio: string;
            profileImageUrl: string;
            profileImageGradient: string;
            hasCompletedOnboarding: boolean;
            onboardingStep: number;
            isEmailVerified: boolean;
            emailVerifiedAt: Date;
            links: any[];
            socialLinks: any[];
            collections: any[];
            forms: any[];
            stores: any[];
            events: any[];
            eventGuests: any[];
            eventHosts: any[];
            eventVendors: any[];
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    updatePassword(req: any, updatePasswordDto: UpdatePasswordDto): Promise<{
        message: string;
        user: {
            email: string;
            username: string;
            firstName: string;
            lastName: string;
            category: import("../entities/user.entity").UserCategory;
            goal: import("../entities/user.entity").UserGoal;
            profileTitle: string;
            bio: string;
            profileImageUrl: string;
            profileImageGradient: string;
            hasCompletedOnboarding: boolean;
            onboardingStep: number;
            isEmailVerified: boolean;
            emailVerifiedAt: Date;
            links: any[];
            socialLinks: any[];
            collections: any[];
            forms: any[];
            stores: any[];
            events: any[];
            eventGuests: any[];
            eventHosts: any[];
            eventVendors: any[];
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
}
