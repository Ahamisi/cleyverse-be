import { LinkService } from '../services/link.service';
import { CreateLinkDto, UpdateLinkDto, ReorderLinksDto, ScheduleLinkDto, LockLinkDto, UnlockLinkDto, UpdateMediaDto, CustomizeLinkDto, ShareLinkDto, TrackClickDto } from '../dto/link.dto';
import { LinkType } from '../entities/link.entity';
import { MediaProcessorService } from '../../../shared/services/media-processor.service';
export declare class LinksController {
    private readonly linkService;
    private readonly mediaProcessorService;
    constructor(linkService: LinkService, mediaProcessorService: MediaProcessorService);
    createLink(req: any, createLinkDto: CreateLinkDto): Promise<{
        message: string;
        link: import("../entities/link.entity").Link;
    }>;
    previewUrl(body: {
        url: string;
    }): Promise<{
        message: string;
        metadata: import("../../../shared/services/media-processor.service").MediaMetadata;
        suggestions: {
            title: string;
            mediaType: string | null;
            thumbnailUrl: string | undefined;
            previewData: {
                platform: string;
                streamingServices: import("../../../shared/services/media-processor.service").StreamingService[] | undefined;
                videoOptions?: undefined;
            } | {
                platform: string;
                videoOptions: import("../../../shared/services/media-processor.service").VideoDisplayOptions | undefined;
                streamingServices?: undefined;
            } | null;
        };
    }>;
    getUserLinks(req: any, includeInactive?: string, type?: LinkType): Promise<{
        message: string;
        links: any;
        total: any;
    }>;
    getFeaturedLinks(req: any): Promise<{
        message: string;
        links: import("../entities/link.entity").Link[];
        total: number;
    }>;
    getSupportedPlatforms(category?: string, search?: string): Promise<{
        message: string;
        platforms: Record<string, any[]>;
        total: number;
        categories: string[];
        iconBaseUrl: string;
        namingConvention: {
            format: string;
            examples: string[];
            note: string;
        };
    }>;
    getLinkAnalytics(req: any, linkId?: string): Promise<{
        message: string;
        analytics: import("../entities/link.entity").Link | {
            links: import("../entities/link.entity").Link[];
            totalLinks: number;
            totalClicks: number;
            avgClicksPerLink: number;
        };
    }>;
    getPublicLinkAnalytics(id: string): Promise<{
        message: string;
        analytics: {
            totalClicks: number;
            uniqueClicks: number;
            clickRate: number;
            topReferrers: {
                referrer: string;
                clicks: number;
            }[];
            topCountries: {
                country: string;
                clicks: number;
            }[];
            clicksOverTime: {
                date: string;
                clicks: number;
            }[];
        };
    }>;
    getLinkById(req: any, id: string): Promise<{
        message: string;
        link: import("../entities/link.entity").Link;
    }>;
    updateLink(req: any, id: string, updateLinkDto: UpdateLinkDto): Promise<{
        message: string;
        link: import("../entities/link.entity").Link;
    }>;
    deleteLink(req: any, id: string): Promise<{
        message: string;
    }>;
    reorderLinks(req: any, reorderDto: ReorderLinksDto): Promise<{
        message: string;
        links: import("../entities/link.entity").Link[];
    }>;
    trackClick(id: string, trackClickDto: TrackClickDto): Promise<{
        message: string;
        clickId: string;
    }>;
    scheduleLink(req: any, id: string, scheduleDto: ScheduleLinkDto): Promise<{
        message: string;
        link: import("../entities/link.entity").Link;
    }>;
    unscheduleLink(req: any, id: string): Promise<{
        message: string;
        link: import("../entities/link.entity").Link;
    }>;
    lockLink(req: any, id: string, lockDto: LockLinkDto): Promise<{
        message: string;
        link: import("../entities/link.entity").Link;
    }>;
    unlockLink(id: string, unlockDto: UnlockLinkDto): Promise<{
        message: string;
        success: boolean;
        link: import("../entities/link.entity").Link | undefined;
    }>;
    updateMedia(req: any, id: string, mediaDto: UpdateMediaDto): Promise<{
        message: string;
        link: import("../entities/link.entity").Link;
    }>;
    customizeLink(req: any, id: string, customizeDto: CustomizeLinkDto): Promise<{
        message: string;
        link: import("../entities/link.entity").Link;
    }>;
    archiveLink(req: any, id: string): Promise<{
        message: string;
        link: import("../entities/link.entity").Link;
    }>;
    restoreLink(req: any, id: string): Promise<{
        message: string;
        link: import("../entities/link.entity").Link;
    }>;
    getArchivedLinks(req: any): Promise<{
        message: string;
        links: import("../entities/link.entity").Link[];
        total: number;
    }>;
    shareLink(req: any, id: string, shareDto: ShareLinkDto): Promise<{
        message: string;
        shareUrl: string;
        platform: string | undefined;
    }>;
    getShareStats(req: any, id: string): Promise<{
        message: string;
        stats: any;
    }>;
}
