import { Repository } from 'typeorm';
import { EventRegistrationQuestion, QuestionType } from '../entities/event-registration-question.entity';
import { Event } from '../entities/event.entity';
export declare class CreateRegistrationQuestionDto {
    question: string;
    description?: string;
    type: QuestionType;
    isRequired?: boolean;
    displayOrder?: number;
    options?: string[];
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
    validationPattern?: string;
    validationMessage?: string;
    allowedFileTypes?: string[];
    maxFileSize?: number;
    placeholderText?: string;
    helpText?: string;
}
export declare class UpdateRegistrationQuestionDto {
    question?: string;
    description?: string;
    isRequired?: boolean;
    displayOrder?: number;
    options?: string[];
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
    validationPattern?: string;
    validationMessage?: string;
    allowedFileTypes?: string[];
    maxFileSize?: number;
    placeholderText?: string;
    helpText?: string;
    isActive?: boolean;
}
export declare class RegistrationQuestionService {
    private questionRepository;
    private eventRepository;
    constructor(questionRepository: Repository<EventRegistrationQuestion>, eventRepository: Repository<Event>);
    addQuestion(userId: string, eventId: string, createDto: CreateRegistrationQuestionDto): Promise<EventRegistrationQuestion>;
    getEventQuestions(userId: string, eventId: string): Promise<EventRegistrationQuestion[]>;
    updateQuestion(userId: string, eventId: string, questionId: string, updateDto: UpdateRegistrationQuestionDto): Promise<EventRegistrationQuestion>;
    deleteQuestion(userId: string, eventId: string, questionId: string): Promise<void>;
    reorderQuestions(userId: string, eventId: string, questionOrders: {
        id: string;
        displayOrder: number;
    }[]): Promise<void>;
}
