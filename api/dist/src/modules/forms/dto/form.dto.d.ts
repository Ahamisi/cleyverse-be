import { FormType, FormStatus } from '../entities/form.entity';
import { FieldType } from '../entities/form-field.entity';
export declare class CreateFormFieldDto {
    label: string;
    type: FieldType;
    placeholder?: string;
    isRequired?: boolean;
    required?: boolean;
    displayOrder?: number;
    fieldOptions?: any;
    validationRules?: any;
}
export declare class CreateFormDto {
    title: string;
    type?: FormType;
    introduction?: string;
    thankYouMessage?: string;
    customTerms?: string;
    requireTermsAcceptance?: boolean;
    collectEmailAddresses?: boolean;
    sendEmailNotifications?: boolean;
    notificationEmail?: string;
    fields?: CreateFormFieldDto[];
}
export declare class UpdateFormDto {
    title?: string;
    introduction?: string;
    thankYouMessage?: string;
    customTerms?: string;
    requireTermsAcceptance?: boolean;
    collectEmailAddresses?: boolean;
    sendEmailNotifications?: boolean;
    notificationEmail?: string;
    isActive?: boolean;
}
export declare class UpdateFormStatusDto {
    status: FormStatus;
}
export declare class SubmitFormDto {
    submitterEmail?: string;
    submitterName?: string;
    submissionData: any;
    acceptTerms?: boolean;
}
export declare class AddFormFieldDto {
    label: string;
    type: FieldType;
    placeholder?: string;
    isRequired?: boolean;
    displayOrder?: number;
    fieldOptions?: any;
    validationRules?: any;
}
export declare class UpdateFormFieldDto {
    label?: string;
    placeholder?: string;
    isRequired?: boolean;
    required?: boolean;
    displayOrder?: number;
    fieldOptions?: any;
    validationRules?: any;
    isActive?: boolean;
}
export declare class ReorderFormFieldsDto {
    fieldIds: string[];
}
