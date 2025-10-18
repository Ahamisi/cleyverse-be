import { Controller, Post, Headers, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { PaystackService } from '../services/paystack.service';

@Controller('webhooks')
export class WebhookController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly paystackService: PaystackService,
  ) {}

  @Post('paystack')
  @HttpCode(HttpStatus.OK)
  async handlePaystackWebhook(
    @Headers('x-paystack-signature') signature: string,
    @Body() payload: any
  ) {
    try {
      // Validate webhook signature
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
    } catch (error) {
      console.error('Error processing Paystack webhook:', error);
      return { status: 'error', message: 'Webhook processing failed' };
    }
  }

  private async handlePaymentSuccess(data: any) {
    try {
      const reference = data.reference;
      
      // Verify and update payment
      const payment = await this.paymentService.verifyPayment(reference);
      
      console.log(`Payment successful: ${payment.id}`);
      
      // TODO: Send success notifications
      // TODO: Update related entities (orders, tickets, etc.)
      // TODO: Trigger payout calculations
      
    } catch (error) {
      console.error('Error handling payment success:', error);
    }
  }

  private async handlePaymentFailed(data: any) {
    try {
      const reference = data.reference;
      
      // Find and update payment status
      // This would be handled by the verifyPayment method
      console.log(`Payment failed: ${reference}`);
      
      // TODO: Send failure notifications
      // TODO: Update related entities
      
    } catch (error) {
      console.error('Error handling payment failure:', error);
    }
  }

  private async handleTransferSuccess(data: any) {
    try {
      console.log(`Transfer successful: ${data.reference}`);
      
      // TODO: Update payout status
      // TODO: Send success notifications
      
    } catch (error) {
      console.error('Error handling transfer success:', error);
    }
  }

  private async handleTransferFailed(data: any) {
    try {
      console.log(`Transfer failed: ${data.reference}`);
      
      // TODO: Update payout status
      // TODO: Send failure notifications
      // TODO: Retry transfer if needed
      
    } catch (error) {
      console.error('Error handling transfer failure:', error);
    }
  }
}
