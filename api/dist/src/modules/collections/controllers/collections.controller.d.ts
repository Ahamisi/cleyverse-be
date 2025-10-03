import { CollectionService } from '../services/collection.service';
import { CreateCollectionDto, UpdateCollectionDto, ReorderCollectionsDto, AddLinksToCollectionDto, RemoveLinksFromCollectionDto, ReorderLinksInCollectionDto, CollectionLayoutDto, CollectionStyleDto, CollectionSettingsDto } from '../dto/collection.dto';
import { CollectionLayout } from '../entities/collection.entity';
export declare class CollectionsController {
    private readonly collectionService;
    constructor(collectionService: CollectionService);
    createCollection(req: any, createCollectionDto: CreateCollectionDto): Promise<{
        message: string;
        collection: import("../entities/collection.entity").Collection;
    }>;
    getUserCollections(req: any, includeInactive?: string): Promise<{
        message: string;
        collections: import("../entities/collection.entity").Collection[];
        total: number;
    }>;
    getAnalytics(req: any, collectionId?: string): Promise<{
        message: string;
        analytics: any;
    }>;
    getArchivedCollections(req: any): Promise<{
        message: string;
        collections: import("../entities/collection.entity").Collection[];
        total: number;
    }>;
    getAvailableLayouts(): Promise<{
        message: string;
        layouts: {
            value: CollectionLayout;
            label: string;
            description: string;
        }[];
    }>;
    reorderCollections(req: any, reorderCollectionsDto: ReorderCollectionsDto): Promise<{
        message: string;
        collections: import("../entities/collection.entity").Collection[];
    }>;
    getCollection(req: any, id: string): Promise<{
        message: string;
        collection: import("../entities/collection.entity").Collection;
    }>;
    updateCollection(req: any, id: string, updateCollectionDto: UpdateCollectionDto): Promise<{
        message: string;
        collection: import("../entities/collection.entity").Collection;
    }>;
    deleteCollection(req: any, id: string): Promise<{
        message: string;
    }>;
    addLinksToCollection(req: any, id: string, addLinksDto: AddLinksToCollectionDto): Promise<{
        message: string;
        collection: import("../entities/collection.entity").Collection;
    }>;
    removeLinksFromCollection(req: any, id: string, removeLinksDto: RemoveLinksFromCollectionDto): Promise<{
        message: string;
        collection: import("../entities/collection.entity").Collection;
    }>;
    reorderLinksInCollection(req: any, id: string, reorderDto: ReorderLinksInCollectionDto): Promise<{
        message: string;
        collection: import("../entities/collection.entity").Collection;
    }>;
    updateLayout(req: any, id: string, layoutDto: CollectionLayoutDto): Promise<{
        message: string;
        collection: import("../entities/collection.entity").Collection;
    }>;
    updateStyle(req: any, id: string, styleDto: CollectionStyleDto): Promise<{
        message: string;
        collection: import("../entities/collection.entity").Collection;
    }>;
    updateSettings(req: any, id: string, settingsDto: CollectionSettingsDto): Promise<{
        message: string;
        collection: import("../entities/collection.entity").Collection;
    }>;
    archiveCollection(req: any, id: string): Promise<{
        message: string;
        collection: import("../entities/collection.entity").Collection;
    }>;
    restoreCollection(req: any, id: string): Promise<{
        message: string;
        collection: import("../entities/collection.entity").Collection;
    }>;
    private formatLayoutLabel;
    private getLayoutDescription;
}
