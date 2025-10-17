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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicProductController = void 0;
const common_1 = require("@nestjs/common");
const product_service_1 = require("../services/product.service");
let PublicProductController = class PublicProductController {
    productService;
    constructor(productService) {
        this.productService = productService;
    }
    async searchProducts(q, page, limit, category, minPrice, maxPrice, sortBy, sortOrder) {
        return this.productService.searchPublicProducts({
            q: q || '',
            page: page || 1,
            limit: limit || 20,
            category,
            minPrice,
            maxPrice,
            sortBy: sortBy || 'relevance',
            sortOrder: sortOrder || 'DESC'
        });
    }
    async getFeaturedProducts(page, limit) {
        return this.productService.getFeaturedProducts({
            page: page || 1,
            limit: limit || 20
        });
    }
};
exports.PublicProductController = PublicProductController;
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('category')),
    __param(4, (0, common_1.Query)('minPrice')),
    __param(5, (0, common_1.Query)('maxPrice')),
    __param(6, (0, common_1.Query)('sortBy')),
    __param(7, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], PublicProductController.prototype, "searchProducts", null);
__decorate([
    (0, common_1.Get)('featured'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PublicProductController.prototype, "getFeaturedProducts", null);
exports.PublicProductController = PublicProductController = __decorate([
    (0, common_1.Controller)('products/public'),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], PublicProductController);
//# sourceMappingURL=public-product.controller.js.map