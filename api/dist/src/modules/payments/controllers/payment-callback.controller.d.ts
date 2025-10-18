import type { Response } from 'express';
import { PaymentService } from '../services/payment.service';
export declare class PaymentCallbackController {
    private readonly paymentService;
    private readonly logger;
    constructor(paymentService: PaymentService);
    paymentSuccess(reference: string, trxref: string, res: Response): Promise<void>;
    paymentFailure(reference: string, trxref: string, message: string, res: Response): Promise<void>;
    paymentCancel(reference: string, trxref: string, res: Response): Promise<void>;
}
