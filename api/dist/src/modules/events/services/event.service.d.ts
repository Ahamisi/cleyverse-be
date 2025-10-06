import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { CreateEventDto, UpdateEventDto, UpdateEventStatusDto, SearchEventsDto } from '../dto/event.dto';
export declare class EventService {
    private eventRepository;
    constructor(eventRepository: Repository<Event>);
    createEvent(userId: string, createEventDto: CreateEventDto): Promise<Event>;
    private createOwnerHost;
    getUserEvents(userId: string, includeArchived?: boolean): Promise<Event[]>;
    getEventById(userId: string, eventId: string): Promise<Event>;
    getPublicEvent(slug: string): Promise<Event>;
    updateEvent(userId: string, eventId: string, updateEventDto: UpdateEventDto): Promise<Event>;
    updateEventStatus(userId: string, eventId: string, updateStatusDto: UpdateEventStatusDto): Promise<Event>;
    deleteEvent(userId: string, eventId: string): Promise<void>;
    duplicateEvent(userId: string, eventId: string): Promise<Event>;
    searchEvents(searchDto: SearchEventsDto): Promise<{
        events: Event[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getEventAnalytics(userId: string, eventId: string): Promise<any>;
    checkSlugAvailability(slug: string): Promise<boolean>;
    generateSlug(title: string): Promise<string>;
}
