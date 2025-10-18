import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PAYMENT_PROCESSORS_CONFIG } from '../../../config/payment.config';

export interface PaystackPaymentRequest {
  amount: number;
  currency: string;
  email: string;
  reference?: string;
  callback_url?: string;
  metadata?: Record<string, any>;
}

export interface PaystackPaymentResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: Record<string, any>;
    log: any;
    fees: number;
    fees_split: any;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
      account_name: string;
    };
    customer: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      customer_code: string;
      phone: string;
      metadata: Record<string, any>;
      risk_action: string;
      international_format_phone: string;
    };
    plan: any;
    split: any;
    order_id: any;
    paidAt: string;
    createdAt: string;
    requested_amount: number;
    pos_transaction_data: any;
    source: any;
    fees_breakdown: any;
  };
}

@Injectable()
export class PaystackService {
  private readonly baseUrl: string;
  private readonly secretKey: string;
  private readonly publicKey: string;

  constructor(private readonly httpService: HttpService) {
    // Get config directly from environment variables since PAYMENT_PROCESSORS_CONFIG
    // is imported before environment variables are loaded
    this.baseUrl = 'https://api.paystack.co';
    this.secretKey = process.env.PAYSTACK_SECRET_KEY || '';
    this.publicKey = process.env.PAYSTACK_PUBLIC_KEY || '';

    // Only throw error in production, allow development without keys
    if (process.env.NODE_ENV === 'production' && (!this.secretKey || !this.publicKey)) {
      throw new Error('Paystack API keys are not configured');
    }
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.secretKey}`,
      'Content-Type': 'application/json',
    };
  }

  async initializePayment(paymentRequest: PaystackPaymentRequest): Promise<PaystackPaymentResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/transaction/initialize`,
          paymentRequest,
          { headers: this.getHeaders() }
        )
      );

      if (!response.data.status) {
        throw new BadRequestException(response.data.message || 'Failed to initialize payment');
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.message || 'Paystack payment initialization failed',
          error.response.status
        );
      }
      throw new HttpException('Payment initialization failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyPayment(reference: string): Promise<PaystackVerifyResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.baseUrl}/transaction/verify/${reference}`,
          { headers: this.getHeaders() }
        )
      );

      if (!response.data.status) {
        throw new BadRequestException(response.data.message || 'Failed to verify payment');
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.message || 'Payment verification failed',
          error.response.status
        );
      }
      throw new HttpException('Payment verification failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createTransfer(transferData: {
    source: string;
    amount: number;
    recipient: string;
    reason: string;
    reference?: string;
  }): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/transfer`,
          transferData,
          { headers: this.getHeaders() }
        )
      );

      if (!response.data.status) {
        throw new BadRequestException(response.data.message || 'Failed to create transfer');
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.message || 'Transfer creation failed',
          error.response.status
        );
      }
      throw new HttpException('Transfer creation failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createRecipient(recipientData: {
    type: string;
    name: string;
    account_number: string;
    bank_code: string;
    currency: string;
  }): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/transferrecipient`,
          recipientData,
          { headers: this.getHeaders() }
        )
      );

      if (!response.data.status) {
        throw new BadRequestException(response.data.message || 'Failed to create recipient');
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.message || 'Recipient creation failed',
          error.response.status
        );
      }
      throw new HttpException('Recipient creation failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getBanks(): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.baseUrl}/bank`,
          { headers: this.getHeaders() }
        )
      );

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.message || 'Failed to fetch banks',
          error.response.status
        );
      }
      throw new HttpException('Failed to fetch banks', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async validateWebhook(payload: any, signature: string): Promise<boolean> {
    const crypto = require('crypto');
    const webhookSecret = PAYMENT_PROCESSORS_CONFIG.paystack.webhookSecret;
    
    if (!webhookSecret) {
      throw new Error('Paystack webhook secret is not configured');
    }

    const hash = crypto
      .createHmac('sha512', webhookSecret)
      .update(JSON.stringify(payload))
      .digest('hex');

    return hash === signature;
  }

  getPublicKey(): string {
    return this.publicKey;
  }

  isConfigured(): boolean {
    return !!(this.secretKey && this.publicKey);
  }
}
