import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '../entities/product.entity';
import { ProductVariant } from '../entities/product-variant.entity';
import { Store } from '../entities/store.entity';
import { PaymentService } from '../../payments/services/payment.service';
import { CreateOrderDto, UpdateOrderStatusDto, OrderQueryDto } from '../dto/order.dto';
export declare class OrderService {
    private readonly orderRepository;
    private readonly orderItemRepository;
    private readonly productRepository;
    private readonly productVariantRepository;
    private readonly storeRepository;
    private readonly paymentService;
    constructor(orderRepository: Repository<Order>, orderItemRepository: Repository<OrderItem>, productRepository: Repository<Product>, productVariantRepository: Repository<ProductVariant>, storeRepository: Repository<Store>, paymentService: PaymentService);
    createOrder(storeId: string, createOrderDto: CreateOrderDto, userId?: string): Promise<{
        order: Order;
        paymentUrl?: string;
        accessCode?: string;
        reference?: string;
    }>;
    getOrderById(orderId: string, userId?: string): Promise<Order>;
    getOrderByNumber(orderNumber: string, email: string): Promise<Order>;
    getUserOrders(userId: string, query: OrderQueryDto): Promise<{
        orders: Order[];
        total: number;
    }>;
    getStoreOrders(storeId: string, query: OrderQueryDto): Promise<{
        orders: Order[];
        total: number;
    }>;
    updateOrderStatus(orderId: string, updateDto: UpdateOrderStatusDto, userId?: string): Promise<Order>;
    cancelOrder(orderId: string, reason: string, userId?: string): Promise<Order>;
    private generateOrderNumber;
    private detectBestCurrency;
    getStoreById(storeId: string, userId: string): Promise<any>;
    private updateInventory;
    private restoreInventory;
}
