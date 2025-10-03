export declare const API_RESPONSE_KEY = "api_response";
export interface ApiResponseOptions {
    message?: string;
    excludeFields?: string[];
}
export declare const ApiResponseMessage: (options: ApiResponseOptions) => import("@nestjs/common").CustomDecorator<string>;
