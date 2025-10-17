"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const base_service_1 = require("../../../common/base/base.service");
const link_entity_1 = require("../entities/link.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const media_processor_service_1 = require("../../../shared/services/media-processor.service");
const crypto = __importStar(require("crypto"));
let LinkService = class LinkService extends base_service_1.BaseService {
    linkRepository;
    userRepository;
    mediaProcessorService;
    constructor(linkRepository, userRepository, mediaProcessorService) {
        super(linkRepository);
        this.linkRepository = linkRepository;
        this.userRepository = userRepository;
        this.mediaProcessorService = mediaProcessorService;
    }
    getEntityName() {
        return 'Link';
    }
    async createLink(userId, createLinkDto) {
        const existingLink = await this.linkRepository.findOne({
            where: { userId, url: createLinkDto.url }
        });
        if (existingLink) {
            throw new common_1.BadRequestException('Link with this URL already exists');
        }
        const mediaMetadata = await this.mediaProcessorService.processUrl(createLinkDto.url);
        const maxOrder = await this.linkRepository
            .createQueryBuilder('link')
            .select('MAX(link.displayOrder)', 'max')
            .where('link.userId = :userId', { userId })
            .getRawOne();
        const displayOrder = createLinkDto.displayOrder ?? (maxOrder?.max || 0) + 1;
        let mediaType;
        let previewData = null;
        let autoTitle = createLinkDto.title;
        let thumbnailUrl = createLinkDto.thumbnailUrl;
        if (mediaMetadata.type === 'music') {
            mediaType = link_entity_1.MediaType.MUSIC;
            autoTitle = autoTitle || `${mediaMetadata.title}${mediaMetadata.artist ? ' - ' + mediaMetadata.artist : ''}`;
            thumbnailUrl = thumbnailUrl || mediaMetadata.thumbnailUrl;
            previewData = {
                platform: mediaMetadata.platform,
                title: mediaMetadata.title,
                artist: mediaMetadata.artist,
                album: mediaMetadata.album,
                duration: mediaMetadata.duration,
                streamingServices: mediaMetadata.streamingServices,
            };
        }
        else if (mediaMetadata.type === 'video') {
            mediaType = link_entity_1.MediaType.VIDEO;
            autoTitle = autoTitle || mediaMetadata.title || 'Video Link';
            thumbnailUrl = thumbnailUrl || mediaMetadata.thumbnailUrl;
            previewData = {
                platform: mediaMetadata.platform,
                title: mediaMetadata.title,
                duration: mediaMetadata.duration,
                embedUrl: mediaMetadata.embedUrl,
                videoOptions: mediaMetadata.videoOptions,
            };
        }
        return this.create({
            ...createLinkDto,
            title: autoTitle,
            userId,
            displayOrder,
            type: createLinkDto.type || link_entity_1.LinkType.REGULAR,
            mediaType,
            thumbnailUrl,
            previewData,
        });
    }
    async getUserLinks(userId, includeInactive = false) {
        const queryBuilder = this.linkRepository
            .createQueryBuilder('link')
            .where('link.userId = :userId', { userId })
            .orderBy('link.displayOrder', 'ASC')
            .addOrderBy('link.createdAt', 'ASC');
        if (!includeInactive) {
            queryBuilder.andWhere('link.isActive = :isActive', { isActive: true });
        }
        return queryBuilder.getMany();
    }
    async updateLink(userId, linkId, updateLinkDto) {
        const link = await this.linkRepository.findOne({
            where: { id: linkId, userId }
        });
        if (!link) {
            throw new common_1.NotFoundException('Link not found or does not belong to user');
        }
        if (updateLinkDto.url && updateLinkDto.url !== link.url) {
            const existingLink = await this.linkRepository.findOne({
                where: { userId, url: updateLinkDto.url }
            });
            if (existingLink && existingLink.id !== linkId) {
                throw new common_1.BadRequestException('Link with this URL already exists');
            }
        }
        await this.repository.update(linkId, updateLinkDto);
        return this.findById(linkId);
    }
    async deleteLink(userId, linkId) {
        const link = await this.linkRepository.findOne({
            where: { id: linkId, userId }
        });
        if (!link) {
            throw new common_1.NotFoundException('Link not found or does not belong to user');
        }
        await this.repository.delete(linkId);
        await this.reorderLinksAfterDeletion(userId, link.displayOrder);
    }
    async reorderLinks(userId, reorderDto) {
        const { linkIds } = reorderDto;
        const links = await this.linkRepository.find({
            where: { userId },
            select: ['id']
        });
        const userLinkIds = links.map(link => link.id);
        const invalidIds = linkIds.filter(id => !userLinkIds.includes(id));
        if (invalidIds.length > 0) {
            throw new common_1.BadRequestException('Some links do not belong to this user');
        }
        for (let i = 0; i < linkIds.length; i++) {
            await this.repository.update(linkIds[i], { displayOrder: i + 1 });
        }
        return this.getUserLinks(userId);
    }
    async trackClick(linkId, trackClickDto) {
        await this.repository.increment({ id: linkId }, 'clickCount', 1);
        await this.repository.update(linkId, { lastClickedAt: new Date() });
        const clickId = crypto.randomUUID();
        return clickId;
    }
    async incrementClickCount(linkId) {
        await this.trackClick(linkId, {});
    }
    async getLinksByType(userId, type) {
        return this.linkRepository.find({
            where: { userId, type, isActive: true },
            order: { displayOrder: 'ASC', createdAt: 'ASC' }
        });
    }
    async getFeaturedLinks(userId) {
        return this.linkRepository.find({
            where: { userId, isFeatured: true, isActive: true },
            order: { displayOrder: 'ASC', createdAt: 'ASC' }
        });
    }
    async getLinkAnalytics(userId, linkId) {
        const queryBuilder = this.linkRepository
            .createQueryBuilder('link')
            .select([
            'link.id',
            'link.title',
            'link.url',
            'link.clickCount',
            'link.lastClickedAt',
            'link.createdAt'
        ])
            .where('link.userId = :userId', { userId });
        if (linkId) {
            queryBuilder.andWhere('link.id = :linkId', { linkId });
            const link = await queryBuilder.getOne();
            if (!link) {
                throw new common_1.NotFoundException('Link not found');
            }
            return link;
        }
        const links = await queryBuilder.getMany();
        const totalClicks = links.reduce((sum, link) => sum + link.clickCount, 0);
        return {
            links,
            totalLinks: links.length,
            totalClicks,
            avgClicksPerLink: links.length > 0 ? Math.round(totalClicks / links.length) : 0
        };
    }
    async getPublicLinkAnalytics(linkId) {
        const link = await this.linkRepository.findOne({
            where: { id: linkId, isActive: true },
            select: ['id', 'title', 'clickCount', 'lastClickedAt', 'createdAt']
        });
        if (!link) {
            throw new common_1.NotFoundException('Link not found');
        }
        return {
            totalClicks: link.clickCount,
            uniqueClicks: link.clickCount,
            clickRate: 0.15,
            topReferrers: [
                { referrer: 'https://google.com', clicks: Math.floor(link.clickCount * 0.3) },
                { referrer: 'https://facebook.com', clicks: Math.floor(link.clickCount * 0.2) }
            ],
            topCountries: [
                { country: 'US', clicks: Math.floor(link.clickCount * 0.5) },
                { country: 'CA', clicks: Math.floor(link.clickCount * 0.2) }
            ],
            clicksOverTime: [
                { date: new Date(Date.now() - 86400000).toISOString().split('T')[0], clicks: Math.floor(link.clickCount * 0.1) },
                { date: new Date().toISOString().split('T')[0], clicks: Math.floor(link.clickCount * 0.1) }
            ]
        };
    }
    async reorderLinksAfterDeletion(userId, deletedOrder) {
        await this.linkRepository
            .createQueryBuilder()
            .update(link_entity_1.Link)
            .set({ displayOrder: () => 'display_order - 1' })
            .where('userId = :userId', { userId })
            .andWhere('displayOrder > :deletedOrder', { deletedOrder })
            .execute();
    }
    async scheduleLink(userId, linkId, scheduleDto) {
        const link = await this.linkRepository.findOne({ where: { id: linkId, userId } });
        if (!link) {
            throw new common_1.NotFoundException('Link not found or does not belong to user');
        }
        const updateData = {};
        if (scheduleDto.scheduledStartAt) {
            updateData.scheduledStartAt = new Date(scheduleDto.scheduledStartAt);
        }
        if (scheduleDto.scheduledEndAt) {
            updateData.scheduledEndAt = new Date(scheduleDto.scheduledEndAt);
        }
        if (scheduleDto.timezone) {
            updateData.timezone = scheduleDto.timezone;
        }
        await this.linkRepository.update(linkId, updateData);
        return this.findById(linkId);
    }
    async unscheduleLink(userId, linkId) {
        const link = await this.linkRepository.findOne({ where: { id: linkId, userId } });
        if (!link) {
            throw new common_1.NotFoundException('Link not found or does not belong to user');
        }
        await this.linkRepository.update(linkId, {
            scheduledStartAt: undefined,
            scheduledEndAt: undefined,
            timezone: undefined
        });
        return this.findById(linkId);
    }
    async isLinkScheduledActive(linkId) {
        const link = await this.findById(linkId);
        const now = new Date();
        if (!link.scheduledStartAt && !link.scheduledEndAt) {
            return true;
        }
        if (link.scheduledStartAt && now < link.scheduledStartAt) {
            return false;
        }
        if (link.scheduledEndAt && now > link.scheduledEndAt) {
            return false;
        }
        return true;
    }
    async lockLink(userId, linkId, lockDto) {
        const link = await this.linkRepository.findOne({ where: { id: linkId, userId } });
        if (!link) {
            throw new common_1.NotFoundException('Link not found or does not belong to user');
        }
        const updateData = {
            isLocked: lockDto.isLocked
        };
        if (lockDto.isLocked) {
            updateData.lockType = lockDto.lockType;
            updateData.lockDescription = lockDto.lockDescription;
            if (lockDto.lockType === link_entity_1.LinkLockType.CODE && lockDto.lockCode) {
                updateData.lockCode = lockDto.lockCode;
            }
        }
        else {
            updateData.lockType = undefined;
            updateData.lockCode = undefined;
            updateData.lockDescription = undefined;
        }
        await this.linkRepository.update(linkId, updateData);
        return this.findById(linkId);
    }
    async unlockLink(linkId, unlockDto) {
        const link = await this.findById(linkId);
        if (!link.isLocked) {
            return { success: true, link };
        }
        switch (link.lockType) {
            case link_entity_1.LinkLockType.CODE:
                if (unlockDto.code === link.lockCode) {
                    return { success: true, link };
                }
                break;
            case link_entity_1.LinkLockType.SUBSCRIPTION:
                if (unlockDto.email) {
                    return { success: true, link };
                }
                break;
            case link_entity_1.LinkLockType.AGE:
                if (unlockDto.birthDate) {
                    const birthDate = new Date(unlockDto.birthDate);
                    const age = new Date().getFullYear() - birthDate.getFullYear();
                    if (age >= 18) {
                        return { success: true, link };
                    }
                }
                break;
            case link_entity_1.LinkLockType.SENSITIVE:
                return { success: true, link };
            case link_entity_1.LinkLockType.NFT:
                return { success: false };
        }
        return { success: false };
    }
    async updateMedia(userId, linkId, mediaDto) {
        const link = await this.linkRepository.findOne({ where: { id: linkId, userId } });
        if (!link) {
            throw new common_1.NotFoundException('Link not found or does not belong to user');
        }
        const updateData = {};
        if (mediaDto.mediaType)
            updateData.mediaType = mediaDto.mediaType;
        if (mediaDto.thumbnailUrl)
            updateData.thumbnailUrl = mediaDto.thumbnailUrl;
        if (mediaDto.previewData)
            updateData.previewData = mediaDto.previewData;
        await this.linkRepository.update(linkId, updateData);
        return this.findById(linkId);
    }
    async customizeLink(userId, linkId, customizeDto) {
        const link = await this.linkRepository.findOne({ where: { id: linkId, userId } });
        if (!link) {
            throw new common_1.NotFoundException('Link not found or does not belong to user');
        }
        const updateData = {};
        if (customizeDto.shortCode) {
            const existingLink = await this.linkRepository.findOne({
                where: { shortCode: customizeDto.shortCode }
            });
            if (existingLink && existingLink.id !== linkId) {
                throw new common_1.BadRequestException('Short code already taken');
            }
            updateData.shortCode = customizeDto.shortCode;
            updateData.shareableShortUrl = `cley.me/${customizeDto.shortCode}`;
        }
        if (customizeDto.customDomain) {
            updateData.customDomain = customizeDto.customDomain;
        }
        await this.linkRepository.update(linkId, updateData);
        return this.findById(linkId);
    }
    async archiveLink(userId, linkId) {
        const link = await this.linkRepository.findOne({ where: { id: linkId, userId } });
        if (!link) {
            throw new common_1.NotFoundException('Link not found or does not belong to user');
        }
        await this.linkRepository.update(linkId, {
            status: link_entity_1.LinkStatus.ARCHIVED,
            archivedAt: new Date(),
            isActive: false
        });
        return this.findById(linkId);
    }
    async restoreLink(userId, linkId) {
        const link = await this.linkRepository.findOne({ where: { id: linkId, userId } });
        if (!link) {
            throw new common_1.NotFoundException('Link not found or does not belong to user');
        }
        await this.linkRepository.update(linkId, {
            status: link_entity_1.LinkStatus.ACTIVE,
            archivedAt: undefined,
            isActive: true
        });
        return this.findById(linkId);
    }
    async getArchivedLinks(userId) {
        return this.linkRepository.find({
            where: { userId, status: link_entity_1.LinkStatus.ARCHIVED },
            order: { archivedAt: 'DESC' }
        });
    }
    async shareLink(userId, linkId, shareDto) {
        const link = await this.linkRepository.findOne({ where: { id: linkId, userId } });
        if (!link) {
            throw new common_1.NotFoundException('Link not found or does not belong to user');
        }
        let shareUrl = link.shareableShortUrl;
        if (!shareUrl) {
            const shortCode = crypto.randomBytes(4).toString('hex');
            shareUrl = `cley.me/${shortCode}`;
            await this.linkRepository.update(linkId, {
                shortCode,
                shareableShortUrl: shareUrl
            });
        }
        await this.linkRepository.increment({ id: linkId }, 'socialShareCount', 1);
        return { shareUrl };
    }
    async getShareStats(userId, linkId) {
        const link = await this.linkRepository.findOne({ where: { id: linkId, userId } });
        if (!link) {
            throw new common_1.NotFoundException('Link not found or does not belong to user');
        }
        return {
            linkId: link.id,
            title: link.title,
            shareUrl: link.shareableShortUrl,
            socialShareCount: link.socialShareCount,
            clickCount: link.clickCount,
            shareToClickRatio: link.socialShareCount > 0 ?
                (link.clickCount / link.socialShareCount).toFixed(2) : '0.00'
        };
    }
};
exports.LinkService = LinkService;
exports.LinkService = LinkService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(link_entity_1.Link)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        media_processor_service_1.MediaProcessorService])
], LinkService);
//# sourceMappingURL=link.service.js.map