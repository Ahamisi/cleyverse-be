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
exports.EventBooth = exports.BoothType = exports.BoothStatus = void 0;
const typeorm_1 = require("typeorm");
var BoothStatus;
(function (BoothStatus) {
    BoothStatus["AVAILABLE"] = "available";
    BoothStatus["RESERVED"] = "reserved";
    BoothStatus["OCCUPIED"] = "occupied";
    BoothStatus["MAINTENANCE"] = "maintenance";
})(BoothStatus || (exports.BoothStatus = BoothStatus = {}));
var BoothType;
(function (BoothType) {
    BoothType["STANDARD"] = "standard";
    BoothType["PREMIUM"] = "premium";
    BoothType["CORNER"] = "corner";
    BoothType["ISLAND"] = "island";
    BoothType["FOOD"] = "food";
    BoothType["TECH"] = "tech";
})(BoothType || (exports.BoothType = BoothType = {}));
let EventBooth = class EventBooth {
    id;
    createdAt;
    updatedAt;
    eventId;
    vendorId;
    boothNumber;
    boothType;
    status;
    section;
    floor;
    positionX;
    positionY;
    sizeWidth;
    sizeLength;
    sizeDescription;
    basePrice;
    premiumMultiplier;
    hasPower;
    powerOutlets;
    hasWifi;
    hasStorage;
    hasSink;
    maxOccupancy;
    setupTime;
    breakdownTime;
    description;
    specialRequirements;
    accessibilityFeatures;
};
exports.EventBooth = EventBooth;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EventBooth.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], EventBooth.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], EventBooth.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_id', type: 'uuid' }),
    __metadata("design:type", String)
], EventBooth.prototype, "eventId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vendor_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], EventBooth.prototype, "vendorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'booth_number', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], EventBooth.prototype, "boothNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'booth_type', type: 'enum', enum: BoothType }),
    __metadata("design:type", String)
], EventBooth.prototype, "boothType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', enum: BoothStatus, default: BoothStatus.AVAILABLE }),
    __metadata("design:type", String)
], EventBooth.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'section', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], EventBooth.prototype, "section", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'floor', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], EventBooth.prototype, "floor", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'position_x', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], EventBooth.prototype, "positionX", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'position_y', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], EventBooth.prototype, "positionY", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'size_width', type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], EventBooth.prototype, "sizeWidth", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'size_length', type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], EventBooth.prototype, "sizeLength", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'size_description', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], EventBooth.prototype, "sizeDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'base_price', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], EventBooth.prototype, "basePrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'premium_multiplier', type: 'decimal', precision: 3, scale: 2, default: 1.0 }),
    __metadata("design:type", Number)
], EventBooth.prototype, "premiumMultiplier", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'has_power', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], EventBooth.prototype, "hasPower", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'power_outlets', type: 'int', default: 2 }),
    __metadata("design:type", Number)
], EventBooth.prototype, "powerOutlets", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'has_wifi', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], EventBooth.prototype, "hasWifi", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'has_storage', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], EventBooth.prototype, "hasStorage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'has_sink', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], EventBooth.prototype, "hasSink", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_occupancy', type: 'int', default: 4 }),
    __metadata("design:type", Number)
], EventBooth.prototype, "maxOccupancy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'setup_time', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], EventBooth.prototype, "setupTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'breakdown_time', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], EventBooth.prototype, "breakdownTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], EventBooth.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'special_requirements', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], EventBooth.prototype, "specialRequirements", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'accessibility_features', type: 'text', array: true, nullable: true }),
    __metadata("design:type", Object)
], EventBooth.prototype, "accessibilityFeatures", void 0);
exports.EventBooth = EventBooth = __decorate([
    (0, typeorm_1.Entity)('event_booths')
], EventBooth);
//# sourceMappingURL=event-booth.entity.js.map