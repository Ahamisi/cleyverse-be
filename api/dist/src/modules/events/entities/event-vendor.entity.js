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
exports.EventVendor = exports.VendorType = exports.VendorStatus = void 0;
const typeorm_1 = require("typeorm");
var VendorStatus;
(function (VendorStatus) {
    VendorStatus["APPLIED"] = "applied";
    VendorStatus["UNDER_REVIEW"] = "under_review";
    VendorStatus["APPROVED"] = "approved";
    VendorStatus["REJECTED"] = "rejected";
    VendorStatus["CANCELLED"] = "cancelled";
    VendorStatus["SUSPENDED"] = "suspended";
})(VendorStatus || (exports.VendorStatus = VendorStatus = {}));
var VendorType;
(function (VendorType) {
    VendorType["PRODUCT"] = "product";
    VendorType["SERVICE"] = "service";
    VendorType["FOOD"] = "food";
    VendorType["SPONSOR"] = "sponsor";
    VendorType["EXHIBITOR"] = "exhibitor";
})(VendorType || (exports.VendorType = VendorType = {}));
let EventVendor = class EventVendor {
    id;
    createdAt;
    updatedAt;
    eventId;
    userId;
    storeId;
    event;
    user;
    store;
    businessName;
    businessDescription;
    businessWebsite;
    businessLogoUrl;
    vendorType;
    status;
    applicationMessage;
    appliedAt;
    reviewedAt;
    reviewedBy;
    reviewNotes;
    boothNumber;
    boothSize;
    boothLocation;
    setupTime;
    breakdownTime;
    vendorFee;
    feePaid;
    paymentDueDate;
    paymentId;
    paymentMethod;
    paidAt;
    commissionRate;
    boothId;
    contactName;
    contactEmail;
    contactPhone;
    powerRequirements;
    wifiRequired;
    specialRequirements;
    equipmentNeeded;
    totalSales;
    totalOrders;
    boothVisits;
    formSubmissionId;
    isFeatured;
    displayOrder;
    isActive;
};
exports.EventVendor = EventVendor;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EventVendor.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], EventVendor.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], EventVendor.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_id', type: 'uuid' }),
    __metadata("design:type", String)
], EventVendor.prototype, "eventId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], EventVendor.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'store_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], EventVendor.prototype, "storeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Event', 'vendors'),
    (0, typeorm_1.JoinColumn)({ name: 'event_id' }),
    __metadata("design:type", Object)
], EventVendor.prototype, "event", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('User', 'eventVendors'),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", Object)
], EventVendor.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Store', 'eventVendors', { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'store_id' }),
    __metadata("design:type", Object)
], EventVendor.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'business_name', type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], EventVendor.prototype, "businessName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'business_description', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], EventVendor.prototype, "businessDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'business_website', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], EventVendor.prototype, "businessWebsite", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'business_logo_url', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], EventVendor.prototype, "businessLogoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vendor_type', type: 'enum', enum: VendorType, default: VendorType.PRODUCT }),
    __metadata("design:type", String)
], EventVendor.prototype, "vendorType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: VendorStatus, default: VendorStatus.APPLIED }),
    __metadata("design:type", String)
], EventVendor.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'application_message', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], EventVendor.prototype, "applicationMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'applied_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], EventVendor.prototype, "appliedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reviewed_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], EventVendor.prototype, "reviewedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reviewed_by', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], EventVendor.prototype, "reviewedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'review_notes', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], EventVendor.prototype, "reviewNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'booth_number', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], EventVendor.prototype, "boothNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'booth_size', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], EventVendor.prototype, "boothSize", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'booth_location', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", Object)
], EventVendor.prototype, "boothLocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'setup_time', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], EventVendor.prototype, "setupTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'breakdown_time', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], EventVendor.prototype, "breakdownTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vendor_fee', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], EventVendor.prototype, "vendorFee", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fee_paid', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], EventVendor.prototype, "feePaid", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_due_date', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], EventVendor.prototype, "paymentDueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_id', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], EventVendor.prototype, "paymentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_method', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], EventVendor.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'paid_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], EventVendor.prototype, "paidAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'commission_rate', type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], EventVendor.prototype, "commissionRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'booth_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], EventVendor.prototype, "boothId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_name', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], EventVendor.prototype, "contactName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_email', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], EventVendor.prototype, "contactEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_phone', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], EventVendor.prototype, "contactPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'power_requirements', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], EventVendor.prototype, "powerRequirements", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'wifi_required', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], EventVendor.prototype, "wifiRequired", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'special_requirements', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], EventVendor.prototype, "specialRequirements", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'equipment_needed', type: 'text', array: true, nullable: true }),
    __metadata("design:type", Object)
], EventVendor.prototype, "equipmentNeeded", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_sales', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], EventVendor.prototype, "totalSales", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_orders', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], EventVendor.prototype, "totalOrders", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'booth_visits', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], EventVendor.prototype, "boothVisits", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'form_submission_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], EventVendor.prototype, "formSubmissionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_featured', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], EventVendor.prototype, "isFeatured", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'display_order', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], EventVendor.prototype, "displayOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], EventVendor.prototype, "isActive", void 0);
exports.EventVendor = EventVendor = __decorate([
    (0, typeorm_1.Entity)('event_vendors')
], EventVendor);
//# sourceMappingURL=event-vendor.entity.js.map