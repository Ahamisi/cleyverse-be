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
exports.DigitalProduct = exports.AccessControlType = exports.DigitalProductType = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../common/base/base.entity");
const product_entity_1 = require("./product.entity");
const digital_access_entity_1 = require("./digital-access.entity");
var DigitalProductType;
(function (DigitalProductType) {
    DigitalProductType["EBOOK"] = "ebook";
    DigitalProductType["PDF"] = "pdf";
    DigitalProductType["AUDIO"] = "audio";
    DigitalProductType["VIDEO"] = "video";
    DigitalProductType["SOFTWARE"] = "software";
    DigitalProductType["COURSE"] = "course";
    DigitalProductType["TEMPLATE"] = "template";
    DigitalProductType["OTHER"] = "other";
})(DigitalProductType || (exports.DigitalProductType = DigitalProductType = {}));
var AccessControlType;
(function (AccessControlType) {
    AccessControlType["EMAIL_ONLY"] = "email_only";
    AccessControlType["PASSWORD_PROTECTED"] = "password_protected";
    AccessControlType["TIME_LIMITED"] = "time_limited";
    AccessControlType["DOWNLOAD_LIMITED"] = "download_limited";
    AccessControlType["SINGLE_USE"] = "single_use";
    AccessControlType["SUBSCRIPTION"] = "subscription";
})(AccessControlType || (exports.AccessControlType = AccessControlType = {}));
let DigitalProduct = class DigitalProduct extends base_entity_1.BaseEntity {
    productId;
    product;
    accessRecords;
    digitalType;
    accessControlType;
    fileName;
    filePath;
    fileSize;
    fileType;
    mimeType;
    fileHash;
    accessPassword;
    accessDurationHours;
    maxDownloads;
    maxConcurrentUsers;
    watermarkEnabled;
    watermarkText;
    autoDeliver;
    deliveryEmailTemplate;
    deliverySubject;
    ipRestriction;
    allowedIps;
    deviceFingerprinting;
    preventScreenshots;
    preventPrinting;
    preventCopying;
    viewerType;
    viewerConfig;
    totalDownloads;
    totalViews;
    uniqueAccessors;
    metadata;
    isActive;
};
exports.DigitalProduct = DigitalProduct;
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id', type: 'uuid', unique: true }),
    __metadata("design:type", String)
], DigitalProduct.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, product => product.digitalProduct, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], DigitalProduct.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => digital_access_entity_1.DigitalAccess, access => access.digitalProduct, { cascade: true }),
    __metadata("design:type", Array)
], DigitalProduct.prototype, "accessRecords", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: DigitalProductType }),
    __metadata("design:type", String)
], DigitalProduct.prototype, "digitalType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: AccessControlType, default: AccessControlType.EMAIL_ONLY }),
    __metadata("design:type", String)
], DigitalProduct.prototype, "accessControlType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], DigitalProduct.prototype, "fileName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_path', type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], DigitalProduct.prototype, "filePath", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_size', type: 'bigint' }),
    __metadata("design:type", Number)
], DigitalProduct.prototype, "fileSize", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_type', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], DigitalProduct.prototype, "fileType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mime_type', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], DigitalProduct.prototype, "mimeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_hash', type: 'varchar', length: 64 }),
    __metadata("design:type", String)
], DigitalProduct.prototype, "fileHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'access_password', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], DigitalProduct.prototype, "accessPassword", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'access_duration_hours', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], DigitalProduct.prototype, "accessDurationHours", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_downloads', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], DigitalProduct.prototype, "maxDownloads", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_concurrent_users', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], DigitalProduct.prototype, "maxConcurrentUsers", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'watermark_enabled', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], DigitalProduct.prototype, "watermarkEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'watermark_text', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], DigitalProduct.prototype, "watermarkText", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'auto_deliver', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], DigitalProduct.prototype, "autoDeliver", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'delivery_email_template', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], DigitalProduct.prototype, "deliveryEmailTemplate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'delivery_subject', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], DigitalProduct.prototype, "deliverySubject", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ip_restriction', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], DigitalProduct.prototype, "ipRestriction", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'allowed_ips', type: 'text', array: true, nullable: true }),
    __metadata("design:type", Object)
], DigitalProduct.prototype, "allowedIps", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'device_fingerprinting', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], DigitalProduct.prototype, "deviceFingerprinting", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'prevent_screenshots', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], DigitalProduct.prototype, "preventScreenshots", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'prevent_printing', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], DigitalProduct.prototype, "preventPrinting", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'prevent_copying', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], DigitalProduct.prototype, "preventCopying", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'viewer_type', type: 'varchar', length: 50, default: 'pdf' }),
    __metadata("design:type", String)
], DigitalProduct.prototype, "viewerType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'viewer_config', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], DigitalProduct.prototype, "viewerConfig", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_downloads', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], DigitalProduct.prototype, "totalDownloads", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_views', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], DigitalProduct.prototype, "totalViews", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unique_accessors', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], DigitalProduct.prototype, "uniqueAccessors", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'metadata', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], DigitalProduct.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], DigitalProduct.prototype, "isActive", void 0);
exports.DigitalProduct = DigitalProduct = __decorate([
    (0, typeorm_1.Entity)('digital_products'),
    (0, typeorm_1.Index)(['productId']),
    (0, typeorm_1.Index)(['accessControlType'])
], DigitalProduct);
//# sourceMappingURL=digital-product.entity.js.map