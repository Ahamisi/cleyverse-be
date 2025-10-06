export declare enum EventProductStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    ACTIVE = "active",
    INACTIVE = "inactive"
}
export declare class EventProduct {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    eventId: string;
    productId: string;
    vendorId: string;
    event: any;
    product: any;
    vendor: any;
    status: EventProductStatus;
    eventPrice: number | null;
    eventDiscount: number | null;
    availableQuantity: number | null;
    minOrderQuantity: number;
    maxOrderQuantity: number | null;
    isFeatured: boolean;
    displayOrder: number;
    boothExclusive: boolean;
    eventDescription: string | null;
    eventTags: string[] | null;
    demoAvailable: boolean;
    demoTimes: any[] | null;
    approvedBy: string | null;
    approvedAt: Date | null;
    rejectionReason: string | null;
    viewCount: number;
    ordersCount: number;
    totalRevenue: number;
    demoRequests: number;
}
