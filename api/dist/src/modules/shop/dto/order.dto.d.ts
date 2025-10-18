import { OrderStatus } from '../entities/order.entity';
export declare class CreateOrderItemDto {
    productId: string;
    variantId?: string;
    quantity: number;
}
export declare class CustomerInfoDto {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
}
export declare class AddressDto {
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
}
export declare class CreateOrderDto {
    items: CreateOrderItemDto[];
    customer: CustomerInfoDto;
    shippingAddress?: AddressDto;
    billingAddress?: AddressDto;
    customerNotes?: string;
    discountCode?: string;
    useShippingAsBilling?: boolean;
}
export declare class UpdateOrderStatusDto {
    status: OrderStatus;
    notes?: string;
    trackingNumber?: string;
    carrier?: string;
}
export declare class OrderQueryDto {
    status?: OrderStatus;
    customerEmail?: string;
    limit?: number;
    offset?: number;
}
export declare class GuestOrderQueryDto {
    email: string;
    orderNumber: string;
}
