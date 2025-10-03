"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponseMessage = exports.API_RESPONSE_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.API_RESPONSE_KEY = 'api_response';
const ApiResponseMessage = (options) => (0, common_1.SetMetadata)(exports.API_RESPONSE_KEY, options);
exports.ApiResponseMessage = ApiResponseMessage;
//# sourceMappingURL=api-response.decorator.js.map