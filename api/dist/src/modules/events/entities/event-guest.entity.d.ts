export declare enum GuestStatus {
    INVITED = "invited",
    REGISTERED = "registered",
    WAITLISTED = "waitlisted",
    CONFIRMED = "confirmed",
    CHECKED_IN = "checked_in",
    NO_SHOW = "no_show",
    CANCELLED = "cancelled"
}
export declare enum GuestType {
    STANDARD = "standard",
    VIP = "vip",
    SPEAKER = "speaker",
    SPONSOR = "sponsor",
    MEDIA = "media",
    STAFF = "staff"
}
export declare enum InvitationSource {
    DIRECT = "direct",
    EMAIL = "email",
    SOCIAL = "social",
    REFERRAL = "referral",
    PUBLIC = "public",
    IMPORT = "import"
}
export declare class EventGuest {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    eventId: string;
    userId: string | null;
    event: any;
    user: any;
    guestName: string | null;
    guestEmail: string | null;
    guestPhone: string | null;
    guestCompany: string | null;
    status: GuestStatus;
    guestType: GuestType;
    invitationSource: InvitationSource;
    registrationToken: string | null;
    registeredAt: Date | null;
    confirmedAt: Date | null;
    checkedInAt: Date | null;
    checkedInBy: string | null;
    checkInMethod: string | null;
    dietaryRestrictions: string | null;
    specialRequests: string | null;
    registrationAnswers: Record<string, any> | null;
    invitationSentAt: Date | null;
    reminderSentAt: Date | null;
    followUpSentAt: Date | null;
    cancelledAt: Date | null;
    cancellationReason: string | null;
    waitlistPosition: number | null;
    waitlistedAt: Date | null;
    formSubmissionId: string | null;
    answers: any[];
}
