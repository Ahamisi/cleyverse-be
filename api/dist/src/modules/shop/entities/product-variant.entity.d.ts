import { BaseEntity } from '../../../common/base/base.entity';
import { Product } from './product.entity';
export declare class ProductVariant extends BaseEntity {
    productId: string;
    product: Product;
    title: string;
    sku: string | null;
    barcode: string | null;
    price: number;
    compareAtPrice: number | null;
    costPerItem: number | null;
    inventoryQuantity: number;
    inventoryPolicy: string;
    option1Name: string | null;
    option1Value: string | null;
    option2Name: string | null;
    option2Value: string | null;
    option3Name: string | null;
    option3Value: string | null;
    weight: number | null;
    weightUnit: string;
    isActive: boolean;
    displayOrder: number;
}
