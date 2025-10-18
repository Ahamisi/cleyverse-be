import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentType, PaymentMethod, PlatformType } from '../entities/payment.entity';
import { Invoice } from '../entities/invoice.entity';
import { Transaction, TransactionType, TransactionStatus } from '../entities/transaction.entity';
import { PaystackService } from './paystack.service';
import { QRCodeService } from './qr-code.service';
import { PLATFORM_FEES_CONFIG, PAYSTACK_FEES_CONFIG } from '../../../config/payment.config';
import * as crypto from 'crypto';

export interface CreatePaymentRequest {
  userId: string | null;
  amount: number;
  currency: string;
  type: PaymentType;
  method: PaymentMethod;
  platform: PlatformType;
  description: string;
  metadata?: Record<string, any>;
  customerEmail?: string;
  callbackUrl?: string;
}

export interface CreateInvoiceRequest {
  creatorId: string;
  amount: number;
  currency: string;
  description: string;
  platform: PlatformType;
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: {
      lat: number;
      lng: number;
    };
  };
}

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly paystackService: PaystackService,
    private readonly qrCodeService: QRCodeService,
  ) {}

  async createPayment(paymentRequest: CreatePaymentRequest): Promise<{
    payment: Payment;
    authorizationUrl?: string;
    accessCode?: string;
    reference?: string;
  }> {
    // Calculate platform fee
    const platformFee = this.calculatePlatformFee(
      paymentRequest.amount,
      paymentRequest.platform,
      paymentRequest.type
    );

    // Calculate processor fee (Paystack)
    const processorFee = this.calculateProcessorFee(
      paymentRequest.amount,
      paymentRequest.currency
    );

    const netAmount = paymentRequest.amount - platformFee - processorFee;

    // Create payment record
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
      status: PaymentStatus.PENDING,
      processor: this.selectPaymentProcessor(paymentRequest.currency),
      platformTransactionId: crypto.randomUUID(),
    });

    const savedPayment = await this.paymentRepository.save(payment);

    // Initialize payment with the selected processor
    if (paymentRequest.method === PaymentMethod.CREDIT_CARD || 
        paymentRequest.method === PaymentMethod.DEBIT_CARD) {
      
      const selectedProcessor = this.selectPaymentProcessor(paymentRequest.currency);
      
      if (selectedProcessor === 'paystack') {
        const paystackResponse = await this.paystackService.initializePayment({
          amount: paymentRequest.amount * 100, // Convert to kobo
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

        // Update payment with Paystack reference
        await this.paymentRepository.update(savedPayment.id, {
          platformTransactionId: paystackResponse.data.reference,
          processorResponse: paystackResponse as any
        });

        return {
          payment: savedPayment,
          authorizationUrl: paystackResponse.data.authorization_url,
          accessCode: paystackResponse.data.access_code,
          reference: paystackResponse.data.reference
        };
      } else if (selectedProcessor === 'stripe') {
        // TODO: Implement Stripe integration
        throw new BadRequestException('Stripe integration not yet implemented');
      } else if (selectedProcessor === 'paypal') {
        // TODO: Implement PayPal integration
        throw new BadRequestException('PayPal integration not yet implemented');
      } else {
        throw new BadRequestException(`Unsupported payment processor: ${selectedProcessor}`);
      }
    }

    return { payment: savedPayment };
  }

  async verifyPayment(reference: string): Promise<Payment> {
    // Verify with Paystack
    const paystackResponse = await this.paystackService.verifyPayment(reference);

    // Find payment by reference
    const payment = await this.paymentRepository.findOne({
      where: { platformTransactionId: reference }
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Update payment status
    const isSuccessful = paystackResponse.data.status === 'success';
    const newStatus = isSuccessful ? PaymentStatus.COMPLETED : PaymentStatus.FAILED;

    await this.paymentRepository.update(payment.id, {
      status: newStatus,
      processedAt: isSuccessful ? new Date() : undefined,
      failedAt: !isSuccessful ? new Date() : undefined,
      processorResponse: paystackResponse as any,
      failureReason: !isSuccessful ? paystackResponse.data.gateway_response : undefined
    });

    // Create transaction record
    await this.createTransaction({
      userId: payment.userId,
      paymentId: payment.id,
      type: TransactionType.PAYMENT,
      status: isSuccessful ? TransactionStatus.COMPLETED : TransactionStatus.FAILED,
      amount: payment.amount,
      currency: payment.currency,
      description: payment.description,
      reference: reference,
      metadata: paystackResponse.data
    });

    const updatedPayment = await this.paymentRepository.findOne({ where: { id: payment.id } });
    if (!updatedPayment) {
      throw new NotFoundException('Payment not found after update');
    }
    return updatedPayment;
  }

  async updatePaymentStatus(paymentId: string, status: PaymentStatus, updateData?: any): Promise<Payment> {
    const updateFields: any = { status };
    
    if (updateData) {
      if (updateData.processedAt) updateFields.processedAt = updateData.processedAt;
      if (updateData.failedAt) updateFields.failedAt = updateData.failedAt;
      if (updateData.failureReason) updateFields.failureReason = updateData.failureReason;
      if (updateData.processorResponse) updateFields.processorResponse = updateData.processorResponse;
    }

    await this.paymentRepository.update(paymentId, updateFields);
    const payment = await this.paymentRepository.findOne({ where: { id: paymentId } });
    if (!payment) {
      throw new NotFoundException('Payment not found after update');
    }
    return payment;
  }

  async createInvoice(invoiceRequest: CreateInvoiceRequest): Promise<{
    invoice: Invoice;
    paymentLink: string;
    qrCode: string;
  }> {
    // Generate unique payment link
    const invoiceId = crypto.randomUUID();
    const paymentLink = `https://cley.me/pay/${invoiceId}`;

    // Generate QR code
    const qrResult = await this.qrCodeService.generateInvoiceQR({
      id: invoiceId,
      creatorId: invoiceRequest.creatorId,
      amount: invoiceRequest.amount,
      currency: invoiceRequest.currency,
      description: invoiceRequest.description
    });

    // Create invoice record
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
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      status: PaymentStatus.PENDING
    });

    const savedInvoice = await this.invoiceRepository.save(invoice);

    return {
      invoice: savedInvoice,
      paymentLink,
      qrCode: qrResult.qrCode
    };
  }

  async processInvoicePayment(invoiceId: string, paymentData: {
    email: string;
    callbackUrl?: string;
  }): Promise<{
    payment: Payment;
    authorizationUrl: string;
    accessCode: string;
    reference: string;
  }> {
    // Find invoice
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId }
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    if (invoice.status !== PaymentStatus.PENDING) {
      throw new BadRequestException('Invoice is not pending');
    }

    if (invoice.expiresAt < new Date()) {
      throw new BadRequestException('Invoice has expired');
    }

    // Create payment for invoice
    const paymentRequest: CreatePaymentRequest = {
      userId: invoice.creatorId,
      amount: invoice.amount,
      currency: invoice.currency,
      type: PaymentType.ONE_TIME,
      method: PaymentMethod.INVOICE_LINK,
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

    // Update invoice with payment reference
    await this.invoiceRepository.update(invoice.id, {
      paymentId: result.payment.id,
      paymentData: {
        reference: result.reference || '',
        accessCode: result.accessCode || ''
      } as any
    });

    return {
      payment: result.payment,
      authorizationUrl: result.authorizationUrl || '',
      accessCode: result.accessCode || '',
      reference: result.reference || ''
    };
  }

  async getPaymentById(paymentId: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: ['user']
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async getInvoiceById(invoiceId: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId },
      relations: ['creator']
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async getUserPayments(userId: string, limit: number = 20, offset: number = 0): Promise<{
    payments: Payment[];
    total: number;
  }> {
    const [payments, total] = await this.paymentRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset
    });

    return { payments, total };
  }

  async getUserInvoices(userId: string, limit: number = 20, offset: number = 0): Promise<{
    invoices: Invoice[];
    total: number;
  }> {
    const [invoices, total] = await this.invoiceRepository.findAndCount({
      where: { creatorId: userId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset
    });

    return { invoices, total };
  }

  private calculatePlatformFee(amount: number, platform: PlatformType, type: PaymentType): number {
    const platformConfig = PLATFORM_FEES_CONFIG[platform];
    if (!platformConfig) return 0;

    let feeConfig;
    switch (type) {
      case PaymentType.ONE_TIME:
        feeConfig = platformConfig.invoice_payments;
        break;
      default:
        feeConfig = platformConfig.invoice_payments;
    }

    if (!feeConfig) return 0;

    const percentageFee = amount * feeConfig.percentage;
    const totalFee = percentageFee + feeConfig.fixed;
    
    return Math.max(
      Math.min(totalFee, feeConfig.maximum),
      feeConfig.minimum
    );
  }

  private calculateProcessorFee(amount: number, currency: string): number {
    const paystackConfig = PAYSTACK_FEES_CONFIG[currency.toLowerCase()] || PAYSTACK_FEES_CONFIG.other;
    
    const percentageFee = amount * paystackConfig.percentage;
    const totalFee = percentageFee + paystackConfig.fixed;
    
    return Math.max(
      Math.min(totalFee, paystackConfig.maximum),
      paystackConfig.minimum
    );
  }

  private async createTransaction(transactionData: {
    userId: string | null;
    paymentId?: string;
    invoiceId?: string;
    type: TransactionType;
    status: TransactionStatus;
    amount: number;
    currency: string;
    description: string;
    reference?: string;
    metadata?: Record<string, any>;
  }): Promise<Transaction> {
    const transaction = this.transactionRepository.create(transactionData);
    return await this.transactionRepository.save(transaction);
  }

  private selectPaymentProcessor(currency: string): string {
    // Import PAYMENT_PROCESSORS_CONFIG at the top of the file
    const { PAYMENT_PROCESSORS_CONFIG } = require('../../../config/payment.config');
    
    // Find the best processor for the currency
    for (const [processorName, config] of Object.entries(PAYMENT_PROCESSORS_CONFIG)) {
      const processorConfig = config as any;
      if (processorConfig.enabled && processorConfig.currencies.includes(currency.toUpperCase())) {
        return processorName;
      }
    }
    
    // Default to paystack if no processor found
    return 'paystack';
  }

  async getStoreTransactions(storeId: string, filters: {
    status?: PaymentStatus;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    orderId?: string;
  }): Promise<{ transactions: Payment[]; total: number }> {
    const queryBuilder = this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.user', 'user')
      .where('payment.metadata->>\'storeId\' = :storeId', { storeId });

    // Apply filters
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

    // Apply pagination
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

  async getStoreTransactionSummary(storeId: string, filters: {
    startDate?: string;
    endDate?: string;
  }): Promise<{
    totalTransactions: number;
    successfulTransactions: number;
    failedTransactions: number;
    pendingTransactions: number;
    totalAmount: number;
    successfulAmount: number;
    totalFees: number;
    netAmount: number;
  }> {
    const queryBuilder = this.paymentRepository
      .createQueryBuilder('payment')
      .where('payment.metadata->>\'storeId\' = :storeId', { storeId });

    // Apply date filters
    if (filters.startDate) {
      queryBuilder.andWhere('payment.createdAt >= :startDate', { startDate: filters.startDate });
    }

    if (filters.endDate) {
      queryBuilder.andWhere('payment.createdAt <= :endDate', { endDate: filters.endDate });
    }

    const payments = await queryBuilder.getMany();

    const summary = {
      totalTransactions: payments.length,
      successfulTransactions: payments.filter(p => p.status === PaymentStatus.COMPLETED).length,
      failedTransactions: payments.filter(p => p.status === PaymentStatus.FAILED).length,
      pendingTransactions: payments.filter(p => p.status === PaymentStatus.PENDING).length,
      totalAmount: payments.reduce((sum, p) => sum + Number(p.amount), 0),
      successfulAmount: payments
        .filter(p => p.status === PaymentStatus.COMPLETED)
        .reduce((sum, p) => sum + Number(p.amount), 0),
      totalFees: payments.reduce((sum, p) => sum + Number(p.platformFee) + Number(p.processorFee), 0),
      netAmount: payments.reduce((sum, p) => sum + Number(p.netAmount), 0),
    };

    return summary;
  }

  async getStoreTransactionAnalytics(storeId: string, filters: {
    startDate?: string;
    endDate?: string;
    groupBy: 'day' | 'week' | 'month';
  }): Promise<{
    dailyStats: Array<{
      date: string;
      transactions: number;
      amount: number;
      successfulTransactions: number;
      successfulAmount: number;
    }>;
    currencyBreakdown: Array<{
      currency: string;
      transactions: number;
      amount: number;
    }>;
    processorBreakdown: Array<{
      processor: string;
      transactions: number;
      amount: number;
    }>;
  }> {
    const queryBuilder = this.paymentRepository
      .createQueryBuilder('payment')
      .where('payment.metadata->>\'storeId\' = :storeId', { storeId });

    // Apply date filters
    if (filters.startDate) {
      queryBuilder.andWhere('payment.createdAt >= :startDate', { startDate: filters.startDate });
    }

    if (filters.endDate) {
      queryBuilder.andWhere('payment.createdAt <= :endDate', { endDate: filters.endDate });
    }

    const payments = await queryBuilder.getMany();

    // Group by date
    const dateGroups: Record<string, Payment[]> = {};
    payments.forEach(payment => {
      const date = new Date(payment.createdAt);
      let key: string;
      
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
      successfulTransactions: payments.filter(p => p.status === PaymentStatus.COMPLETED).length,
      successfulAmount: payments
        .filter(p => p.status === PaymentStatus.COMPLETED)
        .reduce((sum, p) => sum + Number(p.amount), 0),
    })).sort((a, b) => a.date.localeCompare(b.date));

    // Currency breakdown
    const currencyGroups: Record<string, Payment[]> = {};
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

    // Processor breakdown
    const processorGroups: Record<string, Payment[]> = {};
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
}
