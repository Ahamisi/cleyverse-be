import { CollectionLayout, CollectionStatus } from '../entities/collection.entity';
export declare class CreateCollectionDto {
    title: string;
    description?: string;
    layout?: CollectionLayout;
    isActive?: boolean;
    displayOrder?: number;
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: string;
    showTitle?: boolean;
    showCount?: boolean;
    allowReorder?: boolean;
}
export declare class UpdateCollectionDto {
    title?: string;
    description?: string;
    layout?: CollectionLayout;
    isActive?: boolean;
    displayOrder?: number;
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: string;
    showTitle?: boolean;
    showCount?: boolean;
    allowReorder?: boolean;
}
export declare class ReorderCollectionsDto {
    collectionIds: string[];
}
export declare class AddLinksToCollectionDto {
    linkIds: string[];
}
export declare class RemoveLinksFromCollectionDto {
    linkIds: string[];
}
export declare class ReorderLinksInCollectionDto {
    linkIds: string[];
}
export declare class ArchiveCollectionDto {
    status: CollectionStatus;
}
export declare class CollectionLayoutDto {
    layout: CollectionLayout;
}
export declare class CollectionStyleDto {
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: string;
}
export declare class CollectionSettingsDto {
    showTitle?: boolean;
    showCount?: boolean;
    allowReorder?: boolean;
}
