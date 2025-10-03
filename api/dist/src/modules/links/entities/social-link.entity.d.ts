import { BaseEntity } from '../../../common/base/base.entity';
import { User } from '../../users/entities/user.entity';
import { LinkStatus, LinkLockType, MediaType } from './link.entity';
export declare enum SocialPlatform {
    INSTAGRAM = "instagram",
    YOUTUBE = "youtube",
    TIKTOK = "tiktok",
    TWITTER = "twitter",
    FACEBOOK = "facebook",
    LINKEDIN = "linkedin",
    PINTEREST = "pinterest",
    SNAPCHAT = "snapchat",
    SPOTIFY = "spotify",
    APPLE_MUSIC = "apple_music",
    SOUNDCLOUD = "soundcloud",
    TWITCH = "twitch",
    THREADS = "threads",
    WHATSAPP = "whatsapp",
    EMAIL = "email"
}
export declare enum SocialIconPosition {
    TOP = "top",
    BOTTOM = "bottom"
}
export declare class SocialLink extends BaseEntity {
    userId: string;
    user: User;
    platform: SocialPlatform;
    username: string;
    url: string;
    isActive: boolean;
    displayOrder: number;
    iconPosition: SocialIconPosition;
    clickCount: number;
    lastClickedAt: Date;
    scheduledStartAt: Date;
    scheduledEndAt: Date;
    timezone: string;
    isLocked: boolean;
    lockType: LinkLockType;
    lockCode: string;
    lockDescription: string;
    shortCode: string;
    customDomain: string;
    shareableShortUrl: string;
    socialShareCount: number;
    mediaType: MediaType;
    previewData: any;
    status: LinkStatus;
    archivedAt: Date;
}
