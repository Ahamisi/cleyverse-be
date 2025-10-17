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
exports.SocialLinksController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const social_link_service_1 = require("../services/social-link.service");
const link_dto_1 = require("../dto/link.dto");
const social_link_entity_1 = require("../entities/social-link.entity");
let SocialLinksController = class SocialLinksController {
    socialLinkService;
    constructor(socialLinkService) {
        this.socialLinkService = socialLinkService;
    }
    async createSocialLink(req, createSocialLinkDto) {
        const socialLink = await this.socialLinkService.createSocialLink(req.user.userId, createSocialLinkDto);
        return {
            message: `${createSocialLinkDto.platform} link added successfully`,
            socialLink
        };
    }
    async getUserSocialLinks(req, includeInactive) {
        const includeInactiveFlag = includeInactive === 'true';
        const socialLinks = await this.socialLinkService.getUserSocialLinks(req.user.userId, includeInactiveFlag);
        return {
            message: 'Social links retrieved successfully',
            socialLinks,
            total: socialLinks.length
        };
    }
    async getSupportedPlatforms() {
        const platforms = this.socialLinkService.getSupportedPlatforms();
        return {
            message: 'Supported platforms retrieved successfully',
            platforms
        };
    }
    async getSocialLinkAnalytics(req) {
        const analytics = await this.socialLinkService.getSocialLinkAnalytics(req.user.userId);
        return {
            message: 'Social link analytics retrieved successfully',
            analytics
        };
    }
    async getSocialLinkByPlatform(req, platform) {
        const socialLink = await this.socialLinkService.getSocialLinkByPlatform(req.user.userId, platform);
        if (!socialLink) {
            return {
                message: `No ${platform} link found`,
                socialLink: null
            };
        }
        return {
            message: `${platform} link retrieved successfully`,
            socialLink
        };
    }
    async getSocialLinkById(req, id) {
        const socialLink = await this.socialLinkService.findById(id);
        if (socialLink.userId !== req.user.userId) {
            throw new Error('Social link not found or access denied');
        }
        return {
            message: 'Social link retrieved successfully',
            socialLink
        };
    }
    async updateSocialLink(req, id, updateSocialLinkDto) {
        const socialLink = await this.socialLinkService.updateSocialLink(req.user.userId, id, updateSocialLinkDto);
        return {
            message: 'Social link updated successfully',
            socialLink
        };
    }
    async deleteSocialLink(req, id) {
        await this.socialLinkService.deleteSocialLink(req.user.userId, id);
        return {
            message: 'Social link deleted successfully'
        };
    }
    async updateSocialIconSettings(req, settingsDto) {
        const socialLinks = await this.socialLinkService.updateSocialIconSettings(req.user.userId, settingsDto);
        return {
            message: 'Social icon settings updated successfully',
            socialLinks
        };
    }
    async reorderSocialLinks(req, reorderDto) {
        const socialLinks = await this.socialLinkService.reorderSocialLinks(req.user.userId, reorderDto.linkIds);
        return {
            message: 'Social links reordered successfully',
            socialLinks
        };
    }
    async trackClick(id, trackClickDto) {
        const clickId = await this.socialLinkService.trackClick(id, trackClickDto);
        return {
            message: 'Click recorded successfully',
            clickId
        };
    }
};
exports.SocialLinksController = SocialLinksController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, link_dto_1.CreateSocialLinkDto]),
    __metadata("design:returntype", Promise)
], SocialLinksController.prototype, "createSocialLink", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SocialLinksController.prototype, "getUserSocialLinks", null);
__decorate([
    (0, common_1.Get)('platforms'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SocialLinksController.prototype, "getSupportedPlatforms", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SocialLinksController.prototype, "getSocialLinkAnalytics", null);
__decorate([
    (0, common_1.Get)('platform/:platform'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('platform')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SocialLinksController.prototype, "getSocialLinkByPlatform", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SocialLinksController.prototype, "getSocialLinkById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, link_dto_1.UpdateSocialLinkDto]),
    __metadata("design:returntype", Promise)
], SocialLinksController.prototype, "updateSocialLink", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SocialLinksController.prototype, "deleteSocialLink", null);
__decorate([
    (0, common_1.Put)('icon-settings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, link_dto_1.UpdateSocialIconSettingsDto]),
    __metadata("design:returntype", Promise)
], SocialLinksController.prototype, "updateSocialIconSettings", null);
__decorate([
    (0, common_1.Put)('reorder'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, link_dto_1.ReorderLinksDto]),
    __metadata("design:returntype", Promise)
], SocialLinksController.prototype, "reorderSocialLinks", null);
__decorate([
    (0, common_1.Post)(':id/click'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, link_dto_1.TrackClickDto]),
    __metadata("design:returntype", Promise)
], SocialLinksController.prototype, "trackClick", null);
exports.SocialLinksController = SocialLinksController = __decorate([
    (0, common_1.Controller)('social-links'),
    __metadata("design:paramtypes", [social_link_service_1.SocialLinkService])
], SocialLinksController);
//# sourceMappingURL=social-links.controller.js.map