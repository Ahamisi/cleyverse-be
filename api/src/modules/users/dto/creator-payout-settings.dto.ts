import { IsOptional, IsString, IsBoolean, IsEnum, IsEmail, IsObject, Length, Matches, IsNumber, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { 
  PayoutMethod, 
  BankAccountType, 
  PayoutStatus 
} from '../entities/creator-payout-settings.entity';

export class CreatePayoutSettingsDto {
  @IsEnum(PayoutMethod)
  method: PayoutMethod;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  // Bank Transfer Fields
  @IsOptional()
  @IsString()
  @Length(1, 100)
  bankName?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  accountNumber?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  routingNumber?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  swiftCode?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  iban?: string;

  @IsOptional()
  @IsEnum(BankAccountType)
  accountType?: BankAccountType;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  accountHolderName?: string;

  @IsOptional()
  @IsString()
  @Length(2, 2)
  @Matches(/^[A-Z]{2}$/)
  country?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  address?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  city?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  state?: string;

  @IsOptional()
  @IsString()
  @Length(1, 10)
  zipCode?: string;

  // PayPal Fields
  @IsOptional()
  @IsEmail()
  paypalEmail?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  paypalMerchantId?: string;

  // Stripe Connect Fields
  @IsOptional()
  @IsString()
  @Length(1, 100)
  stripeAccountId?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  stripeConnectId?: string;

  // Wise Fields
  @IsOptional()
  @IsString()
  @Length(1, 100)
  wiseAccountId?: string;

  @IsOptional()
  @IsEmail()
  wiseEmail?: string;

  // Crypto Fields
  @IsOptional()
  @IsString()
  @Length(1, 50)
  cryptoCurrency?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  cryptoAddress?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  cryptoNetwork?: string;

  // Additional Fields
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  externalId?: string;
}

export class UpdatePayoutSettingsDto {
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsOptional()
  @IsEnum(PayoutStatus)
  status?: PayoutStatus;

  // Bank Transfer Fields
  @IsOptional()
  @IsString()
  @Length(1, 100)
  bankName?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  accountNumber?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  routingNumber?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  swiftCode?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  iban?: string;

  @IsOptional()
  @IsEnum(BankAccountType)
  accountType?: BankAccountType;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  accountHolderName?: string;

  @IsOptional()
  @IsString()
  @Length(2, 2)
  @Matches(/^[A-Z]{2}$/)
  country?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  address?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  city?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  state?: string;

  @IsOptional()
  @IsString()
  @Length(1, 10)
  zipCode?: string;

  // PayPal Fields
  @IsOptional()
  @IsEmail()
  paypalEmail?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  paypalMerchantId?: string;

  // Stripe Connect Fields
  @IsOptional()
  @IsString()
  @Length(1, 100)
  stripeAccountId?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  stripeConnectId?: string;

  // Wise Fields
  @IsOptional()
  @IsString()
  @Length(1, 100)
  wiseAccountId?: string;

  @IsOptional()
  @IsEmail()
  wiseEmail?: string;

  // Crypto Fields
  @IsOptional()
  @IsString()
  @Length(1, 50)
  cryptoCurrency?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  cryptoAddress?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  cryptoNetwork?: string;

  // Verification Fields
  @IsOptional()
  @IsString()
  @Length(1, 255)
  verificationDocument?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  verificationNotes?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  verifiedBy?: string;

  // Additional Fields
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  externalId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class PayoutSettingsQueryDto {
  @IsOptional()
  @IsEnum(PayoutMethod)
  method?: PayoutMethod;

  @IsOptional()
  @IsEnum(PayoutStatus)
  status?: PayoutStatus;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isActive?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
