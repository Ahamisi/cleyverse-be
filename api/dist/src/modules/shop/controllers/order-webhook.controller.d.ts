import { OrderService } from '../services/order.service';
import { PaymentService } from '../../payments/services/payment.service';
export declare class OrderWebhookController {
    private readonly orderService;
    private readonly paymentService;
    constructor(orderService: OrderService, paymentService: PaymentService);
    handlePaymentCallback(orderId: string, body: any): Promise<{
        status: string;
        message: string;
    }>;
    handlePaystackWebhook(payload: any): Promise<{
        status: string;
        message: string;
    }>;
}
