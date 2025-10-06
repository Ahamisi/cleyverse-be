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
exports.Store = exports.StoreCurrency = exports.StoreStatus = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../common/base/base.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const product_entity_1 = require("./product.entity");
var StoreStatus;
(function (StoreStatus) {
    StoreStatus["DRAFT"] = "draft";
    StoreStatus["ACTIVE"] = "active";
    StoreStatus["PAUSED"] = "paused";
    StoreStatus["SUSPENDED"] = "suspended";
    StoreStatus["ARCHIVED"] = "archived";
})(StoreStatus || (exports.StoreStatus = StoreStatus = {}));
var StoreCurrency;
(function (StoreCurrency) {
    StoreCurrency["USD"] = "USD";
    StoreCurrency["EUR"] = "EUR";
    StoreCurrency["GBP"] = "GBP";
    StoreCurrency["CAD"] = "CAD";
    StoreCurrency["AUD"] = "AUD";
    StoreCurrency["NGN"] = "NGN";
})(StoreCurrency || (exports.StoreCurrency = StoreCurrency = {}));
let Store = class Store extends base_entity_1.BaseEntity {
    userId;
    user;
    products;
    name;
    description;
    storeUrl;
    logoUrl;
    bannerUrl;
    status;
    currency;
    isActive;
    allowReviews;
    autoApproveReviews;
    enableInventoryTracking;
    lowStockThreshold;
    returnPolicy;
    shippingPolicy;
    privacyPolicy;
    termsOfService;
    totalProducts;
    totalOrders;
    totalRevenue;
    archivedAt;
    deletedAt;
    suspendedAt;
    suspendedReason;
};
exports.Store = Store;
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], Store.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.stores, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Store.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_entity_1.Product, product => product.store),
    __metadata("design:type", Array)
], Store.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Store.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Store.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'store_url', type: 'varchar', length: 100, unique: true }),
    __metadata("design:type", String)
], Store.prototype, "storeUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'logo_url', type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Store.prototype, "logoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'banner_url', type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Store.prototype, "bannerUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: StoreStatus, default: StoreStatus.DRAFT }),
    __metadata("design:type", String)
], Store.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: StoreCurrency, default: StoreCurrency.USD }),
    __metadata("design:type", String)
], Store.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Store.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'allow_reviews', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Store.prototype, "allowReviews", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'auto_approve_reviews', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Store.prototype, "autoApproveReviews", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'enable_inventory_tracking', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Store.prototype, "enableInventoryTracking", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'low_stock_threshold', type: 'int', default: 5 }),
    __metadata("design:type", Number)
], Store.prototype, "lowStockThreshold", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'return_policy', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Store.prototype, "returnPolicy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_policy', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Store.prototype, "shippingPolicy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'privacy_policy', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Store.prototype, "privacyPolicy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'terms_of_service', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Store.prototype, "termsOfService", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_products', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Store.prototype, "totalProducts", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_orders', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Store.prototype, "totalOrders", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_revenue', type: 'decimal', precision: 10, scale: 2, default: 0.00 }),
    __metadata("design:type", Number)
], Store.prototype, "totalRevenue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'archived_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Store.prototype, "archivedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'deleted_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Store.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'suspended_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Store.prototype, "suspendedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'suspended_reason', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Store.prototype, "suspendedReason", void 0);
exports.Store = Store = __decorate([
    (0, typeorm_1.Entity)('stores'),
    (0, typeorm_1.Index)(['userId', 'status']),
    (0, typeorm_1.Index)(['userId', 'createdAt'])
], Store);
//# sourceMappingURL=store.entity.js.map