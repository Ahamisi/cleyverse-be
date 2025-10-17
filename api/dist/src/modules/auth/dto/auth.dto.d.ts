import { TempCodeReason } from '../entities/temp-code.entity';
export declare class CheckUserDto {
    email: string;
    deviceFingerprint?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
    deviceFingerprint?: string;
}
export declare class SendTempCodeDto {
    email: string;
    reason: TempCodeReason;
}
export declare class VerifyTempCodeDto {
    email: string;
    code: string;
    deviceFingerprint?: string;
}
export declare class ResendTempCodeDto {
    email: string;
}
