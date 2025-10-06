import { VendorStatus, VendorType } from '../entities/event-vendor.entity';
export declare class ApplyAsVendorDto {
    businessName: string;
    businessDescription?: string;
    businessWebsite?: string;
    businessLogoUrl?: string;
    vendorType: VendorType;
    applicationMessage?: string;
    storeId?: string;
    contactName: string;
    contactEmail: string;
    contactPhone?: string;
    boothSize?: string;
    powerRequirements?: string;
    wifiRequired?: boolean;
    specialRequirements?: string;
    equipmentNeeded?: string[];
}
export declare class UpdateVendorApplicationDto {
    businessName?: string;
    businessDescription?: string;
    businessWebsite?: string;
    businessLogoUrl?: string;
    vendorType?: VendorType;
    applicationMessage?: string;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    boothSize?: string;
    powerRequirements?: string;
    wifiRequired?: boolean;
    specialRequirements?: string;
    equipmentNeeded?: string[];
}
export declare class ReviewVendorApplicationDto {
    status: VendorStatus;
    reviewNotes?: string;
    boothNumber?: string;
    boothLocation?: string;
    vendorFee?: number;
    commissionRate?: number;
}
export declare class UpdateVendorBoothDto {
    boothNumber?: string;
    boothSize?: string;
    boothLocation?: string;
    setupTime?: string;
    breakdownTime?: string;
    isFeatured?: boolean;
    displayOrder?: number;
}
export declare class LinkProductToEventDto {
    productId: string;
    eventPrice?: number;
    eventDiscount?: number;
    availableQuantity?: number;
    minOrderQuantity?: number;
    maxOrderQuantity?: number;
    isFeatured?: boolean;
    boothExclusive?: boolean;
    eventDescription?: string;
    eventTags?: string[];
    demoAvailable?: boolean;
}
export declare class SearchVendorsDto {
    search?: string;
    status?: VendorStatus;
    vendorType?: VendorType;
    isFeatured?: boolean;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
