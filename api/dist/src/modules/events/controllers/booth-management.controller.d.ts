import { BoothManagementService, CreateBoothDto, BulkCreateBoothsDto } from '../services/booth-management.service';
export declare class BoothManagementController {
    private readonly boothService;
    constructor(boothService: BoothManagementService);
    createBooth(req: any, eventId: string, createBoothDto: CreateBoothDto): Promise<{
        message: string;
        booth: import("../entities/event-booth.entity").EventBooth;
    }>;
    bulkCreateBooths(req: any, eventId: string, bulkCreateDto: BulkCreateBoothsDto): Promise<{
        message: string;
        booths: import("../entities/event-booth.entity").EventBooth[];
        total: number;
        boothNumbers: string[];
    }>;
    getEventBooths(req: any, eventId: string): Promise<{
        message: string;
        booths: import("../entities/event-booth.entity").EventBooth[];
        total: number;
    }>;
    getAvailableBooths(req: any, eventId: string): Promise<{
        message: string;
        booths: import("../entities/event-booth.entity").EventBooth[];
        total: number;
    }>;
    getBoothSuggestions(req: any, eventId: string, preferredSection?: string, needsPower?: string, needsWifi?: string, needsStorage?: string, needsSink?: string, maxPrice?: string): Promise<{
        message: string;
        suggestions: import("../entities/event-booth.entity").EventBooth[];
        total: number;
        criteria: {
            preferredSection: string | undefined;
            needsPower: boolean;
            needsWifi: boolean;
            needsStorage: boolean;
            needsSink: boolean;
            maxPrice: number | undefined;
        };
    }>;
    assignBoothToVendor(req: any, eventId: string, boothId: string, vendorId: string): Promise<{
        message: string;
        booth: import("../entities/event-booth.entity").EventBooth;
    }>;
    getBoothAnalytics(req: any, eventId: string): Promise<{
        message: string;
        analytics: any;
    }>;
}
