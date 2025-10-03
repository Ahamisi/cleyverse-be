"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinksModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const link_entity_1 = require("./entities/link.entity");
const social_link_entity_1 = require("./entities/social-link.entity");
const user_entity_1 = require("../users/entities/user.entity");
const services_1 = require("./services");
const links_controller_1 = require("./controllers/links.controller");
const social_links_controller_1 = require("./controllers/social-links.controller");
const media_processor_service_1 = require("../../shared/services/media-processor.service");
let LinksModule = class LinksModule {
};
exports.LinksModule = LinksModule;
exports.LinksModule = LinksModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([link_entity_1.Link, social_link_entity_1.SocialLink, user_entity_1.User]),
        ],
        controllers: [links_controller_1.LinksController, social_links_controller_1.SocialLinksController],
        providers: [services_1.LinkService, services_1.SocialLinkService, media_processor_service_1.MediaProcessorService],
        exports: [services_1.LinkService, services_1.SocialLinkService],
    })
], LinksModule);
//# sourceMappingURL=links.module.js.map