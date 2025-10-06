import { GuestStatus, GuestType, InvitationSource } from '../entities/event-guest.entity';
export declare class InviteGuestDto {
    userId?: string;
    guestName?: string;
    guestEmail?: string;
    guestPhone?: string;
    guestCompany?: string;
    guestType?: GuestType;
    invitationSource?: InvitationSource;
    personalMessage?: string;
}
export declare class BulkInviteGuestsDto {
    guests: InviteGuestDto[];
    personalMessage?: string;
    sendImmediately?: boolean;
}
export declare class ImportGuestsDto {
    emails: string[];
    guestType?: GuestType;
    personalMessage?: string;
}
export declare class UpdateGuestStatusDto {
    status: GuestStatus;
    reason?: string;
}
export declare class CheckInGuestDto {
    checkInMethod?: string;
    notes?: string;
}
export declare class RegisterGuestDto {
    registrationToken: string;
    guestName?: string;
    guestPhone?: string;
    guestCompany?: string;
    dietaryRestrictions?: string;
    specialRequests?: string;
    registrationAnswers?: Record<string, any>;
}
export declare class SearchGuestsDto {
    search?: string;
    status?: GuestStatus;
    guestType?: GuestType;
    invitationSource?: InvitationSource;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
