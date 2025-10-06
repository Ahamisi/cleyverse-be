import { ProductStatus, ProductType } from '../entities/product.entity';
export declare class CreateProductImageDto {
    imageUrl: string;
    altText?: string;
    displayOrder?: number;
    isPrimary?: boolean;
}
export declare class CreateProductVariantDto {
    title: string;
    sku?: string;
    barcode?: string;
    price: number;
    compareAtPrice?: number;
    costPerItem?: number;
    inventoryQuantity?: number;
    option1Name?: string;
    option1Value?: string;
    option2Name?: string;
    option2Value?: string;
    option3Name?: string;
    option3Value?: string;
    weight?: number;
    weightUnit?: string;
}
export declare class CreateProductDto {
    title: string;
    description?: string;
    type?: ProductType;
    price?: number;
    compareAtPrice?: number;
    costPerItem?: number;
    trackQuantity?: boolean;
    inventoryQuantity?: number;
    continueSelling?: boolean;
    requiresShipping?: boolean;
    weight?: number;
    weightUnit?: string;
    seoTitle?: string;
    seoDescription?: string;
    productCategory?: string;
    productType?: string;
    vendor?: string;
    tags?: string[];
    images?: CreateProductImageDto[];
    variants?: CreateProductVariantDto[];
}
export declare class UpdateProductDto {
    title?: string;
    description?: string;
    type?: ProductType;
    price?: number;
    compareAtPrice?: number;
    costPerItem?: number;
    trackQuantity?: boolean;
    inventoryQuantity?: number;
    continueSelling?: boolean;
    requiresShipping?: boolean;
    weight?: number;
    weightUnit?: string;
    seoTitle?: string;
    seoDescription?: string;
    productCategory?: string;
    productType?: string;
    vendor?: string;
    tags?: string[];
    isFeatured?: boolean;
}
export declare class UpdateProductStatusDto {
    status: ProductStatus;
}
export declare class PublishProductDto {
    isPublished: boolean;
}
