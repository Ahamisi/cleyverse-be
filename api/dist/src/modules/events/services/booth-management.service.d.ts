import { Repository } from 'typeorm';
import { EventBooth, BoothType } from '../entities/event-booth.entity';
import { Event } from '../entities/event.entity';
export declare class CreateBoothDto {
    boothNumber: string;
    boothType: BoothType;
    section?: string;
    floor?: string;
    sizeWidth?: number;
    sizeLength?: number;
    sizeDescription?: string;
    basePrice: number;
    premiumMultiplier?: number;
    hasPower?: boolean;
    powerOutlets?: number;
    hasWifi?: boolean;
    hasStorage?: boolean;
    hasSink?: boolean;
    maxOccupancy?: number;
    description?: string;
    specialRequirements?: string;
    accessibilityFeatures?: string[];
}
export declare class BulkCreateBoothsDto {
    template: {
        boothType: BoothType;
        section?: string;
        floor?: string;
        sizeWidth?: number;
        sizeLength?: number;
        sizeDescription?: string;
        basePrice: number;
        premiumMultiplier?: number;
        hasPower?: boolean;
        powerOutlets?: number;
        hasWifi?: boolean;
        hasStorage?: boolean;
        hasSink?: boolean;
        maxOccupancy?: number;
        description?: string;
    };
    boothNumbers: string[];
    autoGenerate?: {
        prefix: string;
        startNumber: number;
        count: number;
    };
}
export declare class BoothManagementService {
    private boothRepository;
    private eventRepository;
    constructor(boothRepository: Repository<EventBooth>, eventRepository: Repository<Event>);
    createBooth(userId: string, eventId: string, createBoothDto: CreateBoothDto): Promise<EventBooth>;
    bulkCreateBooths(userId: string, eventId: string, bulkCreateDto: BulkCreateBoothsDto): Promise<EventBooth[]>;
    getEventBooths(userId: string, eventId: string): Promise<EventBooth[]>;
    getAvailableBooths(userId: string, eventId: string): Promise<EventBooth[]>;
    assignBoothToVendor(userId: string, eventId: string, boothId: string, vendorId: string): Promise<EventBooth>;
    generateBoothSuggestion(eventId: string, vendorRequirements?: {
        preferredSection?: string;
        needsPower?: boolean;
        needsWifi?: boolean;
        needsStorage?: boolean;
        needsSink?: boolean;
        minSize?: number;
        maxPrice?: number;
    }): Promise<EventBooth[]>;
    getBoothAnalytics(userId: string, eventId: string): Promise<any>;
}
