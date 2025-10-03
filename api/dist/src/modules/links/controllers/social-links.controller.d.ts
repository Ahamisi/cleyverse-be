import { SocialLinkService } from '../services/social-link.service';
import { CreateSocialLinkDto, UpdateSocialLinkDto, UpdateSocialIconSettingsDto } from '../dto/link.dto';
import { SocialPlatform } from '../entities/social-link.entity';
export declare class SocialLinksController {
    private readonly socialLinkService;
    constructor(socialLinkService: SocialLinkService);
    createSocialLink(req: any, createSocialLinkDto: CreateSocialLinkDto): Promise<{
        message: string;
        socialLink: import("../entities/social-link.entity").SocialLink;
    }>;
    getUserSocialLinks(req: any, includeInactive?: string): Promise<{
        message: string;
        socialLinks: import("../entities/social-link.entity").SocialLink[];
        total: number;
    }>;
    getSupportedPlatforms(): Promise<{
        message: string;
        platforms: {
            value: SocialPlatform;
            label: string;
            urlPattern?: string;
        }[];
    }>;
    getSocialLinkAnalytics(req: any): Promise<{
        message: string;
        analytics: {
            socialLinks: import("../entities/social-link.entity").SocialLink[];
            totalSocialLinks: number;
            totalClicks: number;
            avgClicksPerLink: number;
            topPlatforms: {
                platform: SocialPlatform;
                username: string;
                clicks: number;
            }[];
        };
    }>;
    getSocialLinkByPlatform(req: any, platform: SocialPlatform): Promise<{
        message: string;
        socialLink: null;
    } | {
        message: string;
        socialLink: import("../entities/social-link.entity").SocialLink;
    }>;
    getSocialLinkById(req: any, id: string): Promise<{
        message: string;
        socialLink: import("../entities/social-link.entity").SocialLink;
    }>;
    updateSocialLink(req: any, id: string, updateSocialLinkDto: UpdateSocialLinkDto): Promise<{
        message: string;
        socialLink: import("../entities/social-link.entity").SocialLink;
    }>;
    deleteSocialLink(req: any, id: string): Promise<{
        message: string;
    }>;
    updateSocialIconSettings(req: any, settingsDto: UpdateSocialIconSettingsDto): Promise<{
        message: string;
        socialLinks: import("../entities/social-link.entity").SocialLink[];
    }>;
    reorderSocialLinks(req: any, body: {
        linkIds: string[];
    }): Promise<{
        message: string;
        socialLinks: import("../entities/social-link.entity").SocialLink[];
    }>;
    incrementClickCount(id: string): Promise<{
        message: string;
    }>;
}
