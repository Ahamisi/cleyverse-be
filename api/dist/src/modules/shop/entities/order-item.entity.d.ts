import { Order } from './order.entity';
import { Product } from './product.entity';
import { ProductVariant } from './product-variant.entity';
export declare class OrderItem {
    id: string;
    orderId: string;
    order: Order;
    productId: string;
    product: Product;
    variantId: string;
    variant: ProductVariant;
    productTitle: string;
    variantTitle: string;
    productHandle: string;
    productImage: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    currency: string;
    productSnapshot: {
        title: string;
        description: string;
        price: number;
        compareAtPrice?: number;
        sku?: string;
        weight?: number;
        dimensions?: {
            length: number;
            width: number;
            height: number;
        };
        tags: string[];
        category: string;
    };
    variantSnapshot: {
        title: string;
        price: number;
        compareAtPrice?: number;
        sku?: string;
        weight?: number;
        inventory: number;
        options: Record<string, string>;
    };
    createdAt: Date;
    updatedAt: Date;
}
