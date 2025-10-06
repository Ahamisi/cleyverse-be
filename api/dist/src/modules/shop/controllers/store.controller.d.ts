import { StoreService } from '../services/store.service';
import { CreateStoreDto, UpdateStoreDto, UpdateStoreStatusDto } from '../dto/store.dto';
export declare class StoreController {
    private readonly storeService;
    constructor(storeService: StoreService);
    create(req: any, createStoreDto: CreateStoreDto): Promise<{
        message: string;
        store: import("../entities/store.entity").Store;
    }>;
    findAll(req: any, includeInactive?: string): Promise<{
        message: string;
        stores: import("../entities/store.entity").Store[];
        total: number;
        hasStores: boolean;
        canCreateMore: boolean;
    }>;
    checkUserStores(req: any): Promise<{
        message: string;
        hasStores: boolean;
        storeCount: number;
        canCreateMore: boolean;
        maxStores: number;
        stores: {
            id: string;
            name: string;
            storeUrl: string;
            status: import("../entities/store.entity").StoreStatus;
            totalProducts: number;
        }[];
    }>;
    getAnalytics(req: any, storeId?: string): Promise<{
        message: string;
        analytics: any;
    }>;
    checkUrlAvailability(storeUrl: string): Promise<{
        message: string;
        storeUrl: string;
        isAvailable: boolean;
        suggestion: string | null;
    }>;
    getPublicStore(storeUrl: string): Promise<{
        message: string;
        store: import("../entities/store.entity").Store;
    }>;
    findOne(req: any, id: string): Promise<{
        message: string;
        store: import("../entities/store.entity").Store;
    }>;
    update(req: any, id: string, updateStoreDto: UpdateStoreDto): Promise<{
        message: string;
        store: import("../entities/store.entity").Store;
    }>;
    updateStatus(req: any, id: string, updateStatusDto: UpdateStoreStatusDto): Promise<{
        message: string;
        store: import("../entities/store.entity").Store;
    }>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
    restoreStore(req: any, id: string): Promise<{
        message: string;
        store: import("../entities/store.entity").Store;
    }>;
    getDeletedStores(req: any): Promise<{
        message: string;
        stores: import("../entities/store.entity").Store[];
        total: number;
    }>;
    suspendStore(id: string, reason: string): Promise<{
        message: string;
        store: import("../entities/store.entity").Store;
    }>;
    unsuspendStore(id: string): Promise<{
        message: string;
        store: import("../entities/store.entity").Store;
    }>;
}
