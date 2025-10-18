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
var PaymentCallbackController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentCallbackController = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("../services/payment.service");
let PaymentCallbackController = PaymentCallbackController_1 = class PaymentCallbackController {
    paymentService;
    logger = new common_1.Logger(PaymentCallbackController_1.name);
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async paymentSuccess(reference, trxref, res) {
        try {
            this.logger.log(`Payment success callback received for reference: ${reference || trxref}`);
            const paymentRef = reference || trxref;
            if (paymentRef) {
                try {
                    await this.paymentService.verifyPayment(paymentRef);
                    this.logger.log(`Payment ${paymentRef} verified successfully`);
                }
                catch (error) {
                    this.logger.error(`Payment verification failed for ${paymentRef}:`, error);
                }
            }
            const successUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/payment/success?reference=${paymentRef}`;
            return res.redirect(successUrl);
        }
        catch (error) {
            this.logger.error('Error in payment success callback:', error);
            const errorUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/payment/error`;
            return res.redirect(errorUrl);
        }
    }
    async paymentFailure(reference, trxref, message, res) {
        try {
            this.logger.log(`Payment failure callback received for reference: ${reference || trxref}, message: ${message}`);
            const paymentRef = reference || trxref;
            const failureUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/payment/failure?reference=${paymentRef}&message=${encodeURIComponent(message || 'Payment failed')}`;
            return res.redirect(failureUrl);
        }
        catch (error) {
            this.logger.error('Error in payment failure callback:', error);
            const errorUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/payment/error`;
            return res.redirect(errorUrl);
        }
    }
    async paymentCancel(reference, trxref, res) {
        try {
            this.logger.log(`Payment cancelled by user for reference: ${reference || trxref}`);
            const paymentRef = reference || trxref;
            const cancelUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/payment/cancelled?reference=${paymentRef}`;
            return res.redirect(cancelUrl);
        }
        catch (error) {
            this.logger.error('Error in payment cancel callback:', error);
            const errorUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/payment/error`;
            return res.redirect(errorUrl);
        }
    }
};
exports.PaymentCallbackController = PaymentCallbackController;
__decorate([
    (0, common_1.Get)('success'),
    __param(0, (0, common_1.Query)('reference')),
    __param(1, (0, common_1.Query)('trxref')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PaymentCallbackController.prototype, "paymentSuccess", null);
__decorate([
    (0, common_1.Get)('failure'),
    __param(0, (0, common_1.Query)('reference')),
    __param(1, (0, common_1.Query)('trxref')),
    __param(2, (0, common_1.Query)('message')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], PaymentCallbackController.prototype, "paymentFailure", null);
__decorate([
    (0, common_1.Get)('cancel'),
    __param(0, (0, common_1.Query)('reference')),
    __param(1, (0, common_1.Query)('trxref')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PaymentCallbackController.prototype, "paymentCancel", null);
exports.PaymentCallbackController = PaymentCallbackController = PaymentCallbackController_1 = __decorate([
    (0, common_1.Controller)('payment-callback'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentCallbackController);
//# sourceMappingURL=payment-callback.controller.js.map