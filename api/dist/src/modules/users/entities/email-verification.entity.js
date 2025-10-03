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
exports.EmailVerification = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../common/base/base.entity");
const user_entity_1 = require("./user.entity");
let EmailVerification = class EmailVerification extends base_entity_1.BaseEntity {
    userId;
    user;
    token;
    expiresAt;
    isUsed;
};
exports.EmailVerification = EmailVerification;
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], EmailVerification.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], EmailVerification.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], EmailVerification.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'expires_at',
        type: 'timestamp',
        default: () => `NOW() + INTERVAL '24 hours'`
    }),
    __metadata("design:type", Date)
], EmailVerification.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_used', default: false }),
    __metadata("design:type", Boolean)
], EmailVerification.prototype, "isUsed", void 0);
exports.EmailVerification = EmailVerification = __decorate([
    (0, typeorm_1.Entity)('email_verifications')
], EmailVerification);
//# sourceMappingURL=email-verification.entity.js.map