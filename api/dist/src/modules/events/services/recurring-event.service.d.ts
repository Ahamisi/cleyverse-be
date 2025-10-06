import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
export declare class CreateRecurringEventDto {
    recurrencePattern: 'daily' | 'weekly' | 'monthly' | 'yearly';
    recurrenceInterval: number;
    recurrenceEndDate?: Date;
    maxInstances?: number;
}
export declare class RecurringEventService {
    private eventRepository;
    constructor(eventRepository: Repository<Event>);
    createRecurringEvent(userId: string, eventId: string, recurringDto: CreateRecurringEventDto): Promise<Event[]>;
    getRecurringEventInstances(userId: string, parentEventId: string): Promise<Event[]>;
    updateRecurringEventSeries(userId: string, parentEventId: string, updateData: Partial<Event>): Promise<Event[]>;
    deleteRecurringEventSeries(userId: string, parentEventId: string, deleteOption: 'all' | 'future'): Promise<void>;
    breakRecurringEventInstance(userId: string, instanceEventId: string): Promise<Event>;
    private generateRecurringInstances;
    private getNextOccurrence;
}
