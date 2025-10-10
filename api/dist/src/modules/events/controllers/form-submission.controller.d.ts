import { FormSubmissionHandlerService } from '../services/form-submission-handler.service';
export declare class FormSubmissionController {
    private readonly formSubmissionHandler;
    constructor(formSubmissionHandler: FormSubmissionHandlerService);
    getVendorApplicationsFromForms(req: any, eventId: string): Promise<{
        message: string;
        applications: any[];
        total: number;
    }>;
    getGuestRegistrationsFromForms(req: any, eventId: string): Promise<{
        message: string;
        registrations: any[];
        total: number;
    }>;
    approveVendorFromForm(req: any, eventId: string, submissionId: string, approvalData: {
        boothNumber?: string;
        boothLocation?: string;
        vendorFee?: number;
        commissionRate?: number;
        reviewNotes?: string;
    }): Promise<{
        message: string;
        vendor: import("../entities/event-vendor.entity").EventVendor;
    }>;
    rejectVendorFromForm(req: any, eventId: string, submissionId: string, rejectionData: {
        reviewNotes?: string;
        rejectionReason?: string;
    }): Promise<{
        message: string;
    }>;
}
export declare class FormsWebhookController {
    private readonly formSubmissionHandler;
    constructor(formSubmissionHandler: FormSubmissionHandlerService);
    handleFormSubmission(payload: {
        formId: string;
        submissionId: string;
        userId?: string;
        submissionData: any;
    }): Promise<{
        message: string;
        error?: undefined;
    } | {
        message: string;
        error: any;
    }>;
}
