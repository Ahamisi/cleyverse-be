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
exports.CreatorSettings = exports.LanguagePreference = exports.ThemePreference = exports.PayoutFrequency = exports.NotificationPreference = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
var NotificationPreference;
(function (NotificationPreference) {
    NotificationPreference["EMAIL"] = "email";
    NotificationPreference["SMS"] = "sms";
    NotificationPreference["PUSH"] = "push";
    NotificationPreference["NONE"] = "none";
})(NotificationPreference || (exports.NotificationPreference = NotificationPreference = {}));
var PayoutFrequency;
(function (PayoutFrequency) {
    PayoutFrequency["DAILY"] = "daily";
    PayoutFrequency["WEEKLY"] = "weekly";
    PayoutFrequency["MONTHLY"] = "monthly";
    PayoutFrequency["MANUAL"] = "manual";
})(PayoutFrequency || (exports.PayoutFrequency = PayoutFrequency = {}));
var ThemePreference;
(function (ThemePreference) {
    ThemePreference["LIGHT"] = "light";
    ThemePreference["DARK"] = "dark";
    ThemePreference["AUTO"] = "auto";
})(ThemePreference || (exports.ThemePreference = ThemePreference = {}));
var LanguagePreference;
(function (LanguagePreference) {
    LanguagePreference["EN"] = "en";
    LanguagePreference["ES"] = "es";
    LanguagePreference["FR"] = "fr";
    LanguagePreference["DE"] = "de";
    LanguagePreference["IT"] = "it";
    LanguagePreference["PT"] = "pt";
    LanguagePreference["ZH"] = "zh";
    LanguagePreference["JA"] = "ja";
    LanguagePreference["KO"] = "ko";
    LanguagePreference["AR"] = "ar";
})(LanguagePreference || (exports.LanguagePreference = LanguagePreference = {}));
let CreatorSettings = class CreatorSettings {
    id;
    userId;
    user;
    theme;
    language;
    emailNotifications;
    smsNotifications;
    pushNotifications;
    marketingEmails;
    publicProfile;
    showEmail;
    showPhone;
    allowMessages;
    allowComments;
    payoutFrequency;
    minimumPayoutThreshold;
    autoPayout;
    preferredCurrency;
    taxCountry;
    taxId;
    businessName;
    businessAddress;
    businessCity;
    businessState;
    businessZipCode;
    customSettings;
    bio;
    website;
    socialLinks;
    createdAt;
    updatedAt;
};
exports.CreatorSettings = CreatorSettings;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CreatorSettings.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', unique: true }),
    __metadata("design:type", String)
], CreatorSettings.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], CreatorSettings.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ThemePreference, default: ThemePreference.AUTO }),
    __metadata("design:type", String)
], CreatorSettings.prototype, "theme", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: LanguagePreference, default: LanguagePreference.EN }),
    __metadata("design:type", String)
], CreatorSettings.prototype, "language", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], CreatorSettings.prototype, "emailNotifications", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], CreatorSettings.prototype, "smsNotifications", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], CreatorSettings.prototype, "pushNotifications", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], CreatorSettings.prototype, "marketingEmails", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], CreatorSettings.prototype, "publicProfile", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], CreatorSettings.prototype, "showEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], CreatorSettings.prototype, "showPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], CreatorSettings.prototype, "allowMessages", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], CreatorSettings.prototype, "allowComments", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PayoutFrequency, default: PayoutFrequency.WEEKLY }),
    __metadata("design:type", String)
], CreatorSettings.prototype, "payoutFrequency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 50.00 }),
    __metadata("design:type", Number)
], CreatorSettings.prototype, "minimumPayoutThreshold", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], CreatorSettings.prototype, "autoPayout", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 3, default: 'USD' }),
    __metadata("design:type", String)
], CreatorSettings.prototype, "preferredCurrency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 2, default: 'US' }),
    __metadata("design:type", String)
], CreatorSettings.prototype, "taxCountry", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], CreatorSettings.prototype, "taxId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], CreatorSettings.prototype, "businessName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], CreatorSettings.prototype, "businessAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], CreatorSettings.prototype, "businessCity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], CreatorSettings.prototype, "businessState", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", String)
], CreatorSettings.prototype, "businessZipCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], CreatorSettings.prototype, "customSettings", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CreatorSettings.prototype, "bio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], CreatorSettings.prototype, "website", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], CreatorSettings.prototype, "socialLinks", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CreatorSettings.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CreatorSettings.prototype, "updatedAt", void 0);
exports.CreatorSettings = CreatorSettings = __decorate([
    (0, typeorm_1.Entity)('creator_settings')
], CreatorSettings);
//# sourceMappingURL=creator-settings.entity.js.map