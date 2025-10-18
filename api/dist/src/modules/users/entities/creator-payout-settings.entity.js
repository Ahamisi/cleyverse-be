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
exports.CreatorPayoutSettings = exports.PayoutStatus = exports.BankAccountType = exports.PayoutMethod = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
var PayoutMethod;
(function (PayoutMethod) {
    PayoutMethod["BANK_TRANSFER"] = "bank_transfer";
    PayoutMethod["PAYPAL"] = "paypal";
    PayoutMethod["STRIPE_CONNECT"] = "stripe_connect";
    PayoutMethod["WISE"] = "wise";
    PayoutMethod["CRYPTO"] = "crypto";
})(PayoutMethod || (exports.PayoutMethod = PayoutMethod = {}));
var BankAccountType;
(function (BankAccountType) {
    BankAccountType["CHECKING"] = "checking";
    BankAccountType["SAVINGS"] = "savings";
    BankAccountType["BUSINESS"] = "business";
})(BankAccountType || (exports.BankAccountType = BankAccountType = {}));
var PayoutStatus;
(function (PayoutStatus) {
    PayoutStatus["ACTIVE"] = "active";
    PayoutStatus["PENDING"] = "pending";
    PayoutStatus["VERIFIED"] = "verified";
    PayoutStatus["REJECTED"] = "rejected";
    PayoutStatus["SUSPENDED"] = "suspended";
})(PayoutStatus || (exports.PayoutStatus = PayoutStatus = {}));
let CreatorPayoutSettings = class CreatorPayoutSettings {
    id;
    userId;
    user;
    method;
    isDefault;
    status;
    bankName;
    accountNumber;
    routingNumber;
    swiftCode;
    iban;
    accountType;
    accountHolderName;
    country;
    address;
    city;
    state;
    zipCode;
    paypalEmail;
    paypalMerchantId;
    stripeAccountId;
    stripeConnectId;
    wiseAccountId;
    wiseEmail;
    cryptoCurrency;
    cryptoAddress;
    cryptoNetwork;
    verificationDocument;
    verifiedAt;
    verificationNotes;
    verifiedBy;
    metadata;
    externalId;
    isActive;
    createdAt;
    updatedAt;
};
exports.CreatorPayoutSettings = CreatorPayoutSettings;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CreatorPayoutSettings.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], CreatorPayoutSettings.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], CreatorPayoutSettings.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PayoutMethod }),
    __metadata("design:type", String)
], CreatorPayoutSettings.prototype, "method", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], CreatorPayoutSettings.prototype, "isDefault", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PayoutStatus, default: PayoutStatus.PENDING }),
    __metadata("design:type", String)
], CreatorPayoutSettings.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], CreatorPayoutSettings.prototype, "bankName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], CreatorPayoutSettings.prototype, "accountNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], CreatorPayoutSettings.prototype, "routingNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], CreatorPayoutSettings.prototype, "swiftCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], CreatorPayoutSettings.prototype, "iban", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: BankAccountType, nullable: true }),
    __metadata("design:type", String)
], CreatorPayoutSettings.prototype, "accountType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], CreatorPayoutSettings.prototype, "accountHolderName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 2, nullable: true }),
    __metadata("design:type", String)
], CreatorPayoutSettings.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], CreatorPayoutSettings.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], CreatorPayoutSettings.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], CreatorPayoutSettings.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", String)
], CreatorPayoutSettings.prototype, "zipCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], CreatorPayoutSettings.prototype, "paypalEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], CreatorPayoutSettings.prototype, "paypalMerchantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], CreatorPayoutSettings.prototype, "stripeAccountId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], CreatorPayoutSettings.prototype, "stripeConnectId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], CreatorPayoutSettings.prototype, "wiseAccountId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], CreatorPayoutSettings.prototype, "wiseEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], CreatorPayoutSettings.prototype, "cryptoCurrency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], CreatorPayoutSettings.prototype, "cryptoAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], CreatorPayoutSettings.prototype, "cryptoNetwork", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], CreatorPayoutSettings.prototype, "verificationDocument", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], CreatorPayoutSettings.prototype, "verifiedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], CreatorPayoutSettings.prototype, "verificationNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], CreatorPayoutSettings.prototype, "verifiedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], CreatorPayoutSettings.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], CreatorPayoutSettings.prototype, "externalId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], CreatorPayoutSettings.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CreatorPayoutSettings.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CreatorPayoutSettings.prototype, "updatedAt", void 0);
exports.CreatorPayoutSettings = CreatorPayoutSettings = __decorate([
    (0, typeorm_1.Entity)('creator_payout_settings'),
    (0, typeorm_1.Index)(['userId', 'isDefault'])
], CreatorPayoutSettings);
//# sourceMappingURL=creator-payout-settings.entity.js.map