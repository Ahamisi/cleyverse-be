import { User } from '../../users/entities/user.entity';
import { Store } from './store.entity';
import { OrderItem } from './order-item.entity';
import { Payment } from '../../payments/entities/payment.entity';
export declare enum OrderStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    PROCESSING = "processing",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled",
    REFUNDED = "refunded"
}
export declare enum OrderType {
    GUEST = "guest",
    REGISTERED = "registered"
}
export declare class Order {
    id: string;
    userId: string | null;
    user: User;
    storeId: string;
    store: Store;
    orderNumber: string;
    status: OrderStatus;
    type: OrderType;
    customerEmail: string;
    customerFirstName: string;
    customerLastName: string;
    customerPhone: string;
    shippingAddress: string;
    shippingCity: string;
    shippingState: string;
    shippingPostalCode: string;
    shippingCountry: string;
    billingAddress: string;
    billingCity: string;
    billingState: string;
    billingPostalCode: string;
    billingCountry: string;
    subtotal: number;
    shippingCost: number;
    taxAmount: number;
    discountAmount: number;
    total: number;
    currency: string;
    paymentId: string;
    payment: Payment;
    paymentStatus: string;
    paymentMethod: string;
    items: OrderItem[];
    trackingNumber: string;
    carrier: string;
    shippedAt: Date;
    deliveredAt: Date;
    cancelledAt: Date;
    cancellationReason: string;
    customerNotes: string;
    internalNotes: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
