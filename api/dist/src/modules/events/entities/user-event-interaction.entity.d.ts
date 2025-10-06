export declare enum InteractionType {
    VIEW = "view",
    LIKE = "like",
    BOOKMARK = "bookmark",
    SHARE = "share",
    REGISTER = "register",
    ATTEND = "attend"
}
export declare class UserEventInteraction {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    eventId: string;
    type: InteractionType;
    metadata: Record<string, any> | null;
    sessionId: string | null;
    userAgent: string | null;
    ipAddress: string | null;
    user: any;
    event: any;
}
export declare class UserEventSubscription {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    eventId: string;
    isActive: boolean;
    notifyUpdates: boolean;
    notifyReminders: boolean;
    user: any;
    event: any;
}
