"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const axios_1 = require("@nestjs/axios");
const payment_entity_1 = require("./entities/payment.entity");
const invoice_entity_1 = require("./entities/invoice.entity");
const transaction_entity_1 = require("./entities/transaction.entity");
const payment_service_1 = require("./services/payment.service");
const paystack_service_1 = require("./services/paystack.service");
const qr_code_service_1 = require("./services/qr-code.service");
const payment_controller_1 = require("./controllers/payment.controller");
const webhook_controller_1 = require("./controllers/webhook.controller");
const payment_methods_controller_1 = require("./controllers/payment-methods.controller");
const paystack_webhook_controller_1 = require("./controllers/paystack-webhook.controller");
const payment_callback_controller_1 = require("./controllers/payment-callback.controller");
let PaymentsModule = class PaymentsModule {
};
exports.PaymentsModule = PaymentsModule;
exports.PaymentsModule = PaymentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([payment_entity_1.Payment, invoice_entity_1.Invoice, transaction_entity_1.Transaction]),
            axios_1.HttpModule,
        ],
        controllers: [
            payment_controller_1.PaymentController,
            payment_controller_1.InvoiceController,
            webhook_controller_1.WebhookController,
            payment_methods_controller_1.PaymentMethodsController,
            paystack_webhook_controller_1.PaystackWebhookController,
            payment_callback_controller_1.PaymentCallbackController,
        ],
        providers: [
            payment_service_1.PaymentService,
            paystack_service_1.PaystackService,
            qr_code_service_1.QRCodeService,
        ],
        exports: [
            payment_service_1.PaymentService,
            paystack_service_1.PaystackService,
            qr_code_service_1.QRCodeService,
        ],
    })
], PaymentsModule);
//# sourceMappingURL=payments.module.js.map