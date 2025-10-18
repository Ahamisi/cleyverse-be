"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaystackService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const payment_config_1 = require("../../../config/payment.config");
let PaystackService = class PaystackService {
    httpService;
    baseUrl;
    secretKey;
    publicKey;
    constructor(httpService) {
        this.httpService = httpService;
        this.baseUrl = 'https://api.paystack.co';
        this.secretKey = process.env.PAYSTACK_SECRET_KEY || '';
        this.publicKey = process.env.PAYSTACK_PUBLIC_KEY || '';
        if (process.env.NODE_ENV === 'production' && (!this.secretKey || !this.publicKey)) {
            throw new Error('Paystack API keys are not configured');
        }
    }
    getHeaders() {
        return {
            'Authorization': `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
        };
    }
    async initializePayment(paymentRequest) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.baseUrl}/transaction/initialize`, paymentRequest, { headers: this.getHeaders() }));
            if (!response.data.status) {
                throw new common_1.BadRequestException(response.data.message || 'Failed to initialize payment');
            }
            return response.data;
        }
        catch (error) {
            if (error.response) {
                throw new common_1.HttpException(error.response.data.message || 'Paystack payment initialization failed', error.response.status);
            }
            throw new common_1.HttpException('Payment initialization failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async verifyPayment(reference) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.baseUrl}/transaction/verify/${reference}`, { headers: this.getHeaders() }));
            if (!response.data.status) {
                throw new common_1.BadRequestException(response.data.message || 'Failed to verify payment');
            }
            return response.data;
        }
        catch (error) {
            if (error.response) {
                throw new common_1.HttpException(error.response.data.message || 'Payment verification failed', error.response.status);
            }
            throw new common_1.HttpException('Payment verification failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createTransfer(transferData) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.baseUrl}/transfer`, transferData, { headers: this.getHeaders() }));
            if (!response.data.status) {
                throw new common_1.BadRequestException(response.data.message || 'Failed to create transfer');
            }
            return response.data;
        }
        catch (error) {
            if (error.response) {
                throw new common_1.HttpException(error.response.data.message || 'Transfer creation failed', error.response.status);
            }
            throw new common_1.HttpException('Transfer creation failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createRecipient(recipientData) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.baseUrl}/transferrecipient`, recipientData, { headers: this.getHeaders() }));
            if (!response.data.status) {
                throw new common_1.BadRequestException(response.data.message || 'Failed to create recipient');
            }
            return response.data;
        }
        catch (error) {
            if (error.response) {
                throw new common_1.HttpException(error.response.data.message || 'Recipient creation failed', error.response.status);
            }
            throw new common_1.HttpException('Recipient creation failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getBanks() {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.baseUrl}/bank`, { headers: this.getHeaders() }));
            return response.data;
        }
        catch (error) {
            if (error.response) {
                throw new common_1.HttpException(error.response.data.message || 'Failed to fetch banks', error.response.status);
            }
            throw new common_1.HttpException('Failed to fetch banks', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async validateWebhook(payload, signature) {
        const crypto = require('crypto');
        const webhookSecret = payment_config_1.PAYMENT_PROCESSORS_CONFIG.paystack.webhookSecret;
        if (!webhookSecret) {
            throw new Error('Paystack webhook secret is not configured');
        }
        const hash = crypto
            .createHmac('sha512', webhookSecret)
            .update(JSON.stringify(payload))
            .digest('hex');
        return hash === signature;
    }
    getPublicKey() {
        return this.publicKey;
    }
    isConfigured() {
        return !!(this.secretKey && this.publicKey);
    }
};
exports.PaystackService = PaystackService;
exports.PaystackService = PaystackService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], PaystackService);
//# sourceMappingURL=paystack.service.js.map