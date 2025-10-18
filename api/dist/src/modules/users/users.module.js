"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const email_verification_entity_1 = require("./entities/email-verification.entity");
const creator_settings_entity_1 = require("./entities/creator-settings.entity");
const creator_payout_settings_entity_1 = require("./entities/creator-payout-settings.entity");
const link_entity_1 = require("../links/entities/link.entity");
const social_link_entity_1 = require("../links/entities/social-link.entity");
const collection_entity_1 = require("../collections/entities/collection.entity");
const user_service_1 = require("./services/user.service");
const email_verification_service_1 = require("./services/email-verification.service");
const creator_settings_service_1 = require("./services/creator-settings.service");
const users_controller_1 = require("./controllers/users.controller");
const creator_settings_controller_1 = require("./controllers/creator-settings.controller");
const email_service_1 = require("../../shared/services/email.service");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                email_verification_entity_1.EmailVerification,
                creator_settings_entity_1.CreatorSettings,
                creator_payout_settings_entity_1.CreatorPayoutSettings,
                link_entity_1.Link,
                social_link_entity_1.SocialLink,
                collection_entity_1.Collection
            ]),
        ],
        controllers: [users_controller_1.UsersController, creator_settings_controller_1.CreatorSettingsController],
        providers: [user_service_1.UserService, email_verification_service_1.EmailVerificationService, creator_settings_service_1.CreatorSettingsService, email_service_1.EmailService],
        exports: [user_service_1.UserService, email_verification_service_1.EmailVerificationService, creator_settings_service_1.CreatorSettingsService],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map