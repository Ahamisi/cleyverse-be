import { Controller, Get, Query } from '@nestjs/common';
import { ProductService } from '../services/product.service';

@Controller('products/public')
export class PublicProductController {
  constructor(
    private readonly productService: ProductService,
  ) {}

  @Get('search')
  async searchProducts(
    @Query('q') q?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string
  ) {
    return this.productService.searchPublicProducts({
      q: q || '',
      page: page || 1,
      limit: limit || 20,
      category,
      minPrice,
      maxPrice,
      sortBy: sortBy || 'relevance',
      sortOrder: sortOrder || 'DESC'
    });
  }

  @Get('featured')
  async getFeaturedProducts(
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    return this.productService.getFeaturedProducts({
      page: page || 1,
      limit: limit || 20
    });
  }
}
