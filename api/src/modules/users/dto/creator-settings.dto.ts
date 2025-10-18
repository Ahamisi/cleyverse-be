import { IsOptional, IsString, IsBoolean, IsEnum, IsNumber, IsUrl, IsEmail, IsObject, Min, Max, Length, Matches } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { 
  ThemePreference, 
  LanguagePreference, 
  PayoutFrequency 
} from '../entities/creator-settings.entity';

export class UpdateCreatorSettingsDto {
  @IsOptional()
  @IsEnum(ThemePreference)
  theme?: ThemePreference;

  @IsOptional()
  @IsEnum(LanguagePreference)
  language?: LanguagePreference;

  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  smsNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  pushNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  marketingEmails?: boolean;

  @IsOptional()
  @IsBoolean()
  publicProfile?: boolean;

  @IsOptional()
  @IsBoolean()
  showEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  showPhone?: boolean;

  @IsOptional()
  @IsBoolean()
  allowMessages?: boolean;

  @IsOptional()
  @IsBoolean()
  allowComments?: boolean;

  @IsOptional()
  @IsEnum(PayoutFrequency)
  payoutFrequency?: PayoutFrequency;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  @Max(10000)
  minimumPayoutThreshold?: number;

  @IsOptional()
  @IsBoolean()
  autoPayout?: boolean;

  @IsOptional()
  @IsString()
  @Length(3, 3)
  @Matches(/^[A-Z]{3}$/)
  preferredCurrency?: string;

  @IsOptional()
  @IsString()
  @Length(2, 2)
  @Matches(/^[A-Z]{2}$/)
  taxCountry?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  taxId?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  businessName?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  businessAddress?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  businessCity?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  businessState?: string;

  @IsOptional()
  @IsString()
  @Length(1, 10)
  businessZipCode?: string;

  @IsOptional()
  @IsObject()
  customSettings?: Record<string, any>;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  bio?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsString()
  socialLinks?: string; // JSON string
}

export class CreateCreatorSettingsDto extends UpdateCreatorSettingsDto {
  // Inherits all fields from UpdateCreatorSettingsDto
  // No additional required fields as settings are created with defaults
}
