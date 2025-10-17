import { UserCategory, UserGoal } from '../entities/user.entity';
export declare class CreateUserDto {
    email: string;
    username: string;
    password?: string;
}
export declare class UpdatePersonalInfoDto {
    firstName?: string;
    lastName?: string;
    category?: UserCategory;
}
export declare class UpdateUsernameDto {
    username: string;
}
export declare class UpdateGoalDto {
    goal: UserGoal;
}
export declare class UpdateProfileDto {
    profileTitle?: string;
    bio?: string;
    profileImageUrl?: string;
    profileImageGradient?: string;
}
export declare class CompleteOnboardingDto {
    profileTitle?: string;
    bio?: string;
    profileImageUrl?: string;
    profileImageGradient?: string;
}
export declare class CheckUsernameDto {
    username: string;
}
export declare class SetupPasswordDto {
    password: string;
}
export declare class VerifyEmailAndSetupPasswordDto {
    token: string;
    password: string;
}
export declare class UpdatePasswordDto {
    currentPassword: string;
    newPassword: string;
}
