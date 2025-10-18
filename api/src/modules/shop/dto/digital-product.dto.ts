import { 
  IsString, 
  IsEnum, 
  IsOptional, 
  IsNumber, 
  IsBoolean, 
  IsArray, 
  IsObject, 
  Min, 
  Max, 
  Length,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { DigitalProductType, AccessControlType } from '../entities/digital-product.entity';

export class CreateDigitalProductDto {
  @IsString()
  productId: string;

  @IsEnum(DigitalProductType)
  digitalType: DigitalProductType;

  @IsEnum(AccessControlType)
  accessControlType: AccessControlType;

  @IsOptional()
  @IsString()
  @Length(4, 50)
  accessPassword?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(8760) // Max 1 year
  accessDurationHours?: number;

  @IsNumber()
  @Min(1)
  @Max(100)
  maxDownloads: number;

  @IsNumber()
  @Min(1)
  @Max(10)
  maxConcurrentUsers: number;

  @IsBoolean()
  watermarkEnabled: boolean;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  watermarkText?: string;

  @IsBoolean()
  autoDeliver: boolean;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  deliveryEmailTemplate?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  deliverySubject?: string;

  @IsBoolean()
  ipRestriction: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedIps?: string[];

  @IsBoolean()
  deviceFingerprinting: boolean;

  @IsBoolean()
  preventScreenshots: boolean;

  @IsBoolean()
  preventPrinting: boolean;

  @IsBoolean()
  preventCopying: boolean;

  @IsString()
  @Length(1, 50)
  viewerType: string;

  @IsOptional()
  @IsObject()
  viewerConfig?: Record<string, any>;
}

export class UpdateDigitalProductDto {
  @IsOptional()
  @IsEnum(AccessControlType)
  accessControlType?: AccessControlType;

  @IsOptional()
  @IsString()
  @Length(4, 50)
  accessPassword?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(8760)
  accessDurationHours?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  maxDownloads?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  maxConcurrentUsers?: number;

  @IsOptional()
  @IsBoolean()
  watermarkEnabled?: boolean;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  watermarkText?: string;

  @IsOptional()
  @IsBoolean()
  autoDeliver?: boolean;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  deliveryEmailTemplate?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  deliverySubject?: string;

  @IsOptional()
  @IsBoolean()
  ipRestriction?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedIps?: string[];

  @IsOptional()
  @IsBoolean()
  deviceFingerprinting?: boolean;

  @IsOptional()
  @IsBoolean()
  preventScreenshots?: boolean;

  @IsOptional()
  @IsBoolean()
  preventPrinting?: boolean;

  @IsOptional()
  @IsBoolean()
  preventCopying?: boolean;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  viewerType?: string;

  @IsOptional()
  @IsObject()
  viewerConfig?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class AccessVerificationDto {
  @IsOptional()
  @IsString()
  @Length(4, 50)
  password?: string;

  @IsOptional()
  @IsString()
  @Length(32, 64)
  deviceFingerprint?: string;
}

export class DigitalProductQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsEnum(DigitalProductType)
  digitalType?: DigitalProductType;

  @IsOptional()
  @IsEnum(AccessControlType)
  accessControlType?: AccessControlType;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class AccessRecordQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  accessType?: string;

  @IsOptional()
  @IsString()
  customerEmail?: string;
}
