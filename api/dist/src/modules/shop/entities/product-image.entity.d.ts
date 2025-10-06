import { BaseEntity } from '../../../common/base/base.entity';
import { Product } from './product.entity';
export declare class ProductImage extends BaseEntity {
    productId: string;
    product: Product;
    imageUrl: string;
    altText: string | null;
    displayOrder: number;
    isPrimary: boolean;
    fileSize: number | null;
    fileType: string | null;
}
