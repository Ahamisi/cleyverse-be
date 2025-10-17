import { IsEnum, IsString, IsOptional, IsArray, MaxLength, MinLength, Matches } from 'class-validator';
import { BusinessType, SalesChannel, ProductType, OnboardingStep } from '../entities/store-onboarding.entity';

export class StartOnboardingDto {
  // No fields needed - just starts the onboarding process
}

export class UpdateBusinessTypeDto {
  @IsEnum(BusinessType)
  businessType: BusinessType;
}

export class UpdateSalesChannelsDto {
  @IsArray()
  @IsEnum(SalesChannel, { each: true })
  salesChannels: SalesChannel[];
}

export class UpdateProductTypesDto {
  @IsArray()
  @IsEnum(ProductType, { each: true })
  productTypes: ProductType[];
}

export class UpdateStoreSetupDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  storeName: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Store URL can only contain lowercase letters, numbers, and hyphens'
  })
  storeUrl: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  storeDescription?: string;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  logoUrl?: string;

  @IsString()
  @IsOptional()
  bannerUrl?: string;
}

export class CompleteOnboardingDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  storeName: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Store URL can only contain lowercase letters, numbers, and hyphens'
  })
  storeUrl: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  storeDescription?: string;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  logoUrl?: string;

  @IsString()
  @IsOptional()
  bannerUrl?: string;
}

export class OnboardingStatusResponse {
  id: string;
  currentStep: OnboardingStep;
  businessType?: BusinessType | null;
  salesChannels?: SalesChannel[] | null;
  productTypes?: ProductType[] | null;
  storeName?: string | null;
  storeUrl?: string | null;
  storeDescription?: string | null;
  currency?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  isCompleted: boolean;
  nextSteps: string[];
  createdAt: Date;
  updatedAt: Date;
}
