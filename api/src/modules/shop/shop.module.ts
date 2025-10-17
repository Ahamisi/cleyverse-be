import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { StoreOnboarding } from './entities/store-onboarding.entity';
import { StoreService } from './services/store.service';
import { ProductService } from './services/product.service';
import { StoreOnboardingService } from './services/store-onboarding.service';
import { StoreController } from './controllers/store.controller';
import { ProductController, PublicProductController } from './controllers/product.controller';
import { PublicProductController as PublicProductSearchController } from './controllers/public-product.controller';
import { StoreOnboardingController } from './controllers/store-onboarding.controller';
import { PublicStoreOnboardingController } from './controllers/public-store-onboarding.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Store,
      Product,
      ProductImage,
      ProductVariant,
      StoreOnboarding,
    ]),
  ],
  providers: [
    StoreService,
    ProductService,
    StoreOnboardingService,
  ],
  controllers: [
    StoreController,
    ProductController,
    PublicProductController,
    PublicProductSearchController,
    StoreOnboardingController,
    PublicStoreOnboardingController,
  ],
  exports: [
    StoreService,
    ProductService,
    StoreOnboardingService,
  ],
})
export class ShopModule {}
