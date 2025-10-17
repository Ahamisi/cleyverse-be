import { IsEmail, IsString, IsOptional, IsEnum, MinLength, MaxLength } from 'class-validator';
import { TempCodeReason } from '../entities/temp-code.entity';

export class CheckUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  deviceFingerprint?: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  deviceFingerprint?: string;
}

export class SendTempCodeDto {
  @IsEmail()
  email: string;

  @IsEnum(TempCodeReason)
  reason: TempCodeReason;
}

export class VerifyTempCodeDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(6)
  code: string;

  @IsOptional()
  @IsString()
  deviceFingerprint?: string;
}

export class ResendTempCodeDto {
  @IsEmail()
  email: string;
}

