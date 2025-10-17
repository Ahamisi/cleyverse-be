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
exports.TempCode = exports.TempCodeReason = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var TempCodeReason;
(function (TempCodeReason) {
    TempCodeReason["NEW_DEVICE"] = "new_device";
    TempCodeReason["FORGOT_PASSWORD"] = "forgot_password";
    TempCodeReason["ONBOARDING"] = "onboarding";
})(TempCodeReason || (exports.TempCodeReason = TempCodeReason = {}));
let TempCode = class TempCode {
    id;
    userId;
    user;
    code;
    reason;
    expiresAt;
    isUsed;
    usedAt;
    attempts;
    ipAddress;
    createdAt;
};
exports.TempCode = TempCode;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TempCode.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], TempCode.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], TempCode.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 6 }),
    __metadata("design:type", String)
], TempCode.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TempCodeReason
    }),
    __metadata("design:type", String)
], TempCode.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expires_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], TempCode.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_used', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], TempCode.prototype, "isUsed", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'used_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], TempCode.prototype, "usedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'attempts', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], TempCode.prototype, "attempts", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ip_address', type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], TempCode.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], TempCode.prototype, "createdAt", void 0);
exports.TempCode = TempCode = __decorate([
    (0, typeorm_1.Entity)('temp_codes')
], TempCode);
//# sourceMappingURL=temp-code.entity.js.map