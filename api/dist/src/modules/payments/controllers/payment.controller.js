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
exports.InvoiceController = exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const payment_service_1 = require("../services/payment.service");
const paystack_service_1 = require("../services/paystack.service");
const payment_dto_1 = require("../dto/payment.dto");
let PaymentController = class PaymentController {
    paymentService;
    paystackService;
    constructor(paymentService, paystackService) {
        this.paymentService = paymentService;
        this.paystackService = paystackService;
    }
    async createPayment(req, createPaymentDto) {
        const paymentRequest = {
            userId: req.user.userId,
            ...createPaymentDto
        };
        const result = await this.paymentService.createPayment(paymentRequest);
        return {
            message: 'Payment initialized successfully',
            payment: result.payment,
            authorizationUrl: result.authorizationUrl,
            accessCode: result.accessCode,
            reference: result.reference
        };
    }
    async verifyPayment(verifyPaymentDto) {
        const payment = await this.paymentService.verifyPayment(verifyPaymentDto.reference);
        return {
            message: 'Payment verified successfully',
            payment
        };
    }
    async getPublicKey() {
        if (!this.paystackService.isConfigured()) {
            return {
                message: 'Paystack is not configured',
                publicKey: null,
                configured: false
            };
        }
        const publicKey = this.paystackService.getPublicKey();
        return {
            message: 'Public key retrieved successfully',
            publicKey,
            configured: true
        };
    }
    async getBanks() {
        const banks = await this.paystackService.getBanks();
        return {
            message: 'Banks retrieved successfully',
            banks: banks.data
        };
    }
    async getPayment(req, id) {
        const payment = await this.paymentService.getPaymentById(id);
        if (payment.userId !== req.user.userId) {
            throw new Error('Payment not found or access denied');
        }
        return {
            message: 'Payment retrieved successfully',
            payment
        };
    }
    async getUserPayments(req, query) {
        const result = await this.paymentService.getUserPayments(req.user.userId, query.limit, query.offset);
        return {
            message: 'Payments retrieved successfully',
            payments: result.payments,
            pagination: {
                total: result.total,
                limit: query.limit,
                offset: query.offset,
                hasMore: result.total > ((query.offset || 0) + (query.limit || 20))
            }
        };
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, payment_dto_1.CreatePaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createPayment", null);
__decorate([
    (0, common_1.Post)('verify'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_dto_1.VerifyPaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "verifyPayment", null);
__decorate([
    (0, common_1.Get)('public-key'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getPublicKey", null);
__decorate([
    (0, common_1.Get)('banks'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getBanks", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getPayment", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, payment_dto_1.PaymentQueryDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getUserPayments", null);
exports.PaymentController = PaymentController = __decorate([
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService,
        paystack_service_1.PaystackService])
], PaymentController);
let InvoiceController = class InvoiceController {
    paymentService;
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async createInvoice(req, createInvoiceDto) {
        const invoiceRequest = {
            creatorId: req.user.userId,
            ...createInvoiceDto
        };
        const result = await this.paymentService.createInvoice(invoiceRequest);
        return {
            message: 'Invoice created successfully',
            invoice: result.invoice,
            paymentLink: result.paymentLink,
            qrCode: result.qrCode
        };
    }
    async getInvoice(id) {
        const invoice = await this.paymentService.getInvoiceById(id);
        return {
            message: 'Invoice retrieved successfully',
            invoice
        };
    }
    async processInvoicePayment(id, processInvoicePaymentDto) {
        const result = await this.paymentService.processInvoicePayment(id, processInvoicePaymentDto);
        return {
            message: 'Invoice payment initialized successfully',
            payment: result.payment,
            authorizationUrl: result.authorizationUrl,
            accessCode: result.accessCode,
            reference: result.reference
        };
    }
    async getUserInvoices(req, query) {
        const result = await this.paymentService.getUserInvoices(req.user.userId, query.limit, query.offset);
        return {
            message: 'Invoices retrieved successfully',
            invoices: result.invoices,
            pagination: {
                total: result.total,
                limit: query.limit,
                offset: query.offset,
                hasMore: result.total > ((query.offset || 0) + (query.limit || 20))
            }
        };
    }
};
exports.InvoiceController = InvoiceController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, payment_dto_1.CreateInvoiceDto]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "createInvoice", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "getInvoice", null);
__decorate([
    (0, common_1.Post)(':id/pay'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payment_dto_1.ProcessInvoicePaymentDto]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "processInvoicePayment", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, payment_dto_1.PaymentQueryDto]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "getUserInvoices", null);
exports.InvoiceController = InvoiceController = __decorate([
    (0, common_1.Controller)('invoices'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], InvoiceController);
//# sourceMappingURL=payment.controller.js.map