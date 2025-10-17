import { ProductService } from '../services/product.service';
export declare class PublicProductController {
    private readonly productService;
    constructor(productService: ProductService);
    searchProducts(q?: string, page?: number, limit?: number, category?: string, minPrice?: number, maxPrice?: number, sortBy?: string, sortOrder?: string): Promise<{
        message: string;
        products: {
            id: string;
            title: string;
            description: string | null;
            handle: string;
            price: string | undefined;
            compareAtPrice: string | undefined;
            images: {
                imageUrl: string;
                altText: string | null;
                isPrimary: boolean;
            }[];
            store: {
                id: string;
                name: string;
                storeUrl: string;
                logoUrl: string | null;
            };
            owner: {
                username: string;
                profileImageUrl: string;
            };
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
        filters: {
            categories: string[];
            priceRange: {
                min: number;
                max: number;
            };
        };
    }>;
    getFeaturedProducts(page?: number, limit?: number): Promise<{
        message: string;
        products: {
            id: string;
            title: string;
            description: string | null;
            handle: string;
            price: string | undefined;
            compareAtPrice: string | undefined;
            images: {
                imageUrl: string;
                altText: string | null;
                isPrimary: boolean;
            }[];
            store: {
                name: string;
                storeUrl: string;
                logoUrl: string | null;
            };
            owner: {
                username: string;
                profileImageUrl: string;
            };
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
}
