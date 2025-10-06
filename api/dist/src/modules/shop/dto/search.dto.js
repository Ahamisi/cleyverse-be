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
exports.BulkUpdatePriceDto = exports.BulkUpdateTagsDto = exports.SearchProductsDto = exports.ProductAvailability = exports.SortOrder = exports.ProductSortBy = void 0;
const class_validator_1 = require("class-validator");
var ProductSortBy;
(function (ProductSortBy) {
    ProductSortBy["CREATED_AT"] = "createdAt";
    ProductSortBy["UPDATED_AT"] = "updatedAt";
    ProductSortBy["TITLE"] = "title";
    ProductSortBy["PRICE"] = "price";
    ProductSortBy["INVENTORY"] = "inventoryQuantity";
    ProductSortBy["ORDERS"] = "orderCount";
    ProductSortBy["VIEWS"] = "viewCount";
})(ProductSortBy || (exports.ProductSortBy = ProductSortBy = {}));
var SortOrder;
(function (SortOrder) {
    SortOrder["ASC"] = "ASC";
    SortOrder["DESC"] = "DESC";
})(SortOrder || (exports.SortOrder = SortOrder = {}));
var ProductAvailability;
(function (ProductAvailability) {
    ProductAvailability["IN_STOCK"] = "in_stock";
    ProductAvailability["LOW_STOCK"] = "low_stock";
    ProductAvailability["OUT_OF_STOCK"] = "out_of_stock";
})(ProductAvailability || (exports.ProductAvailability = ProductAvailability = {}));
class SearchProductsDto {
    search;
    availability;
    category;
    vendor;
    tags;
    minPrice;
    maxPrice;
    sortBy;
    sortOrder;
    page;
    limit;
}
exports.SearchProductsDto = SearchProductsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchProductsDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ProductAvailability),
    __metadata("design:type", String)
], SearchProductsDto.prototype, "availability", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchProductsDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchProductsDto.prototype, "vendor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SearchProductsDto.prototype, "tags", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], SearchProductsDto.prototype, "minPrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], SearchProductsDto.prototype, "maxPrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ProductSortBy),
    __metadata("design:type", String)
], SearchProductsDto.prototype, "sortBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(SortOrder),
    __metadata("design:type", String)
], SearchProductsDto.prototype, "sortOrder", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SearchProductsDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], SearchProductsDto.prototype, "limit", void 0);
class BulkUpdateTagsDto {
    productIds;
    tags;
}
exports.BulkUpdateTagsDto = BulkUpdateTagsDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], BulkUpdateTagsDto.prototype, "productIds", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], BulkUpdateTagsDto.prototype, "tags", void 0);
class BulkUpdatePriceDto {
    productIds;
    price;
}
exports.BulkUpdatePriceDto = BulkUpdatePriceDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], BulkUpdatePriceDto.prototype, "productIds", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], BulkUpdatePriceDto.prototype, "price", void 0);
//# sourceMappingURL=search.dto.js.map