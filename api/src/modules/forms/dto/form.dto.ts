import { IsString, IsOptional, IsBoolean, IsEnum, IsInt, Min, MaxLength, IsArray, ValidateNested, IsEmail, ArrayNotEmpty, IsNotEmpty, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { FormType, FormStatus } from '../entities/form.entity';
import { FieldType } from '../entities/form-field.entity';

export class CreateFormFieldDto {
  @IsString()
  @MaxLength(100)
  label: string;

  @IsEnum(FieldType)
  type: FieldType;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  placeholder?: string;

  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  // Allow both 'required' and 'isRequired' for better UX
  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @IsOptional()
  fieldOptions?: any; // For dropdown options, etc.

  @IsOptional()
  validationRules?: any; // For validation rules
}

export class CreateFormDto {
  @IsString()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsEnum(FormType)
  type?: FormType;

  @IsOptional()
  @IsString()
  introduction?: string;

  @IsOptional()
  @IsString()
  thankYouMessage?: string;

  @IsOptional()
  @IsString()
  customTerms?: string;

  @IsOptional()
  @IsBoolean()
  requireTermsAcceptance?: boolean;

  @IsOptional()
  @IsBoolean()
  collectEmailAddresses?: boolean;

  @IsOptional()
  @IsBoolean()
  sendEmailNotifications?: boolean;

  @IsOptional()
  @IsEmail()
  notificationEmail?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFormFieldDto)
  fields?: CreateFormFieldDto[];
}

export class UpdateFormDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  introduction?: string;

  @IsOptional()
  @IsString()
  thankYouMessage?: string;

  @IsOptional()
  @IsString()
  customTerms?: string;

  @IsOptional()
  @IsBoolean()
  requireTermsAcceptance?: boolean;

  @IsOptional()
  @IsBoolean()
  collectEmailAddresses?: boolean;

  @IsOptional()
  @IsBoolean()
  sendEmailNotifications?: boolean;

  @IsOptional()
  @IsEmail()
  notificationEmail?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateFormStatusDto {
  @IsEnum(FormStatus)
  status: FormStatus;
}

export class SubmitFormDto {
  @IsOptional()
  @IsEmail()
  submitterEmail?: string;

  @IsOptional()
  @IsString()
  submitterName?: string;

  @IsNotEmpty()
  @IsObject()
  submissionData: any; // Dynamic form data - required

  @IsOptional()
  @IsBoolean()
  acceptTerms?: boolean;
}

export class AddFormFieldDto {
  @IsString()
  @MaxLength(100)
  label: string;

  @IsEnum(FieldType)
  type: FieldType;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  placeholder?: string;

  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @IsOptional()
  fieldOptions?: any;

  @IsOptional()
  validationRules?: any;
}

export class UpdateFormFieldDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  label?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  placeholder?: string;

  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  // Allow both 'required' and 'isRequired' for better UX
  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @IsOptional()
  fieldOptions?: any;

  @IsOptional()
  validationRules?: any;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ReorderFormFieldsDto {
  @ArrayNotEmpty()
  @IsString({ each: true })
  fieldIds: string[];
}
