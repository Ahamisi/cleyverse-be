export declare enum EventStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    LIVE = "live",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    ARCHIVED = "archived"
}
export declare enum EventType {
    CONFERENCE = "conference",
    WORKSHOP = "workshop",
    MEETUP = "meetup",
    WEBINAR = "webinar",
    NETWORKING = "networking",
    PARTY = "party",
    CONCERT = "concert",
    EXHIBITION = "exhibition",
    SEMINAR = "seminar",
    OTHER = "other"
}
export declare enum EventVisibility {
    PUBLIC = "public",
    PRIVATE = "private",
    UNLISTED = "unlisted"
}
export declare enum TicketType {
    FREE = "free",
    PAID = "paid",
    DONATION = "donation"
}
export declare enum LocationType {
    PHYSICAL = "physical",
    VIRTUAL = "virtual",
    HYBRID = "hybrid"
}
export declare class Event {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    slug: string;
    coverImageUrl: string | null;
    type: EventType;
    status: EventStatus;
    visibility: EventVisibility;
    startDate: Date;
    endDate: Date;
    timezone: string;
    locationType: LocationType;
    venueName: string | null;
    venueAddress: string | null;
    latitude: number | null;
    longitude: number | null;
    tags: string[] | null;
    categories: string[] | null;
    isRecurring: boolean;
    recurrencePattern: string | null;
    recurrenceInterval: number | null;
    recurrenceEndDate: Date | null;
    parentEventId: string | null;
    targetAudience: string[] | null;
    experienceLevel: string | null;
    industry: string | null;
    likeCount: number;
    bookmarkCount: number;
    engagementScore: number;
    virtualLink: string | null;
    meetingId: string | null;
    meetingPassword: string | null;
    ticketType: TicketType;
    ticketPrice: number | null;
    currency: string;
    capacity: number | null;
    requireApproval: boolean;
    registrationStart: Date | null;
    registrationEnd: Date | null;
    allowWaitlist: boolean;
    allowGuestsInviteOthers: boolean;
    showGuestList: boolean;
    sendReminders: boolean;
    seoTitle: string | null;
    seoDescription: string | null;
    socialImageUrl: string | null;
    viewCount: number;
    shareCount: number;
    totalRegistered: number;
    totalAttended: number;
    allowVendors: boolean;
    vendorApplicationDeadline: Date | null;
    vendorFee: number | null;
    publishedAt: Date | null;
    cancelledAt: Date | null;
    cancellationReason: string | null;
    creatorId: string;
    creator: any;
    guests: any[];
    hosts: any[];
    vendors: any[];
    products: any[];
    registrationQuestions: any[];
}
