import { PaymentService } from '../services/payment.service';
import { PaystackService } from '../services/paystack.service';
export declare class PaystackWebhookController {
    private readonly paymentService;
    private readonly paystackService;
    private readonly logger;
    constructor(paymentService: PaymentService, paystackService: PaystackService);
    handlePaystackWebhook(body: any, signature: string): Promise<{
        status: string;
    }>;
    private handleSuccessfulPayment;
    private handleFailedPayment;
    private handleSuccessfulTransfer;
    private handleFailedTransfer;
    private verifyWebhookSignature;
}
