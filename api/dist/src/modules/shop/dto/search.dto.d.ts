export declare enum ProductSortBy {
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt",
    TITLE = "title",
    PRICE = "price",
    INVENTORY = "inventoryQuantity",
    ORDERS = "orderCount",
    VIEWS = "viewCount"
}
export declare enum SortOrder {
    ASC = "ASC",
    DESC = "DESC"
}
export declare enum ProductAvailability {
    IN_STOCK = "in_stock",
    LOW_STOCK = "low_stock",
    OUT_OF_STOCK = "out_of_stock"
}
export declare class SearchProductsDto {
    search?: string;
    availability?: ProductAvailability;
    category?: string;
    vendor?: string;
    tags?: string[];
    minPrice?: number;
    maxPrice?: number;
    sortBy?: ProductSortBy;
    sortOrder?: SortOrder;
    page?: number;
    limit?: number;
}
export declare class BulkUpdateTagsDto {
    productIds: string[];
    tags: string[];
}
export declare class BulkUpdatePriceDto {
    productIds: string[];
    price: number;
}
