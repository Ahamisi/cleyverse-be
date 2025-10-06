import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { UserEventInteraction, InteractionType, UserEventSubscription } from '../entities/user-event-interaction.entity';
export declare class EventRecommendationFilters {
    location?: {
        latitude: number;
        longitude: number;
        radius: number;
    };
    categories?: string[];
    tags?: string[];
    experienceLevel?: string;
    industry?: string;
    targetAudience?: string[];
    priceRange?: {
        min: number;
        max: number;
    };
    dateRange?: {
        start: Date;
        end: Date;
    };
    eventType?: string;
    locationType?: string;
}
export declare class ExploreEventsDto {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    filters?: EventRecommendationFilters;
}
export declare class EventRecommendationService {
    private eventRepository;
    private interactionRepository;
    private subscriptionRepository;
    constructor(eventRepository: Repository<Event>, interactionRepository: Repository<UserEventInteraction>, subscriptionRepository: Repository<UserEventSubscription>);
    getPersonalizedRecommendations(userId: string, limit?: number): Promise<Event[]>;
    getLocationBasedRecommendations(latitude: number, longitude: number, radiusKm?: number, limit?: number): Promise<Event[]>;
    exploreEvents(userId: string | null, exploreDto: ExploreEventsDto): Promise<{
        events: Event[];
        total: number;
    }>;
    getTrendingEvents(limit?: number): Promise<Event[]>;
    getUpcomingEvents(limit?: number): Promise<Event[]>;
    trackInteraction(userId: string, eventId: string, type: InteractionType, metadata?: any): Promise<void>;
    subscribeToEvent(userId: string, eventId: string): Promise<UserEventSubscription>;
    unsubscribeFromEvent(userId: string, eventId: string): Promise<void>;
    private analyzeUserPreferences;
    private getInteractionWeight;
    private getTopItems;
    private applyFilters;
    private applySorting;
    private trackBulkInteraction;
    private updateEventEngagement;
}
