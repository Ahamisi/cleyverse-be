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
exports.SocialLink = exports.SocialIconPosition = exports.SocialPlatform = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../common/base/base.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const link_entity_1 = require("./link.entity");
var SocialPlatform;
(function (SocialPlatform) {
    SocialPlatform["INSTAGRAM"] = "instagram";
    SocialPlatform["YOUTUBE"] = "youtube";
    SocialPlatform["TIKTOK"] = "tiktok";
    SocialPlatform["TWITTER"] = "twitter";
    SocialPlatform["FACEBOOK"] = "facebook";
    SocialPlatform["LINKEDIN"] = "linkedin";
    SocialPlatform["PINTEREST"] = "pinterest";
    SocialPlatform["SNAPCHAT"] = "snapchat";
    SocialPlatform["SPOTIFY"] = "spotify";
    SocialPlatform["APPLE_MUSIC"] = "apple_music";
    SocialPlatform["SOUNDCLOUD"] = "soundcloud";
    SocialPlatform["TWITCH"] = "twitch";
    SocialPlatform["THREADS"] = "threads";
    SocialPlatform["WHATSAPP"] = "whatsapp";
    SocialPlatform["EMAIL"] = "email";
})(SocialPlatform || (exports.SocialPlatform = SocialPlatform = {}));
var SocialIconPosition;
(function (SocialIconPosition) {
    SocialIconPosition["TOP"] = "top";
    SocialIconPosition["BOTTOM"] = "bottom";
})(SocialIconPosition || (exports.SocialIconPosition = SocialIconPosition = {}));
let SocialLink = class SocialLink extends base_entity_1.BaseEntity {
    userId;
    user;
    platform;
    username;
    url;
    isActive;
    displayOrder;
    iconPosition;
    clickCount;
    lastClickedAt;
    scheduledStartAt;
    scheduledEndAt;
    timezone;
    isLocked;
    lockType;
    lockCode;
    lockDescription;
    shortCode;
    customDomain;
    shareableShortUrl;
    socialShareCount;
    mediaType;
    previewData;
    status;
    archivedAt;
};
exports.SocialLink = SocialLink;
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], SocialLink.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], SocialLink.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SocialPlatform
    }),
    __metadata("design:type", String)
], SocialLink.prototype, "platform", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SocialLink.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SocialLink.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], SocialLink.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'display_order', default: 0 }),
    __metadata("design:type", Number)
], SocialLink.prototype, "displayOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'icon_position',
        type: 'enum',
        enum: SocialIconPosition,
        default: SocialIconPosition.TOP
    }),
    __metadata("design:type", String)
], SocialLink.prototype, "iconPosition", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'click_count', default: 0 }),
    __metadata("design:type", Number)
], SocialLink.prototype, "clickCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_clicked_at', nullable: true }),
    __metadata("design:type", Date)
], SocialLink.prototype, "lastClickedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'scheduled_start_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], SocialLink.prototype, "scheduledStartAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'scheduled_end_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], SocialLink.prototype, "scheduledEndAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SocialLink.prototype, "timezone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_locked', default: false }),
    __metadata("design:type", Boolean)
], SocialLink.prototype, "isLocked", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'lock_type',
        type: 'enum',
        enum: link_entity_1.LinkLockType,
        nullable: true
    }),
    __metadata("design:type", String)
], SocialLink.prototype, "lockType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lock_code', nullable: true }),
    __metadata("design:type", String)
], SocialLink.prototype, "lockCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lock_description', type: 'text', nullable: true }),
    __metadata("design:type", String)
], SocialLink.prototype, "lockDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'short_code', unique: true, nullable: true }),
    __metadata("design:type", String)
], SocialLink.prototype, "shortCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'custom_domain', nullable: true }),
    __metadata("design:type", String)
], SocialLink.prototype, "customDomain", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shareable_short_url', nullable: true }),
    __metadata("design:type", String)
], SocialLink.prototype, "shareableShortUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'social_share_count', default: 0 }),
    __metadata("design:type", Number)
], SocialLink.prototype, "socialShareCount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'media_type',
        type: 'enum',
        enum: link_entity_1.MediaType,
        nullable: true
    }),
    __metadata("design:type", String)
], SocialLink.prototype, "mediaType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'preview_data', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], SocialLink.prototype, "previewData", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: link_entity_1.LinkStatus,
        default: link_entity_1.LinkStatus.ACTIVE
    }),
    __metadata("design:type", String)
], SocialLink.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'archived_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], SocialLink.prototype, "archivedAt", void 0);
exports.SocialLink = SocialLink = __decorate([
    (0, typeorm_1.Entity)('social_links')
], SocialLink);
//# sourceMappingURL=social-link.entity.js.map