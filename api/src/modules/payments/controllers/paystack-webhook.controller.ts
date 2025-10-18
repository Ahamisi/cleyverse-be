import { Controller, Post, Body, Headers, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { PaystackService } from '../services/paystack.service';
import { PaymentStatus } from '../entities/payment.entity';
import * as crypto from 'crypto';

@Controller('webhooks/paystack')
export class PaystackWebhookController {
  private readonly logger = new Logger(PaystackWebhookController.name);

  constructor(
    private readonly paymentService: PaymentService,
    private readonly paystackService: PaystackService,
  ) {}

  @Post()
  async handlePaystackWebhook(
    @Body() body: any,
    @Headers('x-paystack-signature') signature: string,
  ) {
    try {
      // Verify webhook signature
      const isValid = this.verifyWebhookSignature(body, signature);
      if (!isValid) {
        this.logger.error('Invalid webhook signature');
        throw new HttpException('Invalid signature', HttpStatus.BAD_REQUEST);
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
    } catch (error) {
      this.logger.error('Webhook processing error:', error);
      throw new HttpException('Webhook processing failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async handleSuccessfulPayment(data: any): Promise<void> {
    try {
      const { reference, amount, currency, customer, metadata } = data;

      // Update payment status
      const payment = await this.paymentService.verifyPayment(reference);
      
      if (payment && payment.status === PaymentStatus.PENDING) {
        // Update payment to completed
        await this.paymentService.updatePaymentStatus(payment.id, PaymentStatus.COMPLETED, {
          paystackData: data,
          processedAt: new Date()
        });

        // TODO: Add earning to store balance
        // This will be implemented when BalanceService is properly integrated
        if (metadata?.storeId && metadata?.orderId) {
          this.logger.log(`Payment ${reference} completed for store ${metadata.storeId}, order ${metadata.orderId}`);
          // Balance processing will be handled separately
        }

        this.logger.log(`Payment ${reference} processed successfully`);
      }
    } catch (error) {
      this.logger.error(`Error processing successful payment: ${error.message}`);
      throw error;
    }
  }

  private async handleFailedPayment(data: any): Promise<void> {
    try {
      const { reference, gateway_response } = data;

      // Update payment status
      const payment = await this.paymentService.verifyPayment(reference);
      
      if (payment && payment.status === PaymentStatus.PENDING) {
        await this.paymentService.updatePaymentStatus(payment.id, PaymentStatus.FAILED, {
          failureReason: gateway_response,
          failedAt: new Date()
        });

        // TODO: Process the balance (remove pending balance)
        // This will be implemented when BalanceService is properly integrated

        this.logger.log(`Payment ${reference} failed: ${gateway_response}`);
      }
    } catch (error) {
      this.logger.error(`Error processing failed payment: ${error.message}`);
      throw error;
    }
  }

  private async handleSuccessfulTransfer(data: any): Promise<void> {
    try {
      const { reference, amount, currency, recipient, status } = data;

      this.logger.log(`Transfer ${reference} completed successfully`);
      
      // Update balance status for completed payout
      // You would need to implement a method to find balance by transfer reference
      // and mark it as completed
      
    } catch (error) {
      this.logger.error(`Error processing successful transfer: ${error.message}`);
      throw error;
    }
  }

  private async handleFailedTransfer(data: any): Promise<void> {
    try {
      const { reference, reason } = data;

      this.logger.log(`Transfer ${reference} failed: ${reason}`);
      
      // Update balance status for failed payout
      // You would need to implement a method to find balance by transfer reference
      // and move the amount back to available balance
      
    } catch (error) {
      this.logger.error(`Error processing failed transfer: ${error.message}`);
      throw error;
    }
  }

  private verifyWebhookSignature(body: any, signature: string): boolean {
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
    } catch (error) {
      this.logger.error('Error verifying webhook signature:', error);
      return false;
    }
  }
}
