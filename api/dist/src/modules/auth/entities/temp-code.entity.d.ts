import { User } from '../../users/entities/user.entity';
export declare enum TempCodeReason {
    NEW_DEVICE = "new_device",
    FORGOT_PASSWORD = "forgot_password",
    ONBOARDING = "onboarding"
}
export declare class TempCode {
    id: string;
    userId: string;
    user: User;
    code: string;
    reason: TempCodeReason;
    expiresAt: Date;
    isUsed: boolean;
    usedAt: Date | null;
    attempts: number;
    ipAddress: string | null;
    createdAt: Date;
}
