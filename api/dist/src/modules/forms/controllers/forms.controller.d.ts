import { FormService } from '../services/form.service';
import { CreateFormDto, UpdateFormDto, UpdateFormStatusDto, SubmitFormDto, AddFormFieldDto, UpdateFormFieldDto, ReorderFormFieldsDto } from '../dto/form.dto';
import { FormType } from '../entities/form.entity';
export declare class FormsController {
    private readonly formService;
    constructor(formService: FormService);
    create(req: any, createFormDto: CreateFormDto): Promise<{
        message: string;
        form: import("../entities/form.entity").Form;
    }>;
    findAll(req: any, includeInactive?: string): Promise<{
        message: string;
        forms: import("../entities/form.entity").Form[];
        total: number;
    }>;
    getFormTypes(): Promise<{
        message: string;
        types: {
            value: FormType;
            label: string;
            description: string;
        }[];
    }>;
    getFieldTypes(): Promise<{
        message: string;
        fieldTypes: {
            value: string;
            label: string;
            icon: string;
            description: string;
        }[];
    }>;
    getAnalytics(req: any, formId?: string): Promise<{
        message: string;
        analytics: any;
    }>;
    findOne(req: any, id: string): Promise<{
        message: string;
        form: import("../entities/form.entity").Form;
    }>;
    getPublicForm(id: string): Promise<{
        message: string;
        form: import("../entities/form.entity").Form;
    }>;
    update(req: any, id: string, updateFormDto: UpdateFormDto): Promise<{
        message: string;
        form: import("../entities/form.entity").Form;
    }>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
    updateStatus(req: any, id: string, updateStatusDto: UpdateFormStatusDto): Promise<{
        message: string;
        form: import("../entities/form.entity").Form;
    }>;
    addField(req: any, id: string, addFieldDto: AddFormFieldDto): Promise<{
        message: string;
        field: import("../entities/form-field.entity").FormField;
    }>;
    updateField(req: any, id: string, fieldId: string, updateFieldDto: UpdateFormFieldDto): Promise<{
        message: string;
        field: import("../entities/form-field.entity").FormField;
    }>;
    removeField(req: any, id: string, fieldId: string): Promise<{
        message: string;
    }>;
    reorderFields(req: any, id: string, reorderDto: ReorderFormFieldsDto): Promise<{
        message: string;
        form: import("../entities/form.entity").Form;
    }>;
    submitForm(id: string, submitDto: SubmitFormDto, req: any): Promise<{
        message: string;
        submissionId: string;
        thankYou: boolean;
    }>;
    getSubmissions(req: any, id: string): Promise<{
        message: string;
        submissions: import("../entities/form-submission.entity").FormSubmission[];
        total: number;
    }>;
    private validateUUID;
    private formatTypeLabel;
    private getTypeDescription;
    private formatFieldTypeLabel;
    private getFieldTypeDescription;
}
