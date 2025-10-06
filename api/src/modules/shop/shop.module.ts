import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { StoreService } from './services/store.service';
import { ProductService } from './services/product.service';
import { StoreController } from './controllers/store.controller';
import { ProductController, PublicProductController } from './controllers/product.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Store,
      Product,
      ProductImage,
      ProductVariant,
    ]),
  ],
  providers: [
    StoreService,
    ProductService,
  ],
  controllers: [
    StoreController,
    ProductController,
    PublicProductController,
  ],
  exports: [
    StoreService,
    ProductService,
  ],
})
export class ShopModule {}
