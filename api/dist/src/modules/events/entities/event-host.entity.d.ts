export declare enum HostRole {
    OWNER = "owner",
    CO_HOST = "co_host",
    MODERATOR = "moderator",
    ADMIN = "admin"
}
export declare enum HostPermissions {
    MANAGE_EVENT = "manage_event",
    MANAGE_GUESTS = "manage_guests",
    MANAGE_VENDORS = "manage_vendors",
    CHECK_IN_GUESTS = "check_in_guests",
    SEND_MESSAGES = "send_messages",
    VIEW_ANALYTICS = "view_analytics",
    MANAGE_HOSTS = "manage_hosts"
}
export declare class EventHost {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    eventId: string;
    userId: string | null;
    event: any;
    user: any;
    role: HostRole;
    permissions: HostPermissions[];
    bio: string | null;
    profileImageUrl: string | null;
    title: string | null;
    company: string | null;
    linkedinUrl: string | null;
    twitterUrl: string | null;
    isActive: boolean;
    isFeatured: boolean;
    displayOrder: number;
    invitedBy: string | null;
    invitedAt: Date | null;
    acceptedAt: Date | null;
    invitationToken: string | null;
}
