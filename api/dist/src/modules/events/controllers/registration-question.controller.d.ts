import { RegistrationQuestionService, CreateRegistrationQuestionDto, UpdateRegistrationQuestionDto } from '../services/registration-question.service';
export declare class RegistrationQuestionController {
    private readonly questionService;
    constructor(questionService: RegistrationQuestionService);
    addQuestion(req: any, eventId: string, createDto: CreateRegistrationQuestionDto): Promise<{
        message: string;
        question: import("../entities/event-registration-question.entity").EventRegistrationQuestion;
    }>;
    getQuestions(req: any, eventId: string): Promise<{
        message: string;
        questions: import("../entities/event-registration-question.entity").EventRegistrationQuestion[];
        total: number;
    }>;
    updateQuestion(req: any, eventId: string, questionId: string, updateDto: UpdateRegistrationQuestionDto): Promise<{
        message: string;
        question: import("../entities/event-registration-question.entity").EventRegistrationQuestion;
    }>;
    deleteQuestion(req: any, eventId: string, questionId: string): Promise<{
        message: string;
    }>;
    reorderQuestions(req: any, eventId: string, questions: {
        id: string;
        displayOrder: number;
    }[]): Promise<{
        message: string;
    }>;
}
