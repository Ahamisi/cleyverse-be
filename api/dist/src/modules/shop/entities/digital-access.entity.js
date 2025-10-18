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
exports.DigitalAccess = exports.AccessType = exports.AccessStatus = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../common/base/base.entity");
const digital_product_entity_1 = require("./digital-product.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const order_entity_1 = require("./order.entity");
var AccessStatus;
(function (AccessStatus) {
    AccessStatus["ACTIVE"] = "active";
    AccessStatus["EXPIRED"] = "expired";
    AccessStatus["REVOKED"] = "revoked";
    AccessStatus["SUSPENDED"] = "suspended";
})(AccessStatus || (exports.AccessStatus = AccessStatus = {}));
var AccessType;
(function (AccessType) {
    AccessType["PURCHASE"] = "purchase";
    AccessType["GIFT"] = "gift";
    AccessType["PROMOTIONAL"] = "promotional";
    AccessType["ADMIN"] = "admin";
})(AccessType || (exports.AccessType = AccessType = {}));
let DigitalAccess = class DigitalAccess extends base_entity_1.BaseEntity {
    digitalProductId;
    digitalProduct;
    userId;
    user;
    orderId;
    order;
    customerEmail;
    customerName;
    accessType;
    status;
    accessToken;
    accessPassword;
    expiresAt;
    lastAccessedAt;
    accessCount;
    downloadCount;
    maxDownloads;
    deviceFingerprint;
    ipAddress;
    userAgent;
    allowedIps;
    deliveryEmailSent;
    deliveryEmailSentAt;
    deliveryEmailTemplate;
    watermarkText;
    watermarkPosition;
    currentSessionId;
    sessionExpiresAt;
    concurrentSessions;
    metadata;
    notes;
};
exports.DigitalAccess = DigitalAccess;
__decorate([
    (0, typeorm_1.Column)({ name: 'digital_product_id', type: 'uuid' }),
    __metadata("design:type", String)
], DigitalAccess.prototype, "digitalProductId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => digital_product_entity_1.DigitalProduct, digitalProduct => digitalProduct.accessRecords, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'digital_product_id' }),
    __metadata("design:type", digital_product_entity_1.DigitalProduct)
], DigitalAccess.prototype, "digitalProduct", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], DigitalAccess.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", Object)
], DigitalAccess.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], DigitalAccess.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_entity_1.Order, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'order_id' }),
    __metadata("design:type", Object)
], DigitalAccess.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_email', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], DigitalAccess.prototype, "customerEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_name', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], DigitalAccess.prototype, "customerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: AccessType, default: AccessType.PURCHASE }),
    __metadata("design:type", String)
], DigitalAccess.prototype, "accessType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: AccessStatus, default: AccessStatus.ACTIVE }),
    __metadata("design:type", String)
], DigitalAccess.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'access_token', type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], DigitalAccess.prototype, "accessToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'access_password', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], DigitalAccess.prototype, "accessPassword", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expires_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], DigitalAccess.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_accessed_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], DigitalAccess.prototype, "lastAccessedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'access_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], DigitalAccess.prototype, "accessCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'download_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], DigitalAccess.prototype, "downloadCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_downloads', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], DigitalAccess.prototype, "maxDownloads", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'device_fingerprint', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], DigitalAccess.prototype, "deviceFingerprint", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ip_address', type: 'varchar', length: 45, nullable: true }),
    __metadata("design:type", Object)
], DigitalAccess.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_agent', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], DigitalAccess.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'allowed_ips', type: 'text', array: true, nullable: true }),
    __metadata("design:type", Object)
], DigitalAccess.prototype, "allowedIps", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'delivery_email_sent', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], DigitalAccess.prototype, "deliveryEmailSent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'delivery_email_sent_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], DigitalAccess.prototype, "deliveryEmailSentAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'delivery_email_template', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], DigitalAccess.prototype, "deliveryEmailTemplate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'watermark_text', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], DigitalAccess.prototype, "watermarkText", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'watermark_position', type: 'varchar', length: 50, default: 'bottom-right' }),
    __metadata("design:type", String)
], DigitalAccess.prototype, "watermarkPosition", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'current_session_id', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], DigitalAccess.prototype, "currentSessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'session_expires_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], DigitalAccess.prototype, "sessionExpiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'concurrent_sessions', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], DigitalAccess.prototype, "concurrentSessions", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'metadata', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], DigitalAccess.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notes', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], DigitalAccess.prototype, "notes", void 0);
exports.DigitalAccess = DigitalAccess = __decorate([
    (0, typeorm_1.Entity)('digital_access'),
    (0, typeorm_1.Index)(['digitalProductId', 'userId']),
    (0, typeorm_1.Index)(['digitalProductId', 'orderId']),
    (0, typeorm_1.Index)(['accessToken']),
    (0, typeorm_1.Index)(['expiresAt'])
], DigitalAccess);
//# sourceMappingURL=digital-access.entity.js.map