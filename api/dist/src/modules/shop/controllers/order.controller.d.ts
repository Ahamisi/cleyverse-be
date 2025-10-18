import { OrderService } from '../services/order.service';
import { CreateOrderDto, UpdateOrderStatusDto, OrderQueryDto, GuestOrderQueryDto } from '../dto/order.dto';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    createOrder(storeId: string, createOrderDto: CreateOrderDto): Promise<{
        message: string;
        order: import("../entities/order.entity").Order;
        payment: {
            authorizationUrl: string | undefined;
            accessCode: string | undefined;
            reference: string | undefined;
        };
    }>;
    createAuthenticatedOrder(req: any, storeId: string, createOrderDto: CreateOrderDto): Promise<{
        message: string;
        order: import("../entities/order.entity").Order;
        payment: {
            authorizationUrl: string | undefined;
            accessCode: string | undefined;
            reference: string | undefined;
        };
    }>;
    getStoreOrders(storeId: string, query: OrderQueryDto): Promise<{
        message: string;
        orders: import("../entities/order.entity").Order[];
        total: number;
    }>;
    getOrderById(storeId: string, orderId: string): Promise<{
        message: string;
        order: import("../entities/order.entity").Order;
    }>;
    updateOrderStatus(storeId: string, orderId: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<{
        message: string;
        order: import("../entities/order.entity").Order;
    }>;
}
export declare class UserOrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    trackOrder(query: GuestOrderQueryDto): Promise<{
        message: string;
        order: import("../entities/order.entity").Order;
    }>;
    getUserOrders(req: any, query: OrderQueryDto): Promise<{
        message: string;
        orders: import("../entities/order.entity").Order[];
        total: number;
    }>;
    getUserOrderById(req: any, orderId: string): Promise<{
        message: string;
        order: import("../entities/order.entity").Order;
    }>;
}
