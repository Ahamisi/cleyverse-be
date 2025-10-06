export declare enum VendorQuestionType {
    SHORT_TEXT = "short_text",
    LONG_TEXT = "long_text",
    SINGLE_CHOICE = "single_choice",
    MULTIPLE_CHOICE = "multiple_choice",
    YES_NO = "yes_no",
    NUMBER = "number",
    EMAIL = "email",
    PHONE = "phone",
    URL = "url",
    DATE = "date",
    FILE_UPLOAD = "file_upload"
}
export declare class EventVendorQuestion {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    eventId: string;
    question: string;
    description: string | null;
    type: VendorQuestionType;
    isRequired: boolean;
    displayOrder: number;
    options: string[] | null;
    minLength: number | null;
    maxLength: number | null;
    minValue: number | null;
    maxValue: number | null;
    validationPattern: string | null;
    validationMessage: string | null;
    allowedFileTypes: string[] | null;
    maxFileSize: number | null;
    placeholderText: string | null;
    helpText: string | null;
    isActive: boolean;
    event: any;
}
export declare class EventVendorAnswer {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    vendorId: string;
    questionId: string;
    answer: string | null;
    fileUrl: string | null;
    fileName: string | null;
    vendor: any;
    question: EventVendorQuestion;
}
