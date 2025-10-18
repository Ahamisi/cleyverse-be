import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Payment } from './entities/payment.entity';
import { Invoice } from './entities/invoice.entity';
import { Transaction } from './entities/transaction.entity';
import { PaymentService } from './services/payment.service';
import { PaystackService } from './services/paystack.service';
import { QRCodeService } from './services/qr-code.service';
import { PaymentController, InvoiceController } from './controllers/payment.controller';
import { WebhookController } from './controllers/webhook.controller';
import { PaymentMethodsController } from './controllers/payment-methods.controller';
import { PaystackWebhookController } from './controllers/paystack-webhook.controller';
import { PaymentCallbackController } from './controllers/payment-callback.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Invoice, Transaction]),
    HttpModule,
  ],
  controllers: [
    PaymentController,
    InvoiceController,
    WebhookController,
    PaymentMethodsController,
    PaystackWebhookController,
    PaymentCallbackController,
  ],
  providers: [
    PaymentService,
    PaystackService,
    QRCodeService,
  ],
  exports: [
    PaymentService,
    PaystackService,
    QRCodeService,
  ],
})
export class PaymentsModule {}
