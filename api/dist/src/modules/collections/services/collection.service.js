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
exports.CollectionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const base_service_1 = require("../../../common/base/base.service");
const collection_entity_1 = require("../entities/collection.entity");
const link_entity_1 = require("../../links/entities/link.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let CollectionService = class CollectionService extends base_service_1.BaseService {
    collectionRepository;
    linkRepository;
    userRepository;
    constructor(collectionRepository, linkRepository, userRepository) {
        super(collectionRepository);
        this.collectionRepository = collectionRepository;
        this.linkRepository = linkRepository;
        this.userRepository = userRepository;
    }
    getEntityName() {
        return 'Collection';
    }
    async createCollection(userId, createCollectionDto) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        const maxOrder = await this.collectionRepository
            .createQueryBuilder('collection')
            .select('MAX(collection.displayOrder)', 'max')
            .where('collection.userId = :userId', { userId })
            .getRawOne();
        const displayOrder = createCollectionDto.displayOrder ?? (maxOrder?.max || 0) + 1;
        const collection = this.collectionRepository.create({
            ...createCollectionDto,
            userId,
            displayOrder,
            layout: createCollectionDto.layout || collection_entity_1.CollectionLayout.STACK,
        });
        return this.collectionRepository.save(collection);
    }
    async getUserCollections(userId, includeInactive = false) {
        let collectionsQuery = 'SELECT * FROM collections WHERE user_id = $1';
        if (!includeInactive) {
            collectionsQuery += ' AND is_active = true';
        }
        collectionsQuery += ' ORDER BY display_order ASC, created_at ASC';
        const collections = await this.collectionRepository.query(collectionsQuery, [userId]);
        const collectionsWithLinks = await Promise.all(collections.map(async (collection) => {
            const links = await this.linkRepository.query('SELECT * FROM links WHERE collection_id = $1 AND is_active = true ORDER BY display_order ASC', [collection.id]);
            return {
                ...collection,
                links: links,
                linkCount: links.length
            };
        }));
        return collectionsWithLinks;
    }
    async getCollectionById(userId, collectionId) {
        const collectionResult = await this.collectionRepository.query('SELECT * FROM collections WHERE id = $1 AND user_id = $2', [collectionId, userId]);
        if (!collectionResult.length) {
            throw new common_1.NotFoundException('Collection not found or does not belong to user');
        }
        const linksResult = await this.linkRepository.query('SELECT * FROM links WHERE collection_id = $1 AND is_active = true ORDER BY display_order ASC', [collectionId]);
        const collection = {
            ...collectionResult[0],
            links: linksResult
        };
        console.log('🔍 DEBUG - Collection found:', !!collection);
        console.log('🔍 DEBUG - Links count in result:', linksResult.length);
        console.log('🔍 DEBUG - Link count field:', collection.link_count);
        return collection;
    }
    async updateCollection(userId, collectionId, updateDto) {
        const collection = await this.collectionRepository.findOne({
            where: { id: collectionId, userId }
        });
        if (!collection) {
            throw new common_1.NotFoundException('Collection not found or does not belong to user');
        }
        Object.assign(collection, updateDto);
        return this.collectionRepository.save(collection);
    }
    async deleteCollection(userId, collectionId) {
        const collection = await this.collectionRepository.findOne({
            where: { id: collectionId, userId }
        });
        if (!collection) {
            throw new common_1.NotFoundException('Collection not found or does not belong to user');
        }
        await this.linkRepository.update({ collectionId }, { collectionId: null });
        await this.collectionRepository.delete(collectionId);
        await this.reorderCollectionsAfterDeletion(userId, collection.displayOrder);
    }
    async reorderCollections(userId, collectionIds) {
        for (let i = 0; i < collectionIds.length; i++) {
            const collectionId = collectionIds[i];
            await this.collectionRepository.query('UPDATE collections SET display_order = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3', [i, collectionId, userId]);
        }
        return this.getUserCollections(userId);
    }
    async addLinksToCollection(userId, collectionId, addLinksDto) {
        const collectionCheck = await this.collectionRepository.query('SELECT id FROM collections WHERE id = $1 AND user_id = $2', [collectionId, userId]);
        if (!collectionCheck.length) {
            throw new common_1.NotFoundException('Collection not found or does not belong to user');
        }
        const linkCheckResult = await this.linkRepository.query('SELECT id FROM links WHERE id = ANY($1) AND user_id = $2', [addLinksDto.linkIds, userId]);
        if (linkCheckResult.length !== addLinksDto.linkIds.length) {
            throw new common_1.BadRequestException('Some links not found or do not belong to user');
        }
        console.log('🔍 DEBUG - Updating links with collectionId:', collectionId);
        console.log('🔍 DEBUG - Link IDs to update:', addLinksDto.linkIds);
        const updateResult = await this.linkRepository.query('UPDATE links SET collection_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = ANY($2) RETURNING id', [collectionId, addLinksDto.linkIds]);
        console.log('🔍 DEBUG - Raw update result:', updateResult);
        const countResult = await this.linkRepository.query('SELECT COUNT(*) as count FROM links WHERE collection_id = $1 AND is_active = true', [collectionId]);
        const updatedCount = parseInt(countResult[0].count);
        console.log('🔍 DEBUG - Updated count from raw query:', updatedCount);
        await this.collectionRepository.query('UPDATE collections SET link_count = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [updatedCount, collectionId]);
        return this.getCollectionById(userId, collectionId);
    }
    async removeLinksFromCollection(userId, collectionId, removeLinksDto) {
        const collection = await this.getCollectionById(userId, collectionId);
        await this.linkRepository.update({
            id: (0, typeorm_2.In)(removeLinksDto.linkIds),
            collectionId,
            userId
        }, { collectionId: null });
        const updatedCount = await this.linkRepository.count({
            where: { collectionId, isActive: true }
        });
        collection.linkCount = updatedCount;
        await this.collectionRepository.save(collection);
        return this.getCollectionById(userId, collectionId);
    }
    async reorderLinksInCollection(userId, collectionId, reorderDto) {
        const collection = await this.getCollectionById(userId, collectionId);
        if (!collection.allow_reorder) {
            throw new common_1.BadRequestException('Reordering is not allowed for this collection');
        }
        for (let i = 0; i < reorderDto.linkIds.length; i++) {
            const linkId = reorderDto.linkIds[i];
            await this.linkRepository.query('UPDATE links SET display_order = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 AND collection_id = $4', [i, linkId, userId, collectionId]);
        }
        return this.getCollectionById(userId, collectionId);
    }
    async updateCollectionLayout(userId, collectionId, layoutDto) {
        return this.updateCollection(userId, collectionId, { layout: layoutDto.layout });
    }
    async updateCollectionStyle(userId, collectionId, styleDto) {
        return this.updateCollection(userId, collectionId, styleDto);
    }
    async updateCollectionSettings(userId, collectionId, settingsDto) {
        return this.updateCollection(userId, collectionId, settingsDto);
    }
    async archiveCollection(userId, collectionId) {
        const collection = await this.getCollectionById(userId, collectionId);
        collection.status = collection_entity_1.CollectionStatus.ARCHIVED;
        collection.archivedAt = new Date();
        collection.isActive = false;
        return this.collectionRepository.save(collection);
    }
    async restoreCollection(userId, collectionId) {
        const collection = await this.collectionRepository.findOne({
            where: { id: collectionId, userId }
        });
        if (!collection) {
            throw new common_1.NotFoundException('Collection not found');
        }
        collection.status = collection_entity_1.CollectionStatus.ACTIVE;
        collection.archivedAt = null;
        collection.isActive = true;
        return this.collectionRepository.save(collection);
    }
    async getArchivedCollections(userId) {
        return this.collectionRepository.query('SELECT * FROM collections WHERE user_id = $1 AND status = $2 ORDER BY archived_at DESC', [userId, collection_entity_1.CollectionStatus.ARCHIVED]);
    }
    async getCollectionAnalytics(userId, collectionId) {
        let collectionsQuery = 'SELECT * FROM collections WHERE user_id = $1';
        let queryParams = [userId];
        if (collectionId) {
            collectionsQuery += ' AND id = $2';
            queryParams.push(collectionId);
        }
        const collections = await this.collectionRepository.query(collectionsQuery, queryParams);
        const collectionsWithClicks = await Promise.all(collections.map(async (collection) => {
            const clickResult = await this.linkRepository.query('SELECT COALESCE(SUM(click_count), 0) as total_clicks FROM links WHERE collection_id = $1 AND is_active = true', [collection.id]);
            return {
                id: collection.id,
                title: collection.title,
                layout: collection.layout,
                linkCount: collection.link_count,
                totalClicks: parseInt(clickResult[0].total_clicks),
                isActive: collection.is_active,
                status: collection.status,
                createdAt: collection.created_at,
            };
        }));
        const totalCollections = collections.length;
        const totalLinks = collections.reduce((sum, collection) => sum + collection.link_count, 0);
        const totalClicks = collectionsWithClicks.reduce((sum, collection) => sum + collection.totalClicks, 0);
        return {
            collections: collectionsWithClicks,
            totalCollections,
            totalLinks,
            totalClicks,
            avgLinksPerCollection: totalCollections > 0 ? totalLinks / totalCollections : 0,
        };
    }
    async reorderCollectionsAfterDeletion(userId, deletedOrder) {
        await this.collectionRepository
            .createQueryBuilder()
            .update(collection_entity_1.Collection)
            .set({ displayOrder: () => 'display_order - 1' })
            .where('userId = :userId', { userId })
            .andWhere('displayOrder > :deletedOrder', { deletedOrder })
            .execute();
    }
};
exports.CollectionService = CollectionService;
exports.CollectionService = CollectionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(collection_entity_1.Collection)),
    __param(1, (0, typeorm_1.InjectRepository)(link_entity_1.Link)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CollectionService);
//# sourceMappingURL=collection.service.js.map