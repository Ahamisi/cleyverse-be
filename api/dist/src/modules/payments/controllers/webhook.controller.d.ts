import { PaymentService } from '../services/payment.service';
import { PaystackService } from '../services/paystack.service';
export declare class WebhookController {
    private readonly paymentService;
    private readonly paystackService;
    constructor(paymentService: PaymentService, paystackService: PaystackService);
    handlePaystackWebhook(signature: string, payload: any): Promise<{
        status: string;
        message: string;
    }>;
    private handlePaymentSuccess;
    private handlePaymentFailed;
    private handleTransferSuccess;
    private handleTransferFailed;
}
