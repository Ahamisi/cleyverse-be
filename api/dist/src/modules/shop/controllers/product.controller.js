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
exports.PublicProductController = exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const product_service_1 = require("../services/product.service");
const product_dto_1 = require("../dto/product.dto");
const search_dto_1 = require("../dto/search.dto");
let ProductController = class ProductController {
    productService;
    constructor(productService) {
        this.productService = productService;
    }
    async create(req, storeId, createProductDto) {
        const product = await this.productService.createProduct(req.user.userId, storeId, createProductDto);
        return { message: 'Product created successfully', product };
    }
    async searchProducts(req, storeId, searchDto) {
        const result = await this.productService.searchProducts(req.user.userId, storeId, searchDto);
        return { message: 'Products searched successfully', ...result };
    }
    async getAllTags(req, storeId) {
        const tags = await this.productService.getAllTags(req.user.userId, storeId);
        return { message: 'Tags retrieved successfully', tags };
    }
    async getProductsByTag(req, storeId, tag) {
        const products = await this.productService.getProductsByTag(req.user.userId, storeId, tag);
        return { message: 'Products by tag retrieved successfully', products, total: products.length };
    }
    async bulkUpdateTags(req, storeId, bulkUpdateDto) {
        const result = await this.productService.bulkUpdateTags(req.user.userId, storeId, bulkUpdateDto);
        return { message: 'Products tags updated successfully', ...result };
    }
    async bulkUpdatePrice(req, storeId, bulkUpdateDto) {
        const result = await this.productService.bulkUpdatePrice(req.user.userId, storeId, bulkUpdateDto);
        return { message: 'Products price updated successfully', ...result };
    }
    async findAll(req, storeId, includeInactive = 'false') {
        const products = await this.productService.getStoreProducts(req.user.userId, storeId, includeInactive === 'true');
        return { message: 'Products retrieved successfully', products, total: products.length };
    }
    async findOne(req, storeId, id) {
        const product = await this.productService.getProductById(req.user.userId, storeId, id);
        return { message: 'Product retrieved successfully', product };
    }
    async update(req, storeId, id, updateProductDto) {
        const product = await this.productService.updateProduct(req.user.userId, storeId, id, updateProductDto);
        return { message: 'Product updated successfully', product };
    }
    async updateStatus(req, storeId, id, updateStatusDto) {
        const product = await this.productService.updateProductStatus(req.user.userId, storeId, id, updateStatusDto);
        return { message: 'Product status updated successfully', product };
    }
    async publish(req, storeId, id, publishDto) {
        const product = await this.productService.publishProduct(req.user.userId, storeId, id, publishDto);
        return { message: 'Product publish status updated successfully', product };
    }
    async duplicate(req, storeId, id) {
        const product = await this.productService.duplicateProduct(req.user.userId, storeId, id);
        return { message: 'Product duplicated successfully', product };
    }
    async remove(req, storeId, id) {
        await this.productService.deleteProduct(req.user.userId, storeId, id);
        return { message: 'Product deleted successfully' };
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('storeId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, product_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('storeId')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, search_dto_1.SearchProductsDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "searchProducts", null);
__decorate([
    (0, common_1.Get)('tags'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('storeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getAllTags", null);
__decorate([
    (0, common_1.Get)('tags/:tag'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('storeId')),
    __param(2, (0, common_1.Param)('tag')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getProductsByTag", null);
__decorate([
    (0, common_1.Put)('bulk/tags'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('storeId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, search_dto_1.BulkUpdateTagsDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "bulkUpdateTags", null);
__decorate([
    (0, common_1.Put)('bulk/price'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('storeId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, search_dto_1.BulkUpdatePriceDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "bulkUpdatePrice", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('storeId')),
    __param(2, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('storeId')),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('storeId')),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('storeId')),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, product_dto_1.UpdateProductStatusDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Put)(':id/publish'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('storeId')),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, product_dto_1.PublishProductDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "publish", null);
__decorate([
    (0, common_1.Post)(':id/duplicate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('storeId')),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "duplicate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('storeId')),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "remove", null);
exports.ProductController = ProductController = __decorate([
    (0, common_1.Controller)('stores/:storeId/products'),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductController);
let PublicProductController = class PublicProductController {
    productService;
    constructor(productService) {
        this.productService = productService;
    }
    async getPublicProduct(storeUrl, productHandle) {
        const product = await this.productService.getPublicProduct(storeUrl, productHandle);
        return { message: 'Product retrieved successfully', product };
    }
};
exports.PublicProductController = PublicProductController;
__decorate([
    (0, common_1.Get)(':storeUrl/products/:productHandle'),
    __param(0, (0, common_1.Param)('storeUrl')),
    __param(1, (0, common_1.Param)('productHandle')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PublicProductController.prototype, "getPublicProduct", null);
exports.PublicProductController = PublicProductController = __decorate([
    (0, common_1.Controller)('public'),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], PublicProductController);
//# sourceMappingURL=product.controller.js.map