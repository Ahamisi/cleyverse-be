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
exports.TransactionController = exports.TransactionQueryDto = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const payment_service_1 = require("../../payments/services/payment.service");
const order_service_1 = require("../services/order.service");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const payment_entity_1 = require("../../payments/entities/payment.entity");
class TransactionQueryDto {
    status;
    startDate;
    endDate;
    page = 1;
    limit = 20;
    orderId;
}
exports.TransactionQueryDto = TransactionQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(payment_entity_1.PaymentStatus),
    __metadata("design:type", String)
], TransactionQueryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], TransactionQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], TransactionQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    __metadata("design:type", Number)
], TransactionQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    __metadata("design:type", Number)
], TransactionQueryDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], TransactionQueryDto.prototype, "orderId", void 0);
let TransactionController = class TransactionController {
    paymentService;
    orderService;
    constructor(paymentService, orderService) {
        this.paymentService = paymentService;
        this.orderService = orderService;
    }
    async getStoreTransactions(req, storeId, query) {
        const userId = req.user.userId;
        const store = await this.orderService.getStoreById(storeId, userId);
        if (!store) {
            throw new Error('Store not found or does not belong to user');
        }
        const transactions = await this.paymentService.getStoreTransactions(storeId, {
            status: query.status,
            startDate: query.startDate,
            endDate: query.endDate,
            page: query.page,
            limit: query.limit,
            orderId: query.orderId,
        });
        return {
            message: 'Store transactions retrieved successfully',
            store: {
                id: store.id,
                name: store.name,
                storeUrl: store.storeUrl,
            },
            transactions: transactions.transactions,
            pagination: {
                page: query.page || 1,
                limit: query.limit || 20,
                total: transactions.total,
                totalPages: Math.ceil(transactions.total / (query.limit || 20)),
            },
            filters: {
                status: query.status,
                startDate: query.startDate,
                endDate: query.endDate,
                orderId: query.orderId,
            },
        };
    }
    async getTransactionSummary(req, storeId, query) {
        const userId = req.user.userId;
        const store = await this.orderService.getStoreById(storeId, userId);
        if (!store) {
            throw new Error('Store not found or does not belong to user');
        }
        const summary = await this.paymentService.getStoreTransactionSummary(storeId, {
            startDate: query.startDate,
            endDate: query.endDate,
        });
        return {
            message: 'Transaction summary retrieved successfully',
            store: {
                id: store.id,
                name: store.name,
                storeUrl: store.storeUrl,
            },
            summary,
        };
    }
    async getTransactionAnalytics(req, storeId, query) {
        const userId = req.user.userId;
        const store = await this.orderService.getStoreById(storeId, userId);
        if (!store) {
            throw new Error('Store not found or does not belong to user');
        }
        const analytics = await this.paymentService.getStoreTransactionAnalytics(storeId, {
            startDate: query.startDate,
            endDate: query.endDate,
            groupBy: query.groupBy || 'day',
        });
        return {
            message: 'Transaction analytics retrieved successfully',
            store: {
                id: store.id,
                name: store.name,
                storeUrl: store.storeUrl,
            },
            analytics,
        };
    }
};
exports.TransactionController = TransactionController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('storeId')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, TransactionQueryDto]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "getStoreTransactions", null);
__decorate([
    (0, common_1.Get)('summary'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('storeId')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "getTransactionSummary", null);
__decorate([
    (0, common_1.Get)('analytics'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('storeId')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "getTransactionAnalytics", null);
exports.TransactionController = TransactionController = __decorate([
    (0, common_1.Controller)('stores/:storeId/transactions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [payment_service_1.PaymentService,
        order_service_1.OrderService])
], TransactionController);
//# sourceMappingURL=transaction.controller.js.map