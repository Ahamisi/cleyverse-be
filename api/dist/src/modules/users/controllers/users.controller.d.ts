import { UserService, EmailVerificationService } from '../services';
import { CreateUserDto, UpdatePersonalInfoDto, UpdateGoalDto, CheckUsernameDto, UpdateUsernameDto, UpdateProfileDto, CompleteOnboardingDto } from '../dto/create-user.dto';
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
}
