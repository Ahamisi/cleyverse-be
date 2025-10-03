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
exports.Link = exports.MediaType = exports.LinkLockType = exports.LinkStatus = exports.LinkLayout = exports.LinkType = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../common/base/base.entity");
const user_entity_1 = require("../../users/entities/user.entity");
var LinkType;
(function (LinkType) {
    LinkType["REGULAR"] = "regular";
    LinkType["SOCIAL"] = "social";
    LinkType["EMAIL"] = "email";
    LinkType["PHONE"] = "phone";
})(LinkType || (exports.LinkType = LinkType = {}));
var LinkLayout;
(function (LinkLayout) {
    LinkLayout["CLASSIC"] = "classic";
    LinkLayout["FEATURED"] = "featured";
})(LinkLayout || (exports.LinkLayout = LinkLayout = {}));
var LinkStatus;
(function (LinkStatus) {
    LinkStatus["ACTIVE"] = "active";
    LinkStatus["ARCHIVED"] = "archived";
    LinkStatus["DELETED"] = "deleted";
})(LinkStatus || (exports.LinkStatus = LinkStatus = {}));
var LinkLockType;
(function (LinkLockType) {
    LinkLockType["SUBSCRIPTION"] = "subscription";
    LinkLockType["CODE"] = "code";
    LinkLockType["AGE"] = "age";
    LinkLockType["SENSITIVE"] = "sensitive";
    LinkLockType["NFT"] = "nft";
})(LinkLockType || (exports.LinkLockType = LinkLockType = {}));
var MediaType;
(function (MediaType) {
    MediaType["VIDEO"] = "video";
    MediaType["MUSIC"] = "music";
    MediaType["IMAGE"] = "image";
    MediaType["DOCUMENT"] = "document";
})(MediaType || (exports.MediaType = MediaType = {}));
let Link = class Link extends base_entity_1.BaseEntity {
    userId;
    user;
    collectionId;
    title;
    url;
    type;
    layout;
    thumbnailUrl;
    isActive;
    clickCount;
    displayOrder;
    openInNewTab;
    isFeatured;
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
exports.Link = Link;
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], Link.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Link.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'collection_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Link.prototype, "collectionId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Link.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Link.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: LinkType,
        default: LinkType.REGULAR
    }),
    __metadata("design:type", String)
], Link.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: LinkLayout,
        default: LinkLayout.CLASSIC
    }),
    __metadata("design:type", String)
], Link.prototype, "layout", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'thumbnail_url', nullable: true }),
    __metadata("design:type", String)
], Link.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], Link.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'click_count', default: 0 }),
    __metadata("design:type", Number)
], Link.prototype, "clickCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'display_order', default: 0 }),
    __metadata("design:type", Number)
], Link.prototype, "displayOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'open_in_new_tab', default: true }),
    __metadata("design:type", Boolean)
], Link.prototype, "openInNewTab", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_featured', default: false }),
    __metadata("design:type", Boolean)
], Link.prototype, "isFeatured", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_clicked_at', nullable: true }),
    __metadata("design:type", Date)
], Link.prototype, "lastClickedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'scheduled_start_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Link.prototype, "scheduledStartAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'scheduled_end_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Link.prototype, "scheduledEndAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Link.prototype, "timezone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_locked', default: false }),
    __metadata("design:type", Boolean)
], Link.prototype, "isLocked", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'lock_type',
        type: 'enum',
        enum: LinkLockType,
        nullable: true
    }),
    __metadata("design:type", String)
], Link.prototype, "lockType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lock_code', nullable: true }),
    __metadata("design:type", String)
], Link.prototype, "lockCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lock_description', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Link.prototype, "lockDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'short_code', unique: true, nullable: true }),
    __metadata("design:type", String)
], Link.prototype, "shortCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'custom_domain', nullable: true }),
    __metadata("design:type", String)
], Link.prototype, "customDomain", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shareable_short_url', nullable: true }),
    __metadata("design:type", String)
], Link.prototype, "shareableShortUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'social_share_count', default: 0 }),
    __metadata("design:type", Number)
], Link.prototype, "socialShareCount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'media_type',
        type: 'enum',
        enum: MediaType,
        nullable: true
    }),
    __metadata("design:type", String)
], Link.prototype, "mediaType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'preview_data', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Link.prototype, "previewData", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: LinkStatus,
        default: LinkStatus.ACTIVE
    }),
    __metadata("design:type", String)
], Link.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'archived_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Link.prototype, "archivedAt", void 0);
exports.Link = Link = __decorate([
    (0, typeorm_1.Entity)('links')
], Link);
//# sourceMappingURL=link.entity.js.map