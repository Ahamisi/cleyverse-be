import { Repository } from 'typeorm';
import { BaseService } from '../../../common/base/base.service';
import { SocialLink, SocialPlatform } from '../entities/social-link.entity';
import { CreateSocialLinkDto, UpdateSocialLinkDto, UpdateSocialIconSettingsDto, TrackClickDto } from '../dto/link.dto';
export declare class SocialLinkService extends BaseService<SocialLink> {
    private readonly socialLinkRepository;
    constructor(socialLinkRepository: Repository<SocialLink>);
    protected getEntityName(): string;
    createSocialLink(userId: string, createSocialLinkDto: CreateSocialLinkDto): Promise<SocialLink>;
    getUserSocialLinks(userId: string, includeInactive?: boolean): Promise<SocialLink[]>;
    updateSocialLink(userId: string, socialLinkId: string, updateSocialLinkDto: UpdateSocialLinkDto): Promise<SocialLink>;
    deleteSocialLink(userId: string, socialLinkId: string): Promise<void>;
    updateSocialIconSettings(userId: string, settingsDto: UpdateSocialIconSettingsDto): Promise<SocialLink[]>;
    trackClick(socialLinkId: string, trackClickDto: TrackClickDto): Promise<string>;
    incrementClickCount(socialLinkId: string): Promise<void>;
    getSocialLinkByPlatform(userId: string, platform: SocialPlatform): Promise<SocialLink | null>;
    reorderSocialLinks(userId: string, linkIds: string[]): Promise<SocialLink[]>;
    getSocialLinkAnalytics(userId: string): Promise<{
        socialLinks: SocialLink[];
        totalSocialLinks: number;
        totalClicks: number;
        avgClicksPerLink: number;
        topPlatforms: {
            platform: SocialPlatform;
            username: string;
            clicks: number;
        }[];
    }>;
    getSupportedPlatforms(): {
        value: SocialPlatform;
        label: string;
        urlPattern?: string;
    }[];
    private reorderSocialLinksAfterDeletion;
}
