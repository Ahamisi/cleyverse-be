import { LinkType, LinkLayout, LinkStatus, LinkLockType, MediaType } from '../entities/link.entity';
import { SocialPlatform, SocialIconPosition } from '../entities/social-link.entity';
export declare class CreateLinkDto {
    title: string;
    url: string;
    type?: LinkType;
    layout?: LinkLayout;
    thumbnailUrl?: string;
    openInNewTab?: boolean;
    isFeatured?: boolean;
    displayOrder?: number;
    collectionId?: string;
}
export declare class UpdateLinkDto {
    title?: string;
    url?: string;
    layout?: LinkLayout;
    thumbnailUrl?: string;
    isActive?: boolean;
    openInNewTab?: boolean;
    isFeatured?: boolean;
    displayOrder?: number;
}
export declare class CreateSocialLinkDto {
    platform: SocialPlatform;
    username: string;
    url: string;
    iconPosition?: SocialIconPosition;
    displayOrder?: number;
}
export declare class UpdateSocialLinkDto {
    username?: string;
    url?: string;
    isActive?: boolean;
    iconPosition?: SocialIconPosition;
    displayOrder?: number;
}
export declare class ReorderLinksDto {
    linkIds: string[];
}
export declare class UpdateSocialIconSettingsDto {
    iconPosition: SocialIconPosition;
    activePlatforms?: string[];
}
export declare class ScheduleLinkDto {
    scheduledStartAt?: string;
    scheduledEndAt?: string;
    timezone?: string;
}
export declare class LockLinkDto {
    isLocked: boolean;
    lockType?: LinkLockType;
    lockCode?: string;
    lockDescription?: string;
}
export declare class UnlockLinkDto {
    code?: string;
    email?: string;
    birthDate?: string;
}
export declare class UpdateMediaDto {
    mediaType?: MediaType;
    thumbnailUrl?: string;
    previewData?: any;
}
export declare class CustomizeLinkDto {
    shortCode?: string;
    customDomain?: string;
}
export declare class ArchiveLinkDto {
    status: LinkStatus;
}
export declare class ShareLinkDto {
    platform?: string;
    message?: string;
}
