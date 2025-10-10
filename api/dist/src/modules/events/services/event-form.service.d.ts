import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { FormService } from '../../forms/services/form.service';
export declare class EventFormService {
    private eventRepository;
    private formService;
    constructor(eventRepository: Repository<Event>, formService: FormService);
    setVendorForm(userId: string, eventId: string, formId: string): Promise<Event>;
    setGuestForm(userId: string, eventId: string, formId: string): Promise<Event>;
    removeVendorForm(userId: string, eventId: string): Promise<Event>;
    removeGuestForm(userId: string, eventId: string): Promise<Event>;
    getEventForms(userId: string, eventId: string): Promise<{
        vendorFormId: string | null;
        guestFormId: string | null;
    }>;
    getPublicEventForms(eventId: string): Promise<{
        vendorFormId: string | null;
        guestFormId: string | null;
    }>;
    getAllEventLinkedForms(eventId: string): Promise<import("../../forms/entities/form.entity").Form[]>;
}
