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
exports.WebhookController = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("../services/payment.service");
const paystack_service_1 = require("../services/paystack.service");
let WebhookController = class WebhookController {
    paymentService;
    paystackService;
    constructor(paymentService, paystackService) {
        this.paymentService = paymentService;
        this.paystackService = paystackService;
    }
    async handlePaystackWebhook(signature, payload) {
        try {
            const isValid = await this.paystackService.validateWebhook(payload, signature);
            if (!isValid) {
                console.error('Invalid Paystack webhook signature');
                return { status: 'error', message: 'Invalid signature' };
            }
            const event = payload.event;
            const data = payload.data;
            console.log(`Received Paystack webhook: ${event}`);
            switch (event) {
                case 'charge.success':
                    await this.handlePaymentSuccess(data);
                    break;
                case 'charge.failed':
                    await this.handlePaymentFailed(data);
                    break;
                case 'transfer.success':
                    await this.handleTransferSuccess(data);
                    break;
                case 'transfer.failed':
                    await this.handleTransferFailed(data);
                    break;
                default:
                    console.log(`Unhandled Paystack webhook event: ${event}`);
            }
            return { status: 'success', message: 'Webhook processed' };
        }
        catch (error) {
            console.error('Error processing Paystack webhook:', error);
            return { status: 'error', message: 'Webhook processing failed' };
        }
    }
    async handlePaymentSuccess(data) {
        try {
            const reference = data.reference;
            const payment = await this.paymentService.verifyPayment(reference);
            console.log(`Payment successful: ${payment.id}`);
        }
        catch (error) {
            console.error('Error handling payment success:', error);
        }
    }
    async handlePaymentFailed(data) {
        try {
            const reference = data.reference;
            console.log(`Payment failed: ${reference}`);
        }
        catch (error) {
            console.error('Error handling payment failure:', error);
        }
    }
    async handleTransferSuccess(data) {
        try {
            console.log(`Transfer successful: ${data.reference}`);
        }
        catch (error) {
            console.error('Error handling transfer success:', error);
        }
    }
    async handleTransferFailed(data) {
        try {
            console.log(`Transfer failed: ${data.reference}`);
        }
        catch (error) {
            console.error('Error handling transfer failure:', error);
        }
    }
};
exports.WebhookController = WebhookController;
__decorate([
    (0, common_1.Post)('paystack'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Headers)('x-paystack-signature')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "handlePaystackWebhook", null);
exports.WebhookController = WebhookController = __decorate([
    (0, common_1.Controller)('webhooks'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService,
        paystack_service_1.PaystackService])
], WebhookController);
//# sourceMappingURL=webhook.controller.js.map