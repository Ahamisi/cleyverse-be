import { EventRecommendationService, ExploreEventsDto } from '../services/event-recommendation.service';
import { RecurringEventService, CreateRecurringEventDto } from '../services/recurring-event.service';
import { InteractionType } from '../entities/user-event-interaction.entity';
export declare class EventExploreController {
    private readonly recommendationService;
    private readonly recurringEventService;
    constructor(recommendationService: EventRecommendationService, recurringEventService: RecurringEventService);
    exploreEvents(req: any, exploreDto: ExploreEventsDto): Promise<{
        message: string;
        events: import("../entities/event.entity").Event[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getPersonalizedRecommendations(req: any, limit?: number): Promise<{
        message: string;
        events: import("../entities/event.entity").Event[];
        total: number;
    }>;
    getNearbyEvents(latitude: number, longitude: number, radius?: number, limit?: number): Promise<{
        message: string;
        events: import("../entities/event.entity").Event[];
        total: number;
    }>;
    getTrendingEvents(limit?: number): Promise<{
        message: string;
        events: import("../entities/event.entity").Event[];
        total: number;
    }>;
    getUpcomingEvents(limit?: number): Promise<{
        message: string;
        events: import("../entities/event.entity").Event[];
        total: number;
    }>;
    trackInteraction(req: any, eventId: string, body: {
        type: InteractionType;
        metadata?: any;
    }): Promise<{
        message: string;
    }>;
    subscribeToEvent(req: any, eventId: string): Promise<{
        message: string;
        subscription: import("../entities/user-event-interaction.entity").UserEventSubscription;
    }>;
    unsubscribeFromEvent(req: any, eventId: string): Promise<{
        message: string;
    }>;
}
export declare class RecurringEventController {
    private readonly recurringEventService;
    constructor(recurringEventService: RecurringEventService);
    createRecurringEvent(req: any, eventId: string, recurringDto: CreateRecurringEventDto): Promise<{
        message: string;
        parentEvent: import("../entities/event.entity").Event;
        instances: import("../entities/event.entity").Event[];
        totalInstances: number;
    }>;
    getRecurringInstances(req: any, eventId: string): Promise<{
        message: string;
        instances: import("../entities/event.entity").Event[];
        total: number;
    }>;
    updateRecurringSeries(req: any, eventId: string, updateData: any): Promise<{
        message: string;
        parentEvent: import("../entities/event.entity").Event;
        instances: import("../entities/event.entity").Event[];
    }>;
    deleteRecurringSeries(req: any, eventId: string, deleteOption?: 'all' | 'future'): Promise<{
        message: string;
    }>;
    breakRecurringInstance(req: any, instanceId: string): Promise<{
        message: string;
        event: import("../entities/event.entity").Event;
    }>;
}
