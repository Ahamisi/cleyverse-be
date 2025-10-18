import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { LinksModule } from './modules/links/links.module';
import { CollectionsModule } from './modules/collections/collections.module';
import { FormsModule } from './modules/forms/forms.module';
import { ShopModule } from './modules/shop/shop.module';
import { EventsModule } from './modules/events/events.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { User } from './modules/users/entities/user.entity';
import { EmailVerification } from './modules/users/entities/email-verification.entity';
import { CreatorSettings } from './modules/users/entities/creator-settings.entity';
import { CreatorPayoutSettings } from './modules/users/entities/creator-payout-settings.entity';
import { Link } from './modules/links/entities/link.entity';
import { SocialLink } from './modules/links/entities/social-link.entity';
import { Collection } from './modules/collections/entities/collection.entity';
import { Form } from './modules/forms/entities/form.entity';
import { FormField } from './modules/forms/entities/form-field.entity';
import { FormSubmission } from './modules/forms/entities/form-submission.entity';
import { Store } from './modules/shop/entities/store.entity';
import { Product } from './modules/shop/entities/product.entity';
import { ProductImage } from './modules/shop/entities/product-image.entity';
import { ProductVariant } from './modules/shop/entities/product-variant.entity';
import { StoreOnboarding } from './modules/shop/entities/store-onboarding.entity';
import { Event } from './modules/events/entities/event.entity';
import { EventGuest } from './modules/events/entities/event-guest.entity';
import { EventHost } from './modules/events/entities/event-host.entity';
import { EventVendor } from './modules/events/entities/event-vendor.entity';
import { EventProduct } from './modules/events/entities/event-product.entity';
import { EventRegistrationQuestion, EventGuestAnswer } from './modules/events/entities/event-registration-question.entity';
import { Payment } from './modules/payments/entities/payment.entity';
import { Invoice } from './modules/payments/entities/invoice.entity';
import { Transaction } from './modules/payments/entities/transaction.entity';
import { Order } from './modules/shop/entities/order.entity';
import { OrderItem } from './modules/shop/entities/order-item.entity';
import { StoreBalance } from './modules/shop/entities/store-balance.entity';
import { DigitalProduct } from './modules/shop/entities/digital-product.entity';
import { DigitalAccess } from './modules/shop/entities/digital-access.entity';
import { TempCode } from './modules/auth/entities/temp-code.entity';
import { TrustedDevice } from './modules/auth/entities/trusted-device.entity';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, EmailVerification, CreatorSettings, CreatorPayoutSettings, Link, SocialLink, Collection, Form, FormField, FormSubmission, Store, Product, ProductImage, ProductVariant, StoreOnboarding, Order, OrderItem, StoreBalance, DigitalProduct, DigitalAccess, Event, EventGuest, EventHost, EventVendor, EventProduct, EventRegistrationQuestion, EventGuestAnswer, Payment, Invoice, Transaction, TempCode, TrustedDevice],
      synchronize: true, // Only for development - will change to migrations
      logging: process.env.NODE_ENV === 'development',
    }),
    SharedModule,
    UsersModule,
    AuthModule,
    LinksModule,
    CollectionsModule,
    FormsModule,
    ShopModule,
    EventsModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
