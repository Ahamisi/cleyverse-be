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
const store_service_1 = require("./services/store.service");
const product_service_1 = require("./services/product.service");
const store_onboarding_service_1 = require("./services/store-onboarding.service");
const store_controller_1 = require("./controllers/store.controller");
const product_controller_1 = require("./controllers/product.controller");
const public_product_controller_1 = require("./controllers/public-product.controller");
const store_onboarding_controller_1 = require("./controllers/store-onboarding.controller");
const public_store_onboarding_controller_1 = require("./controllers/public-store-onboarding.controller");
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
            ]),
        ],
        providers: [
            store_service_1.StoreService,
            product_service_1.ProductService,
            store_onboarding_service_1.StoreOnboardingService,
        ],
        controllers: [
            store_controller_1.StoreController,
            product_controller_1.ProductController,
            product_controller_1.PublicProductController,
            public_product_controller_1.PublicProductController,
            store_onboarding_controller_1.StoreOnboardingController,
            public_store_onboarding_controller_1.PublicStoreOnboardingController,
        ],
        exports: [
            store_service_1.StoreService,
            product_service_1.ProductService,
            store_onboarding_service_1.StoreOnboardingService,
        ],
    })
], ShopModule);
//# sourceMappingURL=shop.module.js.map