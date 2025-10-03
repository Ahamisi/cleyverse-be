import { BaseEntity } from '../../../common/base/base.entity';
import { User } from '../../users/entities/user.entity';
export declare enum CollectionLayout {
    STACK = "stack",
    GRID = "grid",
    CAROUSEL = "carousel"
}
export declare enum CollectionStatus {
    ACTIVE = "active",
    ARCHIVED = "archived"
}
export declare class Collection extends BaseEntity {
    userId: string;
    user: User;
    title: string;
    description: string;
    layout: CollectionLayout;
    isActive: boolean;
    displayOrder: number;
    status: CollectionStatus;
    linkCount: number;
    backgroundColor: string;
    textColor: string;
    borderRadius: string;
    showTitle: boolean;
    showCount: boolean;
    allowReorder: boolean;
    links?: any[];
    archivedAt: Date | null;
}
