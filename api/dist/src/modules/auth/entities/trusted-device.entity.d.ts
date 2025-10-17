import { User } from '../../users/entities/user.entity';
export declare class TrustedDevice {
    id: string;
    userId: string;
    user: User;
    deviceFingerprint: string;
    deviceName: string | null;
    deviceType: string | null;
    browser: string | null;
    os: string | null;
    ipAddress: string | null;
    lastUsedAt: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
