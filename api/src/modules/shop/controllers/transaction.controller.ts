import { Controller, Get, Query, UseGuards, Request, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { PaymentService } from '../../payments/services/payment.service';
import { OrderService } from '../services/order.service';
import { IsOptional, IsEnum, IsDateString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaymentStatus } from '../../payments/entities/payment.entity';

export class TransactionQueryDto {
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 20;

  @IsOptional()
  @IsUUID()
  orderId?: string;
}

@Controller('stores/:storeId/transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly orderService: OrderService,
  ) {}

  @Get()
  async getStoreTransactions(
    @Request() req,
    @Param('storeId') storeId: string,
    @Query() query: TransactionQueryDto,
  ) {
    const userId = req.user.userId;
    
    // Verify store belongs to user
    const store = await this.orderService.getStoreById(storeId, userId);
    if (!store) {
      throw new Error('Store not found or does not belong to user');
    }

    // Get transactions with filters
    const transactions = await this.paymentService.getStoreTransactions(
      storeId,
      {
        status: query.status,
        startDate: query.startDate,
        endDate: query.endDate,
        page: query.page,
        limit: query.limit,
        orderId: query.orderId,
      }
    );

    return {
      message: 'Store transactions retrieved successfully',
      store: {
        id: store.id,
        name: store.name,
        storeUrl: store.storeUrl,
      },
      transactions: transactions.transactions,
      pagination: {
        page: query.page || 1,
        limit: query.limit || 20,
        total: transactions.total,
        totalPages: Math.ceil(transactions.total / (query.limit || 20)),
      },
      filters: {
        status: query.status,
        startDate: query.startDate,
        endDate: query.endDate,
        orderId: query.orderId,
      },
    };
  }

  @Get('summary')
  async getTransactionSummary(
    @Request() req,
    @Param('storeId') storeId: string,
    @Query() query: { startDate?: string; endDate?: string },
  ) {
    const userId = req.user.userId;
    
    // Verify store belongs to user
    const store = await this.orderService.getStoreById(storeId, userId);
    if (!store) {
      throw new Error('Store not found or does not belong to user');
    }

    const summary = await this.paymentService.getStoreTransactionSummary(
      storeId,
      {
        startDate: query.startDate,
        endDate: query.endDate,
      }
    );

    return {
      message: 'Transaction summary retrieved successfully',
      store: {
        id: store.id,
        name: store.name,
        storeUrl: store.storeUrl,
      },
      summary,
    };
  }

  @Get('analytics')
  async getTransactionAnalytics(
    @Request() req,
    @Param('storeId') storeId: string,
    @Query() query: { 
      startDate?: string; 
      endDate?: string; 
      groupBy?: 'day' | 'week' | 'month';
    },
  ) {
    const userId = req.user.userId;
    
    // Verify store belongs to user
    const store = await this.orderService.getStoreById(storeId, userId);
    if (!store) {
      throw new Error('Store not found or does not belong to user');
    }

    const analytics = await this.paymentService.getStoreTransactionAnalytics(
      storeId,
      {
        startDate: query.startDate,
        endDate: query.endDate,
        groupBy: query.groupBy || 'day',
      }
    );

    return {
      message: 'Transaction analytics retrieved successfully',
      store: {
        id: store.id,
        name: store.name,
        storeUrl: store.storeUrl,
      },
      analytics,
    };
  }
}
