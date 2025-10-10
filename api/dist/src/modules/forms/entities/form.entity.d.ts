import { BaseEntity } from '../../../common/base/base.entity';
import { User } from '../../users/entities/user.entity';
import { FormField } from './form-field.entity';
import { FormSubmission } from './form-submission.entity';
export declare enum FormType {
    BLANK = "blank",
    EMAIL_SIGNUP = "email_signup",
    CONTACT_FORM = "contact_form",
    EVENT_REGISTRATION = "event_registration",
    VENDOR_APPLICATION = "vendor_application",
    GUEST_REGISTRATION = "guest_registration"
}
export declare enum FormStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    ARCHIVED = "archived"
}
export declare class Form extends BaseEntity {
    userId: string;
    user: User;
    title: string;
    type: FormType;
    introduction: string | null;
    thankYouMessage: string | null;
    eventContext: {
        eventId?: string;
        formPurpose?: 'registration' | 'vendor' | 'guest';
        eventTitle?: string;
        eventSlug?: string;
    } | null;
    customTerms: string | null;
    requireTermsAcceptance: boolean;
    collectEmailAddresses: boolean;
    sendEmailNotifications: boolean;
    notificationEmail: string | null;
    isActive: boolean;
    status: FormStatus;
    submissionCount: number;
    archivedAt: Date | null;
    fields: FormField[];
    submissions: FormSubmission[];
}
