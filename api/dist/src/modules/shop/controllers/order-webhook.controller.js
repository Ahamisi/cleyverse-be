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
exports.OrderWebhookController = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("../services/order.service");
const payment_service_1 = require("../../payments/services/payment.service");
const order_entity_1 = require("../entities/order.entity");
let OrderWebhookController = class OrderWebhookController {
    orderService;
    paymentService;
    constructor(orderService, paymentService) {
        this.orderService = orderService;
        this.paymentService = paymentService;
    }
    async handlePaymentCallback(orderId, body) {
        try {
            console.log(`Payment callback received for order: ${orderId}`);
            const order = await this.orderService.getOrderById(orderId);
            if (!order.paymentId) {
                console.error(`No payment ID found for order: ${orderId}`);
                return { status: 'error', message: 'No payment ID found' };
            }
            const payment = await this.paymentService.getPaymentById(order.paymentId);
            if (payment.status === 'completed') {
                await this.orderService.updateOrderStatus(orderId, {
                    status: order_entity_1.OrderStatus.CONFIRMED,
                    notes: 'Payment completed successfully'
                });
                console.log(`Order ${orderId} confirmed after successful payment`);
            }
            else if (payment.status === 'failed') {
                await this.orderService.updateOrderStatus(orderId, {
                    status: order_entity_1.OrderStatus.CANCELLED,
                    notes: 'Payment failed'
                });
                console.log(`Order ${orderId} cancelled due to failed payment`);
            }
            return { status: 'success', message: 'Payment callback processed' };
        }
        catch (error) {
            console.error('Error processing payment callback:', error);
            return { status: 'error', message: 'Payment callback processing failed' };
        }
    }
    async handlePaystackWebhook(payload) {
        try {
            const event = payload.event;
            const data = payload.data;
            console.log(`Received Paystack webhook: ${event}`);
            if (event === 'charge.success') {
                const order = await this.orderService.getOrderById(data.metadata?.orderId);
                if (order && order.paymentId === data.reference) {
                    await this.orderService.updateOrderStatus(order.id, {
                        status: order_entity_1.OrderStatus.CONFIRMED,
                        notes: 'Payment completed via Paystack webhook'
                    });
                    console.log(`Order ${order.id} confirmed via Paystack webhook`);
                }
            }
            else if (event === 'charge.failed') {
                const order = await this.orderService.getOrderById(data.metadata?.orderId);
                if (order && order.paymentId === data.reference) {
                    await this.orderService.updateOrderStatus(order.id, {
                        status: order_entity_1.OrderStatus.CANCELLED,
                        notes: 'Payment failed via Paystack webhook'
                    });
                    console.log(`Order ${order.id} cancelled via Paystack webhook`);
                }
            }
            return { status: 'success', message: 'Webhook processed' };
        }
        catch (error) {
            console.error('Error processing Paystack webhook:', error);
            return { status: 'error', message: 'Webhook processing failed' };
        }
    }
};
exports.OrderWebhookController = OrderWebhookController;
__decorate([
    (0, common_1.Post)(':orderId/payment-callback'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrderWebhookController.prototype, "handlePaymentCallback", null);
__decorate([
    (0, common_1.Post)('webhook/paystack'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderWebhookController.prototype, "handlePaystackWebhook", null);
exports.OrderWebhookController = OrderWebhookController = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [order_service_1.OrderService,
        payment_service_1.PaymentService])
], OrderWebhookController);
//# sourceMappingURL=order-webhook.controller.js.map