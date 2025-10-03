import { BaseEntity } from '../../../common/base/base.entity';
import { Form } from './form.entity';
export declare enum FieldType {
    TEXT = "text",
    EMAIL = "email",
    PHONE = "phone",
    MESSAGE = "message",
    SHORT_ANSWER = "short_answer",
    PARAGRAPH = "paragraph",
    TEXTAREA = "textarea",
    DATE = "date",
    COUNTRY = "country",
    DROPDOWN = "dropdown",
    CHECKBOX = "checkbox",
    RADIO = "radio",
    MULTIPLE_CHOICE = "multiple_choice"
}
export declare class FormField extends BaseEntity {
    formId: string;
    form: Form;
    label: string;
    type: FieldType;
    placeholder: string | null;
    isRequired: boolean;
    displayOrder: number;
    fieldOptions: any;
    validationRules: any;
    isActive: boolean;
}
