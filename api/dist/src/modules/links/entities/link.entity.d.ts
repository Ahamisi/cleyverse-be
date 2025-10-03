import { BaseEntity } from '../../../common/base/base.entity';
import { User } from '../../users/entities/user.entity';
export declare enum LinkType {
    REGULAR = "regular",
    SOCIAL = "social",
    EMAIL = "email",
    PHONE = "phone"
}
export declare enum LinkLayout {
    CLASSIC = "classic",
    FEATURED = "featured"
}
export declare enum LinkStatus {
    ACTIVE = "active",
    ARCHIVED = "archived",
    DELETED = "deleted"
}
export declare enum LinkLockType {
    SUBSCRIPTION = "subscription",
    CODE = "code",
    AGE = "age",
    SENSITIVE = "sensitive",
    NFT = "nft"
}
export declare enum MediaType {
    VIDEO = "video",
    MUSIC = "music",
    IMAGE = "image",
    DOCUMENT = "document"
}
export declare class Link extends BaseEntity {
    userId: string;
    user: User;
    collectionId: string | null;
    title: string;
    url: string;
    type: LinkType;
    layout: LinkLayout;
    thumbnailUrl: string;
    isActive: boolean;
    clickCount: number;
    displayOrder: number;
    openInNewTab: boolean;
    isFeatured: boolean;
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
