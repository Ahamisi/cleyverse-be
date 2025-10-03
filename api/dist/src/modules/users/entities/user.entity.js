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
exports.User = exports.UserGoal = exports.UserCategory = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../common/base/base.entity");
var UserCategory;
(function (UserCategory) {
    UserCategory["BUSINESS"] = "business";
    UserCategory["CREATIVE"] = "creative";
    UserCategory["EDUCATION"] = "education";
    UserCategory["ENTERTAINMENT"] = "entertainment";
    UserCategory["FASHION_BEAUTY"] = "fashion_beauty";
    UserCategory["FOOD_BEVERAGE"] = "food_beverage";
    UserCategory["GOVERNMENT_POLITICS"] = "government_politics";
    UserCategory["HEALTH_WELLNESS"] = "health_wellness";
    UserCategory["NON_PROFIT"] = "non_profit";
    UserCategory["OTHER"] = "other";
    UserCategory["TECH"] = "tech";
    UserCategory["TRAVEL_TOURISM"] = "travel_tourism";
})(UserCategory || (exports.UserCategory = UserCategory = {}));
var UserGoal;
(function (UserGoal) {
    UserGoal["CREATOR"] = "creator";
    UserGoal["BUSINESS"] = "business";
    UserGoal["PERSONAL"] = "personal";
})(UserGoal || (exports.UserGoal = UserGoal = {}));
let User = class User extends base_entity_1.BaseEntity {
    email;
    username;
    password;
    firstName;
    lastName;
    category;
    goal;
    profileTitle;
    bio;
    profileImageUrl;
    hasCompletedOnboarding;
    onboardingStep;
    isEmailVerified;
    emailVerifiedAt;
    links;
    socialLinks;
    collections;
    forms;
};
exports.User = User;
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'first_name', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_name', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: UserCategory,
        nullable: true
    }),
    __metadata("design:type", String)
], User.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: UserGoal,
        nullable: true
    }),
    __metadata("design:type", String)
], User.prototype, "goal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'profile_title', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "profileTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "bio", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'profile_image_url', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "profileImageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'has_completed_onboarding', default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "hasCompletedOnboarding", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'onboarding_step', default: 1 }),
    __metadata("design:type", Number)
], User.prototype, "onboardingStep", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_email_verified', default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isEmailVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email_verified_at', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "emailVerifiedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Link', 'user'),
    __metadata("design:type", Array)
], User.prototype, "links", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('SocialLink', 'user'),
    __metadata("design:type", Array)
], User.prototype, "socialLinks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Collection', 'user'),
    __metadata("design:type", Array)
], User.prototype, "collections", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Form', 'user'),
    __metadata("design:type", Array)
], User.prototype, "forms", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map