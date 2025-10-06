import { Repository } from 'typeorm';
import { Store } from '../entities/store.entity';
import { CreateStoreDto, UpdateStoreDto, UpdateStoreStatusDto } from '../dto/store.dto';
export declare class StoreService {
    private readonly storeRepository;
    constructor(storeRepository: Repository<Store>);
    createStore(userId: string, createStoreDto: CreateStoreDto): Promise<Store>;
    getUserStores(userId: string, includeInactive?: boolean): Promise<Store[]>;
    getStoreById(userId: string, storeId: string): Promise<Store>;
    getPublicStore(storeUrl: string): Promise<Store>;
    updateStore(userId: string, storeId: string, updateStoreDto: UpdateStoreDto): Promise<Store>;
    updateStoreStatus(userId: string, storeId: string, updateStatusDto: UpdateStoreStatusDto): Promise<Store>;
    deleteStore(userId: string, storeId: string): Promise<void>;
    restoreStore(userId: string, storeId: string): Promise<Store>;
    getDeletedStores(userId: string): Promise<Store[]>;
    suspendStore(storeId: string, reason: string): Promise<Store>;
    unsuspendStore(storeId: string): Promise<Store>;
    checkStoreUrlAvailability(storeUrl: string): Promise<boolean>;
    getStoreAnalytics(userId: string, storeId?: string): Promise<any>;
}
