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
exports.CollectionsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const collection_service_1 = require("../services/collection.service");
const collection_dto_1 = require("../dto/collection.dto");
const collection_entity_1 = require("../entities/collection.entity");
let CollectionsController = class CollectionsController {
    collectionService;
    constructor(collectionService) {
        this.collectionService = collectionService;
    }
    async createCollection(req, createCollectionDto) {
        const collection = await this.collectionService.createCollection(req.user.userId, createCollectionDto);
        return {
            message: 'Collection created successfully',
            collection
        };
    }
    async getUserCollections(req, includeInactive = 'false') {
        const collections = await this.collectionService.getUserCollections(req.user.userId, includeInactive === 'true');
        return {
            message: 'Collections retrieved successfully',
            collections,
            total: collections.length
        };
    }
    async getAnalytics(req, collectionId) {
        const analytics = await this.collectionService.getCollectionAnalytics(req.user.userId, collectionId);
        return {
            message: 'Collection analytics retrieved successfully',
            analytics
        };
    }
    async getArchivedCollections(req) {
        const collections = await this.collectionService.getArchivedCollections(req.user.userId);
        return {
            message: 'Archived collections retrieved successfully',
            collections,
            total: collections.length
        };
    }
    async getAvailableLayouts() {
        const layouts = Object.values(collection_entity_1.CollectionLayout).map(layout => ({
            value: layout,
            label: this.formatLayoutLabel(layout),
            description: this.getLayoutDescription(layout)
        }));
        return {
            message: 'Available layouts retrieved successfully',
            layouts
        };
    }
    async reorderCollections(req, reorderCollectionsDto) {
        const collections = await this.collectionService.reorderCollections(req.user.userId, reorderCollectionsDto.collectionIds);
        return {
            message: 'Collections reordered successfully',
            collections
        };
    }
    async getCollection(req, id) {
        const collection = await this.collectionService.getCollectionById(req.user.userId, id);
        return {
            message: 'Collection retrieved successfully',
            collection
        };
    }
    async updateCollection(req, id, updateCollectionDto) {
        const collection = await this.collectionService.updateCollection(req.user.userId, id, updateCollectionDto);
        return {
            message: 'Collection updated successfully',
            collection
        };
    }
    async deleteCollection(req, id) {
        await this.collectionService.deleteCollection(req.user.userId, id);
        return {
            message: 'Collection deleted successfully'
        };
    }
    async addLinksToCollection(req, id, addLinksDto) {
        const collection = await this.collectionService.addLinksToCollection(req.user.userId, id, addLinksDto);
        return {
            message: 'Links added to collection successfully',
            collection
        };
    }
    async removeLinksFromCollection(req, id, removeLinksDto) {
        const collection = await this.collectionService.removeLinksFromCollection(req.user.userId, id, removeLinksDto);
        return {
            message: 'Links removed from collection successfully',
            collection
        };
    }
    async reorderLinksInCollection(req, id, reorderDto) {
        const collection = await this.collectionService.reorderLinksInCollection(req.user.userId, id, reorderDto);
        return {
            message: 'Links reordered in collection successfully',
            collection
        };
    }
    async updateLayout(req, id, layoutDto) {
        const collection = await this.collectionService.updateCollectionLayout(req.user.userId, id, layoutDto);
        return {
            message: 'Collection layout updated successfully',
            collection
        };
    }
    async updateStyle(req, id, styleDto) {
        const collection = await this.collectionService.updateCollectionStyle(req.user.userId, id, styleDto);
        return {
            message: 'Collection style updated successfully',
            collection
        };
    }
    async updateSettings(req, id, settingsDto) {
        const collection = await this.collectionService.updateCollectionSettings(req.user.userId, id, settingsDto);
        return {
            message: 'Collection settings updated successfully',
            collection
        };
    }
    async archiveCollection(req, id) {
        const collection = await this.collectionService.archiveCollection(req.user.userId, id);
        return {
            message: 'Collection archived successfully',
            collection
        };
    }
    async restoreCollection(req, id) {
        const collection = await this.collectionService.restoreCollection(req.user.userId, id);
        return {
            message: 'Collection restored successfully',
            collection
        };
    }
    formatLayoutLabel(layout) {
        const labels = {
            [collection_entity_1.CollectionLayout.STACK]: 'Stack',
            [collection_entity_1.CollectionLayout.GRID]: 'Grid',
            [collection_entity_1.CollectionLayout.CAROUSEL]: 'Carousel'
        };
        return labels[layout] || layout;
    }
    getLayoutDescription(layout) {
        const descriptions = {
            [collection_entity_1.CollectionLayout.STACK]: 'Display your links in the classic Linktree stack.',
            [collection_entity_1.CollectionLayout.GRID]: 'Organize links in a responsive grid layout.',
            [collection_entity_1.CollectionLayout.CAROUSEL]: 'Showcase links in a swipeable carousel format.'
        };
        return descriptions[layout] || '';
    }
};
exports.CollectionsController = CollectionsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, collection_dto_1.CreateCollectionDto]),
    __metadata("design:returntype", Promise)
], CollectionsController.prototype, "createCollection", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CollectionsController.prototype, "getUserCollections", null);
__decorate([
    (0, common_1.Get)('analytics'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('collectionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CollectionsController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Get)('archived'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CollectionsController.prototype, "getArchivedCollections", null);
__decorate([
    (0, common_1.Get)('layouts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CollectionsController.prototype, "getAvailableLayouts", null);
__decorate([
    (0, common_1.Put)('reorder'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, collection_dto_1.ReorderCollectionsDto]),
    __metadata("design:returntype", Promise)
], CollectionsController.prototype, "reorderCollections", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CollectionsController.prototype, "getCollection", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, collection_dto_1.UpdateCollectionDto]),
    __metadata("design:returntype", Promise)
], CollectionsController.prototype, "updateCollection", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CollectionsController.prototype, "deleteCollection", null);
__decorate([
    (0, common_1.Post)(':id/links'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, collection_dto_1.AddLinksToCollectionDto]),
    __metadata("design:returntype", Promise)
], CollectionsController.prototype, "addLinksToCollection", null);
__decorate([
    (0, common_1.Delete)(':id/links'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, collection_dto_1.RemoveLinksFromCollectionDto]),
    __metadata("design:returntype", Promise)
], CollectionsController.prototype, "removeLinksFromCollection", null);
__decorate([
    (0, common_1.Put)(':id/links/reorder'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, collection_dto_1.ReorderLinksInCollectionDto]),
    __metadata("design:returntype", Promise)
], CollectionsController.prototype, "reorderLinksInCollection", null);
__decorate([
    (0, common_1.Put)(':id/layout'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, collection_dto_1.CollectionLayoutDto]),
    __metadata("design:returntype", Promise)
], CollectionsController.prototype, "updateLayout", null);
__decorate([
    (0, common_1.Put)(':id/style'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, collection_dto_1.CollectionStyleDto]),
    __metadata("design:returntype", Promise)
], CollectionsController.prototype, "updateStyle", null);
__decorate([
    (0, common_1.Put)(':id/settings'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, collection_dto_1.CollectionSettingsDto]),
    __metadata("design:returntype", Promise)
], CollectionsController.prototype, "updateSettings", null);
__decorate([
    (0, common_1.Put)(':id/archive'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CollectionsController.prototype, "archiveCollection", null);
__decorate([
    (0, common_1.Put)(':id/restore'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CollectionsController.prototype, "restoreCollection", null);
exports.CollectionsController = CollectionsController = __decorate([
    (0, common_1.Controller)('collections'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [collection_service_1.CollectionService])
], CollectionsController);
//# sourceMappingURL=collections.controller.js.map