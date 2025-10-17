import { IsString, IsEnum, IsOptional, IsUrl, IsBoolean, IsInt, Min, MaxLength, IsDateString, IsObject, IsUUID, IsArray } from 'class-validator';
import { LinkType, LinkLayout, LinkStatus, LinkLockType, MediaType } from '../entities/link.entity';
import { SocialPlatform, SocialIconPosition } from '../entities/social-link.entity';

// Click Tracking DTOs
export class TrackClickDto {
  @IsString()
  @IsOptional()
  userAgent?: string;

  @IsString()
  @IsOptional()
  ipAddress?: string;

  @IsString()
  @IsOptional()
  referrer?: string;
}

export class CreateLinkDto {
  @IsString()
  @MaxLength(100)
  title: string;

  @IsUrl()
  url: string;

  @IsEnum(LinkType)
  @IsOptional()
  type?: LinkType;

  @IsEnum(LinkLayout)
  @IsOptional()
  layout?: LinkLayout;

  @IsUrl()
  @IsOptional()
  thumbnailUrl?: string;

  @IsBoolean()
  @IsOptional()
  openInNewTab?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsInt()
  @Min(0)
  @IsOptional()
  displayOrder?: number;

  // 🆕 Collection support
  @IsOptional()
  @IsUUID()
  collectionId?: string;
}

export class UpdateLinkDto {
  @IsString()
  @MaxLength(100)
  @IsOptional()
  title?: string;

  @IsUrl()
  @IsOptional()
  url?: string;

  @IsEnum(LinkLayout)
  @IsOptional()
  layout?: LinkLayout;

  @IsUrl()
  @IsOptional()
  thumbnailUrl?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  openInNewTab?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsInt()
  @Min(0)
  @IsOptional()
  displayOrder?: number;
}

export class CreateSocialLinkDto {
  @IsEnum(SocialPlatform)
  platform: SocialPlatform;

  @IsString()
  @MaxLength(50)
  username: string;

  @IsUrl()
  url: string;

  @IsEnum(SocialIconPosition)
  @IsOptional()
  iconPosition?: SocialIconPosition;

  @IsInt()
  @Min(0)
  @IsOptional()
  displayOrder?: number;
}

export class UpdateSocialLinkDto {
  @IsString()
  @MaxLength(50)
  @IsOptional()
  username?: string;

  @IsUrl()
  @IsOptional()
  url?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsEnum(SocialIconPosition)
  @IsOptional()
  iconPosition?: SocialIconPosition;

  @IsInt()
  @Min(0)
  @IsOptional()
  displayOrder?: number;
}

export class ReorderLinksDto {
  @IsArray()
  @IsString({ each: true })
  linkIds: string[];
}

export class UpdateSocialIconSettingsDto {
  @IsEnum(SocialIconPosition)
  iconPosition: SocialIconPosition;

  @IsString({ each: true })
  @IsOptional()
  activePlatforms?: string[];
}

// 🆕 ADVANCED LINK FEATURES DTOs

// --- Scheduling DTOs ---
export class ScheduleLinkDto {
  @IsOptional()
  @IsDateString()
  scheduledStartAt?: string;

  @IsOptional()
  @IsDateString()
  scheduledEndAt?: string;

  @IsOptional()
  @IsString()
  timezone?: string;
}

// --- Locking DTOs ---
export class LockLinkDto {
  @IsBoolean()
  isLocked: boolean;

  @IsOptional()
  @IsEnum(LinkLockType)
  lockType?: LinkLockType;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  lockCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  lockDescription?: string;
}

export class UnlockLinkDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  email?: string; // For subscription unlock

  @IsOptional()
  @IsString()
  birthDate?: string; // For age verification
}

// --- Media DTOs ---
export class UpdateMediaDto {
  @IsOptional()
  @IsEnum(MediaType)
  mediaType?: MediaType;

  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @IsOptional()
  @IsObject()
  previewData?: any;
}

// --- Customization DTOs ---
export class CustomizeLinkDto {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  shortCode?: string;

  @IsOptional()
  @IsString()
  customDomain?: string;
}

// --- Archive/Restore DTOs ---
export class ArchiveLinkDto {
  @IsEnum(LinkStatus)
  status: LinkStatus;
}

// --- Sharing DTOs ---
export class ShareLinkDto {
  @IsOptional()
  @IsString()
  platform?: string; // 'instagram' | 'twitter' | 'facebook' etc.

  @IsOptional()
  @IsString()
  message?: string;
}
