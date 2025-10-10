import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { EventVendor } from '../entities/event-vendor.entity';
import { EventGuest } from '../entities/event-guest.entity';
import { FormService } from '../../forms/services/form.service';
export declare class FormSubmissionHandlerService {
    private eventRepository;
    private vendorRepository;
    private guestRepository;
    private formService;
    constructor(eventRepository: Repository<Event>, vendorRepository: Repository<EventVendor>, guestRepository: Repository<EventGuest>, formService: FormService);
    processVendorFormSubmission(formId: string, submissionId: string, userId?: string): Promise<EventVendor>;
    processGuestFormSubmission(formId: string, submissionId: string, userId?: string): Promise<EventGuest>;
    getVendorApplicationsFromForms(userId: string, eventId: string): Promise<any[]>;
    getGuestRegistrationsFromForms(userId: string, eventId: string): Promise<any[]>;
    approveVendorFromForm(userId: string, eventId: string, submissionId: string, approvalData: {
        boothId?: string;
        vendorFee?: number;
        commissionRate?: number;
        reviewNotes?: string;
        paymentDueDate?: string;
    }): Promise<EventVendor>;
    private extractVendorDataFromSubmission;
    private extractGuestDataFromSubmission;
}
