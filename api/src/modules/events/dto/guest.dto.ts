import { IsString, IsOptional, IsEnum, IsEmail, IsBoolean, IsArray, MaxLength, IsUUID, IsPhoneNumber } from 'class-validator';
import { GuestStatus, GuestType, InvitationSource } from '../entities/event-guest.entity';

export class InviteGuestDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  guestName?: string;

  @IsOptional()
  @IsEmail()
  guestEmail?: string;

  @IsOptional()
  @IsPhoneNumber()
  guestPhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  guestCompany?: string;

  @IsOptional()
  @IsEnum(GuestType)
  guestType?: GuestType;

  @IsOptional()
  @IsEnum(InvitationSource)
  invitationSource?: InvitationSource;

  @IsOptional()
  @IsString()
  personalMessage?: string;
}

export class BulkInviteGuestsDto {
  @IsArray()
  guests: InviteGuestDto[];

  @IsOptional()
  @IsString()
  personalMessage?: string;

  @IsOptional()
  @IsBoolean()
  sendImmediately?: boolean = true;
}

export class ImportGuestsDto {
  @IsArray()
  @IsEmail({}, { each: true })
  emails: string[];

  @IsOptional()
  @IsEnum(GuestType)
  guestType?: GuestType;

  @IsOptional()
  @IsString()
  personalMessage?: string;
}

export class UpdateGuestStatusDto {
  @IsEnum(GuestStatus)
  status: GuestStatus;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class CheckInGuestDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  checkInMethod?: string = 'manual'; // 'qr_code', 'manual', 'search', 'self', 'nfc', 'badge_scan'

  @IsOptional()
  @IsString()
  notes?: string;
}

export class RegisterGuestDto {
  @IsString()
  registrationToken: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  guestName?: string;

  @IsOptional()
  @IsPhoneNumber()
  guestPhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  guestCompany?: string;

  @IsOptional()
  @IsString()
  dietaryRestrictions?: string;

  @IsOptional()
  @IsString()
  specialRequests?: string;

  @IsOptional()
  registrationAnswers?: Record<string, any>;
}

export class SearchGuestsDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @IsEnum(GuestStatus)
  status?: GuestStatus;

  @IsOptional()
  @IsEnum(GuestType)
  guestType?: GuestType;

  @IsOptional()
  @IsEnum(InvitationSource)
  invitationSource?: InvitationSource;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
