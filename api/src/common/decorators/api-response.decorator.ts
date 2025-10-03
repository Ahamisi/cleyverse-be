import { SetMetadata } from '@nestjs/common';

export const API_RESPONSE_KEY = 'api_response';

export interface ApiResponseOptions {
  message?: string;
  excludeFields?: string[];
}

export const ApiResponseMessage = (options: ApiResponseOptions) => 
  SetMetadata(API_RESPONSE_KEY, options);
