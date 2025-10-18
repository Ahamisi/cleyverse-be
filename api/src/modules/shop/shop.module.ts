import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { StoreOnboarding } from './entities/store-onboarding.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { StoreBalance } from './entities/store-balance.entity';
import { DigitalProduct } from './entities/digital-product.entity';
import { DigitalAccess } from './entities/digital-access.entity';
import { StoreService } from './services/store.service';
import { ProductService } from './services/product.service';
import { StoreOnboardingService } from './services/store-onboarding.service';
import { OrderService } from './services/order.service';
import { BalanceService } from './services/balance.service';
import { DigitalDeliveryService } from './services/digital-delivery.service';
import { StoreController } from './controllers/store.controller';
import { ProductController, PublicProductController } from './controllers/product.controller';
import { PublicProductController as PublicProductSearchController } from './controllers/public-product.controller';
import { StoreOnboardingController } from './controllers/store-onboarding.controller';
import { PublicStoreOnboardingController } from './controllers/public-store-onboarding.controller';
import { OrderController, UserOrderController } from './controllers/order.controller';
import { OrderWebhookController } from './controllers/order-webhook.controller';
import { TransactionController } from './controllers/transaction.controller';
import { BalanceController } from './controllers/balance.controller';
import { DigitalAccessController } from './controllers/digital-access.controller';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Store,
      Product,
      ProductImage,
      ProductVariant,
      StoreOnboarding,
      Order,
      OrderItem,
      StoreBalance,
      DigitalProduct,
      DigitalAccess,
    ]),
    forwardRef(() => PaymentsModule),
  ],
  providers: [
    StoreService,
    ProductService,
    StoreOnboardingService,
    OrderService,
    BalanceService,
    DigitalDeliveryService,
  ],
  controllers: [
    StoreController,
    ProductController,
    PublicProductController,
    PublicProductSearchController,
    StoreOnboardingController,
    PublicStoreOnboardingController,
    OrderController,
    UserOrderController,
    OrderWebhookController,
    TransactionController,
    BalanceController,
    DigitalAccessController,
  ],
  exports: [
    StoreService,
    ProductService,
    StoreOnboardingService,
    OrderService,
    BalanceService,
    DigitalDeliveryService,
  ],
})
export class ShopModule {}
