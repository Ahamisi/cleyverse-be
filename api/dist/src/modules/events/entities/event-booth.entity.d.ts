export declare enum BoothStatus {
    AVAILABLE = "available",
    RESERVED = "reserved",
    OCCUPIED = "occupied",
    MAINTENANCE = "maintenance"
}
export declare enum BoothType {
    STANDARD = "standard",
    PREMIUM = "premium",
    CORNER = "corner",
    ISLAND = "island",
    FOOD = "food",
    TECH = "tech"
}
export declare class EventBooth {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    eventId: string;
    vendorId: string | null;
    boothNumber: string;
    boothType: BoothType;
    status: BoothStatus;
    section: string | null;
    floor: string | null;
    positionX: number | null;
    positionY: number | null;
    sizeWidth: number | null;
    sizeLength: number | null;
    sizeDescription: string | null;
    basePrice: number;
    premiumMultiplier: number;
    hasPower: boolean;
    powerOutlets: number;
    hasWifi: boolean;
    hasStorage: boolean;
    hasSink: boolean;
    maxOccupancy: number;
    setupTime: Date | null;
    breakdownTime: Date | null;
    description: string | null;
    specialRequirements: string | null;
    accessibilityFeatures: string[] | null;
}
