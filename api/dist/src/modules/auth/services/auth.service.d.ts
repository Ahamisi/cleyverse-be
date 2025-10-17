import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TempCode, TempCodeReason } from '../entities/temp-code.entity';
import { TrustedDevice } from '../entities/trusted-device.entity';
import { EmailService } from '../../../shared/services/email.service';
export declare class AuthService {
    private readonly usersRepository;
    private readonly tempCodeRepository;
    private readonly trustedDeviceRepository;
    private readonly jwtService;
    private readonly emailService;
    constructor(usersRepository: Repository<User>, tempCodeRepository: Repository<TempCode>, trustedDeviceRepository: Repository<TrustedDevice>, jwtService: JwtService, emailService: EmailService);
    validateUser(email: string, password: string): Promise<any>;
    login(email: string, password: string, deviceFingerprint?: string): Promise<{
        access_token: string;
        user: any;
        expires_in: string;
        message: string;
    }>;
    checkUser(email: string, deviceFingerprint?: string): Promise<{
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
    sendTempCode(email: string, reason: TempCodeReason): Promise<{
        message: string;
        expires_in: string;
        codeLength: number;
    }>;
    verifyTempCode(email: string, code: string, deviceFingerprint?: string): Promise<{
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
    resendTempCode(email: string): Promise<{
        message: string;
        expires_in: string;
        codeLength: number;
    }>;
    private updateTrustedDevice;
    cleanupExpiredCodes(): Promise<void>;
    hashPassword(password: string): Promise<string>;
}
