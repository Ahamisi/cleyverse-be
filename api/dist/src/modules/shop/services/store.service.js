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
exports.StoreService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const store_entity_1 = require("../entities/store.entity");
const product_service_1 = require("./product.service");
let StoreService = class StoreService {
    storeRepository;
    productService;
    constructor(storeRepository, productService) {
        this.storeRepository = storeRepository;
        this.productService = productService;
    }
    async createStore(userId, createStoreDto) {
        const existingStore = await this.storeRepository.findOne({
            where: { storeUrl: createStoreDto.storeUrl }
        });
        if (existingStore) {
            throw new common_1.ConflictException('Store URL is already taken');
        }
        const urlPattern = /^[a-z0-9-]+$/;
        if (!urlPattern.test(createStoreDto.storeUrl)) {
            throw new common_1.BadRequestException('Store URL can only contain lowercase letters, numbers, and hyphens');
        }
        const store = this.storeRepository.create({
            ...createStoreDto,
            userId,
            status: store_entity_1.StoreStatus.DRAFT,
        });
        return this.storeRepository.save(store);
    }
    async getUserStores(userId, includeInactive = false) {
        const queryBuilder = this.storeRepository
            .createQueryBuilder('store')
            .where('store.userId = :userId', { userId })
            .orderBy('store.createdAt', 'DESC');
        if (!includeInactive) {
            queryBuilder.andWhere('store.isActive = true');
        }
        return queryBuilder.getMany();
    }
    async getStoreById(userId, storeId) {
        const store = await this.storeRepository.findOne({
            where: { id: storeId, userId },
            relations: ['products']
        });
        if (!store) {
            throw new common_1.NotFoundException('Store not found or does not belong to user');
        }
        return store;
    }
    async updateStore(userId, storeId, updateStoreDto) {
        const store = await this.getStoreById(userId, storeId);
        Object.assign(store, updateStoreDto);
        return this.storeRepository.save(store);
    }
    async updateStoreStatus(userId, storeId, updateStatusDto) {
        const store = await this.getStoreById(userId, storeId);
        store.status = updateStatusDto.status;
        if (updateStatusDto.status === store_entity_1.StoreStatus.ARCHIVED) {
            store.archivedAt = new Date();
        }
        else if (store.archivedAt) {
            store.archivedAt = null;
        }
        return this.storeRepository.save(store);
    }
    async deleteStore(userId, storeId) {
        const store = await this.getStoreById(userId, storeId);
        if (store.totalProducts > 0) {
            throw new common_1.BadRequestException('Cannot delete store with existing products. Archive it instead.');
        }
        store.deletedAt = new Date();
        store.status = store_entity_1.StoreStatus.ARCHIVED;
        await this.storeRepository.save(store);
    }
    async restoreStore(userId, storeId) {
        const store = await this.storeRepository.findOne({
            where: { id: storeId, userId }
        });
        if (!store) {
            throw new common_1.NotFoundException('Store not found or does not belong to user');
        }
        if (!store.deletedAt) {
            throw new common_1.BadRequestException('Store is not deleted');
        }
        const deletedDate = new Date(store.deletedAt);
        const now = new Date();
        const daysDifference = Math.floor((now.getTime() - deletedDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDifference > 60) {
            throw new common_1.BadRequestException('Store cannot be restored after 60 days');
        }
        store.deletedAt = null;
        store.status = store_entity_1.StoreStatus.DRAFT;
        return this.storeRepository.save(store);
    }
    async getDeletedStores(userId) {
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
        return this.storeRepository.find({
            where: {
                userId,
                deletedAt: (0, typeorm_2.Between)(sixtyDaysAgo, new Date())
            },
            order: { deletedAt: 'DESC' }
        });
    }
    async suspendStore(storeId, reason) {
        const store = await this.storeRepository.findOne({
            where: { id: storeId }
        });
        if (!store) {
            throw new common_1.NotFoundException('Store not found');
        }
        store.status = store_entity_1.StoreStatus.SUSPENDED;
        store.suspendedAt = new Date();
        store.suspendedReason = reason;
        return this.storeRepository.save(store);
    }
    async unsuspendStore(storeId) {
        const store = await this.storeRepository.findOne({
            where: { id: storeId }
        });
        if (!store) {
            throw new common_1.NotFoundException('Store not found');
        }
        if (store.status !== store_entity_1.StoreStatus.SUSPENDED) {
            throw new common_1.BadRequestException('Store is not suspended');
        }
        store.status = store_entity_1.StoreStatus.ACTIVE;
        store.suspendedAt = null;
        store.suspendedReason = null;
        return this.storeRepository.save(store);
    }
    async checkStoreUrlAvailability(storeUrl) {
        const store = await this.storeRepository.findOne({
            where: { storeUrl }
        });
        return !store;
    }
    async getStoreAnalytics(userId, storeId) {
        let query = this.storeRepository
            .createQueryBuilder('store')
            .where('store.userId = :userId', { userId });
        if (storeId) {
            query = query.andWhere('store.id = :storeId', { storeId });
        }
        const stores = await query.getMany();
        const totalStores = stores.length;
        const activeStores = stores.filter(store => store.status === store_entity_1.StoreStatus.ACTIVE).length;
        const totalProducts = stores.reduce((sum, store) => sum + store.totalProducts, 0);
        const totalOrders = stores.reduce((sum, store) => sum + store.totalOrders, 0);
        const totalRevenue = stores.reduce((sum, store) => sum + Number(store.totalRevenue), 0);
        return {
            stores: stores.map(store => ({
                id: store.id,
                name: store.name,
                storeUrl: store.storeUrl,
                status: store.status,
                currency: store.currency,
                totalProducts: store.totalProducts,
                totalOrders: store.totalOrders,
                totalRevenue: store.totalRevenue,
                createdAt: store.createdAt,
            })),
            summary: {
                totalStores,
                activeStores,
                totalProducts,
                totalOrders,
                totalRevenue,
                averageRevenuePerStore: totalStores > 0 ? totalRevenue / totalStores : 0,
            }
        };
    }
    async getPublicStore(storeUrl) {
        const store = await this.storeRepository.findOne({
            where: { storeUrl, isActive: true },
            relations: ['user'],
            select: [
                'id', 'name', 'description', 'storeUrl', 'logoUrl', 'bannerUrl',
                'currency', 'isActive', 'status', 'totalProducts', 'createdAt'
            ]
        });
        if (!store || store.status !== store_entity_1.StoreStatus.ACTIVE) {
            return {
                message: 'Store not found or not active',
                store: null,
                owner: null,
                exists: false
            };
        }
        return {
            message: 'Store retrieved successfully',
            store: {
                id: store.id,
                name: store.name,
                description: store.description,
                storeUrl: store.storeUrl,
                logoUrl: store.logoUrl,
                bannerUrl: store.bannerUrl,
                currency: store.currency,
                isActive: store.isActive,
                totalProducts: store.totalProducts,
                createdAt: store.createdAt
            },
            owner: {
                id: store.user.id,
                username: store.user.username,
                firstName: store.user.firstName,
                lastName: store.user.lastName,
                profileImageUrl: store.user.profileImageUrl
            },
            exists: true
        };
    }
    async getPublicStoreProducts(storeUrl, options) {
        const store = await this.storeRepository.findOne({
            where: { storeUrl, isActive: true }
        });
        if (!store || store.status !== store_entity_1.StoreStatus.ACTIVE) {
            return {
                message: 'Store not found or not active',
                products: [],
                pagination: {
                    total: 0,
                    page: options.page,
                    limit: options.limit,
                    totalPages: 0,
                    hasNext: false,
                    hasPrev: false
                },
                exists: false
            };
        }
        const result = await this.productService.getPublicStoreProducts(store.id, options);
        return {
            ...result,
            exists: true
        };
    }
    async getPublicProduct(storeUrl, productHandle) {
        const store = await this.storeRepository.findOne({
            where: { storeUrl, isActive: true }
        });
        if (!store || store.status !== store_entity_1.StoreStatus.ACTIVE) {
            return {
                message: 'Store not found or not active',
                product: null,
                store: null,
                exists: false
            };
        }
        const result = await this.productService.getPublicProduct(store.id, productHandle);
        return {
            ...result,
            exists: true
        };
    }
    async trackProductView(storeUrl, productHandle, trackClickDto) {
        const store = await this.storeRepository.findOne({
            where: { storeUrl, isActive: true }
        });
        if (!store || store.status !== store_entity_1.StoreStatus.ACTIVE) {
            throw new common_1.NotFoundException('Store not found or not active');
        }
        return this.productService.trackProductView(store.id, productHandle, trackClickDto);
    }
};
exports.StoreService = StoreService;
exports.StoreService = StoreService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => product_service_1.ProductService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        product_service_1.ProductService])
], StoreService);
//# sourceMappingURL=store.service.js.map