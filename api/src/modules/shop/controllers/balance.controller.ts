import { Controller, Get, Post, Body, UseGuards, Request, Param, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { BalanceService } from '../services/balance.service';
import { IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class PayoutRequestDto {
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  payoutMethod: string; // 'bank_transfer', 'paypal', 'stripe_connect', etc.
}

export class BalanceQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 50;
}

@Controller('stores/:storeId/balance')
@UseGuards(JwtAuthGuard)
export class BalanceController {
  constructor(
    private readonly balanceService: BalanceService,
  ) {}

  @Get()
  async getStoreBalance(
    @Request() req,
    @Param('storeId') storeId: string,
  ) {
    // Temporary simple response to test if the endpoint works
    return {
      message: 'Store balance retrieved successfully',
      store: {
        id: storeId,
        name: 'Store',
        storeUrl: storeId,
      },
      balance: {
        available: 0,
        pending: 0,
        held: 0,
        processing: 0,
        total: 0,
        currency: 'USD',
        breakdown: {
          availableFormatted: 'USD 0.00',
          pendingFormatted: 'USD 0.00',
          heldFormatted: 'USD 0.00',
          processingFormatted: 'USD 0.00',
          totalFormatted: 'USD 0.00'
        }
      }
    };
  }

  @Get('history')
  async getBalanceHistory(
    @Request() req,
    @Param('storeId') storeId: string,
    @Query() query: BalanceQueryDto,
  ) {
    const page = query.page || 1;
    const limit = query.limit || 50;
    const offset = (page - 1) * limit;

    const history = await this.balanceService.getBalanceHistory(storeId, limit, offset);

    return {
      message: 'Balance history retrieved successfully',
      store: {
        id: storeId,
        name: 'Store',
        storeUrl: storeId,
      },
      history: history.transactions,
      pagination: {
        page,
        limit,
        total: history.total,
        totalPages: Math.ceil(history.total / limit),
      }
    };
  }

  @Post('payout')
  async initiatePayout(
    @Request() req,
    @Param('storeId') storeId: string,
    @Body() payoutRequest: PayoutRequestDto,
  ) {
    try {
      const payout = await this.balanceService.initiatePayout(
        storeId,
        payoutRequest.amount,
        payoutRequest.currency,
        payoutRequest.payoutMethod
      );

      return {
        message: 'Payout initiated successfully',
        payout: {
          id: payout.id,
          amount: payout.amount,
          currency: payout.currency,
          method: payoutRequest.payoutMethod,
          status: 'processing',
          createdAt: payout.createdAt
        },
        note: 'Payout is being processed. You will receive a notification when it\'s completed.'
      };
    } catch (error) {
      return {
        message: error.message,
        error: 'Payout failed'
      };
    }
  }
}
