import { Controller, Post, Get, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { PaymentService } from '../services/payment.service';
import { PaystackService } from '../services/paystack.service';
import { CreatePaymentDto, CreateInvoiceDto, ProcessInvoicePaymentDto, VerifyPaymentDto, PaymentQueryDto } from '../dto/payment.dto';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly paystackService: PaystackService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPayment(@Request() req, @Body() createPaymentDto: CreatePaymentDto) {
    const paymentRequest = {
      userId: req.user.userId,
      ...createPaymentDto
    };

    const result = await this.paymentService.createPayment(paymentRequest);

    return {
      message: 'Payment initialized successfully',
      payment: result.payment,
      authorizationUrl: result.authorizationUrl,
      accessCode: result.accessCode,
      reference: result.reference
    };
  }

  @Post('verify')
  async verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto) {
    const payment = await this.paymentService.verifyPayment(verifyPaymentDto.reference);

    return {
      message: 'Payment verified successfully',
      payment
    };
  }

  @Get('public-key')
  async getPublicKey() {
    if (!this.paystackService.isConfigured()) {
      return {
        message: 'Paystack is not configured',
        publicKey: null,
        configured: false
      };
    }
    
    const publicKey = this.paystackService.getPublicKey();
    
    return {
      message: 'Public key retrieved successfully',
      publicKey,
      configured: true
    };
  }

  @Get('banks')
  async getBanks() {
    const banks = await this.paystackService.getBanks();
    
    return {
      message: 'Banks retrieved successfully',
      banks: banks.data
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getPayment(@Request() req, @Param('id') id: string) {
    const payment = await this.paymentService.getPaymentById(id);

    // Verify ownership
    if (payment.userId !== req.user.userId) {
      throw new Error('Payment not found or access denied');
    }

    return {
      message: 'Payment retrieved successfully',
      payment
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserPayments(@Request() req, @Query() query: PaymentQueryDto) {
    const result = await this.paymentService.getUserPayments(
      req.user.userId,
      query.limit,
      query.offset
    );

    return {
      message: 'Payments retrieved successfully',
      payments: result.payments,
      pagination: {
        total: result.total,
        limit: query.limit,
        offset: query.offset,
        hasMore: result.total > ((query.offset || 0) + (query.limit || 20))
      }
    };
  }
}

@Controller('invoices')
export class InvoiceController {
  constructor(
    private readonly paymentService: PaymentService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createInvoice(@Request() req, @Body() createInvoiceDto: CreateInvoiceDto) {
    const invoiceRequest = {
      creatorId: req.user.userId,
      ...createInvoiceDto
    };

    const result = await this.paymentService.createInvoice(invoiceRequest);

    return {
      message: 'Invoice created successfully',
      invoice: result.invoice,
      paymentLink: result.paymentLink,
      qrCode: result.qrCode
    };
  }

  @Get(':id')
  async getInvoice(@Param('id') id: string) {
    const invoice = await this.paymentService.getInvoiceById(id);

    return {
      message: 'Invoice retrieved successfully',
      invoice
    };
  }

  @Post(':id/pay')
  async processInvoicePayment(
    @Param('id') id: string,
    @Body() processInvoicePaymentDto: ProcessInvoicePaymentDto
  ) {
    const result = await this.paymentService.processInvoicePayment(id, processInvoicePaymentDto);

    return {
      message: 'Invoice payment initialized successfully',
      payment: result.payment,
      authorizationUrl: result.authorizationUrl,
      accessCode: result.accessCode,
      reference: result.reference
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserInvoices(@Request() req, @Query() query: PaymentQueryDto) {
    const result = await this.paymentService.getUserInvoices(
      req.user.userId,
      query.limit,
      query.offset
    );

    return {
      message: 'Invoices retrieved successfully',
      invoices: result.invoices,
      pagination: {
        total: result.total,
        limit: query.limit,
        offset: query.offset,
        hasMore: result.total > ((query.offset || 0) + (query.limit || 20))
      }
    };
  }
}
