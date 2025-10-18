"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./modules/users/users.module");
const auth_module_1 = require("./modules/auth/auth.module");
const links_module_1 = require("./modules/links/links.module");
const collections_module_1 = require("./modules/collections/collections.module");
const forms_module_1 = require("./modules/forms/forms.module");
const shop_module_1 = require("./modules/shop/shop.module");
const events_module_1 = require("./modules/events/events.module");
const payments_module_1 = require("./modules/payments/payments.module");
const user_entity_1 = require("./modules/users/entities/user.entity");
const email_verification_entity_1 = require("./modules/users/entities/email-verification.entity");
const creator_settings_entity_1 = require("./modules/users/entities/creator-settings.entity");
const creator_payout_settings_entity_1 = require("./modules/users/entities/creator-payout-settings.entity");
const link_entity_1 = require("./modules/links/entities/link.entity");
const social_link_entity_1 = require("./modules/links/entities/social-link.entity");
const collection_entity_1 = require("./modules/collections/entities/collection.entity");
const form_entity_1 = require("./modules/forms/entities/form.entity");
const form_field_entity_1 = require("./modules/forms/entities/form-field.entity");
const form_submission_entity_1 = require("./modules/forms/entities/form-submission.entity");
const store_entity_1 = require("./modules/shop/entities/store.entity");
const product_entity_1 = require("./modules/shop/entities/product.entity");
const product_image_entity_1 = require("./modules/shop/entities/product-image.entity");
const product_variant_entity_1 = require("./modules/shop/entities/product-variant.entity");
const store_onboarding_entity_1 = require("./modules/shop/entities/store-onboarding.entity");
const event_entity_1 = require("./modules/events/entities/event.entity");
const event_guest_entity_1 = require("./modules/events/entities/event-guest.entity");
const event_host_entity_1 = require("./modules/events/entities/event-host.entity");
const event_vendor_entity_1 = require("./modules/events/entities/event-vendor.entity");
const event_product_entity_1 = require("./modules/events/entities/event-product.entity");
const event_registration_question_entity_1 = require("./modules/events/entities/event-registration-question.entity");
const payment_entity_1 = require("./modules/payments/entities/payment.entity");
const invoice_entity_1 = require("./modules/payments/entities/invoice.entity");
const transaction_entity_1 = require("./modules/payments/entities/transaction.entity");
const order_entity_1 = require("./modules/shop/entities/order.entity");
const order_item_entity_1 = require("./modules/shop/entities/order-item.entity");
const store_balance_entity_1 = require("./modules/shop/entities/store-balance.entity");
const digital_product_entity_1 = require("./modules/shop/entities/digital-product.entity");
const digital_access_entity_1 = require("./modules/shop/entities/digital-access.entity");
const temp_code_entity_1 = require("./modules/auth/entities/temp-code.entity");
const trusted_device_entity_1 = require("./modules/auth/entities/trusted-device.entity");
const shared_module_1 = require("./shared/shared.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                url: process.env.DATABASE_URL,
                entities: [user_entity_1.User, email_verification_entity_1.EmailVerification, creator_settings_entity_1.CreatorSettings, creator_payout_settings_entity_1.CreatorPayoutSettings, link_entity_1.Link, social_link_entity_1.SocialLink, collection_entity_1.Collection, form_entity_1.Form, form_field_entity_1.FormField, form_submission_entity_1.FormSubmission, store_entity_1.Store, product_entity_1.Product, product_image_entity_1.ProductImage, product_variant_entity_1.ProductVariant, store_onboarding_entity_1.StoreOnboarding, order_entity_1.Order, order_item_entity_1.OrderItem, store_balance_entity_1.StoreBalance, digital_product_entity_1.DigitalProduct, digital_access_entity_1.DigitalAccess, event_entity_1.Event, event_guest_entity_1.EventGuest, event_host_entity_1.EventHost, event_vendor_entity_1.EventVendor, event_product_entity_1.EventProduct, event_registration_question_entity_1.EventRegistrationQuestion, event_registration_question_entity_1.EventGuestAnswer, payment_entity_1.Payment, invoice_entity_1.Invoice, transaction_entity_1.Transaction, temp_code_entity_1.TempCode, trusted_device_entity_1.TrustedDevice],
                synchronize: true,
                logging: process.env.NODE_ENV === 'development',
            }),
            shared_module_1.SharedModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            links_module_1.LinksModule,
            collections_module_1.CollectionsModule,
            forms_module_1.FormsModule,
            shop_module_1.ShopModule,
            events_module_1.EventsModule,
            payments_module_1.PaymentsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map