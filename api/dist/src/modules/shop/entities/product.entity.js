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
exports.Product = exports.ProductType = exports.ProductStatus = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../common/base/base.entity");
const store_entity_1 = require("./store.entity");
const product_image_entity_1 = require("./product-image.entity");
const product_variant_entity_1 = require("./product-variant.entity");
const digital_product_entity_1 = require("./digital-product.entity");
var ProductStatus;
(function (ProductStatus) {
    ProductStatus["DRAFT"] = "draft";
    ProductStatus["ACTIVE"] = "active";
    ProductStatus["ARCHIVED"] = "archived";
})(ProductStatus || (exports.ProductStatus = ProductStatus = {}));
var ProductType;
(function (ProductType) {
    ProductType["PHYSICAL"] = "physical";
    ProductType["DIGITAL"] = "digital";
    ProductType["SERVICE"] = "service";
})(ProductType || (exports.ProductType = ProductType = {}));
let Product = class Product extends base_entity_1.BaseEntity {
    storeId;
    store;
    images;
    variants;
    digitalProduct;
    title;
    description;
    handle;
    type;
    status;
    price;
    compareAtPrice;
    costPerItem;
    trackQuantity;
    inventoryQuantity;
    continueSelling;
    requiresShipping;
    weight;
    weightUnit;
    seoTitle;
    seoDescription;
    productCategory;
    productType;
    vendor;
    tags;
    isPublished;
    publishedAt;
    isFeatured;
    viewCount;
    orderCount;
    archivedAt;
};
exports.Product = Product;
__decorate([
    (0, typeorm_1.Column)({ name: 'store_id', type: 'uuid' }),
    __metadata("design:type", String)
], Product.prototype, "storeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => store_entity_1.Store, store => store.products, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'store_id' }),
    __metadata("design:type", store_entity_1.Store)
], Product.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_image_entity_1.ProductImage, image => image.product, { cascade: true }),
    __metadata("design:type", Array)
], Product.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_variant_entity_1.ProductVariant, variant => variant.product, { cascade: true }),
    __metadata("design:type", Array)
], Product.prototype, "variants", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => digital_product_entity_1.DigitalProduct, digitalProduct => digitalProduct.product, { cascade: true }),
    __metadata("design:type", digital_product_entity_1.DigitalProduct)
], Product.prototype, "digitalProduct", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], Product.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], Product.prototype, "handle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ProductType, default: ProductType.PHYSICAL }),
    __metadata("design:type", String)
], Product.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ProductStatus, default: ProductStatus.DRAFT }),
    __metadata("design:type", String)
], Product.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'compare_at_price', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "compareAtPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cost_per_item', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "costPerItem", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'track_quantity', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "trackQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'inventory_quantity', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "inventoryQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'continue_selling_when_out_of_stock', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Product.prototype, "continueSelling", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'requires_shipping', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "requiresShipping", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'weight_unit', type: 'varchar', length: 10, default: 'kg' }),
    __metadata("design:type", String)
], Product.prototype, "weightUnit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'seo_title', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "seoTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'seo_description', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "seoDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_category', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "productCategory", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_type', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "productType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vendor', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "vendor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', array: true, nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_published', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Product.prototype, "isPublished", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'published_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "publishedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_featured', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Product.prototype, "isFeatured", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'view_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "viewCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "orderCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'archived_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "archivedAt", void 0);
exports.Product = Product = __decorate([
    (0, typeorm_1.Entity)('products'),
    (0, typeorm_1.Index)(['storeId', 'status']),
    (0, typeorm_1.Index)(['storeId', 'createdAt']),
    (0, typeorm_1.Index)(['title']),
    (0, typeorm_1.Index)(['storeId', 'handle'], { unique: true })
], Product);
//# sourceMappingURL=product.entity.js.map