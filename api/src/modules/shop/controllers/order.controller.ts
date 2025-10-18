import { Controller, Post, Get, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { OrderService } from '../services/order.service';
import { CreateOrderDto, UpdateOrderStatusDto, OrderQueryDto, GuestOrderQueryDto } from '../dto/order.dto';

@Controller('stores/:storeId/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(
    @Param('storeId') storeId: string,
    @Body() createOrderDto: CreateOrderDto
  ) {
    const result = await this.orderService.createOrder(storeId, createOrderDto);

    return {
      message: 'Order created successfully',
      order: result.order,
      payment: {
        authorizationUrl: result.paymentUrl,
        accessCode: result.accessCode,
        reference: result.reference
      }
    };
  }

  @Post('authenticated')
  @UseGuards(JwtAuthGuard)
  async createAuthenticatedOrder(
    @Request() req,
    @Param('storeId') storeId: string,
    @Body() createOrderDto: CreateOrderDto
  ) {
    const userId = req.user.id;
    const result = await this.orderService.createOrder(storeId, createOrderDto, userId);

    return {
      message: 'Authenticated order created successfully',
      order: result.order,
      payment: {
        authorizationUrl: result.paymentUrl,
        accessCode: result.accessCode,
        reference: result.reference
      }
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getStoreOrders(
    @Param('storeId') storeId: string,
    @Query() query: OrderQueryDto
  ) {
    const result = await this.orderService.getStoreOrders(storeId, query);
    return {
      message: 'Store orders retrieved successfully',
      orders: result.orders,
      total: result.total
    };
  }

  @Get(':orderId')
  @UseGuards(JwtAuthGuard)
  async getOrderById(
    @Param('storeId') storeId: string,
    @Param('orderId') orderId: string
  ) {
    const order = await this.orderService.getOrderById(orderId);
    return {
      message: 'Order retrieved successfully',
      order
    };
  }

  @Put(':orderId/status')
  @UseGuards(JwtAuthGuard)
  async updateOrderStatus(
    @Param('storeId') storeId: string,
    @Param('orderId') orderId: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto
  ) {
    const order = await this.orderService.updateOrderStatus(orderId, updateOrderStatusDto);
    return {
      message: 'Order status updated successfully',
      order
    };
  }
}

@Controller('orders')
export class UserOrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('track')
  async trackOrder(@Query() query: GuestOrderQueryDto) {
    const order = await this.orderService.getOrderByNumber(query.orderNumber, query.email);
    return {
      message: 'Order retrieved successfully',
      order
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserOrders(@Request() req, @Query() query: OrderQueryDto) {
    const userId = req.user.id;
    const result = await this.orderService.getUserOrders(userId, query);
    return {
      message: 'User orders retrieved successfully',
      orders: result.orders,
      total: result.total
    };
  }

  @Get(':orderId')
  @UseGuards(JwtAuthGuard)
  async getUserOrderById(@Request() req, @Param('orderId') orderId: string) {
    const userId = req.user.id;
    const order = await this.orderService.getOrderById(orderId, userId);
    return {
      message: 'Order retrieved successfully',
      order
    };
  }
}