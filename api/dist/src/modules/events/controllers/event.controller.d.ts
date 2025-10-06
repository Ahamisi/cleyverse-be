import { EventService } from '../services/event.service';
import { CreateEventDto, UpdateEventDto, UpdateEventStatusDto, SearchEventsDto } from '../dto/event.dto';
export declare class EventController {
    private readonly eventService;
    constructor(eventService: EventService);
    create(req: any, createEventDto: CreateEventDto): Promise<{
        message: string;
        event: import("../entities/event.entity").Event;
    }>;
    findAll(req: any, includeArchived?: boolean): Promise<{
        message: string;
        events: import("../entities/event.entity").Event[];
        total: number;
    }>;
    searchPublic(searchDto: SearchEventsDto): Promise<{
        events: import("../entities/event.entity").Event[];
        total: number;
        page: number;
        totalPages: number;
        message: string;
    }>;
    checkSlugAvailability(slug: string): Promise<{
        message: string;
        available: boolean;
    }>;
    generateSlug(title: string): Promise<{
        message: string;
        slug: null;
    } | {
        message: string;
        slug: string;
    }>;
    getPublicEvent(slug: string): Promise<{
        message: string;
        event: import("../entities/event.entity").Event;
    }>;
    findOne(req: any, id: string): Promise<{
        message: string;
        event: import("../entities/event.entity").Event;
    }>;
    update(req: any, id: string, updateEventDto: UpdateEventDto): Promise<{
        message: string;
        event: import("../entities/event.entity").Event;
    }>;
    updateStatus(req: any, id: string, updateStatusDto: UpdateEventStatusDto): Promise<{
        message: string;
        event: import("../entities/event.entity").Event;
    }>;
    duplicate(req: any, id: string): Promise<{
        message: string;
        event: import("../entities/event.entity").Event;
    }>;
    getAnalytics(req: any, id: string): Promise<{
        message: string;
        analytics: any;
    }>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
}
