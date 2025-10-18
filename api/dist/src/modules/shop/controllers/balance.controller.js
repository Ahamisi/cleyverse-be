"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceController = exports.BalanceQueryDto = exports.PayoutRequestDto = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const balance_service_1 = require("../services/balance.service");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class PayoutRequestDto {
    amount;
    currency;
    payoutMethod;
}
exports.PayoutRequestDto = PayoutRequestDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], PayoutRequestDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PayoutRequestDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PayoutRequestDto.prototype, "payoutMethod", void 0);
class BalanceQueryDto {
    page = 1;
    limit = 50;
}
exports.BalanceQueryDto = BalanceQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    __metadata("design:type", Number)
], BalanceQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    __metadata("design:type", Number)
], BalanceQueryDto.prototype, "limit", void 0);
let BalanceController = class BalanceController {
    balanceService;
    constructor(balanceService) {
        this.balanceService = balanceService;
    }
    async getStoreBalance(req, storeId) {
        return {
            message: 'Store balance retrieved successfully',
            store: {
                id: storeId,
                name: 'Store',
                storeUrl: storeId,
            },
            balance: {
                available: 0,
                pending: 0,
                held: 0,
                processing: 0,
                total: 0,
                currency: 'USD',
                breakdown: {
                    availableFormatted: 'USD 0.00',
                    pendingFormatted: 'USD 0.00',
                    heldFormatted: 'USD 0.00',
                    processingFormatted: 'USD 0.00',
                    totalFormatted: 'USD 0.00'
                }
            }
        };
    }
    async getBalanceHistory(req, storeId, query) {
        const page = query.page || 1;
        const limit = query.limit || 50;
        const offset = (page - 1) * limit;
        const history = await this.balanceService.getBalanceHistory(storeId, limit, offset);
        return {
            message: 'Balance history retrieved successfully',
            store: {
                id: storeId,
                name: 'Store',
                storeUrl: storeId,
            },
            history: history.transactions,
            pagination: {
                page,
                limit,
                total: history.total,
                totalPages: Math.ceil(history.total / limit),
            }
        };
    }
    async initiatePayout(req, storeId, payoutRequest) {
        try {
            const payout = await this.balanceService.initiatePayout(storeId, payoutRequest.amount, payoutRequest.currency, payoutRequest.payoutMethod);
            return {
                message: 'Payout initiated successfully',
                payout: {
                    id: payout.id,
                    amount: payout.amount,
                    currency: payout.currency,
                    method: payoutRequest.payoutMethod,
                    status: 'processing',
                    createdAt: payout.createdAt
                },
                note: 'Payout is being processed. You will receive a notification when it\'s completed.'
            };
        }
        catch (error) {
            return {
                message: error.message,
                error: 'Payout failed'
            };
        }
    }
};
exports.BalanceController = BalanceController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('storeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BalanceController.prototype, "getStoreBalance", null);
__decorate([
    (0, common_1.Get)('history'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('storeId')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, BalanceQueryDto]),
    __metadata("design:returntype", Promise)
], BalanceController.prototype, "getBalanceHistory", null);
__decorate([
    (0, common_1.Post)('payout'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('storeId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, PayoutRequestDto]),
    __metadata("design:returntype", Promise)
], BalanceController.prototype, "initiatePayout", null);
exports.BalanceController = BalanceController = __decorate([
    (0, common_1.Controller)('stores/:storeId/balance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [balance_service_1.BalanceService])
], BalanceController);
//# sourceMappingURL=balance.controller.js.map