"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialLinkService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const base_service_1 = require("../../../common/base/base.service");
const social_link_entity_1 = require("../entities/social-link.entity");
let SocialLinkService = class SocialLinkService extends base_service_1.BaseService {
    socialLinkRepository;
    constructor(socialLinkRepository) {
        super(socialLinkRepository);
        this.socialLinkRepository = socialLinkRepository;
    }
    getEntityName() {
        return 'SocialLink';
    }
    async createSocialLink(userId, createSocialLinkDto) {
        const existingLink = await this.socialLinkRepository.findOne({
            where: { userId, platform: createSocialLinkDto.platform }
        });
        if (existingLink) {
            throw new common_1.BadRequestException(`${createSocialLinkDto.platform} link already exists. Update instead.`);
        }
        const maxOrder = await this.socialLinkRepository
            .createQueryBuilder('social_link')
            .select('MAX(social_link.displayOrder)', 'max')
            .where('social_link.userId = :userId', { userId })
            .getRawOne();
        const displayOrder = createSocialLinkDto.displayOrder ?? (maxOrder?.max || 0) + 1;
        return this.create({
            ...createSocialLinkDto,
            userId,
            displayOrder,
            iconPosition: createSocialLinkDto.iconPosition || social_link_entity_1.SocialIconPosition.TOP
        });
    }
    async getUserSocialLinks(userId, includeInactive = false) {
        const queryBuilder = this.socialLinkRepository
            .createQueryBuilder('social_link')
            .where('social_link.userId = :userId', { userId })
            .orderBy('social_link.displayOrder', 'ASC')
            .addOrderBy('social_link.createdAt', 'ASC');
        if (!includeInactive) {
            queryBuilder.andWhere('social_link.isActive = :isActive', { isActive: true });
        }
        return queryBuilder.getMany();
    }
    async updateSocialLink(userId, socialLinkId, updateSocialLinkDto) {
        const socialLink = await this.socialLinkRepository.findOne({
            where: { id: socialLinkId, userId }
        });
        if (!socialLink) {
            throw new common_1.NotFoundException('Social link not found or does not belong to user');
        }
        await this.repository.update(socialLinkId, updateSocialLinkDto);
        return this.findById(socialLinkId);
    }
    async deleteSocialLink(userId, socialLinkId) {
        const socialLink = await this.socialLinkRepository.findOne({
            where: { id: socialLinkId, userId }
        });
        if (!socialLink) {
            throw new common_1.NotFoundException('Social link not found or does not belong to user');
        }
        await this.repository.delete(socialLinkId);
        await this.reorderSocialLinksAfterDeletion(userId, socialLink.displayOrder);
    }
    async updateSocialIconSettings(userId, settingsDto) {
        const { iconPosition, activePlatforms } = settingsDto;
        await this.socialLinkRepository.update({ userId }, { iconPosition });
        if (activePlatforms && activePlatforms.length > 0) {
            await this.socialLinkRepository.update({ userId }, { isActive: false });
            for (const platformId of activePlatforms) {
                await this.socialLinkRepository.update({ id: platformId, userId }, { isActive: true });
            }
        }
        return this.getUserSocialLinks(userId, true);
    }
    async incrementClickCount(socialLinkId) {
        await this.repository.increment({ id: socialLinkId }, 'clickCount', 1);
        await this.repository.update(socialLinkId, { lastClickedAt: new Date() });
    }
    async getSocialLinkByPlatform(userId, platform) {
        return this.socialLinkRepository.findOne({
            where: { userId, platform }
        });
    }
    async reorderSocialLinks(userId, linkIds) {
        const links = await this.socialLinkRepository.find({
            where: { userId },
            select: ['id']
        });
        const userLinkIds = links.map(link => link.id);
        const invalidIds = linkIds.filter(id => !userLinkIds.includes(id));
        if (invalidIds.length > 0) {
            throw new common_1.BadRequestException('Some social links do not belong to this user');
        }
        for (let i = 0; i < linkIds.length; i++) {
            await this.repository.update(linkIds[i], { displayOrder: i + 1 });
        }
        return this.getUserSocialLinks(userId);
    }
    async getSocialLinkAnalytics(userId) {
        const socialLinks = await this.socialLinkRepository
            .createQueryBuilder('social_link')
            .select([
            'social_link.id',
            'social_link.platform',
            'social_link.username',
            'social_link.clickCount',
            'social_link.lastClickedAt',
            'social_link.createdAt'
        ])
            .where('social_link.userId = :userId', { userId })
            .getMany();
        const totalClicks = socialLinks.reduce((sum, link) => sum + link.clickCount, 0);
        return {
            socialLinks,
            totalSocialLinks: socialLinks.length,
            totalClicks,
            avgClicksPerLink: socialLinks.length > 0 ? Math.round(totalClicks / socialLinks.length) : 0,
            topPlatforms: socialLinks
                .sort((a, b) => b.clickCount - a.clickCount)
                .slice(0, 5)
                .map(link => ({
                platform: link.platform,
                username: link.username,
                clicks: link.clickCount
            }))
        };
    }
    getSupportedPlatforms() {
        return [
            { value: social_link_entity_1.SocialPlatform.INSTAGRAM, label: 'Instagram', urlPattern: 'https://www.instagram.com/{username}' },
            { value: social_link_entity_1.SocialPlatform.YOUTUBE, label: 'YouTube', urlPattern: 'https://www.youtube.com/@{username}' },
            { value: social_link_entity_1.SocialPlatform.TIKTOK, label: 'TikTok', urlPattern: 'https://www.tiktok.com/@{username}' },
            { value: social_link_entity_1.SocialPlatform.TWITTER, label: 'X (Twitter)', urlPattern: 'https://twitter.com/{username}' },
            { value: social_link_entity_1.SocialPlatform.FACEBOOK, label: 'Facebook', urlPattern: 'https://facebook.com/{username}' },
            { value: social_link_entity_1.SocialPlatform.LINKEDIN, label: 'LinkedIn', urlPattern: 'https://linkedin.com/in/{username}' },
            { value: social_link_entity_1.SocialPlatform.PINTEREST, label: 'Pinterest', urlPattern: 'https://pinterest.com/{username}' },
            { value: social_link_entity_1.SocialPlatform.SNAPCHAT, label: 'Snapchat', urlPattern: 'https://snapchat.com/add/{username}' },
            { value: social_link_entity_1.SocialPlatform.SPOTIFY, label: 'Spotify', urlPattern: 'https://open.spotify.com/user/{username}' },
            { value: social_link_entity_1.SocialPlatform.APPLE_MUSIC, label: 'Apple Music' },
            { value: social_link_entity_1.SocialPlatform.SOUNDCLOUD, label: 'SoundCloud', urlPattern: 'https://soundcloud.com/{username}' },
            { value: social_link_entity_1.SocialPlatform.TWITCH, label: 'Twitch', urlPattern: 'https://twitch.tv/{username}' },
            { value: social_link_entity_1.SocialPlatform.THREADS, label: 'Threads', urlPattern: 'https://threads.net/@{username}' },
            { value: social_link_entity_1.SocialPlatform.WHATSAPP, label: 'WhatsApp' },
            { value: social_link_entity_1.SocialPlatform.EMAIL, label: 'Email' }
        ];
    }
    async reorderSocialLinksAfterDeletion(userId, deletedOrder) {
        await this.socialLinkRepository
            .createQueryBuilder()
            .update(social_link_entity_1.SocialLink)
            .set({ displayOrder: () => 'display_order - 1' })
            .where('userId = :userId', { userId })
            .andWhere('displayOrder > :deletedOrder', { deletedOrder })
            .execute();
    }
};
exports.SocialLinkService = SocialLinkService;
exports.SocialLinkService = SocialLinkService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(social_link_entity_1.SocialLink)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SocialLinkService);
//# sourceMappingURL=social-link.service.js.map