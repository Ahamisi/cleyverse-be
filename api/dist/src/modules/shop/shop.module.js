"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const store_entity_1 = require("./entities/store.entity");
const product_entity_1 = require("./entities/product.entity");
const product_image_entity_1 = require("./entities/product-image.entity");
const product_variant_entity_1 = require("./entities/product-variant.entity");
const store_onboarding_entity_1 = require("./entities/store-onboarding.entity");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const store_balance_entity_1 = require("./entities/store-balance.entity");
const digital_product_entity_1 = require("./entities/digital-product.entity");
const digital_access_entity_1 = require("./entities/digital-access.entity");
const store_service_1 = require("./services/store.service");
const product_service_1 = require("./services/product.service");
const store_onboarding_service_1 = require("./services/store-onboarding.service");
const order_service_1 = require("./services/order.service");
const balance_service_1 = require("./services/balance.service");
const digital_delivery_service_1 = require("./services/digital-delivery.service");
const store_controller_1 = require("./controllers/store.controller");
const product_controller_1 = require("./controllers/product.controller");
const public_product_controller_1 = require("./controllers/public-product.controller");
const store_onboarding_controller_1 = require("./controllers/store-onboarding.controller");
const public_store_onboarding_controller_1 = require("./controllers/public-store-onboarding.controller");
const order_controller_1 = require("./controllers/order.controller");
const order_webhook_controller_1 = require("./controllers/order-webhook.controller");
const transaction_controller_1 = require("./controllers/transaction.controller");
const balance_controller_1 = require("./controllers/balance.controller");
const digital_access_controller_1 = require("./controllers/digital-access.controller");
const payments_module_1 = require("../payments/payments.module");
let ShopModule = class ShopModule {
};
exports.ShopModule = ShopModule;
exports.ShopModule = ShopModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                store_entity_1.Store,
                product_entity_1.Product,
                product_image_entity_1.ProductImage,
                product_variant_entity_1.ProductVariant,
                store_onboarding_entity_1.StoreOnboarding,
                order_entity_1.Order,
                order_item_entity_1.OrderItem,
                store_balance_entity_1.StoreBalance,
                digital_product_entity_1.DigitalProduct,
                digital_access_entity_1.DigitalAccess,
            ]),
            (0, common_1.forwardRef)(() => payments_module_1.PaymentsModule),
        ],
        providers: [
            store_service_1.StoreService,
            product_service_1.ProductService,
            store_onboarding_service_1.StoreOnboardingService,
            order_service_1.OrderService,
            balance_service_1.BalanceService,
            digital_delivery_service_1.DigitalDeliveryService,
        ],
        controllers: [
            store_controller_1.StoreController,
            product_controller_1.ProductController,
            product_controller_1.PublicProductController,
            public_product_controller_1.PublicProductController,
            store_onboarding_controller_1.StoreOnboardingController,
            public_store_onboarding_controller_1.PublicStoreOnboardingController,
            order_controller_1.OrderController,
            order_controller_1.UserOrderController,
            order_webhook_controller_1.OrderWebhookController,
            transaction_controller_1.TransactionController,
            balance_controller_1.BalanceController,
            digital_access_controller_1.DigitalAccessController,
        ],
        exports: [
            store_service_1.StoreService,
            product_service_1.ProductService,
            store_onboarding_service_1.StoreOnboardingService,
            order_service_1.OrderService,
            balance_service_1.BalanceService,
            digital_delivery_service_1.DigitalDeliveryService,
        ],
    })
], ShopModule);
//# sourceMappingURL=shop.module.js.map