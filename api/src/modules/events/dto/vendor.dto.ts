import { IsString, IsOptional, IsEnum, IsEmail, IsBoolean, IsNumber, IsArray, MaxLength, IsUUID, IsUrl, IsPhoneNumber, Min, Max } from 'class-validator';
import { VendorStatus, VendorType } from '../entities/event-vendor.entity';

export class ApplyAsVendorDto {
  @IsString()
  @MaxLength(200)
  businessName: string;

  @IsOptional()
  @IsString()
  businessDescription?: string;

  @IsOptional()
  @IsUrl()
  businessWebsite?: string;

  @IsOptional()
  @IsUrl()
  businessLogoUrl?: string;

  @IsEnum(VendorType)
  vendorType: VendorType;

  @IsOptional()
  @IsString()
  applicationMessage?: string;

  @IsOptional()
  @IsUUID()
  storeId?: string; // Link existing store

  @IsString()
  @MaxLength(100)
  contactName: string;

  @IsEmail()
  contactEmail: string;

  @IsOptional()
  @IsPhoneNumber()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  boothSize?: string;

  @IsOptional()
  @IsString()
  powerRequirements?: string;

  @IsOptional()
  @IsBoolean()
  wifiRequired?: boolean;

  @IsOptional()
  @IsString()
  specialRequirements?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  equipmentNeeded?: string[];
}

export class UpdateVendorApplicationDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  businessName?: string;

  @IsOptional()
  @IsString()
  businessDescription?: string;

  @IsOptional()
  @IsUrl()
  businessWebsite?: string;

  @IsOptional()
  @IsUrl()
  businessLogoUrl?: string;

  @IsOptional()
  @IsEnum(VendorType)
  vendorType?: VendorType;

  @IsOptional()
  @IsString()
  applicationMessage?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  contactName?: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsPhoneNumber()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  boothSize?: string;

  @IsOptional()
  @IsString()
  powerRequirements?: string;

  @IsOptional()
  @IsBoolean()
  wifiRequired?: boolean;

  @IsOptional()
  @IsString()
  specialRequirements?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  equipmentNeeded?: string[];
}

export class ReviewVendorApplicationDto {
  @IsEnum(VendorStatus)
  status: VendorStatus; // APPROVED or REJECTED

  @IsOptional()
  @IsString()
  reviewNotes?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  boothNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  boothLocation?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  vendorFee?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  commissionRate?: number;
}

export class UpdateVendorBoothDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  boothNumber?: string;

  @IsOptional()
  @IsString()
  boothSize?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  boothLocation?: string;

  @IsOptional()
  @IsString()
  setupTime?: string;

  @IsOptional()
  @IsString()
  breakdownTime?: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  displayOrder?: number;
}

export class LinkProductToEventDto {
  @IsUUID()
  productId: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  eventPrice?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  eventDiscount?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  availableQuantity?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  minOrderQuantity?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxOrderQuantity?: number;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  boothExclusive?: boolean;

  @IsOptional()
  @IsString()
  eventDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  eventTags?: string[];

  @IsOptional()
  @IsBoolean()
  demoAvailable?: boolean;
}

export class SearchVendorsDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @IsEnum(VendorStatus)
  status?: VendorStatus;

  @IsOptional()
  @IsEnum(VendorType)
  vendorType?: VendorType;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
