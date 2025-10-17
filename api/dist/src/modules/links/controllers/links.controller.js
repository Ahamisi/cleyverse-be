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
exports.LinksController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const link_service_1 = require("../services/link.service");
const link_dto_1 = require("../dto/link.dto");
const link_entity_1 = require("../entities/link.entity");
const media_processor_service_1 = require("../../../shared/services/media-processor.service");
const platformsData = __importStar(require("../../../config/platforms.json"));
let LinksController = class LinksController {
    linkService;
    mediaProcessorService;
    constructor(linkService, mediaProcessorService) {
        this.linkService = linkService;
        this.mediaProcessorService = mediaProcessorService;
    }
    async createLink(req, createLinkDto) {
        const link = await this.linkService.createLink(req.user.userId, createLinkDto);
        return {
            message: 'Link created successfully',
            link
        };
    }
    async previewUrl(body) {
        const metadata = await this.mediaProcessorService.processUrl(body.url);
        return {
            message: 'URL processed successfully',
            metadata,
            suggestions: {
                title: metadata.type === 'music'
                    ? `${metadata.title}${metadata.artist ? ' - ' + metadata.artist : ''}`
                    : metadata.title || 'Custom Link',
                mediaType: metadata.type === 'music' ? 'music' : metadata.type === 'video' ? 'video' : null,
                thumbnailUrl: metadata.thumbnailUrl,
                previewData: metadata.type === 'music' ? {
                    platform: metadata.platform,
                    streamingServices: metadata.streamingServices
                } : metadata.type === 'video' ? {
                    platform: metadata.platform,
                    videoOptions: metadata.videoOptions
                } : null
            }
        };
    }
    async getUserLinks(req, includeInactive, type) {
        const includeInactiveFlag = includeInactive === 'true';
        let links;
        if (type) {
            links = await this.linkService.getLinksByType(req.user.userId, type);
        }
        else {
            links = await this.linkService.getUserLinks(req.user.userId, includeInactiveFlag);
        }
        return {
            message: 'Links retrieved successfully',
            links,
            total: links.length
        };
    }
    async getFeaturedLinks(req) {
        const links = await this.linkService.getFeaturedLinks(req.user.userId);
        return {
            message: 'Featured links retrieved successfully',
            links,
            total: links.length
        };
    }
    async getSupportedPlatforms(category, search) {
        let platforms = platformsData.platforms;
        if (category) {
            platforms = platforms.filter(platform => platform.category === category);
        }
        if (search) {
            const searchLower = search.toLowerCase();
            platforms = platforms.filter(platform => platform.name.toLowerCase().includes(searchLower) ||
                platform.description.toLowerCase().includes(searchLower) ||
                platform.domain.toLowerCase().includes(searchLower));
        }
        const groupedPlatforms = platforms.reduce((acc, platform) => {
            if (!acc[platform.category]) {
                acc[platform.category] = [];
            }
            acc[platform.category].push(platform);
            return acc;
        }, {});
        return {
            message: 'Supported platforms retrieved successfully',
            platforms: groupedPlatforms,
            total: platforms.length,
            categories: Object.keys(groupedPlatforms),
            iconBaseUrl: '/icons',
            namingConvention: {
                format: '{category}/{id}.svg',
                examples: ['social/instagram.svg', 'media/spotify.svg', 'commerce/shopify.svg'],
                note: 'All icons should be lowercase with hyphens for multi-word names'
            }
        };
    }
    async getLinkAnalytics(req, linkId) {
        const analytics = await this.linkService.getLinkAnalytics(req.user.userId, linkId);
        return {
            message: 'Analytics retrieved successfully',
            analytics
        };
    }
    async getPublicLinkAnalytics(id) {
        const analytics = await this.linkService.getPublicLinkAnalytics(id);
        return {
            message: 'Analytics retrieved successfully',
            analytics
        };
    }
    async getLinkById(req, id) {
        const link = await this.linkService.findById(id);
        if (link.userId !== req.user.userId) {
            throw new Error('Link not found or access denied');
        }
        return {
            message: 'Link retrieved successfully',
            link
        };
    }
    async updateLink(req, id, updateLinkDto) {
        const link = await this.linkService.updateLink(req.user.userId, id, updateLinkDto);
        return {
            message: 'Link updated successfully',
            link
        };
    }
    async deleteLink(req, id) {
        await this.linkService.deleteLink(req.user.userId, id);
        return {
            message: 'Link deleted successfully'
        };
    }
    async reorderLinks(req, reorderDto) {
        const links = await this.linkService.reorderLinks(req.user.userId, reorderDto);
        return {
            message: 'Links reordered successfully',
            links
        };
    }
    async trackClick(id, trackClickDto) {
        const clickId = await this.linkService.trackClick(id, trackClickDto);
        return {
            message: 'Click recorded successfully',
            clickId
        };
    }
    async scheduleLink(req, id, scheduleDto) {
        const link = await this.linkService.scheduleLink(req.user.userId, id, scheduleDto);
        return {
            message: 'Link scheduled successfully',
            link
        };
    }
    async unscheduleLink(req, id) {
        const link = await this.linkService.unscheduleLink(req.user.userId, id);
        return {
            message: 'Link schedule removed successfully',
            link
        };
    }
    async lockLink(req, id, lockDto) {
        const link = await this.linkService.lockLink(req.user.userId, id, lockDto);
        return {
            message: 'Link locked successfully',
            link
        };
    }
    async unlockLink(id, unlockDto) {
        const result = await this.linkService.unlockLink(id, unlockDto);
        return {
            message: result.success ? 'Link unlocked successfully' : 'Failed to unlock link',
            success: result.success,
            link: result.link
        };
    }
    async updateMedia(req, id, mediaDto) {
        const link = await this.linkService.updateMedia(req.user.userId, id, mediaDto);
        return {
            message: 'Link media updated successfully',
            link
        };
    }
    async customizeLink(req, id, customizeDto) {
        const link = await this.linkService.customizeLink(req.user.userId, id, customizeDto);
        return {
            message: 'Link customized successfully',
            link
        };
    }
    async archiveLink(req, id) {
        const link = await this.linkService.archiveLink(req.user.userId, id);
        return {
            message: 'Link archived successfully',
            link
        };
    }
    async restoreLink(req, id) {
        const link = await this.linkService.restoreLink(req.user.userId, id);
        return {
            message: 'Link restored successfully',
            link
        };
    }
    async getArchivedLinks(req) {
        const links = await this.linkService.getArchivedLinks(req.user.userId);
        return {
            message: 'Archived links retrieved successfully',
            links,
            total: links.length
        };
    }
    async shareLink(req, id, shareDto) {
        const result = await this.linkService.shareLink(req.user.userId, id, shareDto);
        return {
            message: 'Link shared successfully',
            shareUrl: result.shareUrl,
            platform: shareDto.platform
        };
    }
    async getShareStats(req, id) {
        const stats = await this.linkService.getShareStats(req.user.userId, id);
        return {
            message: 'Share statistics retrieved successfully',
            stats
        };
    }
};
exports.LinksController = LinksController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, link_dto_1.CreateLinkDto]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "createLink", null);
__decorate([
    (0, common_1.Post)('preview'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "previewUrl", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('includeInactive')),
    __param(2, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "getUserLinks", null);
__decorate([
    (0, common_1.Get)('featured'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "getFeaturedLinks", null);
__decorate([
    (0, common_1.Get)('supported-platforms'),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "getSupportedPlatforms", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('linkId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "getLinkAnalytics", null);
__decorate([
    (0, common_1.Get)(':id/analytics/public'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "getPublicLinkAnalytics", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "getLinkById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, link_dto_1.UpdateLinkDto]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "updateLink", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "deleteLink", null);
__decorate([
    (0, common_1.Put)('reorder'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, link_dto_1.ReorderLinksDto]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "reorderLinks", null);
__decorate([
    (0, common_1.Post)(':id/click'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, link_dto_1.TrackClickDto]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "trackClick", null);
__decorate([
    (0, common_1.Put)(':id/schedule'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, link_dto_1.ScheduleLinkDto]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "scheduleLink", null);
__decorate([
    (0, common_1.Delete)(':id/schedule'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "unscheduleLink", null);
__decorate([
    (0, common_1.Put)(':id/lock'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, link_dto_1.LockLinkDto]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "lockLink", null);
__decorate([
    (0, common_1.Post)(':id/unlock'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, link_dto_1.UnlockLinkDto]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "unlockLink", null);
__decorate([
    (0, common_1.Put)(':id/media'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, link_dto_1.UpdateMediaDto]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "updateMedia", null);
__decorate([
    (0, common_1.Put)(':id/customize'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, link_dto_1.CustomizeLinkDto]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "customizeLink", null);
__decorate([
    (0, common_1.Put)(':id/archive'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "archiveLink", null);
__decorate([
    (0, common_1.Put)(':id/restore'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "restoreLink", null);
__decorate([
    (0, common_1.Get)('archived'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "getArchivedLinks", null);
__decorate([
    (0, common_1.Post)(':id/share'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, link_dto_1.ShareLinkDto]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "shareLink", null);
__decorate([
    (0, common_1.Get)(':id/share-stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "getShareStats", null);
exports.LinksController = LinksController = __decorate([
    (0, common_1.Controller)('links'),
    __metadata("design:paramtypes", [link_service_1.LinkService,
        media_processor_service_1.MediaProcessorService])
], LinksController);
//# sourceMappingURL=links.controller.js.map