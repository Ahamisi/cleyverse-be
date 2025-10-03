import { IsString, IsOptional, IsBoolean, IsEnum, IsUUID, IsArray, ArrayNotEmpty, MaxLength, IsHexColor, IsInt, Min, Max } from 'class-validator';
import { CollectionLayout, CollectionStatus } from '../entities/collection.entity';

export class CreateCollectionDto {
  @IsString()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsEnum(CollectionLayout)
  layout?: CollectionLayout;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;

  // Styling options
  @IsOptional()
  @IsHexColor()
  backgroundColor?: string;

  @IsOptional()
  @IsHexColor()
  textColor?: string;

  @IsOptional()
  @IsString()
  borderRadius?: string;

  // Display settings
  @IsOptional()
  @IsBoolean()
  showTitle?: boolean;

  @IsOptional()
  @IsBoolean()
  showCount?: boolean;

  @IsOptional()
  @IsBoolean()
  allowReorder?: boolean;
}

export class UpdateCollectionDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsEnum(CollectionLayout)
  layout?: CollectionLayout;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;

  // Styling options
  @IsOptional()
  @IsHexColor()
  backgroundColor?: string;

  @IsOptional()
  @IsHexColor()
  textColor?: string;

  @IsOptional()
  @IsString()
  borderRadius?: string;

  // Display settings
  @IsOptional()
  @IsBoolean()
  showTitle?: boolean;

  @IsOptional()
  @IsBoolean()
  showCount?: boolean;

  @IsOptional()
  @IsBoolean()
  allowReorder?: boolean;
}

export class ReorderCollectionsDto {
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  collectionIds: string[];
}

export class AddLinksToCollectionDto {
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  linkIds: string[];
}

export class RemoveLinksFromCollectionDto {
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  linkIds: string[];
}

export class ReorderLinksInCollectionDto {
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  linkIds: string[];
}

export class ArchiveCollectionDto {
  @IsEnum(CollectionStatus)
  status: CollectionStatus;
}

export class CollectionLayoutDto {
  @IsEnum(CollectionLayout)
  layout: CollectionLayout;
}

export class CollectionStyleDto {
  @IsOptional()
  @IsHexColor()
  backgroundColor?: string;

  @IsOptional()
  @IsHexColor()
  textColor?: string;

  @IsOptional()
  @IsString()
  borderRadius?: string;
}

export class CollectionSettingsDto {
  @IsOptional()
  @IsBoolean()
  showTitle?: boolean;

  @IsOptional()
  @IsBoolean()
  showCount?: boolean;

  @IsOptional()
  @IsBoolean()
  allowReorder?: boolean;
}
