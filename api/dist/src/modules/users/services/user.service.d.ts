import { Repository } from 'typeorm';
import { BaseService } from '../../../common/base/base.service';
import { User, UserCategory, UserGoal } from '../entities/user.entity';
import { EmailVerification } from '../entities/email-verification.entity';
import { EmailService } from '../../../shared/services/email.service';
import { CreateUserDto, UpdatePersonalInfoDto, UpdateProfileDto, CompleteOnboardingDto } from '../dto/create-user.dto';
export declare class UserService extends BaseService<User> {
    private readonly userRepository;
    private readonly emailVerificationRepository;
    private readonly emailService;
    constructor(userRepository: Repository<User>, emailVerificationRepository: Repository<EmailVerification>, emailService: EmailService);
    protected getEntityName(): string;
    register(createUserDto: CreateUserDto): Promise<Omit<User, "password">>;
    updatePersonalInfo(userId: string, personalInfo: UpdatePersonalInfoDto): Promise<Omit<User, "password">>;
    updateUsername(userId: string, username: string): Promise<Omit<User, "password">>;
    updateGoal(userId: string, goal: UserGoal): Promise<Omit<User, "password">>;
    updateProfile(userId: string, profileData: UpdateProfileDto): Promise<Omit<User, "password">>;
    completeOnboarding(userId: string, finalData: CompleteOnboardingDto): Promise<Omit<User, "password">>;
    getOnboardingStatus(userId: string): Promise<{
        user: Omit<User, "password">;
        onboardingStep: number;
        hasCompletedOnboarding: boolean;
        isEmailVerified: boolean;
        nextSteps: string[];
    }>;
    checkUsernameAvailability(username: string): Promise<{
        available: boolean;
        username: string;
        message: string;
    }>;
    getCategories(): {
        value: UserCategory;
        label: string;
    }[];
    getGoals(): {
        value: UserGoal;
        label: string;
        description: string;
    }[];
    private createEmailVerification;
    private getNextSteps;
    private hashPassword;
    private formatCategoryLabel;
}
