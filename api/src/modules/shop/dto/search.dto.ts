import { IsOptional, IsString, IsEnum, IsArray, IsNumber, Min, Max } from 'class-validator';

export enum ProductSortBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  TITLE = 'title',
  PRICE = 'price',
  INVENTORY = 'inventoryQuantity',
  ORDERS = 'orderCount',
  VIEWS = 'viewCount'
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

export enum ProductAvailability {
  IN_STOCK = 'in_stock',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock'
}

export class SearchProductsDto {
  @IsOptional()
  @IsString()
  search?: string; // Search in title, description, tags, SKU

  @IsOptional()
  @IsEnum(ProductAvailability)
  availability?: ProductAvailability;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  vendor?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsEnum(ProductSortBy)
  sortBy?: ProductSortBy;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}

export class BulkUpdateTagsDto {
  @IsArray()
  @IsString({ each: true })
  productIds: string[];

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}

export class BulkUpdatePriceDto {
  @IsArray()
  @IsString({ each: true })
  productIds: string[];

  @IsNumber()
  @Min(0)
  price: number;
}
