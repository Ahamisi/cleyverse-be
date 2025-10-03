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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShareLinkDto = exports.ArchiveLinkDto = exports.CustomizeLinkDto = exports.UpdateMediaDto = exports.UnlockLinkDto = exports.LockLinkDto = exports.ScheduleLinkDto = exports.UpdateSocialIconSettingsDto = exports.ReorderLinksDto = exports.UpdateSocialLinkDto = exports.CreateSocialLinkDto = exports.UpdateLinkDto = exports.CreateLinkDto = void 0;
const class_validator_1 = require("class-validator");
const link_entity_1 = require("../entities/link.entity");
const social_link_entity_1 = require("../entities/social-link.entity");
class CreateLinkDto {
    title;
    url;
    type;
    layout;
    thumbnailUrl;
    openInNewTab;
    isFeatured;
    displayOrder;
    collectionId;
}
exports.CreateLinkDto = CreateLinkDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateLinkDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateLinkDto.prototype, "url", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(link_entity_1.LinkType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLinkDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(link_entity_1.LinkLayout),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLinkDto.prototype, "layout", void 0);
__decorate([
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLinkDto.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateLinkDto.prototype, "openInNewTab", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateLinkDto.prototype, "isFeatured", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateLinkDto.prototype, "displayOrder", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateLinkDto.prototype, "collectionId", void 0);
class UpdateLinkDto {
    title;
    url;
    layout;
    thumbnailUrl;
    isActive;
    openInNewTab;
    isFeatured;
    displayOrder;
}
exports.UpdateLinkDto = UpdateLinkDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateLinkDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateLinkDto.prototype, "url", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(link_entity_1.LinkLayout),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateLinkDto.prototype, "layout", void 0);
__decorate([
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateLinkDto.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateLinkDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateLinkDto.prototype, "openInNewTab", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateLinkDto.prototype, "isFeatured", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateLinkDto.prototype, "displayOrder", void 0);
class CreateSocialLinkDto {
    platform;
    username;
    url;
    iconPosition;
    displayOrder;
}
exports.CreateSocialLinkDto = CreateSocialLinkDto;
__decorate([
    (0, class_validator_1.IsEnum)(social_link_entity_1.SocialPlatform),
    __metadata("design:type", String)
], CreateSocialLinkDto.prototype, "platform", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateSocialLinkDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateSocialLinkDto.prototype, "url", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(social_link_entity_1.SocialIconPosition),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSocialLinkDto.prototype, "iconPosition", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateSocialLinkDto.prototype, "displayOrder", void 0);
class UpdateSocialLinkDto {
    username;
    url;
    isActive;
    iconPosition;
    displayOrder;
}
exports.UpdateSocialLinkDto = UpdateSocialLinkDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSocialLinkDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSocialLinkDto.prototype, "url", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateSocialLinkDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(social_link_entity_1.SocialIconPosition),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSocialLinkDto.prototype, "iconPosition", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateSocialLinkDto.prototype, "displayOrder", void 0);
class ReorderLinksDto {
    linkIds;
}
exports.ReorderLinksDto = ReorderLinksDto;
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ReorderLinksDto.prototype, "linkIds", void 0);
class UpdateSocialIconSettingsDto {
    iconPosition;
    activePlatforms;
}
exports.UpdateSocialIconSettingsDto = UpdateSocialIconSettingsDto;
__decorate([
    (0, class_validator_1.IsEnum)(social_link_entity_1.SocialIconPosition),
    __metadata("design:type", String)
], UpdateSocialIconSettingsDto.prototype, "iconPosition", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateSocialIconSettingsDto.prototype, "activePlatforms", void 0);
class ScheduleLinkDto {
    scheduledStartAt;
    scheduledEndAt;
    timezone;
}
exports.ScheduleLinkDto = ScheduleLinkDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ScheduleLinkDto.prototype, "scheduledStartAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ScheduleLinkDto.prototype, "scheduledEndAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScheduleLinkDto.prototype, "timezone", void 0);
class LockLinkDto {
    isLocked;
    lockType;
    lockCode;
    lockDescription;
}
exports.LockLinkDto = LockLinkDto;
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], LockLinkDto.prototype, "isLocked", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(link_entity_1.LinkLockType),
    __metadata("design:type", String)
], LockLinkDto.prototype, "lockType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], LockLinkDto.prototype, "lockCode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], LockLinkDto.prototype, "lockDescription", void 0);
class UnlockLinkDto {
    code;
    email;
    birthDate;
}
exports.UnlockLinkDto = UnlockLinkDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UnlockLinkDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UnlockLinkDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UnlockLinkDto.prototype, "birthDate", void 0);
class UpdateMediaDto {
    mediaType;
    thumbnailUrl;
    previewData;
}
exports.UpdateMediaDto = UpdateMediaDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(link_entity_1.MediaType),
    __metadata("design:type", String)
], UpdateMediaDto.prototype, "mediaType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], UpdateMediaDto.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateMediaDto.prototype, "previewData", void 0);
class CustomizeLinkDto {
    shortCode;
    customDomain;
}
exports.CustomizeLinkDto = CustomizeLinkDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CustomizeLinkDto.prototype, "shortCode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustomizeLinkDto.prototype, "customDomain", void 0);
class ArchiveLinkDto {
    status;
}
exports.ArchiveLinkDto = ArchiveLinkDto;
__decorate([
    (0, class_validator_1.IsEnum)(link_entity_1.LinkStatus),
    __metadata("design:type", String)
], ArchiveLinkDto.prototype, "status", void 0);
class ShareLinkDto {
    platform;
    message;
}
exports.ShareLinkDto = ShareLinkDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ShareLinkDto.prototype, "platform", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ShareLinkDto.prototype, "message", void 0);
//# sourceMappingURL=link.dto.js.map