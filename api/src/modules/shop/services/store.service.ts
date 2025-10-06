import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Store, StoreStatus } from '../entities/store.entity';
import { CreateStoreDto, UpdateStoreDto, UpdateStoreStatusDto } from '../dto/store.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async createStore(userId: string, createStoreDto: CreateStoreDto): Promise<Store> {
    // Check if store URL is already taken
    const existingStore = await this.storeRepository.findOne({
      where: { storeUrl: createStoreDto.storeUrl }
    });

    if (existingStore) {
      throw new ConflictException('Store URL is already taken');
    }

    // Validate store URL format (only lowercase letters, numbers, hyphens)
    const urlPattern = /^[a-z0-9-]+$/;
    if (!urlPattern.test(createStoreDto.storeUrl)) {
      throw new BadRequestException('Store URL can only contain lowercase letters, numbers, and hyphens');
    }

    const store = this.storeRepository.create({
      ...createStoreDto,
      userId,
      status: StoreStatus.DRAFT,
    });

    return this.storeRepository.save(store);
  }

  async getUserStores(userId: string, includeInactive: boolean = false): Promise<Store[]> {
    const queryBuilder = this.storeRepository
      .createQueryBuilder('store')
      .where('store.userId = :userId', { userId })
      .orderBy('store.createdAt', 'DESC');

    if (!includeInactive) {
      queryBuilder.andWhere('store.isActive = true');
    }

    return queryBuilder.getMany();
  }

  async getStoreById(userId: string, storeId: string): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { id: storeId, userId },
      relations: ['products']
    });

    if (!store) {
      throw new NotFoundException('Store not found or does not belong to user');
    }

    return store;
  }

  async getPublicStore(storeUrl: string): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { 
        storeUrl, 
        status: StoreStatus.ACTIVE,
        isActive: true 
      },
      relations: ['products']
    });

    if (!store) {
      throw new NotFoundException('Store not found or not available');
    }

    return store;
  }

  async updateStore(userId: string, storeId: string, updateStoreDto: UpdateStoreDto): Promise<Store> {
    const store = await this.getStoreById(userId, storeId);
    
    Object.assign(store, updateStoreDto);
    
    return this.storeRepository.save(store);
  }

  async updateStoreStatus(userId: string, storeId: string, updateStatusDto: UpdateStoreStatusDto): Promise<Store> {
    const store = await this.getStoreById(userId, storeId);
    
    store.status = updateStatusDto.status;
    
    // Set archived timestamp if archiving
    if (updateStatusDto.status === StoreStatus.ARCHIVED) {
      store.archivedAt = new Date();
    } else if (store.archivedAt) {
      store.archivedAt = null;
    }
    
    return this.storeRepository.save(store);
  }

  async deleteStore(userId: string, storeId: string): Promise<void> {
    const store = await this.getStoreById(userId, storeId);
    
    // Check if store has products
    if (store.totalProducts > 0) {
      throw new BadRequestException('Cannot delete store with existing products. Archive it instead.');
    }
    
    // Soft delete - set deletedAt timestamp
    store.deletedAt = new Date();
    store.status = StoreStatus.ARCHIVED;
    await this.storeRepository.save(store);
  }

  async restoreStore(userId: string, storeId: string): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { id: storeId, userId }
    });

    if (!store) {
      throw new NotFoundException('Store not found or does not belong to user');
    }

    if (!store.deletedAt) {
      throw new BadRequestException('Store is not deleted');
    }

    // Check if within 60-day restoration window
    const deletedDate = new Date(store.deletedAt);
    const now = new Date();
    const daysDifference = Math.floor((now.getTime() - deletedDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDifference > 60) {
      throw new BadRequestException('Store cannot be restored after 60 days');
    }

    // Restore store
    store.deletedAt = null;
    store.status = StoreStatus.DRAFT; // Set to draft for review
    
    return this.storeRepository.save(store);
  }

  async getDeletedStores(userId: string): Promise<Store[]> {
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    return this.storeRepository.find({
      where: { 
        userId,
        deletedAt: Between(sixtyDaysAgo, new Date())
      },
      order: { deletedAt: 'DESC' }
    });
  }

  async suspendStore(storeId: string, reason: string): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { id: storeId }
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    store.status = StoreStatus.SUSPENDED;
    store.suspendedAt = new Date();
    store.suspendedReason = reason;

    return this.storeRepository.save(store);
  }

  async unsuspendStore(storeId: string): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { id: storeId }
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    if (store.status !== StoreStatus.SUSPENDED) {
      throw new BadRequestException('Store is not suspended');
    }

    store.status = StoreStatus.ACTIVE;
    store.suspendedAt = null;
    store.suspendedReason = null;

    return this.storeRepository.save(store);
  }

  async checkStoreUrlAvailability(storeUrl: string): Promise<boolean> {
    const store = await this.storeRepository.findOne({
      where: { storeUrl }
    });
    
    return !store;
  }

  async getStoreAnalytics(userId: string, storeId?: string): Promise<any> {
    let query = this.storeRepository
      .createQueryBuilder('store')
      .where('store.userId = :userId', { userId });

    if (storeId) {
      query = query.andWhere('store.id = :storeId', { storeId });
    }

    const stores = await query.getMany();

    const totalStores = stores.length;
    const activeStores = stores.filter(store => store.status === StoreStatus.ACTIVE).length;
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
}
