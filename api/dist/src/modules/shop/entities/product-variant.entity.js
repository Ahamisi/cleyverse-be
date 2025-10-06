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
exports.ProductVariant = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../common/base/base.entity");
const product_entity_1 = require("./product.entity");
let ProductVariant = class ProductVariant extends base_entity_1.BaseEntity {
    productId;
    product;
    title;
    sku;
    barcode;
    price;
    compareAtPrice;
    costPerItem;
    inventoryQuantity;
    inventoryPolicy;
    option1Name;
    option1Value;
    option2Name;
    option2Value;
    option3Name;
    option3Value;
    weight;
    weightUnit;
    isActive;
    displayOrder;
};
exports.ProductVariant = ProductVariant;
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id', type: 'uuid' }),
    __metadata("design:type", String)
], ProductVariant.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, product => product.variants, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], ProductVariant.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], ProductVariant.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "sku", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "barcode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'compare_at_price', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "compareAtPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cost_per_item', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "costPerItem", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'inventory_quantity', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "inventoryQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'inventory_policy', type: 'varchar', length: 50, default: 'deny' }),
    __metadata("design:type", String)
], ProductVariant.prototype, "inventoryPolicy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'option1_name', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "option1Name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'option1_value', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "option1Value", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'option2_name', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "option2Name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'option2_value', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "option2Value", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'option3_name', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "option3Name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'option3_value', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "option3Value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'weight_unit', type: 'varchar', length: 10, default: 'kg' }),
    __metadata("design:type", String)
], ProductVariant.prototype, "weightUnit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], ProductVariant.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'display_order', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "displayOrder", void 0);
exports.ProductVariant = ProductVariant = __decorate([
    (0, typeorm_1.Entity)('product_variants'),
    (0, typeorm_1.Index)(['productId', 'isActive'])
], ProductVariant);
//# sourceMappingURL=product-variant.entity.js.map