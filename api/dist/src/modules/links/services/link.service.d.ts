import { Repository } from 'typeorm';
import { BaseService } from '../../../common/base/base.service';
import { Link, LinkType } from '../entities/link.entity';
import { User } from '../../users/entities/user.entity';
import { CreateLinkDto, UpdateLinkDto, ReorderLinksDto, ScheduleLinkDto, LockLinkDto, UnlockLinkDto, UpdateMediaDto, CustomizeLinkDto, ShareLinkDto } from '../dto/link.dto';
import { MediaProcessorService } from '../../../shared/services/media-processor.service';
export declare class LinkService extends BaseService<Link> {
    private readonly linkRepository;
    private readonly userRepository;
    private readonly mediaProcessorService;
    constructor(linkRepository: Repository<Link>, userRepository: Repository<User>, mediaProcessorService: MediaProcessorService);
    protected getEntityName(): string;
    createLink(userId: string, createLinkDto: CreateLinkDto): Promise<Link>;
    getUserLinks(userId: string, includeInactive?: boolean): Promise<Link[]>;
    updateLink(userId: string, linkId: string, updateLinkDto: UpdateLinkDto): Promise<Link>;
    deleteLink(userId: string, linkId: string): Promise<void>;
    reorderLinks(userId: string, reorderDto: ReorderLinksDto): Promise<Link[]>;
    incrementClickCount(linkId: string): Promise<void>;
    getLinksByType(userId: string, type: LinkType): Promise<Link[]>;
    getFeaturedLinks(userId: string): Promise<Link[]>;
    getLinkAnalytics(userId: string, linkId?: string): Promise<Link | {
        links: Link[];
        totalLinks: number;
        totalClicks: number;
        avgClicksPerLink: number;
    }>;
    private reorderLinksAfterDeletion;
    scheduleLink(userId: string, linkId: string, scheduleDto: ScheduleLinkDto): Promise<Link>;
    unscheduleLink(userId: string, linkId: string): Promise<Link>;
    isLinkScheduledActive(linkId: string): Promise<boolean>;
    lockLink(userId: string, linkId: string, lockDto: LockLinkDto): Promise<Link>;
    unlockLink(linkId: string, unlockDto: UnlockLinkDto): Promise<{
        success: boolean;
        link?: Link;
    }>;
    updateMedia(userId: string, linkId: string, mediaDto: UpdateMediaDto): Promise<Link>;
    customizeLink(userId: string, linkId: string, customizeDto: CustomizeLinkDto): Promise<Link>;
    archiveLink(userId: string, linkId: string): Promise<Link>;
    restoreLink(userId: string, linkId: string): Promise<Link>;
    getArchivedLinks(userId: string): Promise<Link[]>;
    shareLink(userId: string, linkId: string, shareDto: ShareLinkDto): Promise<{
        shareUrl: string;
    }>;
    getShareStats(userId: string, linkId: string): Promise<any>;
}
