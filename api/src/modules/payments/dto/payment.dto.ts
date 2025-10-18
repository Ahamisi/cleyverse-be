import { IsString, IsNumber, IsEnum, IsOptional, IsEmail, IsUrl, IsObject, Min, MaxLength } from 'class-validator';
import { PaymentType, PaymentMethod, PlatformType } from '../../../config/payment.config';

export class CreatePaymentDto {
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  @MaxLength(3)
  currency: string;

  @IsEnum(PaymentType)
  type: PaymentType;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsEnum(PlatformType)
  platform: PlatformType;

  @IsString()
  @MaxLength(500)
  description: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @IsOptional()
  @IsUrl()
  callbackUrl?: string;
}

export class CreateInvoiceDto {
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  @MaxLength(3)
  currency: string;

  @IsString()
  @MaxLength(1000)
  description: string;

  @IsEnum(PlatformType)
  platform: PlatformType;

  @IsOptional()
  @IsObject()
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: {
      lat: number;
      lng: number;
    };
  };
}

export class ProcessInvoicePaymentDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsUrl()
  callbackUrl?: string;
}

export class VerifyPaymentDto {
  @IsString()
  reference: string;
}

export class PaymentQueryDto {
  @IsOptional()
  @IsNumber()
  limit?: number = 20;

  @IsOptional()
  @IsNumber()
  offset?: number = 0;
}
