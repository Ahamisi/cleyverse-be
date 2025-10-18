import { Controller, Get, Query, Res, Logger } from '@nestjs/common';
import type { Response } from 'express';
import { PaymentService } from '../services/payment.service';

@Controller('payment-callback')
export class PaymentCallbackController {
  private readonly logger = new Logger(PaymentCallbackController.name);

  constructor(
    private readonly paymentService: PaymentService,
  ) {}

  @Get('success')
  async paymentSuccess(
    @Query('reference') reference: string,
    @Query('trxref') trxref: string,
    @Res() res: Response,
  ) {
    try {
      this.logger.log(`Payment success callback received for reference: ${reference || trxref}`);

      // Verify the payment
      const paymentRef = reference || trxref;
      if (paymentRef) {
        try {
          await this.paymentService.verifyPayment(paymentRef);
          this.logger.log(`Payment ${paymentRef} verified successfully`);
        } catch (error) {
          this.logger.error(`Payment verification failed for ${paymentRef}:`, error);
        }
      }

      // Redirect to success page
      // You can customize this URL based on your frontend
      const successUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/payment/success?reference=${paymentRef}`;
      
      return res.redirect(successUrl);
    } catch (error) {
      this.logger.error('Error in payment success callback:', error);
      const errorUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/payment/error`;
      return res.redirect(errorUrl);
    }
  }

  @Get('failure')
  async paymentFailure(
    @Query('reference') reference: string,
    @Query('trxref') trxref: string,
    @Query('message') message: string,
    @Res() res: Response,
  ) {
    try {
      this.logger.log(`Payment failure callback received for reference: ${reference || trxref}, message: ${message}`);

      const paymentRef = reference || trxref;
      const failureUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/payment/failure?reference=${paymentRef}&message=${encodeURIComponent(message || 'Payment failed')}`;
      
      return res.redirect(failureUrl);
    } catch (error) {
      this.logger.error('Error in payment failure callback:', error);
      const errorUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/payment/error`;
      return res.redirect(errorUrl);
    }
  }

  @Get('cancel')
  async paymentCancel(
    @Query('reference') reference: string,
    @Query('trxref') trxref: string,
    @Res() res: Response,
  ) {
    try {
      this.logger.log(`Payment cancelled by user for reference: ${reference || trxref}`);

      const paymentRef = reference || trxref;
      const cancelUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/payment/cancelled?reference=${paymentRef}`;
      
      return res.redirect(cancelUrl);
    } catch (error) {
      this.logger.error('Error in payment cancel callback:', error);
      const errorUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/payment/error`;
      return res.redirect(errorUrl);
    }
  }
}
