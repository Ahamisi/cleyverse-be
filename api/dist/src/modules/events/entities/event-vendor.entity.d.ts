export declare enum VendorStatus {
    APPLIED = "applied",
    UNDER_REVIEW = "under_review",
    APPROVED = "approved",
    REJECTED = "rejected",
    CANCELLED = "cancelled",
    SUSPENDED = "suspended"
}
export declare enum VendorType {
    PRODUCT = "product",
    SERVICE = "service",
    FOOD = "food",
    SPONSOR = "sponsor",
    EXHIBITOR = "exhibitor"
}
export declare class EventVendor {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    eventId: string;
    userId: string;
    storeId: string | null;
    event: any;
    user: any;
    store: any;
    businessName: string;
    businessDescription: string | null;
    businessWebsite: string | null;
    businessLogoUrl: string | null;
    vendorType: VendorType;
    status: VendorStatus;
    applicationMessage: string | null;
    appliedAt: Date;
    reviewedAt: Date | null;
    reviewedBy: string | null;
    reviewNotes: string | null;
    boothNumber: string | null;
    boothSize: string | null;
    boothLocation: string | null;
    setupTime: Date | null;
    breakdownTime: Date | null;
    vendorFee: number | null;
    feePaid: boolean;
    paymentDueDate: Date | null;
    commissionRate: number | null;
    contactName: string;
    contactEmail: string;
    contactPhone: string | null;
    powerRequirements: string | null;
    wifiRequired: boolean;
    specialRequirements: string | null;
    equipmentNeeded: string[] | null;
    totalSales: number;
    totalOrders: number;
    boothVisits: number;
    isFeatured: boolean;
    displayOrder: number;
    isActive: boolean;
}
