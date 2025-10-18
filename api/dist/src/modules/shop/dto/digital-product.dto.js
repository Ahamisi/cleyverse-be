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
exports.AccessRecordQueryDto = exports.DigitalProductQueryDto = exports.AccessVerificationDto = exports.UpdateDigitalProductDto = exports.CreateDigitalProductDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const digital_product_entity_1 = require("../entities/digital-product.entity");
class CreateDigitalProductDto {
    productId;
    digitalType;
    accessControlType;
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
}
exports.CreateDigitalProductDto = CreateDigitalProductDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDigitalProductDto.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(digital_product_entity_1.DigitalProductType),
    __metadata("design:type", String)
], CreateDigitalProductDto.prototype, "digitalType", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(digital_product_entity_1.AccessControlType),
    __metadata("design:type", String)
], CreateDigitalProductDto.prototype, "accessControlType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(4, 50),
    __metadata("design:type", String)
], CreateDigitalProductDto.prototype, "accessPassword", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(8760),
    __metadata("design:type", Number)
], CreateDigitalProductDto.prototype, "accessDurationHours", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateDigitalProductDto.prototype, "maxDownloads", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], CreateDigitalProductDto.prototype, "maxConcurrentUsers", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDigitalProductDto.prototype, "watermarkEnabled", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 255),
    __metadata("design:type", String)
], CreateDigitalProductDto.prototype, "watermarkText", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDigitalProductDto.prototype, "autoDeliver", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100),
    __metadata("design:type", String)
], CreateDigitalProductDto.prototype, "deliveryEmailTemplate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 255),
    __metadata("design:type", String)
], CreateDigitalProductDto.prototype, "deliverySubject", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDigitalProductDto.prototype, "ipRestriction", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateDigitalProductDto.prototype, "allowedIps", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDigitalProductDto.prototype, "deviceFingerprinting", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDigitalProductDto.prototype, "preventScreenshots", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDigitalProductDto.prototype, "preventPrinting", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDigitalProductDto.prototype, "preventCopying", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 50),
    __metadata("design:type", String)
], CreateDigitalProductDto.prototype, "viewerType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateDigitalProductDto.prototype, "viewerConfig", void 0);
class UpdateDigitalProductDto {
    accessControlType;
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
    isActive;
}
exports.UpdateDigitalProductDto = UpdateDigitalProductDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(digital_product_entity_1.AccessControlType),
    __metadata("design:type", String)
], UpdateDigitalProductDto.prototype, "accessControlType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(4, 50),
    __metadata("design:type", String)
], UpdateDigitalProductDto.prototype, "accessPassword", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(8760),
    __metadata("design:type", Number)
], UpdateDigitalProductDto.prototype, "accessDurationHours", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateDigitalProductDto.prototype, "maxDownloads", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], UpdateDigitalProductDto.prototype, "maxConcurrentUsers", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDigitalProductDto.prototype, "watermarkEnabled", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 255),
    __metadata("design:type", String)
], UpdateDigitalProductDto.prototype, "watermarkText", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDigitalProductDto.prototype, "autoDeliver", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100),
    __metadata("design:type", String)
], UpdateDigitalProductDto.prototype, "deliveryEmailTemplate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 255),
    __metadata("design:type", String)
], UpdateDigitalProductDto.prototype, "deliverySubject", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDigitalProductDto.prototype, "ipRestriction", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateDigitalProductDto.prototype, "allowedIps", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDigitalProductDto.prototype, "deviceFingerprinting", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDigitalProductDto.prototype, "preventScreenshots", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDigitalProductDto.prototype, "preventPrinting", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDigitalProductDto.prototype, "preventCopying", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 50),
    __metadata("design:type", String)
], UpdateDigitalProductDto.prototype, "viewerType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateDigitalProductDto.prototype, "viewerConfig", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDigitalProductDto.prototype, "isActive", void 0);
class AccessVerificationDto {
    password;
    deviceFingerprint;
}
exports.AccessVerificationDto = AccessVerificationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(4, 50),
    __metadata("design:type", String)
], AccessVerificationDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(32, 64),
    __metadata("design:type", String)
], AccessVerificationDto.prototype, "deviceFingerprint", void 0);
class DigitalProductQueryDto {
    page = 1;
    limit = 20;
    digitalType;
    accessControlType;
    isActive;
}
exports.DigitalProductQueryDto = DigitalProductQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], DigitalProductQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], DigitalProductQueryDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(digital_product_entity_1.DigitalProductType),
    __metadata("design:type", String)
], DigitalProductQueryDto.prototype, "digitalType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(digital_product_entity_1.AccessControlType),
    __metadata("design:type", String)
], DigitalProductQueryDto.prototype, "accessControlType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], DigitalProductQueryDto.prototype, "isActive", void 0);
class AccessRecordQueryDto {
    page = 1;
    limit = 20;
    status;
    accessType;
    customerEmail;
}
exports.AccessRecordQueryDto = AccessRecordQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], AccessRecordQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], AccessRecordQueryDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AccessRecordQueryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AccessRecordQueryDto.prototype, "accessType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AccessRecordQueryDto.prototype, "customerEmail", void 0);
//# sourceMappingURL=digital-product.dto.js.map