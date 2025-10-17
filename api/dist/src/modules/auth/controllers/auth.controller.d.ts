import { AuthService } from '../services/auth.service';
import { CheckUserDto, LoginDto, SendTempCodeDto, VerifyTempCodeDto, ResendTempCodeDto } from '../dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    checkUser(checkUserDto: CheckUserDto): Promise<{
        hasPassword: boolean;
        isKnownDevice: boolean;
        requiresTempCode: boolean;
        canUsePassword: boolean;
        user: {
            id: string;
            email: string;
            username: string;
            hasCompletedOnboarding: boolean;
            onboardingStep: number;
        };
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: any;
        expires_in: string;
        message: string;
    }>;
    sendTempCode(sendTempCodeDto: SendTempCodeDto): Promise<{
        message: string;
        expires_in: string;
        codeLength: number;
    }>;
    verifyTempCode(verifyTempCodeDto: VerifyTempCodeDto): Promise<{
        access_token: string;
        user: {
            email: string;
            username: string;
            firstName: string;
            lastName: string;
            category: import("../../users/entities/user.entity").UserCategory;
            goal: import("../../users/entities/user.entity").UserGoal;
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
        expires_in: string;
        message: string;
    }>;
    resendTempCode(resendTempCodeDto: ResendTempCodeDto): Promise<{
        message: string;
        expires_in: string;
        codeLength: number;
    }>;
}
