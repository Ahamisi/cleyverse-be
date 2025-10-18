import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreBalance, BalanceType, TransactionType } from '../entities/store-balance.entity';
import { PaymentStatus } from '../../payments/entities/payment.entity';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(StoreBalance)
    private readonly balanceRepository: Repository<StoreBalance>,
  ) {}

  async getStoreBalance(storeId: string): Promise<{
    available: number;
    pending: number;
    held: number;
    processing: number;
    total: number;
    currency: string;
  }> {
    const balances = await this.balanceRepository
      .createQueryBuilder('balance')
      .select('balance.type', 'type')
      .addSelect('SUM(balance.amount)', 'total')
      .addSelect('balance.currency', 'currency')
      .where('balance.storeId = :storeId', { storeId })
      .groupBy('balance.type, balance.currency')
      .getRawMany();

    const result = {
      available: 0,
      pending: 0,
      held: 0,
      processing: 0,
      total: 0,
      currency: 'USD'
    };

    balances.forEach(balance => {
      const amount = parseFloat(balance.total) || 0;
      result.currency = balance.currency;
      
      switch (balance.type) {
        case BalanceType.AVAILABLE:
          result.available = amount;
          break;
        case BalanceType.PENDING:
          result.pending = amount;
          break;
        case BalanceType.HELD:
          result.held = amount;
          break;
        case BalanceType.PROCESSING:
          result.processing = amount;
          break;
      }
    });

    result.total = result.available + result.pending + result.held + result.processing;
    return result;
  }

  async addEarning(storeId: string, amount: number, currency: string, paymentId: string, orderId: string, metadata?: any): Promise<StoreBalance> {
    // Calculate fees
    const fees = this.calculateFees(amount, currency);
    const netAmount = amount - fees.totalFees;

    // Add to pending balance initially
    const balance = this.balanceRepository.create({
      storeId,
      type: BalanceType.PENDING,
      amount: netAmount,
      currency,
      transactionType: TransactionType.EARNING,
      description: `Earning from order ${orderId}`,
      paymentId,
      orderId,
      metadata: {
        ...metadata,
        grossAmount: amount,
        platformFee: fees.platformFee,
        processorFee: fees.processorFee,
        totalFees: fees.totalFees,
        netAmount: netAmount
      }
    });

    return await this.balanceRepository.save(balance);
  }

  async processPayment(paymentId: string, status: PaymentStatus): Promise<void> {
    const balance = await this.balanceRepository.findOne({
      where: { paymentId }
    });

    if (!balance) return;

    switch (status) {
      case PaymentStatus.COMPLETED:
        // Move from pending to available
        await this.updateBalanceType(balance.id, BalanceType.AVAILABLE);
        break;
      case PaymentStatus.FAILED:
      case PaymentStatus.CANCELLED:
        // Remove the balance entry
        await this.balanceRepository.remove(balance);
        break;
      case PaymentStatus.REFUNDED:
        // Create a refund entry
        await this.addRefund(balance.storeId, balance.amount, balance.currency, paymentId, balance.orderId);
        break;
    }
  }

  async addRefund(storeId: string, amount: number, currency: string, paymentId: string, orderId: string): Promise<StoreBalance> {
    const balance = this.balanceRepository.create({
      storeId,
      type: BalanceType.AVAILABLE,
      amount: -amount, // Negative amount for refund
      currency,
      transactionType: TransactionType.REFUND,
      description: `Refund for order ${orderId}`,
      paymentId,
      orderId,
      metadata: { refund: true }
    });

    return await this.balanceRepository.save(balance);
  }

  async initiatePayout(storeId: string, amount: number, currency: string, payoutMethod: string): Promise<StoreBalance> {
    // Check if store has sufficient available balance
    const currentBalance = await this.getStoreBalance(storeId);
    if (currentBalance.available < amount) {
      throw new Error('Insufficient balance for payout');
    }

    // Move amount from available to processing
    const balance = this.balanceRepository.create({
      storeId,
      type: BalanceType.PROCESSING,
      amount: -amount, // Negative amount for payout
      currency,
      transactionType: TransactionType.PAYOUT,
      description: `Payout via ${payoutMethod}`,
      metadata: { payoutMethod, status: 'processing' }
    });

    return await this.balanceRepository.save(balance);
  }

  async completePayout(balanceId: string): Promise<void> {
    const balance = await this.balanceRepository.findOne({ where: { id: balanceId } });
    if (balance) {
      balance.processedAt = new Date();
      balance.metadata = { ...balance.metadata, status: 'completed' };
      await this.balanceRepository.save(balance);
    }
  }

  async getBalanceHistory(storeId: string, limit: number = 50, offset: number = 0): Promise<{
    transactions: StoreBalance[];
    total: number;
  }> {
    const [transactions, total] = await this.balanceRepository.findAndCount({
      where: { storeId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset
    });

    return { transactions, total };
  }

  private async updateBalanceType(balanceId: string, newType: BalanceType): Promise<void> {
    await this.balanceRepository.update(balanceId, {
      type: newType,
      processedAt: new Date()
    });
  }

  private calculateFees(amount: number, currency: string): {
    platformFee: number;
    processorFee: number;
    totalFees: number;
  } {
    // Platform fee: 8% for products (from payment.config.ts)
    const platformFeeRate = 0.08;
    const platformFee = amount * platformFeeRate;

    // Processor fee based on currency
    let processorFeeRate = 0.03; // Default 3%
    
    if (currency === 'NGN') {
      processorFeeRate = 0.015; // 1.5% for NGN (Paystack)
    } else if (['GHS', 'KES'].includes(currency)) {
      processorFeeRate = 0.02; // 2% for GHS, KES
    } else if (currency === 'ZAR') {
      processorFeeRate = 0.025; // 2.5% for ZAR
    }

    const processorFee = amount * processorFeeRate;
    const totalFees = platformFee + processorFee;

    return {
      platformFee: Math.round(platformFee * 100) / 100,
      processorFee: Math.round(processorFee * 100) / 100,
      totalFees: Math.round(totalFees * 100) / 100
    };
  }
}
