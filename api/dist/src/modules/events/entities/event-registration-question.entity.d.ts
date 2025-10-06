export declare enum QuestionType {
    SHORT_TEXT = "short_text",
    LONG_TEXT = "long_text",
    SINGLE_CHOICE = "single_choice",
    MULTIPLE_CHOICE = "multiple_choice",
    DROPDOWN = "dropdown",
    EMAIL = "email",
    PHONE = "phone",
    NUMBER = "number",
    DATE = "date",
    CHECKBOX = "checkbox",
    FILE_UPLOAD = "file_upload"
}
export declare class EventRegistrationQuestion {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    eventId: string;
    event: any;
    question: string;
    description: string | null;
    type: QuestionType;
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
    isActive: boolean;
    placeholderText: string | null;
    helpText: string | null;
    answers: any[];
}
export declare class EventGuestAnswer {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    guestId: string;
    questionId: string;
    guest: any;
    question: any;
    answerText: string | null;
    answerNumber: number | null;
    answerDate: Date | null;
    answerBoolean: boolean | null;
    answerChoices: string[] | null;
    fileUrl: string | null;
    fileName: string | null;
    fileSize: number | null;
}
