import { BaseEntity } from '../../../common/base/base.entity';
import { Store } from './store.entity';
import { ProductImage } from './product-image.entity';
import { ProductVariant } from './product-variant.entity';
export declare enum ProductStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    ARCHIVED = "archived"
}
export declare enum ProductType {
    PHYSICAL = "physical",
    DIGITAL = "digital",
    SERVICE = "service"
}
export declare class Product extends BaseEntity {
    storeId: string;
    store: Store;
    images: ProductImage[];
    variants: ProductVariant[];
    title: string;
    description: string | null;
    handle: string;
    type: ProductType;
    status: ProductStatus;
    price: number | null;
    compareAtPrice: number | null;
    costPerItem: number | null;
    trackQuantity: boolean;
    inventoryQuantity: number;
    continueSelling: boolean;
    requiresShipping: boolean;
    weight: number | null;
    weightUnit: string;
    seoTitle: string | null;
    seoDescription: string | null;
    productCategory: string | null;
    productType: string | null;
    vendor: string | null;
    tags: string[] | null;
    isPublished: boolean;
    publishedAt: Date | null;
    isFeatured: boolean;
    viewCount: number;
    orderCount: number;
    archivedAt: Date | null;
}
