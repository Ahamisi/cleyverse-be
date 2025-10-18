"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("../entities/payment.entity");
const invoice_entity_1 = require("../entities/invoice.entity");
const transaction_entity_1 = require("../entities/transaction.entity");
const paystack_service_1 = require("./paystack.service");
const qr_code_service_1 = require("./qr-code.service");
const payment_config_1 = require("../../../config/payment.config");
const crypto = __importStar(require("crypto"));
let PaymentService = class PaymentService {
    paymentRepository;
    invoiceRepository;
    transactionRepository;
    paystackService;
    qrCodeService;
    constructor(paymentRepository, invoiceRepository, transactionRepository, paystackService, qrCodeService) {
        this.paymentRepository = paymentRepository;
        this.invoiceRepository = invoiceRepository;
        this.transactionRepository = transactionRepository;
        this.paystackService = paystackService;
        this.qrCodeService = qrCodeService;
    }
    async createPayment(paymentRequest) {
        const platformFee = this.calculatePlatformFee(paymentRequest.amount, paymentRequest.platform, paymentRequest.type);
        const processorFee = this.calculateProcessorFee(paymentRequest.amount, paymentRequest.currency);
        const netAmount = paymentRequest.amount - platformFee - processorFee;
        const payment = this.paymentRepository.create({
            userId: paymentRequest.userId,
            amount: paymentRequest.amount,
            currency: paymentRequest.currency,
            type: paymentRequest.type,
            method: paymentRequest.method,
            platform: paymentRequest.platform,
            description: paymentRequest.description,
            metadata: paymentRequest.metadata,
            platformFee,
            processorFee,
            netAmount,
            status: payment_entity_1.PaymentStatus.PENDING,
            processor: this.selectPaymentProcessor(paymentRequest.currency),
            platformTransactionId: crypto.randomUUID(),
        });
        const savedPayment = await this.paymentRepository.save(payment);
        if (paymentRequest.method === payment_entity_1.PaymentMethod.CREDIT_CARD ||
            paymentRequest.method === payment_entity_1.PaymentMethod.DEBIT_CARD) {
            const selectedProcessor = this.selectPaymentProcessor(paymentRequest.currency);
            if (selectedProcessor === 'paystack') {
                const paystackResponse = await this.paystackService.initializePayment({
                    amount: paymentRequest.amount * 100,
                    currency: paymentRequest.currency,
                    email: paymentRequest.customerEmail || 'customer@example.com',
                    reference: savedPayment.platformTransactionId,
                    callback_url: paymentRequest.callbackUrl,
                    metadata: {
                        paymentId: savedPayment.id,
                        userId: paymentRequest.userId,
                        platform: paymentRequest.platform,
                        ...paymentRequest.metadata
                    }
                });
                await this.paymentRepository.update(savedPayment.id, {
                    platformTransactionId: paystackResponse.data.reference,
                    processorResponse: paystackResponse
                });
                return {
                    payment: savedPayment,
                    authorizationUrl: paystackResponse.data.authorization_url,
                    accessCode: paystackResponse.data.access_code,
                    reference: paystackResponse.data.reference
                };
            }
            else if (selectedProcessor === 'stripe') {
                throw new common_1.BadRequestException('Stripe integration not yet implemented');
            }
            else if (selectedProcessor === 'paypal') {
                throw new common_1.BadRequestException('PayPal integration not yet implemented');
            }
            else {
                throw new common_1.BadRequestException(`Unsupported payment processor: ${selectedProcessor}`);
            }
        }
        return { payment: savedPayment };
    }
    async verifyPayment(reference) {
        const paystackResponse = await this.paystackService.verifyPayment(reference);
        const payment = await this.paymentRepository.findOne({
            where: { platformTransactionId: reference }
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        const isSuccessful = paystackResponse.data.status === 'success';
        const newStatus = isSuccessful ? payment_entity_1.PaymentStatus.COMPLETED : payment_entity_1.PaymentStatus.FAILED;
        await this.paymentRepository.update(payment.id, {
            status: newStatus,
            processedAt: isSuccessful ? new Date() : undefined,
            failedAt: !isSuccessful ? new Date() : undefined,
            processorResponse: paystackResponse,
            failureReason: !isSuccessful ? paystackResponse.data.gateway_response : undefined
        });
        await this.createTransaction({
            userId: payment.userId,
            paymentId: payment.id,
            type: transaction_entity_1.TransactionType.PAYMENT,
            status: isSuccessful ? transaction_entity_1.TransactionStatus.COMPLETED : transaction_entity_1.TransactionStatus.FAILED,
            amount: payment.amount,
            currency: payment.currency,
            description: payment.description,
            reference: reference,
            metadata: paystackResponse.data
        });
        const updatedPayment = await this.paymentRepository.findOne({ where: { id: payment.id } });
        if (!updatedPayment) {
            throw new common_1.NotFoundException('Payment not found after update');
        }
        return updatedPayment;
    }
    async updatePaymentStatus(paymentId, status, updateData) {
        const updateFields = { status };
        if (updateData) {
            if (updateData.processedAt)
                updateFields.processedAt = updateData.processedAt;
            if (updateData.failedAt)
                updateFields.failedAt = updateData.failedAt;
            if (updateData.failureReason)
                updateFields.failureReason = updateData.failureReason;
            if (updateData.processorResponse)
                updateFields.processorResponse = updateData.processorResponse;
        }
        await this.paymentRepository.update(paymentId, updateFields);
        const payment = await this.paymentRepository.findOne({ where: { id: paymentId } });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found after update');
        }
        return payment;
    }
    async createInvoice(invoiceRequest) {
        const invoiceId = crypto.randomUUID();
        const paymentLink = `https://cley.me/pay/${invoiceId}`;
        const qrResult = await this.qrCodeService.generateInvoiceQR({
            id: invoiceId,
            creatorId: invoiceRequest.creatorId,
            amount: invoiceRequest.amount,
            currency: invoiceRequest.currency,
            description: invoiceRequest.description
        });
        const invoice = this.invoiceRepository.create({
            id: invoiceId,
            creatorId: invoiceRequest.creatorId,
            amount: invoiceRequest.amount,
            currency: invoiceRequest.currency,
            description: invoiceRequest.description,
            paymentLink,
            qrCode: qrResult.qrCode,
            platform: invoiceRequest.platform,
            customerInfo: invoiceRequest.customerInfo,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            status: payment_entity_1.PaymentStatus.PENDING
        });
        const savedInvoice = await this.invoiceRepository.save(invoice);
        return {
            invoice: savedInvoice,
            paymentLink,
            qrCode: qrResult.qrCode
        };
    }
    async processInvoicePayment(invoiceId, paymentData) {
        const invoice = await this.invoiceRepository.findOne({
            where: { id: invoiceId }
        });
        if (!invoice) {
            throw new common_1.NotFoundException('Invoice not found');
        }
        if (invoice.status !== payment_entity_1.PaymentStatus.PENDING) {
            throw new common_1.BadRequestException('Invoice is not pending');
        }
        if (invoice.expiresAt < new Date()) {
            throw new common_1.BadRequestException('Invoice has expired');
        }
        const paymentRequest = {
            userId: invoice.creatorId,
            amount: invoice.amount,
            currency: invoice.currency,
            type: payment_entity_1.PaymentType.ONE_TIME,
            method: payment_entity_1.PaymentMethod.INVOICE_LINK,
            platform: invoice.platform,
            description: invoice.description,
            metadata: {
                invoiceId: invoice.id,
                customerInfo: invoice.customerInfo
            },
            customerEmail: paymentData.email,
            callbackUrl: paymentData.callbackUrl
        };
        const result = await this.createPayment(paymentRequest);
        await this.invoiceRepository.update(invoice.id, {
            paymentId: result.payment.id,
            paymentData: {
                reference: result.reference || '',
                accessCode: result.accessCode || ''
            }
        });
        return {
            payment: result.payment,
            authorizationUrl: result.authorizationUrl || '',
            accessCode: result.accessCode || '',
            reference: result.reference || ''
        };
    }
    async getPaymentById(paymentId) {
        const payment = await this.paymentRepository.findOne({
            where: { id: paymentId },
            relations: ['user']
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        return payment;
    }
    async getInvoiceById(invoiceId) {
        const invoice = await this.invoiceRepository.findOne({
            where: { id: invoiceId },
            relations: ['creator']
        });
        if (!invoice) {
            throw new common_1.NotFoundException('Invoice not found');
        }
        return invoice;
    }
    async getUserPayments(userId, limit = 20, offset = 0) {
        const [payments, total] = await this.paymentRepository.findAndCount({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: limit,
            skip: offset
        });
        return { payments, total };
    }
    async getUserInvoices(userId, limit = 20, offset = 0) {
        const [invoices, total] = await this.invoiceRepository.findAndCount({
            where: { creatorId: userId },
            order: { createdAt: 'DESC' },
            take: limit,
            skip: offset
        });
        return { invoices, total };
    }
    calculatePlatformFee(amount, platform, type) {
        const platformConfig = payment_config_1.PLATFORM_FEES_CONFIG[platform];
        if (!platformConfig)
            return 0;
        let feeConfig;
        switch (type) {
            case payment_entity_1.PaymentType.ONE_TIME:
                feeConfig = platformConfig.invoice_payments;
                break;
            default:
                feeConfig = platformConfig.invoice_payments;
        }
        if (!feeConfig)
            return 0;
        const percentageFee = amount * feeConfig.percentage;
        const totalFee = percentageFee + feeConfig.fixed;
        return Math.max(Math.min(totalFee, feeConfig.maximum), feeConfig.minimum);
    }
    calculateProcessorFee(amount, currency) {
        const paystackConfig = payment_config_1.PAYSTACK_FEES_CONFIG[currency.toLowerCase()] || payment_config_1.PAYSTACK_FEES_CONFIG.other;
        const percentageFee = amount * paystackConfig.percentage;
        const totalFee = percentageFee + paystackConfig.fixed;
        return Math.max(Math.min(totalFee, paystackConfig.maximum), paystackConfig.minimum);
    }
    async createTransaction(transactionData) {
        const transaction = this.transactionRepository.create(transactionData);
        return await this.transactionRepository.save(transaction);
    }
    selectPaymentProcessor(currency) {
        const { PAYMENT_PROCESSORS_CONFIG } = require('../../../config/payment.config');
        for (const [processorName, config] of Object.entries(PAYMENT_PROCESSORS_CONFIG)) {
            const processorConfig = config;
            if (processorConfig.enabled && processorConfig.currencies.includes(currency.toUpperCase())) {
                return processorName;
            }
        }
        return 'paystack';
    }
    async getStoreTransactions(storeId, filters) {
        const queryBuilder = this.paymentRepository
            .createQueryBuilder('payment')
            .leftJoinAndSelect('payment.user', 'user')
            .where('payment.metadata->>\'storeId\' = :storeId', { storeId });
        if (filters.status) {
            queryBuilder.andWhere('payment.status = :status', { status: filters.status });
        }
        if (filters.startDate) {
            queryBuilder.andWhere('payment.createdAt >= :startDate', { startDate: filters.startDate });
        }
        if (filters.endDate) {
            queryBuilder.andWhere('payment.createdAt <= :endDate', { endDate: filters.endDate });
        }
        if (filters.orderId) {
            queryBuilder.andWhere('payment.metadata->>\'orderId\' = :orderId', { orderId: filters.orderId });
        }
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const offset = (page - 1) * limit;
        queryBuilder
            .orderBy('payment.createdAt', 'DESC')
            .skip(offset)
            .take(limit);
        const [transactions, total] = await queryBuilder.getManyAndCount();
        return { transactions, total };
    }
    async getStoreTransactionSummary(storeId, filters) {
        const queryBuilder = this.paymentRepository
            .createQueryBuilder('payment')
            .where('payment.metadata->>\'storeId\' = :storeId', { storeId });
        if (filters.startDate) {
            queryBuilder.andWhere('payment.createdAt >= :startDate', { startDate: filters.startDate });
        }
        if (filters.endDate) {
            queryBuilder.andWhere('payment.createdAt <= :endDate', { endDate: filters.endDate });
        }
        const payments = await queryBuilder.getMany();
        const summary = {
            totalTransactions: payments.length,
            successfulTransactions: payments.filter(p => p.status === payment_entity_1.PaymentStatus.COMPLETED).length,
            failedTransactions: payments.filter(p => p.status === payment_entity_1.PaymentStatus.FAILED).length,
            pendingTransactions: payments.filter(p => p.status === payment_entity_1.PaymentStatus.PENDING).length,
            totalAmount: payments.reduce((sum, p) => sum + Number(p.amount), 0),
            successfulAmount: payments
                .filter(p => p.status === payment_entity_1.PaymentStatus.COMPLETED)
                .reduce((sum, p) => sum + Number(p.amount), 0),
            totalFees: payments.reduce((sum, p) => sum + Number(p.platformFee) + Number(p.processorFee), 0),
            netAmount: payments.reduce((sum, p) => sum + Number(p.netAmount), 0),
        };
        return summary;
    }
    async getStoreTransactionAnalytics(storeId, filters) {
        const queryBuilder = this.paymentRepository
            .createQueryBuilder('payment')
            .where('payment.metadata->>\'storeId\' = :storeId', { storeId });
        if (filters.startDate) {
            queryBuilder.andWhere('payment.createdAt >= :startDate', { startDate: filters.startDate });
        }
        if (filters.endDate) {
            queryBuilder.andWhere('payment.createdAt <= :endDate', { endDate: filters.endDate });
        }
        const payments = await queryBuilder.getMany();
        const dateGroups = {};
        payments.forEach(payment => {
            const date = new Date(payment.createdAt);
            let key;
            switch (filters.groupBy) {
                case 'day':
                    key = date.toISOString().split('T')[0];
                    break;
                case 'week':
                    const weekStart = new Date(date);
                    weekStart.setDate(date.getDate() - date.getDay());
                    key = weekStart.toISOString().split('T')[0];
                    break;
                case 'month':
                    key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    break;
                default:
                    key = date.toISOString().split('T')[0];
            }
            if (!dateGroups[key]) {
                dateGroups[key] = [];
            }
            dateGroups[key].push(payment);
        });
        const dailyStats = Object.entries(dateGroups).map(([date, payments]) => ({
            date,
            transactions: payments.length,
            amount: payments.reduce((sum, p) => sum + Number(p.amount), 0),
            successfulTransactions: payments.filter(p => p.status === payment_entity_1.PaymentStatus.COMPLETED).length,
            successfulAmount: payments
                .filter(p => p.status === payment_entity_1.PaymentStatus.COMPLETED)
                .reduce((sum, p) => sum + Number(p.amount), 0),
        })).sort((a, b) => a.date.localeCompare(b.date));
        const currencyGroups = {};
        payments.forEach(payment => {
            if (!currencyGroups[payment.currency]) {
                currencyGroups[payment.currency] = [];
            }
            currencyGroups[payment.currency].push(payment);
        });
        const currencyBreakdown = Object.entries(currencyGroups).map(([currency, payments]) => ({
            currency,
            transactions: payments.length,
            amount: payments.reduce((sum, p) => sum + Number(p.amount), 0),
        }));
        const processorGroups = {};
        payments.forEach(payment => {
            if (!processorGroups[payment.processor]) {
                processorGroups[payment.processor] = [];
            }
            processorGroups[payment.processor].push(payment);
        });
        const processorBreakdown = Object.entries(processorGroups).map(([processor, payments]) => ({
            processor,
            transactions: payments.length,
            amount: payments.reduce((sum, p) => sum + Number(p.amount), 0),
        }));
        return {
            dailyStats,
            currencyBreakdown,
            processorBreakdown,
        };
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(1, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __param(2, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        paystack_service_1.PaystackService,
        qr_code_service_1.QRCodeService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map