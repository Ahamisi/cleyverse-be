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
exports.TrustedDevice = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
let TrustedDevice = class TrustedDevice {
    id;
    userId;
    user;
    deviceFingerprint;
    deviceName;
    deviceType;
    browser;
    os;
    ipAddress;
    lastUsedAt;
    isActive;
    createdAt;
    updatedAt;
};
exports.TrustedDevice = TrustedDevice;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TrustedDevice.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], TrustedDevice.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], TrustedDevice.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'device_fingerprint', type: 'varchar', unique: false }),
    __metadata("design:type", String)
], TrustedDevice.prototype, "deviceFingerprint", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'device_name', type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], TrustedDevice.prototype, "deviceName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'device_type', type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], TrustedDevice.prototype, "deviceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'browser', type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], TrustedDevice.prototype, "browser", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'os', type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], TrustedDevice.prototype, "os", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ip_address', type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], TrustedDevice.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_used_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], TrustedDevice.prototype, "lastUsedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], TrustedDevice.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], TrustedDevice.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], TrustedDevice.prototype, "updatedAt", void 0);
exports.TrustedDevice = TrustedDevice = __decorate([
    (0, typeorm_1.Entity)('trusted_devices')
], TrustedDevice);
//# sourceMappingURL=trusted-device.entity.js.map