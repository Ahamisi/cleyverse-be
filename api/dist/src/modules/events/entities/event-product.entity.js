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
exports.EventProduct = exports.EventProductStatus = void 0;
const typeorm_1 = require("typeorm");
var EventProductStatus;
(function (EventProductStatus) {
    EventProductStatus["PENDING"] = "pending";
    EventProductStatus["APPROVED"] = "approved";
    EventProductStatus["REJECTED"] = "rejected";
    EventProductStatus["ACTIVE"] = "active";
    EventProductStatus["INACTIVE"] = "inactive";
})(EventProductStatus || (exports.EventProductStatus = EventProductStatus = {}));
let EventProduct = class EventProduct {
    id;
    createdAt;
    updatedAt;
    eventId;
    productId;
    vendorId;
    event;
    product;
    vendor;
    status;
    eventPrice;
    eventDiscount;
    availableQuantity;
    minOrderQuantity;
    maxOrderQuantity;
    isFeatured;
    displayOrder;
    boothExclusive;
    eventDescription;
    eventTags;
    demoAvailable;
    demoTimes;
    approvedBy;
    approvedAt;
    rejectionReason;
    viewCount;
    ordersCount;
    totalRevenue;
    demoRequests;
};
exports.EventProduct = EventProduct;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EventProduct.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], EventProduct.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], EventProduct.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_id', type: 'uuid' }),
    __metadata("design:type", String)
], EventProduct.prototype, "eventId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id', type: 'uuid' }),
    __metadata("design:type", String)
], EventProduct.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vendor_id', type: 'uuid' }),
    __metadata("design:type", String)
], EventProduct.prototype, "vendorId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Event', 'products'),
    (0, typeorm_1.JoinColumn)({ name: 'event_id' }),
    __metadata("design:type", Object)
], EventProduct.prototype, "event", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Product', 'eventProducts'),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", Object)
], EventProduct.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('EventVendor', 'products'),
    (0, typeorm_1.JoinColumn)({ name: 'vendor_id' }),
    __metadata("design:type", Object)
], EventProduct.prototype, "vendor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: EventProductStatus, default: EventProductStatus.PENDING }),
    __metadata("design:type", String)
], EventProduct.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_price', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], EventProduct.prototype, "eventPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_discount', type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], EventProduct.prototype, "eventDiscount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'available_quantity', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], EventProduct.prototype, "availableQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'min_order_quantity', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], EventProduct.prototype, "minOrderQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_order_quantity', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], EventProduct.prototype, "maxOrderQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_featured', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], EventProduct.prototype, "isFeatured", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'display_order', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], EventProduct.prototype, "displayOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'booth_exclusive', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], EventProduct.prototype, "boothExclusive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_description', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], EventProduct.prototype, "eventDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_tags', type: 'text', array: true, nullable: true }),
    __metadata("design:type", Object)
], EventProduct.prototype, "eventTags", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'demo_available', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], EventProduct.prototype, "demoAvailable", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'demo_times', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], EventProduct.prototype, "demoTimes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_by', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], EventProduct.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], EventProduct.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rejection_reason', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], EventProduct.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'view_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], EventProduct.prototype, "viewCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'orders_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], EventProduct.prototype, "ordersCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_revenue', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], EventProduct.prototype, "totalRevenue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'demo_requests', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], EventProduct.prototype, "demoRequests", void 0);
exports.EventProduct = EventProduct = __decorate([
    (0, typeorm_1.Entity)('event_products')
], EventProduct);
//# sourceMappingURL=event-product.entity.js.map