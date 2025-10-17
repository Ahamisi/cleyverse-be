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
exports.StoreOnboarding = exports.OnboardingStep = exports.ProductType = exports.SalesChannel = exports.BusinessType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var BusinessType;
(function (BusinessType) {
    BusinessType["JUST_STARTING"] = "just_starting";
    BusinessType["ALREADY_SELLING"] = "already_selling";
})(BusinessType || (exports.BusinessType = BusinessType = {}));
var SalesChannel;
(function (SalesChannel) {
    SalesChannel["ONLINE_STORE"] = "online_store";
    SalesChannel["SOCIAL_MEDIA"] = "social_media";
    SalesChannel["IN_PERSON"] = "in_person";
    SalesChannel["MARKETPLACES"] = "marketplaces";
    SalesChannel["EXISTING_WEBSITE"] = "existing_website";
    SalesChannel["NOT_SURE"] = "not_sure";
})(SalesChannel || (exports.SalesChannel = SalesChannel = {}));
var ProductType;
(function (ProductType) {
    ProductType["PHYSICAL_PRODUCTS"] = "physical_products";
    ProductType["DIGITAL_PRODUCTS"] = "digital_products";
    ProductType["SERVICES"] = "services";
    ProductType["DROPSHIPPING"] = "dropshipping";
    ProductType["PRINT_ON_DEMAND"] = "print_on_demand";
    ProductType["DECIDE_LATER"] = "decide_later";
})(ProductType || (exports.ProductType = ProductType = {}));
var OnboardingStep;
(function (OnboardingStep) {
    OnboardingStep["WELCOME"] = "welcome";
    OnboardingStep["BUSINESS_TYPE"] = "business_type";
    OnboardingStep["SALES_CHANNELS"] = "sales_channels";
    OnboardingStep["PRODUCT_TYPE"] = "product_type";
    OnboardingStep["STORE_SETUP"] = "store_setup";
    OnboardingStep["COMPLETED"] = "completed";
})(OnboardingStep || (exports.OnboardingStep = OnboardingStep = {}));
let StoreOnboarding = class StoreOnboarding {
    id;
    userId;
    user;
    currentStep;
    businessType;
    salesChannels;
    productTypes;
    storeName;
    storeUrl;
    storeDescription;
    currency;
    logoUrl;
    bannerUrl;
    isCompleted;
    createdAt;
    updatedAt;
};
exports.StoreOnboarding = StoreOnboarding;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], StoreOnboarding.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], StoreOnboarding.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], StoreOnboarding.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: OnboardingStep,
        default: OnboardingStep.WELCOME
    }),
    __metadata("design:type", String)
], StoreOnboarding.prototype, "currentStep", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: BusinessType,
        nullable: true
    }),
    __metadata("design:type", Object)
], StoreOnboarding.prototype, "businessType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'simple-array',
        nullable: true
    }),
    __metadata("design:type", Object)
], StoreOnboarding.prototype, "salesChannels", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'simple-array',
        nullable: true
    }),
    __metadata("design:type", Object)
], StoreOnboarding.prototype, "productTypes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], StoreOnboarding.prototype, "storeName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], StoreOnboarding.prototype, "storeUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], StoreOnboarding.prototype, "storeDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], StoreOnboarding.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], StoreOnboarding.prototype, "logoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], StoreOnboarding.prototype, "bannerUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], StoreOnboarding.prototype, "isCompleted", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], StoreOnboarding.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], StoreOnboarding.prototype, "updatedAt", void 0);
exports.StoreOnboarding = StoreOnboarding = __decorate([
    (0, typeorm_1.Entity)('store_onboarding')
], StoreOnboarding);
//# sourceMappingURL=store-onboarding.entity.js.map