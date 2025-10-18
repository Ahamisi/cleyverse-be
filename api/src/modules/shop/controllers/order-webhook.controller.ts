import { Controller, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { PaymentService } from '../../payments/services/payment.service';
import { OrderStatus } from '../entities/order.entity';

@Controller('orders')
export class OrderWebhookController {
  constructor(
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
  ) {}

  @Post(':orderId/payment-callback')
  @HttpCode(HttpStatus.OK)
  async handlePaymentCallback(
    @Param('orderId') orderId: string,
    @Body() body: any
  ) {
    try {
      console.log(`Payment callback received for order: ${orderId}`);

      // Get the order
      const order = await this.orderService.getOrderById(orderId);
      
      if (!order.paymentId) {
        console.error(`No payment ID found for order: ${orderId}`);
        return { status: 'error', message: 'No payment ID found' };
      }

      // Verify the payment
      const payment = await this.paymentService.getPaymentById(order.paymentId);
      
      if (payment.status === 'completed') {
        // Update order status to confirmed
        await this.orderService.updateOrderStatus(orderId, {
          status: OrderStatus.CONFIRMED,
          notes: 'Payment completed successfully'
        });

        console.log(`Order ${orderId} confirmed after successful payment`);
        
        // TODO: Send confirmation email to customer
        // TODO: Send notification to store owner
        // TODO: Update inventory (already done during order creation)
        
      } else if (payment.status === 'failed') {
        // Update order status to cancelled
        await this.orderService.updateOrderStatus(orderId, {
          status: OrderStatus.CANCELLED,
          notes: 'Payment failed'
        });

        console.log(`Order ${orderId} cancelled due to failed payment`);
        
        // TODO: Send failure notification to customer
        // TODO: Restore inventory (already handled in order service)
      }

      return { status: 'success', message: 'Payment callback processed' };
    } catch (error) {
      console.error('Error processing payment callback:', error);
      return { status: 'error', message: 'Payment callback processing failed' };
    }
  }

  @Post('webhook/paystack')
  @HttpCode(HttpStatus.OK)
  async handlePaystackWebhook(@Body() payload: any) {
    try {
      const event = payload.event;
      const data = payload.data;

      console.log(`Received Paystack webhook: ${event}`);

      if (event === 'charge.success') {
        // Find order by payment reference
        const order = await this.orderService.getOrderById(data.metadata?.orderId);
        
        if (order && order.paymentId === data.reference) {
          await this.orderService.updateOrderStatus(order.id, {
            status: OrderStatus.CONFIRMED,
            notes: 'Payment completed via Paystack webhook'
          });

          console.log(`Order ${order.id} confirmed via Paystack webhook`);
        }
      } else if (event === 'charge.failed') {
        // Find order by payment reference
        const order = await this.orderService.getOrderById(data.metadata?.orderId);
        
        if (order && order.paymentId === data.reference) {
          await this.orderService.updateOrderStatus(order.id, {
            status: OrderStatus.CANCELLED,
            notes: 'Payment failed via Paystack webhook'
          });

          console.log(`Order ${order.id} cancelled via Paystack webhook`);
        }
      }

      return { status: 'success', message: 'Webhook processed' };
    } catch (error) {
      console.error('Error processing Paystack webhook:', error);
      return { status: 'error', message: 'Webhook processing failed' };
    }
  }
}
