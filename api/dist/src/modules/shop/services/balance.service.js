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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const store_balance_entity_1 = require("../entities/store-balance.entity");
const payment_entity_1 = require("../../payments/entities/payment.entity");
let BalanceService = class BalanceService {
    balanceRepository;
    constructor(balanceRepository) {
        this.balanceRepository = balanceRepository;
    }
    async getStoreBalance(storeId) {
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
                case store_balance_entity_1.BalanceType.AVAILABLE:
                    result.available = amount;
                    break;
                case store_balance_entity_1.BalanceType.PENDING:
                    result.pending = amount;
                    break;
                case store_balance_entity_1.BalanceType.HELD:
                    result.held = amount;
                    break;
                case store_balance_entity_1.BalanceType.PROCESSING:
                    result.processing = amount;
                    break;
            }
        });
        result.total = result.available + result.pending + result.held + result.processing;
        return result;
    }
    async addEarning(storeId, amount, currency, paymentId, orderId, metadata) {
        const fees = this.calculateFees(amount, currency);
        const netAmount = amount - fees.totalFees;
        const balance = this.balanceRepository.create({
            storeId,
            type: store_balance_entity_1.BalanceType.PENDING,
            amount: netAmount,
            currency,
            transactionType: store_balance_entity_1.TransactionType.EARNING,
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
    async processPayment(paymentId, status) {
        const balance = await this.balanceRepository.findOne({
            where: { paymentId }
        });
        if (!balance)
            return;
        switch (status) {
            case payment_entity_1.PaymentStatus.COMPLETED:
                await this.updateBalanceType(balance.id, store_balance_entity_1.BalanceType.AVAILABLE);
                break;
            case payment_entity_1.PaymentStatus.FAILED:
            case payment_entity_1.PaymentStatus.CANCELLED:
                await this.balanceRepository.remove(balance);
                break;
            case payment_entity_1.PaymentStatus.REFUNDED:
                await this.addRefund(balance.storeId, balance.amount, balance.currency, paymentId, balance.orderId);
                break;
        }
    }
    async addRefund(storeId, amount, currency, paymentId, orderId) {
        const balance = this.balanceRepository.create({
            storeId,
            type: store_balance_entity_1.BalanceType.AVAILABLE,
            amount: -amount,
            currency,
            transactionType: store_balance_entity_1.TransactionType.REFUND,
            description: `Refund for order ${orderId}`,
            paymentId,
            orderId,
            metadata: { refund: true }
        });
        return await this.balanceRepository.save(balance);
    }
    async initiatePayout(storeId, amount, currency, payoutMethod) {
        const currentBalance = await this.getStoreBalance(storeId);
        if (currentBalance.available < amount) {
            throw new Error('Insufficient balance for payout');
        }
        const balance = this.balanceRepository.create({
            storeId,
            type: store_balance_entity_1.BalanceType.PROCESSING,
            amount: -amount,
            currency,
            transactionType: store_balance_entity_1.TransactionType.PAYOUT,
            description: `Payout via ${payoutMethod}`,
            metadata: { payoutMethod, status: 'processing' }
        });
        return await this.balanceRepository.save(balance);
    }
    async completePayout(balanceId) {
        const balance = await this.balanceRepository.findOne({ where: { id: balanceId } });
        if (balance) {
            balance.processedAt = new Date();
            balance.metadata = { ...balance.metadata, status: 'completed' };
            await this.balanceRepository.save(balance);
        }
    }
    async getBalanceHistory(storeId, limit = 50, offset = 0) {
        const [transactions, total] = await this.balanceRepository.findAndCount({
            where: { storeId },
            order: { createdAt: 'DESC' },
            take: limit,
            skip: offset
        });
        return { transactions, total };
    }
    async updateBalanceType(balanceId, newType) {
        await this.balanceRepository.update(balanceId, {
            type: newType,
            processedAt: new Date()
        });
    }
    calculateFees(amount, currency) {
        const platformFeeRate = 0.08;
        const platformFee = amount * platformFeeRate;
        let processorFeeRate = 0.03;
        if (currency === 'NGN') {
            processorFeeRate = 0.015;
        }
        else if (['GHS', 'KES'].includes(currency)) {
            processorFeeRate = 0.02;
        }
        else if (currency === 'ZAR') {
            processorFeeRate = 0.025;
        }
        const processorFee = amount * processorFeeRate;
        const totalFees = platformFee + processorFee;
        return {
            platformFee: Math.round(platformFee * 100) / 100,
            processorFee: Math.round(processorFee * 100) / 100,
            totalFees: Math.round(totalFees * 100) / 100
        };
    }
};
exports.BalanceService = BalanceService;
exports.BalanceService = BalanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(store_balance_entity_1.StoreBalance)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BalanceService);
//# sourceMappingURL=balance.service.js.map