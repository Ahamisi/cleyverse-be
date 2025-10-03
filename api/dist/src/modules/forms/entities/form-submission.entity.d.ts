import { BaseEntity } from '../../../common/base/base.entity';
import { Form } from './form.entity';
export declare class FormSubmission extends BaseEntity {
    formId: string;
    form: Form;
    submitterEmail: string | null;
    submitterName: string | null;
    submissionData: any;
    submitterIp: string | null;
    userAgent: string | null;
    referrerUrl: string | null;
    isRead: boolean;
    isStarred: boolean;
    isSpam: boolean;
    responseSent: boolean;
    responseSentAt: Date | null;
}
