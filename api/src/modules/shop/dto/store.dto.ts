import { IsString, IsOptional, IsEnum, IsBoolean, IsNumber, IsArray, IsUrl, MaxLength, Min, Max } from 'class-validator';
import { StoreStatus, StoreCurrency } from '../entities/store.entity';

export class CreateStoreDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(100)
  storeUrl: string; // Must be unique and URL-friendly

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(StoreCurrency)
  currency?: StoreCurrency;

  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @IsOptional()
  @IsUrl()
  bannerUrl?: string;
}

export class UpdateStoreDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(StoreCurrency)
  currency?: StoreCurrency;

  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @IsOptional()
  @IsUrl()
  bannerUrl?: string;

  @IsOptional()
  @IsBoolean()
  allowReviews?: boolean;

  @IsOptional()
  @IsBoolean()
  autoApproveReviews?: boolean;

  @IsOptional()
  @IsBoolean()
  enableInventoryTracking?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  lowStockThreshold?: number;

  @IsOptional()
  @IsString()
  returnPolicy?: string;

  @IsOptional()
  @IsString()
  shippingPolicy?: string;

  @IsOptional()
  @IsString()
  privacyPolicy?: string;

  @IsOptional()
  @IsString()
  termsOfService?: string;
}

export class UpdateStoreStatusDto {
  @IsEnum(StoreStatus)
  status: StoreStatus;
}
