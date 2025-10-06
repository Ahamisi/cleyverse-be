import { VendorService } from '../services/vendor.service';
import { ApplyAsVendorDto, UpdateVendorApplicationDto, ReviewVendorApplicationDto, UpdateVendorBoothDto, LinkProductToEventDto, SearchVendorsDto } from '../dto/vendor.dto';
export declare class VendorController {
    private readonly vendorService;
    constructor(vendorService: VendorService);
    apply(req: any, eventId: string, applyDto: ApplyAsVendorDto): Promise<{
        message: string;
        vendor: import("../entities/event-vendor.entity").EventVendor;
    }>;
    getMyApplication(req: any, eventId: string): Promise<{
        message: string;
        vendor: import("../entities/event-vendor.entity").EventVendor;
    }>;
    updateMyApplication(req: any, eventId: string, updateDto: UpdateVendorApplicationDto): Promise<{
        message: string;
        vendor: import("../entities/event-vendor.entity").EventVendor;
    }>;
    cancelMyApplication(req: any, eventId: string): Promise<{
        message: string;
    }>;
    findAll(req: any, eventId: string, searchDto: SearchVendorsDto): Promise<{
        message: string;
        vendors: import("../entities/event-vendor.entity").EventVendor[];
        total: number;
    }>;
    getPublicVendors(eventId: string): Promise<{
        message: string;
        vendors: import("../entities/event-vendor.entity").EventVendor[];
        total: number;
    }>;
    reviewApplication(req: any, eventId: string, vendorId: string, reviewDto: ReviewVendorApplicationDto): Promise<{
        message: string;
        vendor: import("../entities/event-vendor.entity").EventVendor;
    }>;
    updateBooth(req: any, eventId: string, vendorId: string, updateBoothDto: UpdateVendorBoothDto): Promise<{
        message: string;
        vendor: import("../entities/event-vendor.entity").EventVendor;
    }>;
    getAnalytics(req: any, eventId: string, vendorId: string): Promise<{
        message: string;
        analytics: any;
    }>;
}
export declare class EventProductController {
    private readonly vendorService;
    constructor(vendorService: VendorService);
    linkProduct(req: any, eventId: string, linkDto: LinkProductToEventDto): Promise<{
        message: string;
        eventProduct: import("../entities/event-product.entity").EventProduct;
    }>;
    getEventProducts(eventId: string, vendorId?: string): Promise<{
        message: string;
        products: import("../entities/event-product.entity").EventProduct[];
        total: number;
    }>;
    approveProduct(req: any, eventId: string, productId: string): Promise<{
        message: string;
        eventProduct: import("../entities/event-product.entity").EventProduct;
    }>;
    rejectProduct(req: any, eventId: string, productId: string, reason: string): Promise<{
        message: string;
        eventProduct: import("../entities/event-product.entity").EventProduct;
    }>;
}
