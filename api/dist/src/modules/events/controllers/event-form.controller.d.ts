import { EventFormService } from '../services/event-form.service';
export declare class EventFormController {
    private readonly eventFormService;
    constructor(eventFormService: EventFormService);
    setVendorForm(req: any, eventId: string, formId: string): Promise<{
        message: string;
        event: {
            id: string;
            vendorFormId: string | null;
        };
    }>;
    setGuestForm(req: any, eventId: string, formId: string): Promise<{
        message: string;
        event: {
            id: string;
            guestFormId: string | null;
        };
    }>;
    removeVendorForm(req: any, eventId: string): Promise<{
        message: string;
        event: {
            id: string;
            vendorFormId: string | null;
        };
    }>;
    removeGuestForm(req: any, eventId: string): Promise<{
        message: string;
        event: {
            id: string;
            guestFormId: string | null;
        };
    }>;
    getEventForms(req: any, eventId: string): Promise<{
        message: string;
        forms: {
            vendorFormId: string | null;
            guestFormId: string | null;
        };
    }>;
}
export declare class PublicEventFormController {
    private readonly eventFormService;
    constructor(eventFormService: EventFormService);
    getPublicEventForms(eventId: string): Promise<{
        message: string;
        forms: {
            vendorFormId: string | null;
            guestFormId: string | null;
            vendorFormUrl: string | null;
            guestFormUrl: string | null;
        };
    }>;
}
