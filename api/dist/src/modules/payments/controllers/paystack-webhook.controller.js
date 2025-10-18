"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PaystackWebhookController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaystackWebhookController = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("../services/payment.service");
const paystack_service_1 = require("../services/paystack.service");
const payment_entity_1 = require("../entities/payment.entity");
const crypto = __importStar(require("crypto"));
let PaystackWebhookController = PaystackWebhookController_1 = class PaystackWebhookController {
    paymentService;
    paystackService;
    logger = new common_1.Logger(PaystackWebhookController_1.name);
    constructor(paymentService, paystackService) {
        this.paymentService = paymentService;
        this.paystackService = paystackService;
    }
    async handlePaystackWebhook(body, signature) {
        try {
            const isValid = this.verifyWebhookSignature(body, signature);
            if (!isValid) {
                this.logger.error('Invalid webhook signature');
                throw new common_1.HttpException('Invalid signature', common_1.HttpStatus.BAD_REQUEST);
            }
            const { event, data } = body;
            this.logger.log(`Received Paystack webhook: ${event}`);
            switch (event) {
                case 'charge.success':
                    await this.handleSuccessfulPayment(data);
                    break;
                case 'charge.failed':
                    await this.handleFailedPayment(data);
                    break;
                case 'transfer.success':
                    await this.handleSuccessfulTransfer(data);
                    break;
                case 'transfer.failed':
                    await this.handleFailedTransfer(data);
                    break;
                default:
                    this.logger.log(`Unhandled webhook event: ${event}`);
            }
            return { status: 'success' };
        }
        catch (error) {
            this.logger.error('Webhook processing error:', error);
            throw new common_1.HttpException('Webhook processing failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async handleSuccessfulPayment(data) {
        try {
            const { reference, amount, currency, customer, metadata } = data;
            const payment = await this.paymentService.verifyPayment(reference);
            if (payment && payment.status === payment_entity_1.PaymentStatus.PENDING) {
                await this.paymentService.updatePaymentStatus(payment.id, payment_entity_1.PaymentStatus.COMPLETED, {
                    paystackData: data,
                    processedAt: new Date()
                });
                if (metadata?.storeId && metadata?.orderId) {
                    this.logger.log(`Payment ${reference} completed for store ${metadata.storeId}, order ${metadata.orderId}`);
                }
                this.logger.log(`Payment ${reference} processed successfully`);
            }
        }
        catch (error) {
            this.logger.error(`Error processing successful payment: ${error.message}`);
            throw error;
        }
    }
    async handleFailedPayment(data) {
        try {
            const { reference, gateway_response } = data;
            const payment = await this.paymentService.verifyPayment(reference);
            if (payment && payment.status === payment_entity_1.PaymentStatus.PENDING) {
                await this.paymentService.updatePaymentStatus(payment.id, payment_entity_1.PaymentStatus.FAILED, {
                    failureReason: gateway_response,
                    failedAt: new Date()
                });
                this.logger.log(`Payment ${reference} failed: ${gateway_response}`);
            }
        }
        catch (error) {
            this.logger.error(`Error processing failed payment: ${error.message}`);
            throw error;
        }
    }
    async handleSuccessfulTransfer(data) {
        try {
            const { reference, amount, currency, recipient, status } = data;
            this.logger.log(`Transfer ${reference} completed successfully`);
        }
        catch (error) {
            this.logger.error(`Error processing successful transfer: ${error.message}`);
            throw error;
        }
    }
    async handleFailedTransfer(data) {
        try {
            const { reference, reason } = data;
            this.logger.log(`Transfer ${reference} failed: ${reason}`);
        }
        catch (error) {
            this.logger.error(`Error processing failed transfer: ${error.message}`);
            throw error;
        }
    }
    verifyWebhookSignature(body, signature) {
        try {
            const webhookSecret = process.env.PAYSTACK_WEBHOOK_SECRET;
            if (!webhookSecret) {
                this.logger.warn('Paystack webhook secret not configured');
                return false;
            }
            const hash = crypto
                .createHmac('sha512', webhookSecret)
                .update(JSON.stringify(body))
                .digest('hex');
            return hash === signature;
        }
        catch (error) {
            this.logger.error('Error verifying webhook signature:', error);
            return false;
        }
    }
};
exports.PaystackWebhookController = PaystackWebhookController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-paystack-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PaystackWebhookController.prototype, "handlePaystackWebhook", null);
exports.PaystackWebhookController = PaystackWebhookController = PaystackWebhookController_1 = __decorate([
    (0, common_1.Controller)('webhooks/paystack'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService,
        paystack_service_1.PaystackService])
], PaystackWebhookController);
//# sourceMappingURL=paystack-webhook.controller.js.map