import { Repository } from 'typeorm';
import { EventVendor } from '../entities/event-vendor.entity';
import { EventProduct } from '../entities/event-product.entity';
import { Event } from '../entities/event.entity';
import { ApplyAsVendorDto, UpdateVendorApplicationDto, ReviewVendorApplicationDto, UpdateVendorBoothDto, LinkProductToEventDto, SearchVendorsDto } from '../dto/vendor.dto';
export declare class VendorService {
    private vendorRepository;
    private eventProductRepository;
    private eventRepository;
    constructor(vendorRepository: Repository<EventVendor>, eventProductRepository: Repository<EventProduct>, eventRepository: Repository<Event>);
    applyAsVendor(userId: string, eventId: string, applyDto: ApplyAsVendorDto): Promise<EventVendor>;
    updateVendorApplication(userId: string, eventId: string, updateDto: UpdateVendorApplicationDto): Promise<EventVendor>;
    reviewVendorApplication(userId: string, eventId: string, vendorId: string, reviewDto: ReviewVendorApplicationDto): Promise<EventVendor>;
    updateVendorBooth(userId: string, eventId: string, vendorId: string, updateBoothDto: UpdateVendorBoothDto): Promise<EventVendor>;
    linkProductToEvent(userId: string, eventId: string, linkDto: LinkProductToEventDto): Promise<EventProduct>;
    approveEventProduct(userId: string, eventId: string, productId: string): Promise<EventProduct>;
    rejectEventProduct(userId: string, eventId: string, productId: string, reason: string): Promise<EventProduct>;
    getEventVendors(userId: string, eventId: string, searchDto?: SearchVendorsDto): Promise<EventVendor[]>;
    getPublicEventVendors(eventId: string): Promise<EventVendor[]>;
    getEventProducts(eventId: string, vendorId?: string): Promise<EventProduct[]>;
    getVendorApplication(userId: string, eventId: string): Promise<EventVendor>;
    cancelVendorApplication(userId: string, eventId: string): Promise<void>;
    getVendorAnalytics(userId: string, eventId: string, vendorId: string): Promise<any>;
}
