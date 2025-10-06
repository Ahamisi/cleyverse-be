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
exports.EventHost = exports.HostPermissions = exports.HostRole = void 0;
const typeorm_1 = require("typeorm");
var HostRole;
(function (HostRole) {
    HostRole["OWNER"] = "owner";
    HostRole["CO_HOST"] = "co_host";
    HostRole["MODERATOR"] = "moderator";
    HostRole["ADMIN"] = "admin";
})(HostRole || (exports.HostRole = HostRole = {}));
var HostPermissions;
(function (HostPermissions) {
    HostPermissions["MANAGE_EVENT"] = "manage_event";
    HostPermissions["MANAGE_GUESTS"] = "manage_guests";
    HostPermissions["MANAGE_VENDORS"] = "manage_vendors";
    HostPermissions["CHECK_IN_GUESTS"] = "check_in_guests";
    HostPermissions["SEND_MESSAGES"] = "send_messages";
    HostPermissions["VIEW_ANALYTICS"] = "view_analytics";
    HostPermissions["MANAGE_HOSTS"] = "manage_hosts";
})(HostPermissions || (exports.HostPermissions = HostPermissions = {}));
let EventHost = class EventHost {
    id;
    createdAt;
    updatedAt;
    eventId;
    userId;
    event;
    user;
    role;
    permissions;
    bio;
    profileImageUrl;
    title;
    company;
    linkedinUrl;
    twitterUrl;
    isActive;
    isFeatured;
    displayOrder;
    invitedBy;
    invitedAt;
    acceptedAt;
    invitationToken;
};
exports.EventHost = EventHost;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EventHost.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], EventHost.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], EventHost.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_id', type: 'uuid' }),
    __metadata("design:type", String)
], EventHost.prototype, "eventId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], EventHost.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Event', 'hosts'),
    (0, typeorm_1.JoinColumn)({ name: 'event_id' }),
    __metadata("design:type", Object)
], EventHost.prototype, "event", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('User', 'eventHosts'),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", Object)
], EventHost.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: HostRole, default: HostRole.CO_HOST }),
    __metadata("design:type", String)
], EventHost.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', array: true, default: [] }),
    __metadata("design:type", Array)
], EventHost.prototype, "permissions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], EventHost.prototype, "bio", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'profile_image_url', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], EventHost.prototype, "profileImageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], EventHost.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], EventHost.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'linkedin_url', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], EventHost.prototype, "linkedinUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'twitter_url', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], EventHost.prototype, "twitterUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], EventHost.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_featured', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], EventHost.prototype, "isFeatured", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'display_order', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], EventHost.prototype, "displayOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'invited_by', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], EventHost.prototype, "invitedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'invited_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], EventHost.prototype, "invitedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'accepted_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], EventHost.prototype, "acceptedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'invitation_token', type: 'varchar', length: 100, unique: true, nullable: true }),
    __metadata("design:type", Object)
], EventHost.prototype, "invitationToken", void 0);
exports.EventHost = EventHost = __decorate([
    (0, typeorm_1.Entity)('event_hosts')
], EventHost);
//# sourceMappingURL=event-host.entity.js.map